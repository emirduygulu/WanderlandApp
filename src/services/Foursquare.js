// 📁 FoursquareService.js
import { FSQ_API_KEY } from '@env';

// 📌 Endpoint: Search places by keyword
export const searchFSQPlaces = async (lat, lon, query, radius = 100000) => {
  try {
    // Uygun kategorileri belirleyelim
    // 16000: Tourist Attractions
    // 16003: Historic Sites
    // 16004: Monuments
    // 16007: Museums
    // 10000: Arts & Entertainment
    // 12000: Attractions
    const categories = '16000,16003,16004,16007,10000,12000';
    
    // Foursquare API'nin desteklediği alan bilgileri
    const fields = 'fsq_id,name,location,geocodes,categories,popularity,rating,photos';
    
    // Varsayılan olarak popülerliğe göre sıralama
    const sort = 'POPULARITY';
    
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=20&radius=${radius}&sort=${sort}&categories=${categories}&fields=${fields}&locale=tr`;
    console.log('Foursquare API İsteği:', url);
    
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: FSQ_API_KEY,
      },
    });
    
    if (!response.ok) {
      console.error(`Foursquare API Hatası: ${response.status} - ${response.statusText}`);
      throw new Error(`API Hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Foursquare sonuç sayısı: ${data.results ? data.results.length : 0}`);
    
    if (data.results && data.results.length > 0) {
      // İlk sonucun bir örneğini görüntüleyelim
      console.log('İlk sonuç örneği:', JSON.stringify(data.results[0], null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('Foursquare Arama Hatası:', error);
    return { results: [] };
  }
};

// 📌 Endpoint: Sadece popüler turistik noktaları aramak için özel fonksiyon
export const searchPopularLandmarks = async (lat, lon, cityName, radius = 100000) => {
  try {
    console.log(`${cityName} için ${lat},${lon} koordinatlarında popüler turistik yerler aranıyor`);
    
    // Daha spesifik kategori filtreleri kullanılıyor
    const categories = '16000,16003,16004,16007'; // Sadece turistik yerler, tarihi yerler, anıtlar ve müzeler
    
    const fields = 'fsq_id,name,location,geocodes,categories,popularity,rating,description,tel,website,photos';
    
    // Popülerliğe göre sıralama
    const sort = 'POPULARITY';
    
    // Foursquare'a gönderilecek sorgu - şehir ismi + "landmark" veya "attractions"
    let query = `${cityName} famous landmark attractions`;
    
    // Şehir bazlı özel sorgular - daha spesifik sonuçlar için
    const cityQueries = {
      'Paris': 'Paris Eiffel Tower Louvre Notre Dame',
      'New York City': 'New York Empire State Building Statue of Liberty Central Park Times Square',
      'İstanbul': 'Istanbul Hagia Sophia Blue Mosque Topkapi Palace Grand Bazaar',
      'Londra': 'London Big Ben Tower Bridge Buckingham Palace',
      'Tokyo': 'Tokyo Tower Shibuya Crossing Imperial Palace',
      'Barcelona': 'Barcelona Sagrada Familia Park Guell',
      'Roma': 'Rome Colosseum Vatican Trevi Fountain'
    };
    
    if (cityQueries[cityName]) {
      query = cityQueries[cityName];
      console.log(`${cityName} için özel sorgu kullanılıyor: ${query}`);
    }
    
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(query)}&ll=${lat},${lon}&limit=15&radius=${radius}&sort=${sort}&categories=${categories}&fields=${fields}&locale=tr`;
    console.log('Foursquare Popüler Yerler API İsteği:', url);
    
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: FSQ_API_KEY,
      },
    });
    
    if (!response.ok) {
      console.error(`Foursquare API Hatası: ${response.status} - ${response.statusText}`);
      throw new Error(`API Hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Foursquare popüler turistik yerler sonuç sayısı: ${data.results ? data.results.length : 0}`);
    
    if (data.results && data.results.length > 0) {
      // İlk sonucun detaylarını yazdıralım
      console.log('İlk turistik yer örneği:', JSON.stringify(data.results[0], null, 2));
    }
    
    // Popüler yerlerin isimlerini içeren anahtar kelimeler
    const popularKeywords = [
      'eiffel', 'louvre', 'notre dame', 'colosseum', 'vatican', 
      'big ben', 'tower', 'palace', 'statue of liberty', 'times square',
      'central park', 'empire state', 'ayasofya', 'blue mosque', 'hagia sophia',
      'topkapi', 'galata', 'sagrada familia', 'museum', 'cathedral',
      'castle', 'historic', 'monument', 'landmark', 'famous', 'popular'
    ];
    
    // Şehre özel anahtar kelimeler
    const cityKeywords = {
      'Paris': ['eiffel', 'louvre', 'notre dame', 'arc de triomphe', 'montmartre'],
      'New York City': ['empire state', 'central park', 'statue of liberty', 'times square'],
      'İstanbul': ['ayasofya', 'hagia sophia', 'blue mosque', 'topkapi', 'galata'],
      'Londra': ['big ben', 'london eye', 'tower bridge', 'buckingham'],
      'Tokyo': ['tokyo tower', 'shibuya', 'imperial palace', 'meiji'],
      'Barcelona': ['sagrada familia', 'park guell', 'la rambla'],
      'Roma': ['colosseum', 'vatican', 'trevi', 'pantheon']
    };
    
    // Şehre özel anahtar kelimeleri kullan
    const keywords = cityKeywords[cityName] || popularKeywords;
    
    // Sonuçları filtrele - popüler yerleri ön plana çıkar
    if (data.results && data.results.length > 0) {
      // Önce popülerlik/puana göre sırala
      const sortedResults = [...data.results].sort((a, b) => {
        // Popülerlik yoksa rating'e bak, o da yoksa 0 kabul et
        const aPopularity = a.popularity || a.rating || 0;
        const bPopularity = b.popularity || b.rating || 0;
        return bPopularity - aPopularity;
      });
      
      // Popüler yerleri filtrele
      const popularPlaces = sortedResults.filter(place => {
        const placeName = place.name.toLowerCase();
        return keywords.some(keyword => placeName.includes(keyword.toLowerCase()));
      });
      
      // Popüler yerler varsa önce onları göster, yoksa tüm sonuçları döndür
      const finalResults = popularPlaces.length > 0 ? popularPlaces : sortedResults;
      
      console.log(`${cityName} için ${finalResults.length} popüler turistik yer bulundu`);
      console.log('Turistik yerlerin isimleri:', finalResults.map(place => place.name).join(', '));
      
      return { results: finalResults };
    }
    
    return data;
  } catch (error) {
    console.error('Foursquare Popüler Turistik Yerler Arama Hatası:', error);
    return { results: [] };
  }
};

// https://api.foursquare.com/v3/places/{fsq_id}
export const getFSQPlaceDetails = async (fsq_id) => {
  try {
    const fields = 'fsq_id,name,description,photos,rating,website,location,tel,email,hours,price,categories,stats';
    const url = `https://api.foursquare.com/v3/places/${fsq_id}?fields=${fields}&locale=tr`;
    console.log('Yer detayları getiriliyor:', url);
    
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: FSQ_API_KEY,
      },
    });
    
    if (!response.ok) {
      console.error(`Foursquare Detaylar API Hatası: ${response.status} - ${response.statusText}`);
      throw new Error(`API Hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Yer detayları alındı:', JSON.stringify({
      name: data.name,
      description: data.description,
      photos: data.photos ? data.photos.length : 0
    }, null, 2));
    
    return data;
  } catch (error) {
    console.error('Foursquare Detaylar Hatası:', error);
    return {};
  }
};
