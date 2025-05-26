import { OTM_API_KEY } from '@env';
import { CITY_COORDINATES, POPULAR_LANDMARKS } from '../data/PopulerLandmarks';
import { fetchLandmarkImage } from './Unsplash';

/**
 * Şehir ismine göre koordinat bilgisi alır
 * @param {string} cityName - Şehir adı
 * @returns {Promise<{lat: number, lon: number} | null>} - Şehrin koordinatları
 */
export const getCoordinatesByCity = async (cityName) => {
  try {
    // Şehir ismi kontrolü
    if (!cityName || typeof cityName !== 'string' || cityName.trim().length < 2) {
      console.error('Geçersiz şehir adı:', cityName);
      return null;
    }
    
    // Normalizasyon - şehir isimlerini standartlaştır
    const normalizedCity = normalizeCity(cityName);
    if (normalizedCity) {
      console.log(`Normalleştirilmiş şehir adı: ${normalizedCity} (önceki: ${cityName})`);
    }
    
    // Önce elle girdiğimiz popüler şehirler içinde var mı diye kontrol edelim
    // Eğer varsa, API çağrısı yapmadan sonuç döndürelim
    if (normalizedCity && CITY_COORDINATES[normalizedCity]) {
      console.log(`${normalizedCity} için önceden tanımlanmış koordinatlar kullanılıyor`);
      return CITY_COORDINATES[normalizedCity];
    }
    
    const knownCity = Object.keys(POPULAR_LANDMARKS).find(
      city => city.toLowerCase() === cityName.toLowerCase()
    );
    
    if (knownCity && CITY_COORDINATES[knownCity]) {
      console.log(`${knownCity} için önceden tanımlanmış koordinatlar kullanılıyor`);
      return CITY_COORDINATES[knownCity];
    }
    
    const encodedCityName = encodeURIComponent(cityName.trim());
    console.log(`Şehir için koordinatlar getiriliyor: ${encodedCityName}`);
    
    const res = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${encodedCityName}&apikey=${OTM_API_KEY}`);
    
    if (!res.ok) {
      console.error(`Koordinatları getirirken hata: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    // API başarılı cevap verdi mi kontrol et
    if (!data || !data.lat || !data.lon) {
      console.error('Geoname API\'den geçersiz yanıt:', data);
      return null;
    }
    
    console.log(`Koordinatlar bulundu: enlem=${data.lat}, boylam=${data.lon}`);
    return { lat: data.lat, lon: data.lon };
  } catch (err) {
    console.error('Geoname hatası:', err);
    return null;
  }
};

/**
 * Şehir adını normalize eden yardımcı fonksiyon
 * @param {string} cityName - Normalize edilecek şehir adı
 * @returns {string|null} - Normalize edilmiş şehir adı
 */
