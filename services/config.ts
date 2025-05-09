// Expo ve React Native uygulamalarında çevre değişkenlerini yönetme
import Constants from 'expo-constants';
import * as dotenv from 'dotenv';

// .env dosyasını yükle (Expo geliştirme ortamında çalışıyorsa)
try {
  dotenv.config();
} catch (error) {
  console.warn('dotenv yapılandırması yüklenemedi:', error);
}

// Çevre değişkenlerini tek bir yerden yönetmek için
interface EnvConfig {
  MEDIA_API_KEY: string;
  FOOD_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  NODE_ENV: string;
}

// Expo yapılandırmasından veya process.env'den değişkenleri al
const getEnvVars = (): EnvConfig => {
  try {
    // Expo yapılandırmasında extra alanını kullan
    if (Constants.expoConfig?.extra) {
      return Constants.expoConfig.extra as EnvConfig;
    }
    
    // Eğer Expo yapılandırması bulunamazsa, process.env'yi kullan
    return {
      MEDIA_API_KEY: process.env.MEDIA_API_KEY || '',
      FOOD_API_KEY: process.env.FOOD_API_KEY || '',
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
      NODE_ENV: process.env.NODE_ENV || 'development',
    };
  } catch (error) {
    console.warn('Environment variables could not be loaded', error);
    // Varsayılan boş değerler dön
    return {
      MEDIA_API_KEY: '',
      FOOD_API_KEY: '',
      GOOGLE_MAPS_API_KEY: '',
      NODE_ENV: 'development',
    };
  }
};

// Config nesnesini dışa aktar
export const config = getEnvVars();

// Belirli API anahtarlarına ve diğer yapılandırmalara daha kolay erişim
export const MEDIA_API_KEY = config.MEDIA_API_KEY;
export const FOOD_API_KEY = config.FOOD_API_KEY;
export const GOOGLE_MAPS_API_KEY = config.GOOGLE_MAPS_API_KEY;
export const IS_DEVELOPMENT = config.NODE_ENV === 'development'; 