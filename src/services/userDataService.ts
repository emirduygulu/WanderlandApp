import { supabase } from '../config/supabaseConfig';

export type UserProfile = {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at?: string;
};

export type UserDataError = {
  message: string;
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<{ profile: UserProfile | null; error: UserDataError | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return { profile: null, error: { message: error.message } };
    }
    
    return { profile: data, error: null };
  } catch (error: any) {
    return { profile: null, error: { message: error.message || 'Failed to get user profile' } };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<{ profile: UserProfile | null; error: UserDataError | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return { profile: null, error: { message: error.message } };
    }
    
    return { profile: data, error: null };
  } catch (error: any) {
    return { profile: null, error: { message: error.message || 'Failed to update user profile' } };
  }
};

// Store user search history
export const saveSearchHistory = async (userId: string, searchTerm: string): Promise<{ error: UserDataError | null }> => {
  try {
    const { error } = await supabase
      .from('search_history')
      .insert([
        { 
          user_id: userId,
          search_term: searchTerm,
          searched_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to save search history' } };
  }
};

// Get user search history
export const getSearchHistory = async (userId: string): Promise<{ history: any[]; error: UserDataError | null }> => {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false });
    
    if (error) {
      return { history: [], error: { message: error.message } };
    }
    
    return { history: data || [], error: null };
  } catch (error: any) {
    return { history: [], error: { message: error.message || 'Failed to get search history' } };
  }
};

// Clear search history
export const clearSearchHistory = async (userId: string): Promise<{ error: UserDataError | null }> => {
  try {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to clear search history' } };
  }
}; 