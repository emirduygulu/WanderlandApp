// CityGuideWikipediaService.ts - City Guide'a özel Wikipedia API servisi

export interface CityGuideWikipediaResult {
  title: string;
  description: string;
  imageUrl: string;
  source: 'wikipedia' | 'fallback';
}

// İstanbul landmark'ları için özel Wikipedia sayfa başlıkları
const ISTANBUL_LANDMARKS: Record<string, string> = {
  'ayasofya camii': 'Ayasofya',
  'ayasofya': 'Ayasofya',
  'sultanahmet camii (mavi cami)': 'Sultanahmet Camii',
  'sultanahmet camii': 'Sultanahmet Camii',
  'mavi cami': 'Sultanahmet Camii',
  'topkapı sarayı': 'Topkapı Sarayı',
  'galata kulesi': 'Galata Kulesi',
  'kapalıçarşı': 'Kapalıçarşı',
  'büyük çarşı': 'Kapalıçarşı',
  'dolmabahçe sarayı': 'Dolmabahçe Sarayı',
  'beylerbeyi sarayı': 'Beylerbeyi Sarayı',
  'yerebatan sarnıcı': 'Yerebatan Sarnıcı',
  'basilica cistern': 'Yerebatan Sarnıcı',
  'boğaziçi köprüsü': 'Boğaziçi Köprüsü',
  '15 temmuz köprüsü': 'Boğaziçi Köprüsü'
};

// Paris landmark'ları için özel Wikipedia sayfa başlıkları
const PARIS_LANDMARKS: Record<string, string> = {
  'eiffel tower': 'Eyfel Kulesi',
  'eyfel kulesi': 'Eyfel Kulesi',
  'louvre': 'Louvre Müzesi',
  'louvre museum': 'Louvre Müzesi',
  'notre dame': 'Notre-Dame de Paris',
  'notre-dame': 'Notre-Dame de Paris',
  'arc de triomphe': 'Zafer Takı',
  'zafer takı': 'Zafer Takı',
  'champs-élysées': 'Champs-Élysées',
  'champs elysees': 'Champs-Élysées'
};

// New York landmark'ları için özel Wikipedia sayfa başlıkları
const NEWYORK_LANDMARKS: Record<string, string> = {
  'empire state building': 'Empire State Building',
  'statue of liberty': 'Özgürlük Heykeli',
  'özgürlük heykeli': 'Özgürlük Heykeli',
  'central park': 'Central Park',
  'times square': 'Times Square',
  'brooklyn bridge': 'Brooklyn Köprüsü'
};

// Şehir bazlı landmark haritası
const CITY_LANDMARKS: Record<string, Record<string, string>> = {
  'İstanbul': ISTANBUL_LANDMARKS,
  'istanbul': ISTANBUL_LANDMARKS,
  'Paris': PARIS_LANDMARKS,
  'paris': PARIS_LANDMARKS,
  'New York City': NEWYORK_LANDMARKS,
  'New York': NEWYORK_LANDMARKS,
  'newyork': NEWYORK_LANDMARKS
};

/**
 * Wikipedia REST API'si ile sayfa özeti al
 */
const fetchWikipediaPageSummary = async (pageTitle: string, language: 'tr' | 'en' = 'tr'): Promise<any> => {
  try {
    const encodedTitle = encodeURIComponent(pageTitle);
    const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
    
    console.log(`🔍 Fetching Wikipedia summary: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WanderlandApp/1.0 (contact@wanderlandapp.com)',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Wikipedia API failed: ${response.status} for ${pageTitle}`);
      return null;
    }
    
    const data = await response.json();
    
    // Disambiguation sayfası değilse ve extract varsa başarılı
    if (data.type !== 'disambiguation' && data.extract) {
      console.log(`✅ Wikipedia success: ${data.title} (${data.extract.length} chars)`);
      return data;
    }
    
    console.log(`⚠️ Wikipedia disambiguation or no extract: ${pageTitle}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Wikipedia fetch error for ${pageTitle}:`, error);
    return null;
  }
};

/**
 * Landmark için Wikipedia verisi al
 */
