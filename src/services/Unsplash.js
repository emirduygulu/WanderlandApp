import { UNSPLASH_ACCESS_KEY } from '@env';

/**
 * Şehir veya landmark için görsel almak için geliştirilmiş fonksiyon
 * @param {string} query - Arama sorgusu
 * @param {Object} options - Ek ayarlar
 * @returns {Promise<string|null>} - Görsel URL'i veya null
 */
export const fetchImageByQuery = async (query, options = {}) => {
  const { 
    perPage = 3, 
    orientation = 'landscape',
    contentFilter = 'high',
    quality = 'regular'
  } = options;
  
  try {
    console.log(`"${query}" sorgusu için Unsplash görseli getiriliyor`);
    
    // API isteği yapılırken orientation ve content_filter parametrelerini ekle
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${perPage}&orientation=${orientation}&content_filter=${contentFilter}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Unsplash API hatası (${response.status}):`, errorData);
      throw new Error(`Unsplash API hatası: ${response.status}`);
    }

    const data = await response.json();
    
    // Sonuçları logla
    console.log(`"${query}" için Unsplash sonuçları: ${data.results ? data.results.length : 0} görsel bulundu`);

    if (data.results && data.results.length > 0) {
      // Birden fazla sonuç varsa en iyi eşleşmeyi seçmeye çalış
      const bestMatch = data.results.find(result => 
        result.description && result.description.toLowerCase().includes(query.toLowerCase())
      ) || data.results[0];
      
      // quality parametresine göre URL'i döndür (regular, full, raw, small)
      return bestMatch.urls[quality] || bestMatch.urls.regular;
    } else {
      console.log(`"${query}" sorgusu için Unsplash sonucu bulunamadı`);
      return null;
    }
  } catch (error) {
    console.error(`"${query}" sorgusu için Unsplash API Hatası:`, error);
    // API hatası durumunda null döndür, uygulama fallback mekanizmasını kullanacak
    return null;
  }
};

// Şehir görseli almak için (önceki sürüm yerine geçecek)
export const fetchCityImage = async (city) => {
  try {
    // Şehir görselleri için optimize edilmiş sorgu
    const imageUrl = await fetchImageByQuery(`${city} city skyline`, {
      orientation: 'landscape',
      perPage: 3
    });
    
    if (imageUrl) return imageUrl;
    
    // Fallback: Sadece şehir adıyla dene
    return await fetchImageByQuery(city, { perPage: 3 });
  } catch (error) {
    console.error('Unsplash Şehir Görseli Hatası:', error);
    return null;
  }
};

// Landmark için görsel getir (şehir adı + landmark adı kombinasyonu)
export const fetchLandmarkImage = async (city, landmarkName) => {
  try {
    // İlk deneme: Landmark + şehir adı
    const query = `${landmarkName} ${city} landmark`;
    const imageUrl = await fetchImageByQuery(query, {
      orientation: 'landscape',
      perPage: 3,
      quality: 'regular'
    });
    
    if (imageUrl) return imageUrl;
    
    // İkinci deneme: Sadece landmark adı
    const fallbackImageUrl = await fetchImageByQuery(`${landmarkName} landmark`, {
      perPage: 3
    });
    
    if (fallbackImageUrl) return fallbackImageUrl;
    
    // Son çare: Genel turistik yer görseli
    return await fetchImageByQuery(`${city} tourist attraction`, {
      perPage: 1
    });
  } catch (error) {
    console.error('Unsplash Turistik Yer Görseli Hatası:', error);
    return null;
  }
};

// Landmark görsellerini ön yükleme fonksiyonu (performans için)
export const preloadLandmarkImages = async (landmarks) => {
  const imagePromises = {};
  
  for (const city in landmarks) {
    imagePromises[city] = [];
    
    for (const landmark of landmarks[city]) {
      const promise = fetchLandmarkImage(city, landmark.name);
      imagePromises[city].push(promise);
    }
  }
  
  // Tüm promise'ları bekle
  const results = {};
  for (const city in imagePromises) {
    results[city] = await Promise.all(imagePromises[city]);
  }
  
  return results;
};