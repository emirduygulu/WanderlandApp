import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { getUserFavorites, removeFromFavorites, type Favorite } from '../../services/favoritesService';

const { width } = Dimensions.get('window');

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { favorites: userFavorites, error } = await getUserFavorites(user.id);
      
      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      setFavorites(userFavorites);
    } catch (error) {
      Alert.alert('Hata', 'Favoriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleRemoveFromFavorites = async (itemId: string) => {
    if (!user?.id) return;

    Alert.alert(
      'Favorilerden Kaldır',
      'Bu içeriği favorilerden kaldırmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            const { error } = await removeFromFavorites(user.id, itemId);
            
            if (error) {
              Alert.alert('Hata', error.message);
              return;
            }

            setFavorites(prev => prev.filter(fav => fav.item_id !== itemId));
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, [loadFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const renderFavoriteItem = ({ item }: { item: Favorite }) => {
    const itemData = item.item_data;
    
    return (
      <View style={styles.favoriteItem}>
        {itemData?.image && (
          <Image source={{ uri: itemData.image }} style={styles.itemImage} />
        )}
        
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {itemData?.title || itemData?.name || 'Başlıksız'}
          </Text>
          
          {itemData?.description && (
            <Text style={styles.itemDescription} numberOfLines={3}>
              {itemData.description}
            </Text>
          )}
          
          <View style={styles.itemMeta}>
            <Text style={styles.itemType}>
              {item.item_type}
            </Text>
            
            <Text style={styles.itemDate}>
              {new Date(item.created_at || '').toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromFavorites(item.item_id)}
        >
          <Ionicons name="heart" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>Henüz favori içeriğiniz yok</Text>
      <Text style={styles.emptyDescription}>
        Beğendiğiniz içerikleri favorilere ekleyerek buradan kolayca erişebilirsiniz
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <Text style={styles.favoriteCount}>
          {favorites.length} içerik
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  favoriteCount: {
    fontSize: 14,
    color: '#6c757d',
  },
  listContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemType: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '500',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  removeButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen; 