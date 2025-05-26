import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategoryData, CategoryData, PlaceItem } from '../../services/categoryService';

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

  // İlgili sezona göre arka plan rengi belirleme
  const getSeasonalCardStyle = () => {
    switch(categoryId) {
      case 'winter':
        return { backgroundColor: '#E1F5FE' }; // Açık mavi
      case 'spring':
        return { backgroundColor: '#E8F5E9' }; // Açık yeşil
      case 'summer':
        return { backgroundColor: '#FFF8E1' }; // Açık sarı
      case 'autumn':
        return { backgroundColor: '#FBE9E7' }; // Açık turuncu
      default:
        return {};
    }
  };

  // Yer kartını render eden fonksiyon
  const renderItem = ({ item }: { item: PlaceItem }) => (
    <TouchableOpacity style={[styles.card, getSeasonalCardStyle()]}>
      <View style={styles.imageContainer}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.destinationImage}
            defaultSource={require('../../assets/logo/wl-text.png')}
          />
        ) : (
          <View style={[styles.colorPlaceholder, { backgroundColor: getRandomColor(item.id) }]} />
        )}
      </View>
      <View style={styles.contentArea}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>{Math.round(item.rating * 10)} Reviews</Text>
        </View>

        {/* Ek açıklama, varsa göster */}
        {item.description && (
          <Text style={styles.itemDescription}>{item.description}</Text>
        )}

        {/* Öne çıkan özellikleri göster */}
        {item.highlights && item.highlights.length > 0 && (
          <View style={styles.highlightsContainer}>
            {item.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightTag}>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Rastgele renk seçme fonksiyonu
  const getRandomColor = (id: string) => {
    const colors = ['#6EE7B7', '#93C5FD', '#FCD34D', '#F87171'];
    // İd string olduğu için önce sayıya dönüştürüyoruz
    const hashCode = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hashCode % colors.length];
  };

  // Mevsim başlıklarını özelleştir
  const getCategoryIcon = () => {
    switch(categoryId) {
      case 'winter':
        return <Ionicons name="snow-outline" size={24} color="#333" style={styles.categoryIcon} />;
      case 'spring':
        return <Ionicons name="flower-outline" size={24} color="#333" style={styles.categoryIcon} />;
      case 'summer':
        return <Ionicons name="sunny-outline" size={24} color="#333" style={styles.categoryIcon} />;
      case 'autumn':
        return <Ionicons name="leaf-outline" size={24} color="#333" style={styles.categoryIcon} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryData.title}</Text>
        {getCategoryIcon()}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  categoryIcon: {
    marginLeft: 10,
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
    height: 550,
    borderRadius: 24,
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  colorPlaceholder: {
    width: '100%',
    height: '100%',
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
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 9,
    color: '#6B7280',
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 12,
    lineHeight: 18,
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  highlightTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 10,
    color: '#4B5563',
  },
});