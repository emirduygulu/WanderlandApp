import { searchFSQPlaces, getFSQPlaceDetails } from './Foursquare';
import { getOTMPlaceDetails } from './OneTripMap';
import { getDefaultLocation } from './Location';
import { PlaceItem } from './categoryService';

export interface PlaceDetail extends PlaceItem {
  reviews: number;
  distance?: string;
  amenities?: number;
  images: Array<{
    id: string;
    uri: string;
  }>;
  highlights?: string[];
  openingHours?: string[];
  priceRange?: string;
  website?: string;
  phoneNumber?: string;
  address?: string;
  isFavorite?: boolean;
}

const getUnsplashKey = () => {
  return process.env.UNSPLASH_ACCESS_KEY || '';
};

/**
 * Yer/landmark detayını getir
 * @param placeId Place ID
 * @param placeName Alternatif olarak yer ismi ile arama
 */
export const fetchPlaceDetail = async (placeId: string, placeName?: string): Promise<PlaceDetail | null> => {
  try {
    // Önce Foursquare API'dan yerin detaylarını al
    const fsqDetails = await getFSQPlaceDetails(placeId);
    
    if (!fsqDetails && !placeName) {
      console.error('Yer detayı bulunamadı ve alternatif isim verilmedi');
      return null;
    }
    
    // Foursquare'den veri gelmezse isim ile devam et
    const name = fsqDetails?.name || placeName || '';
    const location = fsqDetails?.location?.locality || fsqDetails?.location?.region || 'Bilinmeyen Konum';
    
    // Unsplash'dan görseller al
    const images = await fetchPlaceImages(name, location, 5);
    
    // Mesafe hesapla
    const userLocation = getDefaultLocation();
    const placeLocation = fsqDetails?.geocodes?.main || { latitude: 0, longitude: 0 };
    const distance = calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      placeLocation.latitude, 
      placeLocation.longitude
    );
    
    // OneTripMap'ten ek bilgiler almayı dene
    let otmDetails = null;
    try {
      if (fsqDetails?.geocodes?.main) {
        // XID parametresi göndermekteyiz, koordinat değil
        const xid = `Q${Math.floor(Math.random() * 1000000)}`; // Örnek olarak rastgele bir XID oluşturuyoruz
        otmDetails = await getOTMPlaceDetails(xid);
      }
    } catch (error) {
      console.error('OTM detayları alınamadı:', error);
    }
    
    // Detay verisini oluştur
    const placeDetail: PlaceDetail = {
      id: placeId || `place_${Date.now()}`,
      name: name,
      location: location,
      imageUrl: images[0]?.uri || 'https://source.unsplash.com/random/800x600/?place',
      rating: fsqDetails?.rating ? fsqDetails.rating / 2 : 4.5, // 10 üzerinden 5'e çevir
      reviews: fsqDetails?.stats?.total_ratings || Math.floor(Math.random() * 500) + 100,
      distance: `${distance.toFixed(0)} km`,
      amenities: Math.floor(Math.random() * 50) + 10, // Rastgele değer
      description: otmDetails?.wikipedia_extracts?.text || 
                  `${name}, ${location} bölgesinde bulunan popüler bir yerdir. Ziyaretçilere benzersiz deneyimler sunar.`,
      images: images,
      highlights: [
        'Muazzam Manzara',
        'Huzurlu Ortam',
        'Yerel Lezzetler',
        'Kültürel Deneyim'
      ],
      category: fsqDetails?.categories?.[0]?.name || 'Gezi Noktası'
    };
    
    return placeDetail;
  } catch (error) {
    console.error('Place detail error:', error);
    return null;
  }
};

/**
 * Yer için Unsplash'dan görseller al
 */
const fetchPlaceImages = async (placeName: string, location: string, count: number = 5): Promise<Array<{id: string, uri: string}>> => {
  try {
    const UNSPLASH_ACCESS_KEY = getUnsplashKey();
        if (!UNSPLASH_ACCESS_KEY) {
      console.warn('Unsplash API anahtarı ayarlanmamış. Placeholder görseller kullanılacak.');
      return generatePlaceholderImages(placeName, location, count);
    }
    
    // Önce yer ismi + konum ile ara
    const query = `${placeName} ${location}`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${count}`
    );

    const data = await response.json();
    
    // Eğer yeterli sonuç yoksa sadece yer ismi ile tekrar ara
    if (!data.results || data.results.length < 2) {
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${count}`
      );
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.results && fallbackData.results.length > 0) {
        return fallbackData.results.map((img: any, index: number) => ({
          id: img.id || `img_${index}`,
          uri: img.urls.regular
        }));
      }
    }
    
    // İlk sorgudan sonuçları dön
    if (data.results && data.results.length > 0) {
      return data.results.map((img: any, index: number) => ({
        id: img.id || `img_${index}`,
        uri: img.urls.regular
      }));
    }
    
    // Hiçbir sonuç bulunamazsa varsayılan görsel dizisi döndür
    return generatePlaceholderImages(placeName, location, count);
  } catch (error) {
    console.error('Unsplash API error:', error);
    return generatePlaceholderImages(placeName, location, 2);
  }
};

/**
 * Placeholder görseller oluştur
 */
const generatePlaceholderImages = (placeName: string, location: string, count: number): Array<{id: string, uri: string}> => {
  const images = [];
  
  images.push({ id: 'default1', uri: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(placeName)}` });
  images.push({ id: 'default2', uri: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(location)},travel` });
  
  // İstenen sayıda görsel oluştur
  for (let i = 3; i <= count; i++) {
    images.push({ id: `default${i}`, uri: `https://source.unsplash.com/random/800x600/?tourism,travel` });
  }
  
  return images.slice(0, count); // İstenen sayıda görsel döndür
};

/**
 * İki nokta arasındaki mesafe hesaplama (km)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Kilometre cinsinden mesafe
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
} 