export const getCityGuideWikipediaData = async (
  landmarkName: string,
  cityName: string
): Promise<CityGuideWikipediaResult> => {
  try {
    console.log(`🏛️ Getting Wikipedia data for: ${landmarkName} in ${cityName}`);
    
    const fallbackResult = {
      title: landmarkName,
      description: `${landmarkName}, ${cityName} şehrinin önemli turistik noktalarından biridir. Şehrin kültürel ve tarihi mirasının bir parçası olarak ziyaretçilerin ilgisini çeker.`,
      imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(landmarkName)},${encodeURIComponent(cityName)},landmark`,
      source: 'fallback' as const
    };
    
    // 1. Şehir bazlı özel eşleşmeler kontrol et
    const cityLandmarks = CITY_LANDMARKS[cityName];
    const normalizedLandmarkName = landmarkName.toLowerCase().trim();
    
    let wikiPageTitle = '';
    if (cityLandmarks && cityLandmarks[normalizedLandmarkName]) {
      wikiPageTitle = cityLandmarks[normalizedLandmarkName];
      console.log(`📍 Found predefined Wikipedia title: ${wikiPageTitle}`);
    } else {
      wikiPageTitle = landmarkName;
      console.log(`📍 Using original name: ${wikiPageTitle}`);
    }
    
    // 2. Türkçe Wikipedia'dan dene
    let wikiData = await fetchWikipediaPageSummary(wikiPageTitle, 'tr');
    
    // 3. Türkçe'de bulamazsa İngilizce dene
    if (!wikiData) {
      console.log(`🔄 Trying English Wikipedia for: ${wikiPageTitle}`);
      wikiData = await fetchWikipediaPageSummary(wikiPageTitle, 'en');
    }
    
    // 4. Hala bulamazsa farklı varyasyonlar dene
    if (!wikiData && cityLandmarks) {
      console.log(`🔄 Trying alternative names...`);
      for (const [key, value] of Object.entries(cityLandmarks)) {
        if (normalizedLandmarkName.includes(key) || key.includes(normalizedLandmarkName)) {
          wikiData = await fetchWikipediaPageSummary(value, 'tr');
          if (wikiData) break;
          
          wikiData = await fetchWikipediaPageSummary(value, 'en');
          if (wikiData) break;
        }
      }
    }
    
    // 5. Wikipedia verisi bulunamadıysa fallback döndür
    if (!wikiData) {
      console.log(`❌ No Wikipedia data found for ${landmarkName}, using fallback`);
      return fallbackResult;
    }
    
    // 6. Wikipedia verilerini işle
    let description = wikiData.extract || fallbackResult.description;
    
    // Açıklamayı temizle ve kısalt
    if (description.length > 500) {
      description = description.substring(0, 500);
      // Son cümleyi tamamlamaya çalış
      const lastSentenceEnd = Math.max(
        description.lastIndexOf('.'),
        description.lastIndexOf('!'),
        description.lastIndexOf('?')
      );
      if (lastSentenceEnd > 300) {
        description = description.substring(0, lastSentenceEnd + 1);
      } else {
        description += '...';
      }
    }
    
    // Görsel URL'si al
    let imageUrl = fallbackResult.imageUrl;
    if (wikiData.originalimage && wikiData.originalimage.source) {
      imageUrl = wikiData.originalimage.source;
      console.log(`🖼️ Using original Wikipedia image`);
    } else if (wikiData.thumbnail && wikiData.thumbnail.source) {
      imageUrl = wikiData.thumbnail.source;
      console.log(`🖼️ Using Wikipedia thumbnail`);
    }
    
    console.log(`✅ Wikipedia data processed for ${landmarkName}:`, {
      title: wikiData.title,
      descriptionLength: description.length,
      hasImage: imageUrl !== fallbackResult.imageUrl
    });
    
    return {
      title: wikiData.title,
      description,
      imageUrl,
      source: 'wikipedia'
    };
    
  } catch (error) {
    console.error(`❌ Error getting Wikipedia data for ${landmarkName}:`, error);
    return {
      title: landmarkName,
      description: `${landmarkName}, ${cityName} şehrinin önemli turistik noktalarından biridir.`,
      imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(landmarkName)},landmark`,
      source: 'fallback'
    };
  }
};

/**
 * Şehir için Wikipedia görsel al
 */
export const getCityImageFromWikipedia = async (cityName: string): Promise<string | null> => {
  try {
    console.log(`🏙️ Getting city image from Wikipedia: ${cityName}`);
    
    // Şehir için özel başlıklar
    const cityTitles: Record<string, string> = {
      'İstanbul': 'İstanbul',
      'Istanbul': 'İstanbul',
      'Paris': 'Paris',
      'New York': 'New York',
      'New York City': 'New York',
      'London': 'Londra',
      'Londra': 'Londra',
      'Tokyo': 'Tokyo',
      'Barcelona': 'Barcelona',
      'Rome': 'Roma',
      'Roma': 'Roma'
    };
    
    const wikiTitle = cityTitles[cityName] || cityName;
    
    // Türkçe Wikipedia'dan dene
    let wikiData = await fetchWikipediaPageSummary(wikiTitle, 'tr');
    
    // İngilizce'den dene
    if (!wikiData) {
      wikiData = await fetchWikipediaPageSummary(cityName, 'en');
    }
    
    if (!wikiData) {
      console.log(`❌ No Wikipedia data for city: ${cityName}`);
      return null;
    }
    
    // Görsel URL'si al
    if (wikiData.originalimage && wikiData.originalimage.source) {
      console.log(`✅ City image from Wikipedia original`);
      return wikiData.originalimage.source;
    }
    
    if (wikiData.thumbnail && wikiData.thumbnail.source) {
      console.log(`✅ City image from Wikipedia thumbnail`);
      return wikiData.thumbnail.source;
    }
    
    console.log(`⚠️ No image in Wikipedia data for: ${cityName}`);
    return null;
    
  } catch (error) {
    console.error(`❌ Error getting city image from Wikipedia:`, error);
    return null;
  }
};

/**
 * Test fonksiyonu
 */
export const testCityGuideWikipedia = async () => {
  console.log('🧪 Testing City Guide Wikipedia Service...');
  
  const testCases = [
    { landmark: 'Galata Kulesi', city: 'İstanbul' },
    { landmark: 'Ayasofya', city: 'İstanbul' },
    { landmark: 'Eiffel Tower', city: 'Paris' },
    { landmark: 'Empire State Building', city: 'New York' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.landmark} in ${testCase.city}`);
    const result = await getCityGuideWikipediaData(testCase.landmark, testCase.city);
    console.log(`Result: ${result.source} - ${result.title.substring(0, 30)}...`);
  }
};

export default {
  getCityGuideWikipediaData,
  getCityImageFromWikipedia,
  testCityGuideWikipedia
}; 