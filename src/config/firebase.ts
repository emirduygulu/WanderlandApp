import {
    FIREBASE_API_KEY,
    FIREBASE_APP_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET
} from '@env';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Check if config is valid
const isConfigValid = () => {
  return FIREBASE_API_KEY && FIREBASE_API_KEY.length > 0 && 
         FIREBASE_APP_ID && FIREBASE_APP_ID.length > 0;
};

let app: any = null;
let auth: any = null;

try {
  if (!isConfigValid()) {
    console.warn('Firebase configuration is incomplete. Some features may not work.');
  }
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully');
  
  // Quick test to verify auth is working
  setTimeout(() => {
    if (auth) {
      console.log('Firebase Auth is working correctly');
    }
  }, 2000);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { app, auth };
