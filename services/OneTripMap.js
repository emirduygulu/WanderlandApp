import { POPULAR_LANDMARKS, CITY_COORDINATES } from '../data/PopulerLandmarks';
import { fetchLandmarkImage } from './Unsplash';

const OTM_API_KEY = '5ae2e3f221c38a28845f05b674f143e88996df66592ed1d4d38906af';

export const getCoordinatesByCity = async (cityName) => {
  try {
    // Şehir ismi kontrolü
    if (!cityName || typeof cityName !== 'string' || cityName.trim().length < 2) {
      console.error('Invalid city name provided:', cityName);
      return null;
    }
    
    // Önce elle girdiğimiz popüler şehirler içinde var mı diye kontrol edelim
    // Eğer varsa, API çağrısı yapmadan sonuç döndürelim
    const knownCity = Object.keys(POPULAR_LANDMARKS).find(
      city => city.toLowerCase() === cityName.toLowerCase()
    );
    
    if (knownCity && CITY_COORDINATES[knownCity]) {
      console.log(`Using predefined coordinates for ${knownCity}`);
      return CITY_COORDINATES[knownCity];
    }
    
    const encodedCityName = encodeURIComponent(cityName.trim());
    console.log(`Fetching coordinates for city: ${encodedCityName}`);
    
    const res = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${encodedCityName}&apikey=${OTM_API_KEY}`);
    
    if (!res.ok) {
      console.error(`Error fetching coordinates: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    // API başarılı cevap verdi mi kontrol et
    if (!data || !data.lat || !data.lon) {
      console.error('Invalid response from geoname API:', data);
      return null;
    }
    
    console.log(`Coordinates found: lat=${data.lat}, lon=${data.lon}`);
    return { lat: data.lat, lon: data.lon };
  } catch (err) {
    console.error('Geoname error:', err);
    return null;
  }
};

