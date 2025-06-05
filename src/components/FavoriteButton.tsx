import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isFavorited, toggleFavorite } from '../services/favoritesService';

interface FavoriteButtonProps {
  itemId: string;
  itemType: string;
  itemData: any;
  size?: number;
  style?: any;
  onToggle?: (isFavorited: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
  itemData,
  size = 24,
  style,
  onToggle,
}) => {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?.id) return;

      const { isFavorited: status, error } = await isFavorited(user.id, itemId);
      
      if (error) {
        console.error('Favori durumu kontrol edilirken hata:', error.message);
        return;
      }

      setFavorited(status);
    };

    checkFavoriteStatus();
  }, [user?.id, itemId]);

  const handleToggleFavorite = async () => {
    if (!user?.id || loading) return;

    setLoading(true);

    try {
      const { isFavorited: newStatus, error } = await toggleFavorite(
        user.id,
        itemId,
        itemType,
        itemData
      );

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      setFavorited(newStatus);
      onToggle?.(newStatus);
      
      // Show success message
      const message = newStatus 
        ? 'Favorilere eklendi' 
        : 'Favorilerden kaldırıldı';
        
      Alert.alert('Başarılı', message);
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleToggleFavorite}
      disabled={loading}
    >
      <Ionicons
        name={favorited ? 'heart' : 'heart-outline'}
        size={size}
        color={favorited ? '#ff4757' : '#6c757d'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FavoriteButton; 