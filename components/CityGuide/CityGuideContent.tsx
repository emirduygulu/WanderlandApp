import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { getCoordinatesByCity, searchOTMPlaces, getOTMPlaceDetails } from '../../services/OneTripMap';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; 

// Route parametreleri için tip tanımı
type RootStackParamList = {
  CityGuideContent: {
    name: string;
    description: string;
  };
  Content: {
    item?: any;
    itemId?: string; 
  };
};

type CityGuideContentRouteProp = RouteProp<RootStackParamList, 'CityGuideContent'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

// API'den dönen yer detayları için tip tanımı
interface PlaceDetail {
  xid: string;
  name: string;
  preview?: {
    source: string;
  };
  wikipedia_extracts?: {
    text: string;
  };
  kind?: string;
  address?: {
    city?: string;
    road?: string;
    state?: string;
    neighbourhood?: string;
  };
  custom?: boolean;
}

const translateCategory = (kind: string): string => {
  const categories: Record<string, string> = {
    'interesting_places': 'İlgi Çekici Yerler',
    'architecture': 'Mimari',
    'cultural': 'Kültürel',
    'historic': 'Tarihi',
    'natural': 'Doğal Güzellik',
    'foods': 'Yeme-İçme',
    'museums': 'Müze',
    'religion': 'Dini Mekan',
    'sport': 'Spor',
    'amusements': 'Eğlence',
    'shops': 'Alışveriş',
    'other': 'Diğer'
  };
  
  if (!kind) return 'İlgi Çekici Yerler';
  
  const mainCategory = kind.split('_')[0];
  return categories[mainCategory] || 'İlgi Çekici Yerler';
};

// Wikipedia metinlerini temizleme ve basit çeviri
const cleanDescription = (text: string): string => {
  if (!text) return '';
  
  // İngilizce metinleri Türkçe karşılıkları ile değiştirme
  const translations: Record<string, string> = {
    'is a': 'bir',
    'located in': 'bulunmaktadır',
    'century': 'yüzyıl',
    'the city': 'şehir',
    'tourists': 'turistler',
    'built': 'inşa edildi',
    'ancient': 'antik',
    'historical': 'tarihi',
    'site': 'alan',
    'famous': 'ünlü',
    'museum': 'müze',
    'architecture': 'mimari',
    'mosque': 'cami',
    'church': 'kilise',
    'palace': 'saray',
    'castle': 'kale',
    'beach': 'plaj',
    'mountain': 'dağ',
    'river': 'nehir',
    'lake': 'göl',
    'island': 'ada',
    'bridge': 'köprü',
    'tower': 'kule',
    'park': 'park',
    'square': 'meydan',
    'street': 'cadde'
  };
  
  let translated = text;
  
  Object.entries(translations).forEach(([eng, tr]) => {
    translated = translated.replace(new RegExp(`\\b${eng}\\b`, 'gi'), tr);
  });
  
  // Metni kısaltma
  if (translated.length > 150) {
    return translated.slice(0, 150) + '...';
  }
  
  return translated;
};

