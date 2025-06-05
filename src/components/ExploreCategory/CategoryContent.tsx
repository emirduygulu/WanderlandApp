import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CategoryData, PlaceItem } from '../../services/categoryService';
import { getSeasonalCities, SeasonalCity } from '../../services/SeasonalCitiesService';

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
    // Kategori ID kontrolü
    if (!categoryId) {
      console.error('❌ CategoryContent - categoryId undefined!');
      setError('Kategori ID bulunamadı');
      setLoading(false);
      return;
    }
    
    console.log('🔥 CategoryContent - Kategori ID:', categoryId);
    loadCategoryData();
  }, [categoryId]);

  const loadCategoryData = () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Kategori verisi yükleniyor:', categoryId);
      
      // Mevsimsel kategoriler için
      const seasonalCategories = ['winter', 'spring', 'summer', 'autumn'];
      if (seasonalCategories.includes(categoryId)) {
        console.log('🌍 Mevsimsel kategori tespit edildi:', categoryId);
        
        // Doğrudan SeasonalCitiesService'den verileri al
        const seasonalData = getSeasonalCities(categoryId as any);
        console.log('✅ Mevsimsel veri alındı, şehir sayısı:', seasonalData.cities.length);
        
        // Veriyi CategoryData formatına dönüştür
        const formattedData: CategoryData = {
          title: seasonalData.title,
          description: seasonalData.description,
          items: seasonalData.cities.map(city => convertToPlaceItem(city, categoryId))
        };
        
        console.log('📊 Dönüştürülen öğe sayısı:', formattedData.items.length);
        setCategoryData(formattedData);
      } else {
        console.error('❌ Geçersiz kategori tipi:', categoryId);
        setError('Bu kategori mevsimsel değil');
      }
    } catch (err) {
      console.error('❌ Veri yükleme hatası:', err);
      setError('Veri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  // SeasonalCity'yi PlaceItem'a dönüştür
  const convertToPlaceItem = (city: SeasonalCity, category: string): PlaceItem => {
    return {
      id: city.id,
      name: city.name,
      location: `${city.name}, ${city.country}`,
      imageUrl: city.imageUrl,
      rating: city.rating,
      description: city.description,
      highlights: city.highlights,
      category: category
    };
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
            <Text style={styles.highlightsTitle}>Öne Çıkan Özellikler:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlightsScroll}>
              {item.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightTag}>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Mevsimsel ipuçları için ek alan */}
        {(categoryId === 'winter' || categoryId === 'spring' || categoryId === 'summer' || categoryId === 'autumn') && (
          <View style={styles.seasonalTipContainer}>
            <Ionicons name="bulb-outline" size={16} color="#4B5563" />
            <Text style={styles.seasonalTipText}>
              {getSeasonalTip(categoryId)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Mevsimsel ipucu getir
  const getSeasonalTip = (season: string): string => {
    const tips: Record<string, string> = {
      winter: 'Sıcak kıyafetler ve kar botları unutmayın!',
      spring: 'Yağmur için şemsiye ve kat kat kıyafet tavsiye edilir.',
      summer: 'Güneş kremi ve bol su içmeyi unutmayın.',
      autumn: 'Rüzgarlık ve orta kalınlıkta ceketler ideal olacaktır.'
    };
    return tips[season] || 'İyi seyahatler!';
  };

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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        {/* Geri Butonu ve Başlık */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryData.title}</Text>
          {getCategoryIcon()}
        </View>
        
        {/* Açıklama */}
        <Text style={styles.description}>{categoryData.description}</Text>
      </View>
      
      {/* Yerler Listesi */}
      <FlatList
        data={categoryData.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default CategoryContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginTop: 10,
    paddingTop: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 25,
    borderRadius: 20,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    padding: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
    lineHeight: 20,
  },
  highlightsContainer: {
    marginTop: 16,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  highlightsScroll: {
    marginTop: 5,
  },
  highlightTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  highlightText: {
    fontSize: 12,
    color: '#4B5563',
  },
  seasonalTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0A7EA5',
  },
  seasonalTipText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});