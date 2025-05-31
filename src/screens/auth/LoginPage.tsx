import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackPress = () => {
    navigation.goBack();
  };
  const validateInputs = () => {
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
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

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // Navigate to Main screen after successful login
      navigation.navigate('Main');
    } catch (error: any) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      // Supabase specific error handling
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Şifre Sıfırlama',
      'Şifre sıfırlama bağlantısı gönderilecek e-posta adresinizi girin.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Gönder',
          onPress: async () => {
            if (!email) {
              Alert.alert('Hata', 'Lütfen önce e-posta adresinizi girin.');
              return;
            }
            
            try {
              setLoading(true);
              await resetPassword(email);
              Alert.alert(
                'Başarılı',
                'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.'
              );
            } catch (error: any) {
              let errorMessage = 'Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu.';
              
              if (error.message.includes('Email not found')) {
                errorMessage = 'Bu e-posta adresine ait bir hesap bulunamadı.';
              } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Geçersiz e-posta adresi.';
              }
              
              Alert.alert('Hata', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Wanderland</Text>
          <Text style={styles.subtitle}>Hoş Geldiniz</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
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
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              Hesabınız yok mu? Kayıt Olun
            </Text>
          </TouchableOpacity>
        </View>
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
  overlayTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 50,
      paddingHorizontal: 20,
    },
  forgotPasswordButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#0A7EA5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    height: 50,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    alignItems: 'center',
  },
  registerButtonText: {
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
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
});

export default LoginScreen;