const CityGuideContent = () => {
  const route = useRoute<CityGuideContentRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { name, description } = route.params;
  const [placeDetails, setPlaceDetails] = useState<PlaceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const coords = await getCoordinatesByCity(name);
        if (!coords) {
          setError('Şehir koordinatları bulunamadı.');
          setLoading(false);
          return;
        }

        // Daha fazla turistik yer çekmek için sayıyı artırıyoruz
        const places = await searchOTMPlaces(coords.lat, coords.lon, 15000, 12);
        if (!places || places.length === 0) {
          setError('Bu şehir için turistik yerler bulunamadı.');
          setLoading(false);
          return;
        }

        // Paralel istekler yerine sıralı istekler kullanarak API rate limit aşımını engelleme
        const validDetails = [];
        // En fazla 8 yer göster, rate limit sorunlarını azaltmak için
        const limitedPlaces = places.slice(0, 8);
        // Sıralı istekler - daha yavaş ama rate limit'i aşmaz
        for (const place of limitedPlaces) {
          try {
            const detail = await getOTMPlaceDetails(place.xid);
            if (detail) {
              validDetails.push(detail);
            }
          } catch (error) {
            console.error(`Error fetching details for ${place.xid}:`, error);
          }
        }
        
        setPlaceDetails(validDetails);
      } catch (err) {
        console.error('Error loading place details:', err);
        setError('Bilgileri yüklerken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [name]);

  // Geri butonuna basıldığında önceki sayfaya dön
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Bir yere tıklandığında detay sayfasına git
  const handlePlacePress = async (place: PlaceDetail) => {
    try {
      // Yerden alınması gereken bilgiler
      const placeName = place.name;
      const placeImage = place.preview?.source || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(placeName)},landmark`;
      const placeDesc = place.wikipedia_extracts?.text ? cleanDescription(place.wikipedia_extracts.text) : 
      `${placeName}, ${name} bölgesinde bulunan önemli bir turistik noktadır.`;
      
      // Random rating
      const rating = (Math.random() * (5 - 4) + 4).toFixed(1);
      const reviewCount = Math.floor(Math.random() * 1000) + 100;
      
      // Navigate to ContentPage
      navigation.navigate('Content', {
        item: {
          id: place.xid,
          name: placeName,
          location: `${place.address?.city || name}`,
          description: placeDesc,
          imageUrl: placeImage,
          rating: parseFloat(rating),
          reviews: reviewCount,
          distance: "Bölgede",
          category: translateCategory(place.kind || ''),
          images: [
            { id: '1', uri: placeImage },
          ]
        }
      });
    } catch (error) {
      console.error("Error navigating to place details:", error);
    }
  };

  // Yıldız derecelendirmesi gösterme işlemi gerçekleştirilmekte.
  const renderRating = (rating = 4) => {
    const stars = [];
    const maxRating = 5;
    
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={16} 
          color={i <= rating ? "#FFD700" : "#CCCCCC"} 
          style={styles.starIcon}
        />
      );
    }
    
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  // Rastgele renk seçme fonksiyonu (placeholder için)
  const getRandomColor = (id: string) => {
    const colors = ['#6EE7B7', '#93C5FD', '#FCD34D', '#F87171'];
    // Id string olduğu için önce sayıya dönüştürüyoruz
    const hashCode = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hashCode % colors.length];
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Popüler yerler getiriliyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Her yerle ilgili bir kart oluşturulmaktadır.
  const renderPlaceCard = (place: PlaceDetail) => (
    <TouchableOpacity 
      key={place.xid} 
      style={styles.card}
      onPress={() => handlePlacePress(place)}
    >
      <View style={styles.imageContainer}>
        {place.preview?.source ? (
          <Image 
            source={{ uri: place.preview.source }} 
            style={styles.destinationImage}
            defaultSource={require('../../assets/logo/wl-text.png')}
          />
        ) : (
          <View style={[styles.colorPlaceholder, { backgroundColor: getRandomColor(place.xid) }]} />
        )}
      </View>
      <View style={styles.contentArea}>
        <Text style={styles.title}>{place.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.location}>{name}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{place.custom ? "5.0" : "4.7"}</Text>
          <Text style={styles.reviews}>{place.custom ? 520 : Math.floor(Math.random() * 500) + 100} Değerlendirme</Text>
        </View>

        {/* Açıklama metnini göster */}
        {place.wikipedia_extracts?.text && (
          <Text style={styles.itemDescription}>{cleanDescription(place.wikipedia_extracts.text)}</Text>
        )}

        {/* Detaya Git Butonu */}
        <TouchableOpacity style={styles.directionsButton} onPress={() => handlePlacePress(place)}>
          <Ionicons name="information-circle-outline" size={16} color="#fff" />
          <Text style={styles.directionsText}>Detayları Görüntüle</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <Ionicons name="location" size={24} color="#333" style={styles.categoryIcon} />
      </View>
      
      {/* Açıklama */}
      <Text style={styles.description}>{description}</Text>
      
      {/* Yerler Listesi */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        <Text style={styles.sectionTitle}>Popüler Yerler</Text>
        {placeDetails.length > 0 ? (
          placeDetails.map(place => renderPlaceCard(place))
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="information-circle" size={40} color="#4dabf7" />
            <Text style={styles.noData}>Bu şehir için veri bulunamadı.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CityGuideContent;

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
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  categoryIcon: {
    marginLeft: 10,
    color: '#E17055',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  listContainer: {
    paddingVertical: 10,
    paddingBottom: 50,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 25,
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
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 1,
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
    lineHeight: 22,
    maxHeight: 80, // Biraz daha kısa
    overflow: 'hidden',
  },
  directionsButton: {
    backgroundColor: '#E17055',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  directionsText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#4dabf7',
    marginTop: 12,
    textAlign: 'center',
  },
});