const normalizeCity = (cityName) => {
  if (!cityName || typeof cityName !== 'string') return null;
  
  // Önce şehir adını küçük harfe çevir ve boşlukları temizle
  const normalizedName = cityName.trim().toLowerCase();
  
  // Bilinen şehir isimleri için eşleştirme
  const cityMap = {
    // Genel varyasyonlar
    'paris': 'Paris',
    'parijs': 'Paris',
    'pariz': 'Paris',
    'parís': 'Paris',
    
    // New York varyasyonları
    'new york': 'New York City',
    'newyork': 'New York City',
    'new york city': 'New York City',
    'nyc': 'New York City',
    'new-york': 'New York City',
    
    // İstanbul varyasyonları
    'istanbul': 'İstanbul',
    'constantinople': 'İstanbul',
    'konstantinopolis': 'İstanbul',
    
    // London varyasyonları
    'london': 'Londra',
    'londra': 'Londra',
    'londres': 'Londra',
    
    // Tokyo varyasyonları
    'tokyo': 'Tokyo',
    'tokio': 'Tokyo',
    'tōkyō': 'Tokyo',
    
    // Barcelona varyasyonları
    'barcelona': 'Barcelona',
    'barselona': 'Barcelona',
    
    // Roma varyasyonları
    'rome': 'Roma',
    'roma': 'Roma',
    'rom': 'Roma',
    
    // Diğer şehirler
    'bali': 'Bali',
    'zurich': 'Zürih',
    'zürich': 'Zürih',
    'zurih': 'Zürih',
    'zürih': 'Zürih',
    'prague': 'Prag',
    'prag': 'Prag',
    'praha': 'Prag',
    'salzburg': 'Salzburg',
    'antalya': 'Antalya',
    'venice': 'Venedik',
    'venedik': 'Venedik',
    'venezia': 'Venedik'
  };
  
  // Doğrudan eşleşme kontrolü
  if (cityMap[normalizedName]) {
    return cityMap[normalizedName];
  }
  
  // Eşleşme yoksa, kısmi kelime kontrolü yap
  for (const [key, value] of Object.entries(cityMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return value;
    }
  }
  
  // POPULAR_LANDMARKS'ta doğrudan arama
  for (const city of Object.keys(POPULAR_LANDMARKS)) {
    if (city.toLowerCase() === normalizedName || 
        city.toLowerCase().includes(normalizedName) || 
        normalizedName.includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return null;
};

/**
 * Belirli bir konumun yakınındaki önemli yerleri arar
 * @param {number} lat - Enlem
 * @param {number} lon - Boylam
 * @param {number} radius - Arama yarıçapı (metre)
 * @param {number} limit - Maksimum sonuç sayısı
 * @returns {Promise<Array>} - Bulunan yerler listesi
 */
export const searchOTMPlaces = async (lat, lon, radius = 10000, limit = 10) => {
  try {
    // Önce koordinatları kontrol edelim
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.error('Geçersiz koordinatlar:', lat, lon);
      return [];
    }

    // 1. Önce şehir ismini öğrenelim
    const cityName = await getCityNameFromCoordinates(lat, lon);
    console.log(`Koordinatlardan şehir adı: ${cityName}`);
    
    // Şehir adını normalize et - daha iyi eşleşme için
    const normalizedCityName = cityName ? normalizeCity(cityName) : null;
    const cityToUse = normalizedCityName || cityName;
    
    if (normalizedCityName && normalizedCityName !== cityName) {
      console.log(`Normalleştirilmiş şehir adı: ${normalizedCityName} (API'den gelen: ${cityName})`);
    }
    
    // 2. Manuel eklediğimiz popüler yerler varsa önce onlara bakıyoruz
    if (cityToUse && POPULAR_LANDMARKS[cityToUse]) {
      console.log(`${cityToUse} için manuel olarak hazırlanmış turistik yerler kullanılıyor`);
      
      // Manuel eklediğimiz ünlü noktaları dönüyoruz
      // Her landmark için Unsplash API'den görsel çekiyoruz
      const landmarks = [];
      
      for (const landmark of POPULAR_LANDMARKS[cityToUse]) {
        console.log(`İşleniyor: ${landmark.name}`);
        
        // Eğer landmark'ın görüntüsü yoksa Unsplash'ten çekelim
        if (!landmark.image) {
          try {
            console.log(`${landmark.name} için görsel getiriliyor`);
            const imageUrl = await fetchLandmarkImage(cityToUse, landmark.name);
            console.log(`${landmark.name} için görsel: ${imageUrl ? 'başarılı' : 'yok'}`);
            landmark.image = imageUrl; // API'den gelen görüntüyü kaydedelim
          } catch (err) {
            console.error(`${landmark.name} için görsel getirilemedi:`, err);
          }
        }
        
        landmarks.push({
          xid: `custom_${landmark.name.replace(/\s/g, '_')}`,
          name: landmark.name,
          custom: true,
          custom_data: landmark
        });
      }
      
      console.log(`${cityToUse} için ${landmarks.length} önceden tanımlanmış turistik yer döndürülüyor`);
      return landmarks;
    }
    
    // 3. Koordinatlar yakın bir şehirle eşleşiyor mu kontrol et
    console.log(`Koordinatların bilinen bir şehirle eşleşip eşleşmediği kontrol ediliyor`);
    for (const [knownCity, coords] of Object.entries(CITY_COORDINATES)) {
      // 50km içindeyse, bilinen şehre yakın sayalım
      const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
      console.log(`${knownCity} şehrine uzaklık: ${distance.toFixed(2)}km`);
      
      if (distance < 50) { // 50km radius
        console.log(`Koordinatlar ${knownCity} şehrinin 50km içinde, önceden tanımlanmış turistik yerler kullanılıyor`);
        
        // Bu şehir için önceden tanımlanmış landmarks var mı?
        if (POPULAR_LANDMARKS[knownCity]) {
          const landmarks = [];
          
          for (const landmark of POPULAR_LANDMARKS[knownCity]) {
            console.log(`İşleniyor: ${landmark.name}`);
            
            if (!landmark.image) {
              try {
                console.log(`Yakındaki turistik yer için görsel getiriliyor: ${landmark.name}`);
                const imageUrl = await fetchLandmarkImage(knownCity, landmark.name);
                console.log(`Görsel alındı: ${imageUrl ? 'başarılı' : 'yok'}`);
                landmark.image = imageUrl;
              } catch (err) {
                console.error(`${landmark.name} için görsel getirilemedi:`, err);
              }
            }
            
            landmarks.push({
              xid: `custom_${landmark.name.replace(/\s/g, '_')}`,
              name: landmark.name,
              custom: true,
              custom_data: landmark
            });
          }
          
          return landmarks;
        }
      }
    }
    
    // 4. API için değerleri hazırla
    const safeRadius = Math.min(Math.max(parseInt(radius) || 5000, 1000), 20000); // 1km-20km arası sınırlama
    const safeLimit = Math.min(Math.max(parseInt(limit) || 5, 5), 15); // 5-15 arası sınırlama (en az 5 sonuç)
    const safeLat = parseFloat(lat).toFixed(6); // 6 ondalık basamağa yuvarla
    const safeLon = parseFloat(lon).toFixed(6);

    // 5. OpenTripMap API'den popüler ve önemli yerleri al
    // Önce daha spesifik, önemli turistik yerleri alalım
    const kinds = 'interesting_places,tourist_facilities,museums,historic,architecture,cultural';
    
    console.log(`OTM API Request: lat=${safeLat}, lon=${safeLon}, radius=${safeRadius}, limit=${safeLimit}`);
    
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${safeRadius}&lon=${safeLon}&lat=${safeLat}&format=json&apikey=${OTM_API_KEY}&kinds=${kinds}&rate=3&limit=${safeLimit}`;
    console.log('OpenTripMap API URL:', url);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`Error searching places: ${res.status} ${res.statusText}`);
      console.error('Request URL was:', url);
      
      // Hata durumunda boş array döndürüp hata oluşturmayalım
      return [];
    }
    
    const data = await res.json();
    console.log(`OTM API returned ${data.length} results`);
    
    if (data.length > 0) {
      console.log('Sample OTM result:', JSON.stringify(data[0], null, 2));
    }
    
    // Bilinen popüler landmark isimlerini içeren bir liste
    const popularLandmarkKeywords = [
      'tower', 'castle', 'palace', 'cathedral', 'museum', 'gallery',
      'temple', 'mosque', 'church', 'square', 'garden', 'park',
      'bridge', 'monument', 'statue', 'gate', 'wall', 'fortress',
      'colosseum', 'pantheon', 'acropolis', 'pyramid', 'sphinx',
      'louvre', 'eiffel', 'notre dame', 'kremlin', 'big ben',
      'statue of liberty', 'empire state', 'times square', 'central park',
      'sagrada familia', 'pisa', 'st peter', 'sistine', 'hagia sophia',
      'blue mosque', 'taj mahal', 'great wall', 'forbidden city',
      'angkor wat', 'grand canyon', 'chichen itza', 'machu picchu'
    ];
    
    // Şehre özel anahtar kelimeler - önemli turistik yerleri filtrelemek için
    const citySpecificKeywords = {
      'Paris': ['eiffel', 'louvre', 'notre dame', 'arc de triomphe', 'champs', 'montmartre', 'versailles'],
      'New York City': ['empire state', 'central park', 'statue of liberty', 'times square', 'brooklyn bridge', 'rockefeller', 'grand central', 'broadway'],
      'İstanbul': ['ayasofya', 'hagia sophia', 'blue mosque', 'sultan ahmet', 'topkapi', 'galata', 'grand bazaar', 'bosphorus', 'spice market', 'basilica cistern'],
      'Londra': ['big ben', 'london eye', 'tower bridge', 'buckingham', 'westminster', 'british museum', 'trafalgar', 'st pauls', 'piccadilly', 'covent garden'],
      'Tokyo': ['tokyo tower', 'shibuya', 'imperial palace', 'meiji', 'skytree', 'sensoji', 'shinjuku', 'ueno', 'akihabara', 'ginza'],
      'Barcelona': ['sagrada familia', 'park guell', 'la rambla', 'montjuic', 'casa batllo', 'camp nou', 'gothic quarter', 'casa mila', 'barceloneta', 'boqueria'],
      'Roma': ['colosseum', 'vatican', 'trevi', 'pantheon', 'roman forum', 'spanish steps', 'piazza navona', 'castel sant angelo', 'palatine hill', 'borghese']
    };
    
    // Şehir ismi varsa o şehir için özel anahtar kelimeleri kullan
    const keywordsToUse = cityToUse && citySpecificKeywords[cityToUse] 
      ? citySpecificKeywords[cityToUse] 
      : popularLandmarkKeywords;
    
    console.log(`Using keywords for filtering:`, keywordsToUse);
    
    // Sonuçları filtrele - popüler yerleri ön plana çıkar
    const filterPopularLandmarks = (places) => {
      if (!Array.isArray(places) || places.length === 0) return [];
      
      // Önce sonuçları rate (puanlarına) göre sırala
      const sortedPlaces = [...places].sort((a, b) => (b.rate || 0) - (a.rate || 0));
      
      // Popüler yer isimlerini içerenleri bul
      const popularPlaces = sortedPlaces.filter(place => {
        const name = place.name.toLowerCase();
        return keywordsToUse.some(keyword => name.includes(keyword.toLowerCase()));
      });
      
      // Popüler yerler varsa onları döndür, yoksa tüm sonuçları döndür
      return popularPlaces.length > 3 ? popularPlaces : sortedPlaces;
    };
    
    if (Array.isArray(data) && data.length > 0) {
      const filteredData = filterPopularLandmarks(data);
      console.log(`Found ${filteredData.length} places (filtered from ${data.length})`);
      return filteredData;
    } else {
      console.log('No results found, trying fallback categories...');
      
      // Eğer veri bulunamadıysa daha geniş bir kategori yelpazesi ile tekrar deneyelim
      const fallbackKinds = 'cultural,natural,amusements,architecture,historic';
      const fallbackUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${safeRadius}&lon=${safeLon}&lat=${safeLat}&format=json&apikey=${OTM_API_KEY}&kinds=${fallbackKinds}&limit=${safeLimit*2}`; // limit'i 2 katına çıkarıyoruz
      console.log('Trying fallback URL:', fallbackUrl);
      
      try {
        const fallbackRes = await fetch(fallbackUrl);
        
        if (!fallbackRes.ok) {
          console.error(`Fallback search failed: ${fallbackRes.status}`);
          return [];
        }
        
        const fallbackData = await fallbackRes.json();
        console.log(`Fallback search returned ${fallbackData.length} results`);
        
        if (Array.isArray(fallbackData) && fallbackData.length > 0) {
          console.log('Sample fallback result:', JSON.stringify(fallbackData[0], null, 2));
        }
        
        if (Array.isArray(fallbackData)) {
          const filteredFallbackData = filterPopularLandmarks(fallbackData);
          console.log(`Found ${filteredFallbackData.length} places in fallback (filtered from ${fallbackData.length})`);
          return filteredFallbackData;
        }
      } catch (fallbackErr) {
        console.error('Fallback search error:', fallbackErr);
      }
      
      // Tüm denemeler başarısız olduysa boş array döndür
      return [];
    }
  } catch (err) {
    console.error('OpenTripMap search error:', err);
    return [];
  }
};

