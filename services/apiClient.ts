import axios from 'axios';
import * as dotenv from 'dotenv';

// Expo ile çalışırken process.env'yi Constants.expoConfig.extra ile değiştirmeyi düşünebilirsiniz
try {
  dotenv.config();
} catch (error) {
  console.warn('Error loading .env file', error);
}

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging or auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // console.log('API Request:', config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error types
    if (error.response) {
      // Server responded with non-2xx
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('API No Response Error:', error.request);
    } else {
      // Error setting up request
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
