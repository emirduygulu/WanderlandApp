import { supabase } from '../config/supabaseConfig';

export type Favorite = {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  item_data: any;
  created_at?: string;
};

export type FavoriteError = {
  message: string;
};

// Add an item to favorites
export const addToFavorites = async (userId: string, itemId: string, itemType: string, itemData: any): Promise<{ favorite: Favorite | null; error: FavoriteError | null }> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert([
        { 
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          item_data: itemData
        }
      ])
      .select()
      .single();
    
    if (error) {
      return { favorite: null, error: { message: error.message } };
    }
    
    return { favorite: data, error: null };
  } catch (error: any) {
    return { favorite: null, error: { message: error.message || 'Failed to add to favorites' } };
  }
};

// Remove an item from favorites
export const removeFromFavorites = async (userId: string, itemId: string): Promise<{ error: FavoriteError | null }> => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
    
    if (error) {
      return { error: { message: error.message } };
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || 'Failed to remove from favorites' } };
  }
};

// Check if an item is favorited
export const isFavorited = async (userId: string, itemId: string): Promise<{ isFavorited: boolean; error: FavoriteError | null }> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .maybeSingle();
    
    if (error) {
      return { isFavorited: false, error: { message: error.message } };
    }
    
    return { isFavorited: !!data, error: null };
  } catch (error: any) {
    return { isFavorited: false, error: { message: error.message || 'Failed to check if item is favorited' } };
  }
};

// Get all favorites for a user
export const getUserFavorites = async (userId: string, itemType?: string): Promise<{ favorites: Favorite[]; error: FavoriteError | null }> => {
  try {
    let query = supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);
    
    if (itemType) {
      query = query.eq('item_type', itemType);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return { favorites: [], error: { message: error.message } };
    }
    
    return { favorites: data || [], error: null };
  } catch (error: any) {
    return { favorites: [], error: { message: error.message || 'Failed to get user favorites' } };
  }
}; 