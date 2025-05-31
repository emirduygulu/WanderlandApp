import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !name) {
      setError('Lütfen tüm alanları doldurun.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return false;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Geçerli bir e-posta adresi girin.');
      return false;
    }

    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      await register(email, password, name);
      navigation.navigate('Main');
    } catch (error: any) {
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      
      // Supabase specific error handling
      if (error.message.includes('email already exists')) {
        errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Şifre en az 6 karakter olmalıdır.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Wanderland</Text>
            <Text style={styles.subtitle}>Yeni Hesap Oluştur</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre Tekrar"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                Zaten hesabınız var mı? Giriş Yapın
              </Text>
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
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0A7EA5',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#0A7EA5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 50,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#0A7EA5',
    fontSize: 14,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 30,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
});

export default RegisterScreen;
