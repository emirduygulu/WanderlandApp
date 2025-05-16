import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlaceItem, fetchDiscoverPlaces } from '../../services/categoryService';

interface DiscoverPlacesAreaProps {
  categoryName: string;
}

const DiscoverPlacesArea: React.FC<DiscoverPlacesAreaProps> = ({ categoryName }) => {
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      try {
        // DISCOVER_CATEGORIES içindeki eşleştirmeyi kullanarak API'den veri çek
        const categoryId = categoryName === 'Hepsi' ? 'all' : categoryName === 'Restoranlar' ? 'restaurants' 
          : categoryName === 'Yeşil Alanlar' ? 'parks' 
          : categoryName === 'Eğlence Alanları' ? 'entertainment'
          : categoryName === 'Tarihi Yerler' ? 'historical'
          : categoryName === 'Kafe ve Barlar' ? 'cafes' : 'all';

        const data = await fetchDiscoverPlaces(categoryId);
        setPlaces(data);
      } catch (error) {
        console.error('Error loading discover places:', error);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [categoryName]);

  const renderItem = ({ item }: { item: PlaceItem }) => (
    <TouchableOpacity style={styles.placeItem}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeDetails}>
        <Text style={styles.placeTitle} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.placeLocation} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.placeRating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.placeReviews}>(200+ değerlendirme)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#60A5FA" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bu kategoride henüz yer bulunmuyor.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14
  },
  placeItem: {
    width: 260,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: 280,
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeDetails: {
    padding: 12,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeRating: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  placeReviews: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});

export default DiscoverPlacesArea;