// İki koordinat arasındaki mesafeyi kilometre cinsinden hesaplar (Haversine formülü)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;
  return distance;
};

// Koordinatlardan şehir ismini alır (reverse geocoding)
const getCityNameFromCoordinates = async (lat, lon) => {
  try {
    // Koordinatları kontrol et ve formatla
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates provided to getCityNameFromCoordinates:', lat, lon);
      return null;
    }
    
    // 6 ondalık basamağa yuvarlama (API hassasiyeti için)
    const safeLat = parseFloat(lat).toFixed(6);
    const safeLon = parseFloat(lon).toFixed(6);
    
    console.log(`Reverse geocoding: lat=${safeLat}, lon=${safeLon}`);
    
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?lat=${safeLat}&lon=${safeLon}&apikey=${OTM_API_KEY}`
    );
    
    if (!res.ok) {
      console.error(`Reverse geocoding failed: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    // İsim yoksa veya kısa ise null dön
    if (!data || !data.name || data.name.length < 2) {
      console.warn('Invalid or empty city name received from reverse geocoding');
      return null;
    }
    
    console.log(`City name found: ${data.name}`);
    return data.name;
  } catch (err) {
    console.error('Error getting city name from coordinates:', err);
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // API limitine karşı önlem

// Rate limit hata işleme sayacı
let retryCount = 0;
const maxRetries = 5;
const retryBackoff = 1000; // ms cinsinden temel bekleme süresi

export const getOTMPlaceDetails = async (xid) => {
  if (!xid) {
    console.error('Invalid xid provided');
    return null;
  }
  
  // Özel eklediğimiz yerler için xid custom_ ile başlar
  if (xid.startsWith('custom_')) {
    // Özel landmark verilerini işliyoruz
    const landmarkName = xid.replace('custom_', '').replace(/_/g, ' ');
    console.log(`Processing custom landmark: ${landmarkName}`);
    
    // Tüm özel yerler arasında arama yap
    for (const cityName in POPULAR_LANDMARKS) {
      const landmark = POPULAR_LANDMARKS[cityName].find(l => l.name === landmarkName);
      if (landmark) {
        console.log(`Found custom landmark data for: ${landmark.name} in ${cityName}`);
        
        // Eğer landmark'ın görüntüsü yoksa Unsplash'ten çekelim
        if (!landmark.image) {
          try {
            console.log(`Fetching image for custom landmark: ${landmark.name}`);
            const imageUrl = await fetchLandmarkImage(cityName, landmark.name);
            console.log(`Got image for custom landmark: ${imageUrl ? 'success' : 'null'}`);
            landmark.image = imageUrl; // API'den gelen görüntüyü kaydedelim
          } catch (err) {
            console.error(`Error fetching image for ${landmark.name}:`, err);
          }
        }
        
        // Görsel URL'si geçerli değilse yedek görsel kullan
        if (!landmark.image) {
          console.log(`Using backup image for ${landmark.name}`);
          landmark.image = `https://source.unsplash.com/featured/?${encodeURIComponent(landmark.name)},landmark`;
        }
        
        // Landmark verilerini döndür
        const result = {
          xid: xid,
          name: landmark.name,
          wikipedia_extracts: {
            text: landmark.description
          },
          preview: {
            source: landmark.image
          },
          custom: true
        };
        
        console.log(`Returning custom landmark data:`, JSON.stringify({
          name: result.name,
          description_length: result.wikipedia_extracts.text.length,
          has_image: !!result.preview.source
        }, null, 2));
        
        return result;
      }
    }
    console.warn(`Custom landmark not found: ${landmarkName}`);
    return null;
  }
  
  try {
    // uzun delay ile API rate limit aşımını engelleme
    await delay(600); 
    
    console.log(`Fetching place details for xid: ${xid}`);
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_API_KEY}&lang=tr`
    );
    
    if (!res.ok) {
      if (res.status === 429 && retryCount < maxRetries) {
        retryCount++;
        const waitTime = retryBackoff * Math.pow(2, retryCount - 1);
        console.warn(`Rate limit hit for ${xid} (429), retrying after ${waitTime}ms (attempt ${retryCount}/${maxRetries})`);
        
        await delay(waitTime);
        return getOTMPlaceDetails(xid); 
      }
      
      console.error(`Place details fetch failed for ${xid}: ${res.status} ${res.statusText}`);
      retryCount = 0; 
      return null;
    }
    
    // Başarılı cevap için retry sayacını sıfırla
    retryCount = 0;
    
    const data = await res.json();
    console.log(`Got OTM place details for ${xid}:`, JSON.stringify({
      name: data.name,
      has_wikipedia_text: !!data.wikipedia_extracts?.text,
      has_image: !!data.preview?.source,
      wikipedia_text_length: data.wikipedia_extracts?.text?.length || 0
    }, null, 2));
    
    // Veri kontrolü
    if (!data || !data.name) {
      console.warn(`Incomplete place data received for ${xid}`);
    }
    
    // Veri zenginleştirme
    
    // Eğer Wikipedia açıklaması yoksa, basit bir açıklama ekleyelim
    if (!data.wikipedia_extracts || !data.wikipedia_extracts.text || data.wikipedia_extracts.text.length < 10) {
      console.log(`No Wikipedia description for ${data.name}, creating custom description`);
      
      let placeName = data.name || "Bu yer";
      let placeKinds = data.kinds ? data.kinds.replace(/,/g, ', ') : 'turistik';
      let placeRating = data.rate || 3;
      
      // Daha zengin bir açıklama oluştur
      let customDescription = `${placeName}, ${placeKinds} özelliklere sahip önemli bir turistik noktadır. `;
      
      // Konum bilgisi varsa ekle
      if (data.address) {
        if (data.address.city) {
          customDescription += `${data.address.city} şehrinde yer alır. `;
        }
        if (data.address.road && data.address.house_number) {
          customDescription += `Adresi: ${data.address.road} ${data.address.house_number}. `;
        }
      }
      
      // Rating bilgisi ekle
      customDescription += `Ziyaretçiler tarafından ${placeRating} üzerinden puanlanmıştır. `;
      
      // Eğer yüksek puanlıysa belirt
      if (placeRating >= 4) {
        customDescription += `Yüksek puanıyla öne çıkan popüler bir turistik noktadır.`;
      } else if (placeRating >= 3) {
        customDescription += `Turistler tarafından ilgi gören bir yerdir.`;
      } else {
        customDescription += `Şehri ziyaret ederken görülebilecek yerlerden biridir.`;
      }
      
      data.wikipedia_extracts = {
        text: customDescription
      };
    }
    
    // Eğer görsel yoksa, temsili bir görsel ekleyelim
    if (!data.preview || !data.preview.source) {
      console.log(`No image for ${data.name}, fetching from Unsplash`);
      
      // Daha güvenilir bir görsel kaynağı kullanıyoruz - Unsplash API
      try {
        const query = data.name + (data.address?.city ? ` ${data.address.city}` : '');
        const imageUrl = await fetchLandmarkImage("", query);
        console.log(`Fetched image for ${data.name}: ${imageUrl ? 'success' : 'null'}`);
        
        if (imageUrl) {
          data.preview = {
            source: imageUrl
          };
        } else {
          // Yedek kaynak kullan
          data.preview = {
            source: `https://source.unsplash.com/featured/?${encodeURIComponent(data.name)},landmark`
          };
        }
      } catch (err) {
        console.error('Error fetching image:', err);
        data.preview = {
          source: `https://source.unsplash.com/featured/?${encodeURIComponent(data.name)},landmark`
        };
      }
    }
    
    console.log(`Returning enriched place data for ${data.name}`);
    return data;
  } catch (err) {
    console.error(`Place details error for ${xid}:`, err);
    retryCount = 0; // Hata durumunda retry sayacını sıfırla
    return null;
  }
};

