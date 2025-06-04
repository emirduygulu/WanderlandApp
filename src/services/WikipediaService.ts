// WikipediaService.ts - Geliştirilmiş Wikipedia API servisi

export interface WikipediaSummary {
  title: string;
  description?: string;
  extract: string;
  image?: string;
  url?: string;
  language: 'tr' | 'en';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WikipediaSearchResult {
  title: string;
  description?: string;
  url: string;
}

export interface WikipediaError {
  error: string;
  code?: number;
}

// Türkçe karakterleri normalize eden fonksiyon
const normalizeForWikipedia = (query: string): string => {
  return query
    .trim()
    .replace(/\s+/g, '_') // Boşlukları alt çizgi ile değiştir
    .replace(/['"]/g, ''); // Tırnak işaretlerini kaldır
};

// Alternatif arama terimleri oluşturan fonksiyon
const generateAlternativeQueries = (query: string): string[] => {
  const alternatives = [query];
  
  // Türkçe yer isimleri için İngilizce alternatifleri
  const turkishToEnglish: Record<string, string> = {
    'ayasofya': 'Hagia Sophia',
    'anıtkabir': 'Anıtkabir',
    'galata kulesi': 'Galata Tower',
    'galata köprüsü': 'Galata Bridge',
    'sultanahmet camii': 'Blue Mosque',
    'topkapı sarayı': 'Topkapi Palace',
    'kapadokya': 'Cappadocia',
    'pamukkale': 'Pamukkale',
    'efes': 'Ephesus',
    'nemrut dağı': 'Mount Nemrut',
    'istanbul': 'Istanbul',
    'ankara': 'Ankara',
    'izmir': 'Izmir',
    'antalya': 'Antalya'
  };
  
  const normalized = query.toLowerCase();
  for (const [turkish, english] of Object.entries(turkishToEnglish)) {
    if (normalized.includes(turkish)) {
      alternatives.push(english);
      break;
    }
  }
  
  // Farklı varyasyonlar ekle
  if (!query.includes('_')) {
    alternatives.push(query.replace(/\s+/g, '_'));
  }
  
  return [...new Set(alternatives)]; // Duplikatları kaldır
};

/**
 * Wikipedia'dan özet bilgi çeker (önce Türkçe, sonra İngilizce)
 */
export const fetchWikipediaSummary = async (query: string): Promise<WikipediaSummary | WikipediaError> => {
  if (!query || query.trim().length === 0) {
    return { error: 'Geçersiz arama terimi' };
  }

  console.log(`🔍 Wikipedia özeti aranıyor: "${query}"`);
  
  const alternatives = generateAlternativeQueries(query);
  
  // Önce Türkçe Wikipedia'da ara
  for (const searchTerm of alternatives) {
    try {
      console.log(`📖 Türkçe Wikipedia'da aranıyor: "${searchTerm}"`);
      const normalizedQuery = normalizeForWikipedia(searchTerm);
      
      const response = await fetch(
        `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedQuery)}`,
        {
          headers: {
            'User-Agent': 'WanderlandApp/1.0 (https://wanderlandapp.com/contact)'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.type !== 'disambiguation' && data.extract) {
          console.log(`✅ Türkçe Wikipedia'da bulundu: "${data.title}"`);
          
          // Görsel URL'sini öncelik sırasına göre al
          let imageUrl = '';
          if (data.originalimage?.source) {
            imageUrl = data.originalimage.source;
            console.log(`🖼️ Original image bulundu: ${imageUrl}`);
          } else if (data.thumbnail?.source) {
            imageUrl = data.thumbnail.source;
            console.log(`🖼️ Thumbnail bulundu: ${imageUrl}`);
          }
          
          return {
            title: data.title,
            description: data.description,
            extract: data.extract,
            image: imageUrl,
            url: data.content_urls?.desktop?.page,
            language: 'tr',
            coordinates: data.coordinates ? {
              lat: data.coordinates.lat,
              lng: data.coordinates.lon
            } : undefined
          };
        }
      }
    } catch (error) {
      console.log(`❌ Türkçe Wikipedia hatası: ${searchTerm}`, error);
    }
  }
  
  // Türkçe'de bulunamadıysa İngilizce Wikipedia'da ara
  for (const searchTerm of alternatives) {
    try {
      console.log(`📖 İngilizce Wikipedia'da aranıyor: "${searchTerm}"`);
      const normalizedQuery = normalizeForWikipedia(searchTerm);
      
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(normalizedQuery)}`,
        {
          headers: {
            'User-Agent': 'WanderlandApp/1.0 (https://wanderlandapp.com/contact)'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.type !== 'disambiguation' && data.extract) {
          console.log(`✅ İngilizce Wikipedia'da bulundu: "${data.title}"`);
          
          // Görsel URL'sini öncelik sırasına göre al
          let imageUrl = '';
          if (data.originalimage?.source) {
            imageUrl = data.originalimage.source;
            console.log(`🖼️ Original image bulundu: ${imageUrl}`);
          } else if (data.thumbnail?.source) {
            imageUrl = data.thumbnail.source;
            console.log(`🖼️ Thumbnail bulundu: ${imageUrl}`);
          }
          
          return {
            title: data.title,
            description: data.description,
            extract: data.extract,
            image: imageUrl,
            url: data.content_urls?.desktop?.page,
            language: 'en',
            coordinates: data.coordinates ? {
              lat: data.coordinates.lat,
              lng: data.coordinates.lon
            } : undefined
          };
        }
      }
    } catch (error) {
      console.log(`❌ İngilizce Wikipedia hatası: ${searchTerm}`, error);
    }
  }
  
  console.log(`❌ Wikipedia'da bulunamadı: "${query}"`);
  return { error: 'Wikipedia\'da içerik bulunamadı' };
};

/**
 * Wikipedia'da arama yapar ve sonuç listesi döndürür
 */
export const searchWikipedia = async (query: string, language: 'tr' | 'en' = 'tr', limit: number = 5): Promise<WikipediaSearchResult[] | WikipediaError> => {
  if (!query || query.trim().length === 0) {
    return { error: 'Geçersiz arama terimi' };
  }

  try {
    console.log(`🔍 Wikipedia araması: "${query}" (${language})`);
    
    const response = await fetch(
      `https://${language}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${limit}&namespace=0&format=json&origin=*`,
      {
        headers: {
          'User-Agent': 'WanderlandApp/1.0 (https://wanderlandapp.com/contact)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data) || data.length < 4) {
      return { error: 'Geçersiz API yanıtı' };
    }

    const [searchTerm, titles, descriptions, urls] = data;
    
    if (!titles || titles.length === 0) {
      return { error: 'Arama sonucu bulunamadı' };
    }

    const results: WikipediaSearchResult[] = titles.map((title: string, index: number) => ({
      title,
      description: descriptions[index] || '',
      url: urls[index] || ''
    }));

    console.log(`✅ ${results.length} Wikipedia sonucu bulundu`);
    return results;
    
  } catch (error) {
    console.error(`❌ Wikipedia arama hatası:`, error);
    return { error: `Arama hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` };
  }
};

/**
 * Belirli bir landmark için Wikipedia bilgilerini çeker
 */
export const fetchLandmarkInfo = async (landmarkName: string, cityName?: string): Promise<WikipediaSummary | WikipediaError> => {
  // Yer ismi ve şehir ismi ile arama sorgusu oluştur
  const queries = [
    landmarkName,
    cityName ? `${landmarkName} ${cityName}` : landmarkName,
    cityName ? `${landmarkName}, ${cityName}` : landmarkName
  ];

  for (const query of queries) {
    const result = await fetchWikipediaSummary(query);
    if ('title' in result) {
      return result;
    }
  }

  return { error: `${landmarkName} için Wikipedia bilgisi bulunamadı` };
};

/**
 * Şehir için Wikipedia bilgilerini çeker
 */
export const fetchCityInfo = async (cityName: string): Promise<WikipediaSummary | WikipediaError> => {
  const queries = [
    cityName,
    `${cityName} şehri`,
    `${cityName} city`
  ];

  for (const query of queries) {
    const result = await fetchWikipediaSummary(query);
    if ('title' in result) {
      return result;
    }
  }

  return { error: `${cityName} için Wikipedia bilgisi bulunamadı` };
};

/**
 * Wikipedia görseli için yüksek kaliteli URL döndürür
 */
export const getHighQualityWikipediaImage = (imageUrl: string, width: number = 800): string => {
  if (!imageUrl) return '';
  
  console.log(`🖼️ Wikipedia görsel işleniyor: ${imageUrl}`);
  
  try {
    // Wikipedia Commons görsellerini yüksek kaliteye çevir
    if (imageUrl.includes('upload.wikimedia.org')) {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      
      // Thumbnail URL'sini belirli boyutlu URL'sine çevir
      if (pathParts.includes('thumb')) {
        const thumbIndex = pathParts.indexOf('thumb');
        const filename = pathParts[pathParts.length - 1];
        
        // Dosya uzantısını al
        const fileExtension = filename.split('.').pop() || 'jpg';
        const filenameWithoutSize = filename.replace(/^\d+px-/, '');
        
        // Yeni path oluştur: /wikipedia/commons/thumb/x/xx/filename.jpg/{width}px-filename.jpg
        const newPath = pathParts.slice(0, thumbIndex + 1).concat(
          pathParts.slice(thumbIndex + 1, -1),
          `${width}px-${filenameWithoutSize}`
        );
        
        url.pathname = newPath.join('/');
        const finalUrl = url.toString();
        console.log(`✅ Wikipedia görseli yüksek kaliteye çevrildi: ${finalUrl}`);
        return finalUrl;
      }
      
      // Zaten tam boyutsa doğrudan döndür
      console.log(`✅ Wikipedia görseli zaten yüksek kalitede: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`⚠️ Wikipedia görseli değil, düzenleme yapılmadı: ${imageUrl}`);
    return imageUrl;
  } catch (error) {
    console.error('Wikipedia görsel URL düzenleme hatası:', error);
    return imageUrl;
  }
};

/**
 * Test fonksiyonu
 */
export const testWikipediaService = async () => {
  console.log('🧪 Wikipedia Servisi Test Ediliyor...');
  
  const testQueries = [
    'Anıtkabir',
    'Galata Kulesi',
    'Ayasofya',
    'Kapadokya',
    'İstanbul'
  ];

  for (const query of testQueries) {
    console.log(`\n📖 Test: ${query}`);
    const result = await fetchWikipediaSummary(query);
    
    if ('error' in result) {
      console.log(`❌ Hata: ${result.error}`);
    } else {
      console.log(`✅ Başarılı: ${result.title} (${result.language})`);
      console.log(`📝 Özet: ${result.extract.substring(0, 100)}...`);
      console.log(`🖼️ Görsel: ${result.image ? 'Var' : 'Yok'}`);
    }
  }
};

export default {
  fetchWikipediaSummary,
  searchWikipedia,
  fetchLandmarkInfo,
  fetchCityInfo,
  getHighQualityWikipediaImage,
  testWikipediaService
}; 