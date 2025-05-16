import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { getCoordinatesByCity, searchOTMPlaces, getOTMPlaceDetails } from '../../services/OneTripMap';
import { Ionicons } from '@expo/vector-icons';

// Ekran genişliğini alıyoruz
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // Container padding'i çıkarıldı

// Route parametreleri için tip tanımı
type RootStackParamList = {
  CityGuideContent: {
    name: string;
    description: string;
  };
};

type CityGuideContentRouteProp = RouteProp<RootStackParamList, 'CityGuideContent'>;

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
  custom?: boolean;
}

const CityGuideContent = () => {
  const route = useRoute<CityGuideContentRouteProp>();
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

        // Önce 7 popüler yer gelmekte.
        const places = await searchOTMPlaces(coords.lat, coords.lon, 15000, 7);
        if (!places || places.length === 0) {
          setError('Bu şehir için turistik yerler bulunamadı.');
          setLoading(false);
          return;
        }

        // Paralel olarak tüm yer detaylarını çekilmekte.
        const detailsPromises = places.map((place: any) => getOTMPlaceDetails(place.xid));
        const details = await Promise.all(detailsPromises);

        // Boş olmayanları filtreleme işlemi gerçekleştirilmekte.
        const validDetails = details.filter(Boolean);
        
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
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Her yerle ilgili bir kart oluşturuluyor.
  const renderPlaceCard = (place: PlaceDetail) => (
    <View key={place.xid} style={styles.card}>
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
          <Text style={styles.rating}>{place.custom ? "5.0" : "4.5"}</Text>
          <Text style={styles.reviews}>{Math.round((place.custom ? 5.0 : 4.5) * 10)} Reviews</Text>
        </View>

        {/* Açıklama metnini göster */}
        {place.wikipedia_extracts?.text && (
          <Text style={styles.itemDescription}>{place.wikipedia_extracts.text}</Text>
        )}

        {/* Yol tarifi butonu */}
        <TouchableOpacity style={styles.directionsButton}>
          <Ionicons name="navigate-outline" size={16} color="#fff" />
          <Text style={styles.directionsText}>Yol Tarifi Al</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Başlık ve Geri Butonu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
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
    height: 450,
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
  starIcon: {
    marginHorizontal: 1,
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
    maxHeight: 120,
    overflow: 'hidden',
  },
  directionsButton: {
    backgroundColor: '#2A3663',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  directionsText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
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