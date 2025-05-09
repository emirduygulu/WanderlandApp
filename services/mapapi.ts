// Google Maps API Servisleri

import apiClient from './apiClient';
import { GOOGLE_MAPS_API_KEY } from './config';

// Metin araması ile yer bul - Adres, şehir veya mekan adı ile arama yapma
export const searchPlacesByText = async (query: string, limit: number = 5) => {
  try {
    const response = await apiClient.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query,
        key: GOOGLE_MAPS_API_KEY,
        language: 'tr',
        maxResults: limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Metin ile yer arama hatası:', error);
    throw error;
  }
};

// Adres bilgisini koordinatlara dönüştürme (Geocoding)
export const geocodeAddress = async (address: string) => {
  try {
    const response = await apiClient.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
        language: 'tr'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Adres geocoding hatası:', error);
    throw error;
  }
};

// Koordinatları adres bilgisine dönüştürme (Ters Geocoding)
export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await apiClient.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY,
        language: 'tr'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Ters geocoding hatası:', error);
    throw error;
  }
};

// Belirli bir konum etrafındaki yerleri arama 
export const searchNearbyPlaces = async (
  longitude: number,
  latitude: number,
  radius: number = 1000,
  type: string = '',
  keyword: string = '',
  limit: number = 20
) => {
  try {
    const params: any = {
      location: `${latitude},${longitude}`,
      radius,
      language: 'tr',
      key: GOOGLE_MAPS_API_KEY
    };
    
    // Kategori (type) ve anahtar kelime ekle 
    if (type) params.type = type;
    if (keyword) params.keyword = keyword;
    
    const response = await apiClient.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error('Yakındaki yerleri arama hatası:', error);
    throw error;
  }
};

// Google Places API için fotoğraf türü
interface GooglePlacePhoto {
  photo_reference: string;
  width: number;
  height: number;
}

// Mekan detaylarını getir (Bilgiler, yıldızlar ve yorumlar dahil)
export const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await apiClient.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        language: 'tr',
        // İlgili bilgiler, fotoğraflar, yorumlar ve yıldız bilgilerini dahil et
        fields: 'name,formatted_address,geometry,rating,reviews,photos,formatted_phone_number,opening_hours,website,price_level,user_ratings_total'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Mekan detayları getirme hatası:', error);
    throw error;
  }
};

// Mekan yorumlarını getir
export const getPlaceReviews = async (placeId: string) => {
  // Google Maps API'de ayrı bir yorum endpointi yok, place details içinde geliyor
  // Ancak tekrar kullanılabilirlik için ayrı bir fonksiyon olarak tanımlıyoruz
  try {
    const placeDetails = await getPlaceDetails(placeId);
    return {
      placeId,
      reviews: placeDetails.result.reviews || [],
      rating: placeDetails.result.rating || 0,
      totalRatings: placeDetails.result.user_ratings_total || 0
    };
  } catch (error) {
    console.error('Mekan yorumları getirme hatası:', error);
    throw error;
  }
};

// Statik harita görüntüsü URL'si oluştur
export const getStaticMapImageUrl = (
  longitude: number,
  latitude: number,
  zoom: number = 13,
  width: number = 600,
  height: number = 400
): string => {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:red|${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
};

// İki nokta arasında yol tarifi al
export const getDirections = async (
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
) => {
  try {
    const response = await apiClient.get(
      'https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${startLat},${startLng}`,
          destination: `${endLat},${endLng}`,
          mode,
          key: GOOGLE_MAPS_API_KEY,
          language: 'tr'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Yol tarifi alma hatası:', error);
    throw error;
  }
};

// Otomatik tamamlama - yer arama sırasında önerileri getir
export const getAutocompletePredictions = async (input: string, location?: { lat: number, lng: number }, radius?: number) => {
  try {
    const params: any = {
      input,
      key: GOOGLE_MAPS_API_KEY,
      language: 'tr',
      components: 'country:tr'
    };
    
    // Opsiyonel konum ve yarıçap
    if (location) {
      params.location = `${location.lat},${location.lng}`;
      if (radius) params.radius = radius;
    }
    
    const response = await apiClient.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      { params }
    );
    
    return response.data;
  } catch (error) {
    console.error('Otomatik tamamlama hatası:', error);
    throw error;
  }
};

// Yer fotoğraflarını getir
export const getPlacePhotos = async (placeId: string, maxPhotos: number = 5) => {
  try {
    const placeDetails = await getPlaceDetails(placeId);
    
    if (!placeDetails.result.photos || placeDetails.result.photos.length === 0) {
      return { photos: [] };
    }
    
    // En fazla istenen sayıda fotoğraf al
    const photos = placeDetails.result.photos.slice(0, maxPhotos).map((photo: GooglePlacePhoto) => ({
      reference: photo.photo_reference,
      width: photo.width,
      height: photo.height,
      url: getPhotoUrl(photo.photo_reference, photo.width)
    }));
    
    return { photos };
  } catch (error) {
    console.error('Yer fotoğrafları getirme hatası:', error);
    throw error;
  }
};

// Fotoğraf URL'si oluştur
export const getPhotoUrl = (photoReference: string, maxWidth: number = 800): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
};