// Unsplash için bilinen fotoğraf ID'leri
const LANDMARK_UNSPLASH_PHOTOS = {
  'landmark': [
    'photo-1552832230-c0197dd311b5',
    'photo-1564501049412-61c2a3083791',
    'photo-1567359781514-3b964e2b04d6',
    'photo-1549893072-4b747df5f669',
    'photo-1533929736458-ca588d08c8be',
    'photo-1558117338-7ef3d637ce2f'
  ],
  'tourism': [
    'photo-1556821862-33ec0be5c2c0',
    'photo-1571893541378-197b76e9a4b3',
    'photo-1524113015963-fe31c600dd18',
    'photo-1502602898657-3e91760cbb34'
  ],
  'travel': [
    'photo-1504512485720-7d83a16ee930',
    'photo-1452421822248-d4c2b47f0c81',
    'photo-1530521954074-e64f6810b32d',
    'photo-1501256504904-1fbe305bb538'
  ]
};

// Bir kategori için rastgele Unsplash fotoğrafı seçer
const getRandomUnsplashPhotoId = (searchTerm) => {
  let category = 'landmark'; // varsayılan kategori
  
  // Arama terimine göre kategori seçimi
  if (searchTerm.includes('castle') || searchTerm.includes('palace') || 
      searchTerm.includes('museum') || searchTerm.includes('monument')) {
    category = 'landmark';
  } else if (searchTerm.includes('park') || searchTerm.includes('garden') || 
             searchTerm.includes('beach') || searchTerm.includes('nature')) {
    category = 'tourism';
  } else if (searchTerm.includes('square') || searchTerm.includes('street') || 
             searchTerm.includes('market') || searchTerm.includes('city')) {
    category = 'travel';
  }
  
  const photos = LANDMARK_UNSPLASH_PHOTOS[category];
  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex];
};