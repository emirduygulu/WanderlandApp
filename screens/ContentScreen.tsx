import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import ContentPage from '../components/ContentPage/ContentPage';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { fetchPlaceDetail, PlaceDetail } from '../services/PlaceDetailService';

// Geçici RootStackParamList tanımlaması
type RootStackParamList = {
  Content: {
    item?: {
      id: string;
      name: string;
      location: string;
      description: string;
      rating: number;
      reviews: number;
      distance: string;
      amenities?: number;
      images: Array<{
        id: string;
        uri: string;
      }>;
      isFavorite?: boolean;
    };
    itemId?: string;
  };
};

type ContentScreenRouteProp = RouteProp<RootStackParamList, 'Content'>;

const ContentScreen = () => {
  const route = useRoute<ContentScreenRouteProp>();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placeData, setPlaceData] = useState<PlaceDetail | null>(null);
  
  // Route params'dan id veya item bilgisini al
  const { itemId, item } = route.params || {};

  useEffect(() => {
    // Başlığı ayarla
    if (item?.name) {
      navigation.setOptions({ title: item.name });
    }
    
    const loadPlaceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Eğer zaten item prop'u varsa ve image'lar mevcutsa direk onu kullan
        if (item && item.images && item.images.length > 0) {
          setPlaceData(item as PlaceDetail);
          setLoading(false);
          return;
        }
        
        // API'den veri çek
        let placeDetail: PlaceDetail | null = null;
        
        if (itemId) {
          // ID varsa, direkt olarak ID ile çağır
          placeDetail = await fetchPlaceDetail(itemId);
        } else if (item) {
          // Yoksa item üzerinden ID veya isim ile çağır
          placeDetail = await fetchPlaceDetail(item.id, item.name);
        } else {
          // Hem ID hem item yoksa örnek veri göster
          placeDetail = sampleData;
        }
        
        if (placeDetail) {
          setPlaceData(placeDetail);
        } else {
          setError('Yer detayları yüklenirken bir sorun oluştu.');
        }
      } catch (err) {
        console.error('Place detail loading error:', err);
        setError('Yer detayları yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadPlaceDetails();
  }, [itemId, item, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E17055" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error || !placeData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Beklenmeyen bir hata oluştu.'}</Text>
        <Text style={styles.errorSubtext}>Lütfen daha sonra tekrar deneyin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ContentPage 
        name={placeData.name}
        location={placeData.location}
        description={placeData.description || ''}
        rating={placeData.rating}
        reviews={placeData.reviews}
        distance={placeData.distance || ''}
        amenities={placeData.amenities}
        images={placeData.images}
        isFavorite={placeData.isFavorite}
      />
    </View>
  );
};

// Sample data for fallback
const sampleData: PlaceDetail = {
  id: '1',
  name: 'Nusa Penida',
  location: 'Bali, Endonezya',
  description: "Nusa Penida, küçük ama güzel bir Endonezya adası. Bali'nin güneydoğusunda yer alan ada, turkuaz suları, etkileyici sahilleri ve dramatik kıyı şeridiyle bilinir. Keloking Beach ve Broken Beach gibi nefes kesici manzaraları ile fotoğraf tutkunları için adeta bir cennet.",
  rating: 4.8,
  reviews: 3243,
  imageUrl: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3',
  distance: '3000 km',
  amenities: 108,
  images: [
    {
      id: '1',
      uri: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      id: '2',
      uri: 'https://images.unsplash.com/photo-1584811644163-5ee1a1bef3d3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      id: '3',
      uri: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      id: '4',
      uri: 'https://images.unsplash.com/photo-1581313758694-b9ce89fdba5d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
  ],
  isFavorite: false,
  category: 'Tourism',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E17055',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ContentScreen; 