import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://buisrzwhseewxgtlojiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1aXNyendoc2Vld3hndGxvaml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTY1MjIsImV4cCI6MjA2NDA5MjUyMn0.gonKfP3jGDIEw35OGDq94Ik-j_T58twKO60E26P3SlE';

// Basitleştirilmiş istemci yapılandırması
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: fetch // Native fetch kullan
  }
});