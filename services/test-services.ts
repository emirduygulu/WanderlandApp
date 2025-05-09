// API servislerini test etmek için geliştirme sırasında kullanılacak dosya

import { searchPhotos, getRandomPhoto } from './mediaapi';
import { searchRecipes, getRecipeInformation } from './foodapi';
import { 
  searchNearbyPlaces, 
  getPlaceDetails, 
  searchPlacesByText, 
  getStaticMapImageUrl, 
  getDirections,
  geocodeAddress,
  reverseGeocode,
  getPlaceReviews,
  getPlacePhotos,
  getAutocompletePredictions
} from './mapapi';
import { IS_DEVELOPMENT } from './config';

// Unsplash API testleri
const testMediaAPI = async () => {
  try {
    console.log('Medya API (Unsplash) Test Ediliyor...');
    
    // Fotoğraf arama testi
    console.log('\nFotoğraf Arama Testi:');
    const searchResult = await searchPhotos('istanbul', 1, 2);
    console.log('Arama Sonucu:', searchResult.results ? 
      `${searchResult.results.length} fotoğraf bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Rastgele fotoğraf testi
    console.log('\nRastgele Fotoğraf Testi:');
    const randomPhoto = await getRandomPhoto();
    console.log('Rastgele Fotoğraf URL:', randomPhoto?.urls?.regular || 'Fotoğraf bulunamadı veya hata oluştu');
  } catch (error) {
    console.error('Medya API Test Hatası:', error);
  }
};

// Spoonacular API testleri
const testFoodAPI = async () => {
  try {
    console.log('\nYemek API (Spoonacular) Test Ediliyor...');
    
    // Tarif arama testi
    console.log('\nTarif Arama Testi:');
    const searchResult = await searchRecipes('pasta', 2);
    console.log('Tarif Arama Sonucu:', searchResult.results ? 
      `${searchResult.results.length} tarif bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Tarif bilgileri testi, eğer sonuç varsa
    if (searchResult.results && searchResult.results.length > 0) {
      const recipeId = searchResult.results[0].id;
      console.log('\nTarif Bilgisi Getirme Testi:');
      const recipeInfo = await getRecipeInformation(recipeId);
      console.log('Tarif Bilgisi:', recipeInfo?.title || 'Bilgi bulunamadı veya hata oluştu');
    }
  } catch (error) {
    console.error('Yemek API Test Hatası:', error);
  }
};

// Google Maps API testleri
const testGoogleMapsAPI = async () => {
  try {
    console.log('\nGoogle Maps API Test Ediliyor...');
    
    // Adres geocoding testi
    console.log('\nAdres Geocoding Testi:');
    const geocodeResult = await geocodeAddress('Ayasofya, İstanbul');
    console.log('Geocode Sonucu:', geocodeResult.results ? 
      `Koordinatlar bulundu: ${JSON.stringify(geocodeResult.results[0]?.geometry?.location)}` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Ters geocoding testi, Taksim Meydanı koordinatları kullanılıyor
    console.log('\nTers Geocoding Testi:');
    const reverseResult = await reverseGeocode(41.0370, 28.9851);
    console.log('Ters Geocode Sonucu:', reverseResult.results ? 
      `Adres bulundu: ${reverseResult.results[0]?.formatted_address}` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Metin ile yer arama testi
    console.log('\nMetin ile Yer Arama Testi:');
    const textSearchResult = await searchPlacesByText('istanbul restoranlar');
    console.log('Metin Arama Sonucu:', textSearchResult.results ? 
      `${textSearchResult.results.length} yer bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Otomatik tamamlama testi
    console.log('\nOtomatik Tamamlama Testi:');
    const autocompleteResult = await getAutocompletePredictions('İstanbul Res');
    console.log('Otomatik Tamamlama Sonucu:', autocompleteResult.predictions ? 
      `${autocompleteResult.predictions.length} öneri bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Yakında yer arama testi, İstanbul koordinatları kullanılıyor
    console.log('\nYakında Yer Arama Testi:');
    const nearbyResult = await searchNearbyPlaces(28.9784, 41.0082, 1000, 'restaurant');
    console.log('Yakındaki Yerler Sonucu:', nearbyResult.results ? 
      `${nearbyResult.results.length} yakın yer bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
    
    // Yer detayları ve yorumları testi, eğer sonuç varsa
    if (nearbyResult.results && nearbyResult.results.length > 0) {
      const placeId = nearbyResult.results[0].place_id;
      
      // Yer detayları testi
      console.log('\nYer Detayları Getirme Testi:');
      const placeDetails = await getPlaceDetails(placeId);
      console.log('Yer Detayları:', placeDetails.result?.name || 'Detay bulunamadı veya hata oluştu');
      console.log('Yer Puanı:', placeDetails.result?.rating || 'Puan bulunamadı');
      
      // Yer yorumları testi
      console.log('\nYer Yorumları Getirme Testi:');
      const placeReviews = await getPlaceReviews(placeId);
      console.log('Yer Yorumları:', placeReviews.reviews ? 
        `${placeReviews.reviews.length} yorum bulundu, ortalama puan: ${placeReviews.rating}` : 
        'Yorum bulunamadı veya hata oluştu');
      
      // Yer fotoğrafları testi
      console.log('\nYer Fotoğrafları Getirme Testi:');
      const placePhotos = await getPlacePhotos(placeId, 3);
      console.log('Yer Fotoğrafları:', placePhotos.photos ? 
        `${placePhotos.photos.length} fotoğraf bulundu` : 
        'Fotoğraf bulunamadı veya hata oluştu');
    }
    
    // Statik harita resmi URL testi
    console.log('\nStatik Harita Resmi URL Testi:');
    const mapImageUrl = getStaticMapImageUrl(28.9784, 41.0082);
    console.log('Statik Harita Resmi URL:', mapImageUrl);
    
    // Yol tarifi testi
    console.log('\nYol Tarifi Testi:');
    // Ayasofya'dan Topkapı Sarayı'na
    const directionsResult = await getDirections(28.9802, 41.0086, 28.9834, 41.0115, 'walking');
    console.log('Yol Tarifi Sonucu:', directionsResult.routes ? 
      `${directionsResult.routes.length} rota bulundu` : 
      'Sonuç bulunamadı veya hata oluştu');
  } catch (error) {
    console.error('Google Maps API Test Hatası:', error);
  }
};

// Ana test fonksiyonu
const testAllAPIs = async () => {
  if (!IS_DEVELOPMENT) {
    console.warn('Testler sadece geliştirme ortamında çalıştırılmalıdır');
    return;
  }
  
  console.log('API testleri başlatılıyor...');
  console.log('=====================');
  
  await testMediaAPI();
  await testFoodAPI();
  await testGoogleMapsAPI();
  
  console.log('=====================');
  console.log('API testleri tamamlandı');
};

export default testAllAPIs; 