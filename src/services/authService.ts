import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabaseConfig';

export type AuthError = {
  message: string;
};

export const registerUser = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error: { message: error.message } };
    }
    
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message || 'Registration failed' } };
  }
};

export const loginUser = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error: { message: error.message } };
    }
    
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message || 'Login failed' } };
  }
};

export const logoutUser = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Logout failed' } };
  }
};

export const getCurrentUser = async (): Promise<{ user: User | null; error: AuthError | null }> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: { message: error.message } };
    }
    
    return { user: data.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message || 'Failed to get current user' } };
  }
};

export const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Password reset failed' } };
  }
};

export const updateUserProfile = async (userDetails: { username?: string; avatarUrl?: string }): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: userDetails
    });
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to update profile' } };
  }
}; 