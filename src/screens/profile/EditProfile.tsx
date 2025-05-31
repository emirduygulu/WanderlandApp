import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Avatar from '../../components/Avatar';
import { supabase } from '../../config/supabaseConfig';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

const EditProfile = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.user_metadata && user.user_metadata.name) {
        setDisplayName(user.user_metadata.name);
      } else if (user.email) {
        // E-posta adresinden kullanıcı adı oluştur
        const nameFromEmail = user.email.split('@')[0];
        setDisplayName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
    }
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Lütfen bir isim girin.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (user) {
        // Supabase ile kullanıcı metadata'sını güncelle
        const { error: updateError } = await supabase.auth.updateUser({
          data: { name: displayName }
        });

        if (updateError) {
          throw updateError;
        }

        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error: any) {
      console.error('Profil güncellenirken hata oluştu:', error);
      setError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Avatar değiştirme ekranına yönlendirme
  const handleAvatarChange = () => {
    navigation.navigate('AvatarSelector');
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profili Düzenle</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handleAvatarChange}>
              <Avatar
                size={100}
                style={styles.profileImage}
              />
              <View style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Avatarı Değiştir</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Ad Soyad"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user.email || ''}
                editable={false}
              />
              <Text style={styles.helperText}>E-posta adresi değiştirilemez</Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  changePhotoButton: {
    marginTop: 10,
  },
  changePhotoText: {
    color: '#FF6B00',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#EBEBEB',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfile; 