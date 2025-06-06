import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import { supabase } from '../src/config/supabaseConfig';
import { AuthProvider } from '../src/context/AuthContext';
import { BlogProvider } from '../src/context/BlogContext';
import { AppNavigator } from '../src/navigation/AppNavigator';

export default function App() {
  // Uygulama başladığında Supabase'i kontrol edilmeli
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error("Supabase connection error:", error.message);
        } else {
          console.log("Supabase connection successful");
        }
      } catch (error) {
        console.error("Failed to check Supabase connection:", error);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <BlogProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </BlogProvider>
      </AuthProvider>
    </NavigationContainer>
  );
} 