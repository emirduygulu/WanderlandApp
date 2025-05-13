import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategoryData, CategoryData, PlaceItem } from '../../services/categoryService';

// Ekran genişliğini alıyoruz
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // Container padding'i çıkarıldı

// CategoryContent için props interface'i
interface CategoryContentProps {
  categoryId: string;
  onBack: () => void;
}

const CategoryContent = ({ categoryId, onBack }: CategoryContentProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);

  useEffect(() => {
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Kategori servisinden veri çek
      const data = await fetchCategoryData(categoryId);
      setCategoryData(data);
    } catch (err) {
      setError('Veri yüklenirken bir hata oluştu.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error || !categoryData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error || 'Kategori bulunamadı'}</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Yer kartını render eden fonksiyon
  const renderItem = ({ item }: { item: PlaceItem }) => (
    <TouchableOpacity style={styles.card}>
      <View 
        style={[styles.imageContainer, { backgroundColor: getRandomColor(item.id) }]}
      />
      <View style={styles.contentArea}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>{item.rating * 10} Reviews</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Rastgele renk seçme fonksiyonu
  const getRandomColor = (id: string) => {
    const colors = ['#6EE7B7', '#93C5FD', '#FCD34D', '#F87171'];
    return colors[parseInt(id) % colors.length];
  };

  return (
    <View style={styles.container}>
      {/* Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryData.title}</Text>
      </View>
      
      {/* Açıklama */}
      <Text style={styles.description}>{categoryData.description}</Text>
      
      {/* Yerler Listesi */}
      <FlatList
        data={categoryData.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CategoryContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 24,
  },
  contentArea: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 18,
    marginTop: -110,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    fontSize: 11,
    color: '#6B7280',
  },
});