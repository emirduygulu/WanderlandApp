// Basitleştirilmiş Unsplash servisi

// Türkiye'deki popüler yerler için sabit fotoğraflar - GELİŞTİRİLMİŞ
const TURKISH_PLACE_PHOTOS = {
  // Anıtkabir ve Ankara
  'anitkabir': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'anıtkabir': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'ataturk mausoleum': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'ankara': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  
  // İstanbul - Galata bölgesi için özel fotoğraflar
  'galata köprüsü': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', // Gerçek Galata Köprüsü fotoğrafı
  'galata koprüsu': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'galata bridge': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'galata kulesi': 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&q=80', // Galata Kulesi için ayrı fotoğraf
  'galata tower': 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&q=80',
  
  // Diğer İstanbul yerler
  'ayasofya': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  'hagia sophia': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  'sultanahmet': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', // Sultanahmet Camii
  'sultanahmet camii': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'blue mosque': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'topkapı': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  'topkapi': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  'topkapi palace': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  'bosphorus': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'boğaziçi': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  
  // Kapadokya
  'kapadokya': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80',
  'cappadocia': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80',
  'göreme': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80',
  'goreme': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&q=80',
  
  // Diğer turistik yerler
  'pamukkale': 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
  'efes': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80',
  'ephesus': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80',
  'nemrut': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'mount nemrut': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  
  // Şehirler
  'izmir': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80',
  'antalya': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'bodrum': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'marmaris': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
};

// Varsayılan fotoğraflar
const DEFAULT_PHOTOS = {
  general: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  landmark: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
  city: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  mosque: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  palace: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80',
  bridge: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80'
};

// Geliştirilmiş arama terimi normalize etme
const normalizeSearchTerm = (term) => {
  if (!term) return '';
  return term
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, ' ') // Birden fazla boşluğu tek boşluk yap
    .replace(/[^\w\s]/g, ''); // Noktalama işaretlerini kaldır
};

/**
 * Geliştirilmiş resim getirme fonksiyonu
 */
export const fetchImageByQuery = async (query, options = {}) => {
  try {
    console.log(`🔍 Fotoğraf aranıyor: "${query}"`);
    
    // Önce Türkçe yerler listesinde ara
    const normalizedQuery = normalizeSearchTerm(query);
    
    // 1. Doğrudan eşleşme
    if (TURKISH_PLACE_PHOTOS[normalizedQuery]) {
      console.log(`✅ Doğrudan eşleşme bulundu: "${normalizedQuery}"`);
      return TURKISH_PLACE_PHOTOS[normalizedQuery];
    }
    
    // 2. Kısmi eşleşme - daha akıllı
    for (const [key, url] of Object.entries(TURKISH_PLACE_PHOTOS)) {
      // Galata Köprüsü için özel kontrol
      if (key.includes('galata') && normalizedQuery.includes('galata')) {
        if (key.includes('kopru') && normalizedQuery.includes('kopru')) {
          console.log(`🌉 Galata Köprüsü eşleşmesi: "${key}"`);
          return url;
        }
        if (key.includes('bridge') && (normalizedQuery.includes('bridge') || normalizedQuery.includes('kopru'))) {
          console.log(`🌉 Galata Bridge eşleşmesi: "${key}"`);
          return url;
        }
        if (key.includes('kule') && normalizedQuery.includes('kule')) {
          console.log(`🗼 Galata Kulesi eşleşmesi: "${key}"`);
          return url;
        }
      }
      
      // Genel kısmi eşleşme
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        console.log(`🎯 Kısmi eşleşme bulundu: "${key}" -> "${normalizedQuery}"`);
        return url;
      }
    }
    
    // 3. Kelime bazlı eşleşme
    const queryWords = normalizedQuery.split(' ');
    for (const [key, url] of Object.entries(TURKISH_PLACE_PHOTOS)) {
      const keyWords = key.split(' ');
      const matchCount = queryWords.filter(word => 
        keyWords.some(keyWord => keyWord.includes(word) || word.includes(keyWord))
      ).length;
      
      if (matchCount >= Math.min(queryWords.length, keyWords.length) / 2) {
        console.log(`📝 Kelime eşleşmesi bulundu: "${key}" (${matchCount} kelime)`);
        return url;
      }
    }
    
    // 4. Varsayılan fotoğraf döndür
    console.log(`⚡ Varsayılan fotoğraf kullanılıyor: "${query}"`);
    return DEFAULT_PHOTOS.general;
    
  } catch (error) {
    console.error('❌ Fotoğraf getirme hatası:', error);
    return DEFAULT_PHOTOS.general;
  }
};

// Şehir görseli
export const fetchCityImage = async (city) => {
  try {
    console.log(`🏙️ Şehir görseli isteniyor: "${city}"`);
    return await fetchImageByQuery(city);
  } catch (error) {
    console.error('❌ Şehir görseli hatası:', error);
    return DEFAULT_PHOTOS.city;
  }
};

// Landmark görseli
export const fetchLandmarkImage = async (city, landmarkName) => {
  try {
    console.log(`🏛️ Landmark görseli isteniyor: "${landmarkName}" - "${city}"`);
    const query = `${landmarkName} ${city}`;
    return await fetchImageByQuery(query);
  } catch (error) {
    console.error('❌ Landmark görseli hatası:', error);
    return DEFAULT_PHOTOS.landmark;
  }
};

// Toplu görsel yükleme
export const preloadLandmarkImages = async (landmarks) => {
  const results = {};
  
  for (const city in landmarks) {
    try {
      results[city] = [];
      for (const landmark of landmarks[city]) {
        const imageUrl = await fetchLandmarkImage(city, landmark.name);
        results[city].push(imageUrl);
      }
    } catch (error) {
      console.error(`❌ ${city} için görsel yükleme hatası:`, error);
      results[city] = [DEFAULT_PHOTOS.landmark];
    }
  }
  
  return results;
}; 