import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type AvatarSelectorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AvatarSelector'>;

const AvatarSelector = () => {
  const navigation = useNavigation<AvatarSelectorScreenNavigationProp>();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    Alert.alert('Bilgi', 'Avatar kaydetme özelliği şu anda devre dışıdır.', [
      { text: 'Tamam', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButtonContainer}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avatar</Text>
        <TouchableOpacity 
          onPress={handleSave}
          style={styles.saveButtonContainer}
        >
          <Text style={styles.saveButton}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Önizleme */}
        <View style={styles.previewContainer}>
          <Avatar
            size={150}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Avatar özelleştirme özelliği şu anda geliştirme aşamasındadır. Bu özellik yakında kullanılabilir olacaktır.
          </Text>
        </View>

        {/* Boşluk */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButtonContainer: {
    padding: 5,
  },
  saveButtonContainer: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    color: '#FF6B00',
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    marginHorizontal: 20,
  },
  infoContainer: {
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  spacer: {
    height: 40,
  },
});

export default AvatarSelector; 