export const searchOTMPlaces = async (lat, lon, radius = 10000, limit = 10) => {
  try {
    // Önce koordinatları kontrol edelim
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates provided:', lat, lon);
      return [];
    }

    // Manuel eklediğimiz popüler yerler varsa önce onlara bakıyoruz
    const cityName = await getCityNameFromCoordinates(lat, lon);
    
    if (cityName && POPULAR_LANDMARKS[cityName]) {
      console.log(`Returning manually curated landmarks for ${cityName}`);
      
      // Manuel eklediğimiz ünlü noktaları dönüyoruz
      // Her landmark için Unsplash API'den görsel çekiyoruz
      const landmarks = [];
      
      for (const landmark of POPULAR_LANDMARKS[cityName]) {
        // Eğer landmark'ın görüntüsü yoksa Unsplash'ten çekelim
        if (!landmark.image) {
          const imageUrl = await fetchLandmarkImage(cityName, landmark.name);
          landmark.image = imageUrl; // API'den gelen görüntüyü kaydedelim
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
    
    // OpenTripMap API'si için değerleri doğru formata çevirelim
    const safeRadius = Math.min(Math.max(parseInt(radius) || 5000, 1000), 20000); // 1km-20km arası sınırlama
    const safeLimit = Math.min(Math.max(parseInt(limit) || 5, 3), 15); // 3-15 arası sınırlama
    const safeLat = parseFloat(lat).toFixed(6); // 6 ondalık basamağa yuvarla
    const safeLon = parseFloat(lon).toFixed(6);

    // API için basitleştirilmiş kategori listesi
    const kinds = 'interesting_places,museums,historic,architecture';
    
    console.log(`API Request: lat=${safeLat}, lon=${safeLon}, radius=${safeRadius}, limit=${safeLimit}`);
    
    const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${safeRadius}&lon=${safeLon}&lat=${safeLat}&format=json&apikey=${OTM_API_KEY}&kinds=${kinds}&rate=2&limit=${safeLimit}`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      console.error(`Error searching places: ${res.status} ${res.statusText}`);
      console.error('Request URL was:', url);
      
      // Hata durumunda boş array döndürüp hata oluşturmayalım
      return [];
    }
    
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log('No results found, trying fallback categories...');
      
      // Eğer veri bulunamadıysa daha geniş bir kategori yelpazesi ile tekrar deneyelim
      const fallbackKinds = 'cultural,natural,amusements';
      const fallbackUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${safeRadius}&lon=${safeLon}&lat=${safeLat}&format=json&apikey=${OTM_API_KEY}&kinds=${fallbackKinds}&limit=${safeLimit}`;
      
      try {
        const fallbackRes = await fetch(fallbackUrl);
        
        if (!fallbackRes.ok) {
          console.error(`Fallback search failed: ${fallbackRes.status}`);
          return [];
        }
        
        const fallbackData = await fallbackRes.json();
        return Array.isArray(fallbackData) ? fallbackData : [];
      } catch (fallbackErr) {
        console.error('Fallback search error:', fallbackErr);
        return [];
      }
    }
  } catch (err) {
    console.error('OTM search error:', err);
    return [];
  }
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

export const getOTMPlaceDetails = async (xid) => {
  if (!xid) {
    console.error('Invalid xid provided');
    return null;
  }
  
  // Özel eklediğimiz yerler için xid custom_ ile başlar
  if (xid.startsWith('custom_')) {
    // Özel landmark verilerini işliyoruz
    const landmarkName = xid.replace('custom_', '').replace(/_/g, ' ');
    
    // Tüm özel yerler arasında arama yap
    for (const cityName in POPULAR_LANDMARKS) {
      const landmark = POPULAR_LANDMARKS[cityName].find(l => l.name === landmarkName);
      if (landmark) {
        console.log(`Using custom landmark data for: ${landmark.name}`);
        
        // Eğer landmark'ın görüntüsü yoksa Unsplash'ten çekelim
        if (!landmark.image) {
          try {
            const imageUrl = await fetchLandmarkImage(cityName, landmark.name);
            landmark.image = imageUrl; // API'den gelen görüntüyü kaydedelim
          } catch (err) {
            console.error(`Error fetching image for ${landmark.name}:`, err);
          }
        }
        
        return {
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
      }
    }
    return null;
  }
  
  try {
    await delay(300); // Rate limit koruması
    
    console.log(`Fetching place details for xid: ${xid}`);
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_API_KEY}&lang=tr`
    );
    
    if (!res.ok) {
      console.error(`Place details fetch failed for ${xid}: ${res.status} ${res.statusText}`);
      return null;
    }
    
    const data = await res.json();
    
    // Veri kontrolü
    if (!data || !data.name) {
      console.warn(`Incomplete place data received for ${xid}`);
    }
    
    // Veri zenginleştirme
    
    // Eğer Wikipedia açıklaması yoksa, basit bir açıklama ekleyelim
    if (!data.wikipedia_extracts || !data.wikipedia_extracts.text) {
      let placeName = data.name || "Bu yer";
      let placeKinds = data.kinds ? data.kinds.replace(/,/g, ', ') : 'turistik';
      let placeRating = data.rate || 3;
      
      data.wikipedia_extracts = {
        text: `${placeName}, ${placeKinds} özelliklere sahip önemli bir noktadır. Ziyaretçiler tarafından ${placeRating} üzerinden puanlanmıştır.`
      };
    }
    
    // Eğer görsel yoksa, temsili bir görsel ekleyelim
    if (!data.preview || !data.preview.source) {
      // Daha güvenilir bir görsel kaynağı kullanıyoruz - Unsplash API
      try {
        const imageUrl = await fetchLandmarkImage("", data.name);
        data.preview = {
          source: imageUrl || `https://images.unsplash.com/${getRandomUnsplashPhotoId('landmark')}?q=80&w=800&h=600&auto=format&fit=crop`
        };
      } catch (err) {
        console.error('Error fetching image:', err);
        data.preview = {
          source: `https://images.unsplash.com/${getRandomUnsplashPhotoId('landmark')}?q=80&w=800&h=600&auto=format&fit=crop`
        };
      }
    }
    
    return data;
  } catch (err) {
    console.error(`Place details error for ${xid}:`, err);
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