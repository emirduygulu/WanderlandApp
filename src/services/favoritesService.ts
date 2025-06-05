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
    // Check if already favorited to prevent duplicates
    const { isFavorited: alreadyFavorited } = await isFavorited(userId, itemId);
    
    if (alreadyFavorited) {
      return { favorite: null, error: { message: 'Bu içerik zaten favorilerinizde' } };
    }

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
    return { favorite: null, error: { message: error.message || 'Favorilere eklenirken bir hata oluştu' } };
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
    return { error: { message: error.message || 'Favorilerden kaldırılırken bir hata oluştu' } };
  }
};

// Toggle favorite status
export const toggleFavorite = async (userId: string, itemId: string, itemType: string, itemData: any): Promise<{ isFavorited: boolean; error: FavoriteError | null }> => {
  try {
    const { isFavorited: currentlyFavorited, error: checkError } = await isFavorited(userId, itemId);
    
    if (checkError) {
      return { isFavorited: false, error: checkError };
    }

    if (currentlyFavorited) {
      const { error: removeError } = await removeFromFavorites(userId, itemId);
      if (removeError) {
        return { isFavorited: true, error: removeError };
      }
      return { isFavorited: false, error: null };
    } else {
      const { error: addError } = await addToFavorites(userId, itemId, itemType, itemData);
      if (addError) {
        return { isFavorited: false, error: addError };
      }
      return { isFavorited: true, error: null };
    }
  } catch (error: any) {
    return { isFavorited: false, error: { message: error.message || 'Favori durumu değiştirilirken bir hata oluştu' } };
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
    return { isFavorited: false, error: { message: error.message || 'Favori durumu kontrol edilirken bir hata oluştu' } };
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
    return { favorites: [], error: { message: error.message || 'Favoriler yüklenirken bir hata oluştu' } };
  }
};

// Get favorites count for a user
export const getFavoritesCount = async (userId: string, itemType?: string): Promise<{ count: number; error: FavoriteError | null }> => {
  try {
    let query = supabase
      .from('favorites')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (itemType) {
      query = query.eq('item_type', itemType);
    }
    
    const { count, error } = await query;
    
    if (error) {
      return { count: 0, error: { message: error.message } };
    }
    
    return { count: count || 0, error: null };
  } catch (error: any) {
    return { count: 0, error: { message: error.message || 'Favori sayısı hesaplanırken bir hata oluştu' } };
  }
}; 