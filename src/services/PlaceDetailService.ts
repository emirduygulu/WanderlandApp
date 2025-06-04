import { getFSQPlaceDetails } from './Foursquare';
import { getDefaultLocation } from './Location';
import { getOTMPlaceDetails } from './OneTripMap';
import { fetchCityImage } from './Unsplash';
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
    
    // Basit görsel al
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
        const xid = `Q${Math.floor(Math.random() * 1000000)}`;
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
      imageUrl: images[0]?.uri || await fetchCityImage(name),
      rating: fsqDetails?.rating ? fsqDetails.rating / 2 : 4.5,
      reviews: fsqDetails?.stats?.total_ratings || Math.floor(Math.random() * 500) + 100,
      distance: `${distance.toFixed(0)} km`,
      amenities: Math.floor(Math.random() * 50) + 10,
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
 * Yer için basit görseller al
 */
const fetchPlaceImages = async (placeName: string, location: string, count: number = 5): Promise<Array<{id: string, uri: string}>> => {
  try {
    const images = [];
    
    // Ana görsel
    const mainImage = await fetchCityImage(`${placeName} ${location}`);
    images.push({ 
      id: `main_${placeName}`, 
      uri: mainImage 
    });
    
    // Alternatif görseller
    const queries = [placeName, location, 'Turkey landmark', 'Turkey travel'];
    
    for (let i = 0; i < Math.min(queries.length, count - 1); i++) {
      try {
        const imageUrl = await fetchCityImage(queries[i]);
        images.push({ 
          id: `alt_${i}_${placeName}`, 
          uri: imageUrl 
        });
      } catch (error) {
        console.log(`Alternatif görsel ${i + 1} hatası:`, error);
      }
    }
    
    // Eksik görseller için varsayılan
    while (images.length < count) {
      images.push({ 
        id: `fallback_${images.length}`, 
        uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
      });
    }
    
    return images.slice(0, count);
  } catch (error) {
    console.error('Image fetch error:', error);
    // Hata durumunda varsayılan görseller
    const fallbackImages = [];
    for (let i = 0; i < count; i++) {
      fallbackImages.push({ 
        id: `error_${i}`, 
        uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80'
      });
    }
    return fallbackImages;
  }
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