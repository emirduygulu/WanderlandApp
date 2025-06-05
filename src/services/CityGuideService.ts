// Define type for landmark data from PopulerLandmarks.js
interface PopularLandmark {
  name: string;
  description: string;
  image: string | null;
}

// Import POPULAR_LANDMARKS with proper type definition
import { POPULAR_LANDMARKS } from '../data/PopulerLandmarks';

import { getCityGuideWikipediaData, getCityImageFromWikipedia } from './CityGuideWikipediaService';
import { searchFSQPlaces, searchPopularLandmarks } from './Foursquare';
import { getCoordinatesByCity, getOTMPlaceDetails, searchOTMPlaces } from './OneTripMap';
import { fetchCityImage } from './Unsplash';

// Foursquare types (since they come from JS file)
interface FSQPlace {
  fsq_id: string;
  name: string;
  location: {
    address?: string;
    country?: string;
  };
  description?: string;
  rating?: number;
  popularity?: number;
  categories?: Array<{name: string; id: number}>;
}

interface FSQSearchResult {
  results: FSQPlace[];
}

export interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string | number; // Support both remote URLs and local assets
  landmarks?: Landmark[];
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
  wikiTitle?: string;
}

// Varsayılan şehir listesi
const defaultCities: Omit<City, 'imageUrl'>[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    description: "Japonya'nın başkenti, modern teknoloji ve geleneksel kültürün muhteşem uyumu."
  },
  {
    id: 'paris',
    name: 'Paris',
    description: "Fransa'nın romantik başkenti, sanat, moda ve gastronomi merkezi."
  },
  {
    id: 'newyork',
    name: 'New York',
    description: "Amerika'nın simge şehri, çok kültürlü yapısı ve ikonik gökdelenleriyle ünlü."
  },
  {
    id: 'london',
    name: 'London',
    description: "İngiltere'nin tarihi başkenti, kültürel çeşitliliği ve görkemli mimarisiyle dikkat çekiyor."
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    description: "İspanya'nın renkli şehri, Gaudi mimarisi ve canlı atmosferiyle büyüleyici."
  },
  {
    id: 'istanbul',
    name: 'İstanbul',
    description: "İki kıtayı birleştiren şehir, tarihi ve kültürel zenginliği ile ünlü."
  },
  {
    id: 'rome',
    name: 'Rome',
    description: "İtalya'nın başkenti, antik tarihi, sanatı ve lezzetli mutfağıyla büyüleyici."
  },
  {
    id: 'bali',
    name: 'Bali',
    description: "Endonezya'nın cennet adası, tropikal plajları ve zengin kültürel mirası ile misafirperver."
  }
];

// Şehir ID'si ile POPULAR_LANDMARKS içindeki şehir adını eşleştirme
const cityIdToPopularLandmarkKey: Record<string, string> = {
  'paris': 'Paris',
  'newyork': 'New York City',
  'istanbul': 'İstanbul',
  'london': 'Londra',
  'tokyo': 'Tokyo',
  'barcelona': 'Barcelona',
  'rome': 'Roma',
  'bali': 'Bali',
  'zurich': 'Zürih',
  'prague': 'Prag',
  'salzburg': 'Salzburg',
  'antalya': 'Antalya',
  'venice': 'Venedik'
  // Diğer şehirler buraya eklenebilir
};

// Şehir adını normalize eden yardımcı fonksiyon
const normalizeCity = (cityName: string): string | null => {
  // Önce şehir adını küçük harfe çevir ve boşlukları temizle
  const normalizedName = cityName.trim().toLowerCase();
  
  // Bilinen şehir isimleri için eşleştirme
  const cityMap: Record<string, string> = {
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
 * Açıklama metni oluşturucu
 */
const enrichDescription = (name: string, cityName: string, category?: string): string => {
  const categoryText = category || 'landmark';
  return `${name}, ${cityName} şehrinin önemli ${categoryText} noktalarından biridir. Bu yer şehrin kültürel ve tarihi zenginliklerini yansıtan önemli bir mekandır.`;
};

// Landmark görselini yer adıyla daha iyi eşleştiren fonksiyon
const getAccurateImageQuery = (landmarkName: string, cityName: string): string => {
  // Şehir ve landmark isimlerini birleştirerek daha spesifik bir arama sorgusu oluştur
  const baseQuery = `${landmarkName} ${cityName}`;
  
  // Popüler landmarklar için spesifik sorgular
  const specificQueries: Record<string, Record<string, string>> = {
    'Paris': {
      'Eiffel': 'Eiffel Tower Paris landmark',
      'Louvre': 'Louvre Museum Paris glass pyramid',
      'Notre Dame': 'Notre Dame Cathedral Paris',
      'Champs': 'Champs-Elysees Paris avenue',
      'Arc de Triomphe': 'Arc de Triomphe Paris monument'
    },
    'New York City': {
      'Empire State': 'Empire State Building New York skyline',
      'Central Park': 'Central Park New York aerial',
      'Statue of Liberty': 'Statue of Liberty New York harbor',
      'Times Square': 'Times Square New York night lights',
      'Brooklyn Bridge': 'Brooklyn Bridge New York sunset'
    },
    'İstanbul': {
      'Ayasofya': 'Hagia Sophia Istanbul mosque',
      'Mavi Cami': 'Blue Mosque Istanbul Sultan Ahmed',
      'Topkapı': 'Topkapi Palace Istanbul historic',
      'Galata': 'Galata Tower Istanbul panoramic',
      'Kapalı': 'Grand Bazaar Istanbul market'
    },
    'Londra': {
      'Big Ben': 'Big Ben London Westminster palace',
      'London Eye': 'London Eye Thames River ferris wheel',
      'Buckingham': 'Buckingham Palace London royal guards',
      'Tower Bridge': 'Tower Bridge London Thames river',
      'British Museum': 'British Museum London building'
    }
  };
  
  // Landmark adına göre özel sorgu kontrolü
  const citySpecifics = specificQueries[cityName];
  if (citySpecifics) {
    for (const [keyword, query] of Object.entries(citySpecifics)) {
      if (landmarkName.toLowerCase().includes(keyword.toLowerCase())) {
        return query;
      }
    }
  }
  
  // Özel sorgu bulunamadıysa landmark + şehir + landmark kelimesini ekleyerek döndür
  return `${baseQuery} landmark attraction`;
};

// Local city assets import
const cityAssets = {
  istanbul: require('../assets/city/istanbul.jpg'),
  paris: require('../assets/city/paris.jpg'),
  tokyo: require('../assets/city/tokyo.jpg'),
  newyork: require('../assets/city/nyc.jpg'),
  'new york': require('../assets/city/nyc.jpg'),
  london: require('../assets/city/london.jpg'), 
  barcelona: require('../assets/city/barcelona.jpg'),
  rome: require('../assets/city/roma.jpg'),
  roma: require('../assets/city/roma.jpg'),
  bali: require('../assets/city/bali.jpg'),
  norway: require('../assets/city/norway.jpg'),
  capetown: require('../assets/city/capetown.jpg'),
  placeholder: require('../assets/city/placeholder.png')
};

/**
 * Şehir için local asset görselini al
 */
const getCityLocalImage = (cityId: string, cityName: string): any => {
  // Önce şehir ID'sine göre asset ara
  const normalizedId = cityId.toLowerCase().trim();
  if (cityAssets[normalizedId as keyof typeof cityAssets]) {
    console.log(`🖼️ Using local asset for city ID: ${cityId}`);
    return cityAssets[normalizedId as keyof typeof cityAssets];
  }
  
  // Şehir adına göre asset ara
  const normalizedName = cityName.toLowerCase().trim();
  if (cityAssets[normalizedName as keyof typeof cityAssets]) {
    console.log(`🖼️ Using local asset for city name: ${cityName}`);
    return cityAssets[normalizedName as keyof typeof cityAssets];
  }
  
  // Özel eşleşmeler
  const cityNameMappings: Record<string, keyof typeof cityAssets> = {
    'new york city': 'newyork',
    'nyc': 'newyork',
    'i̇stanbul': 'istanbul',
    'londra': 'placeholder', // London asset yok
    'roma': 'roma',
    'cape town': 'capetown'
  };
  
  const mappedName = cityNameMappings[normalizedName];
  if (mappedName && cityAssets[mappedName]) {
    console.log(`🖼️ Using mapped local asset for: ${cityName} → ${mappedName}`);
    return cityAssets[mappedName];
  }
  
  console.log(`❌ No local asset found for: ${cityName} (${cityId}), using placeholder`);
  return cityAssets.placeholder;
};

/**
 * Popüler şehirleri API'den alır - local asset'lerle
 */
export const fetchPopularCities = async (): Promise<City[]> => {
  try {
    const cities = defaultCities.map((city) => {
      // Local asset'i kullan
      const localImage = getCityLocalImage(city.id, city.name);
      
      return {
        ...city,
        imageUrl: localImage
      };
    });
    
    console.log(`✅ Loaded ${cities.length} cities with local assets`);
    return cities;
  } catch (error) {
    console.error('Error fetching popular cities with local assets:', error);
    
    // Hata durumunda placeholder ile şehirleri döndür
    return defaultCities.map(city => ({
      ...city,
      imageUrl: cityAssets.placeholder
    }));
  }
};

/**
 * Landmark verilerini Wikipedia ile zenginleştir
 */
const enrichLandmarkData = async (
  landmark: Landmark, 
  cityName: string
): Promise<Landmark> => {
  try {
    console.log(`🔧 Enriching landmark: ${landmark.name} with City Guide Wikipedia service`);
    
    // Yeni Wikipedia servisini kullan
    const wikipediaData = await getCityGuideWikipediaData(landmark.name, cityName);
    
    return {
      ...landmark,
      description: wikipediaData.description,
      imageUrl: wikipediaData.imageUrl,
      // Wikipedia başlığı varsa ek bilgi olarak sakla
      wikiTitle: wikipediaData.title
    };
    
  } catch (error) {
    console.error(`❌ Error enriching landmark ${landmark.name}:`, error);
    return landmark; // Hata durumunda orijinal veriyi döndür
  }
};

/**
 * Belirli bir şehir için popüler landmark verileri alır
 */
export const fetchCityLandmarks = async (cityName: string): Promise<Landmark[]> => {
  console.log(`Fetching landmarks for city: ${cityName}`);
  
  // 1. Şehir adını normalize et
  const normalizedCityName = normalizeCity(cityName);
  console.log(`Normalized city name: ${normalizedCityName || 'null'} from original: ${cityName}`);
  
  // 2. Önce POPULAR_LANDMARKS veri setinden bilinen yerleri al
  if (normalizedCityName && POPULAR_LANDMARKS[normalizedCityName as keyof typeof POPULAR_LANDMARKS]) {
    console.log(`Found ${normalizedCityName} in POPULAR_LANDMARKS`);
    
    const popularLandmarks = POPULAR_LANDMARKS[normalizedCityName as keyof typeof POPULAR_LANDMARKS];
    const enrichedLandmarks = await Promise.all(
      popularLandmarks.map(async (landmark: PopularLandmark, index: number) => {
        const landmarkData: Landmark = {
          id: `${normalizedCityName}-${index}`,
          name: landmark.name,
          description: landmark.description,
          imageUrl: landmark.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(landmark.name)},landmark`,
          category: 'landmark'
        };
        
        // Wikipedia ile zenginleştir
        return await enrichLandmarkData(landmarkData, normalizedCityName);
      })
    );
    
    console.log(`Returning ${enrichedLandmarks.length} enriched popular landmarks for ${normalizedCityName}`);
    return enrichedLandmarks;
  }

  // 3. API'lerden landmark verilerini al
  const coordinates = await getCoordinatesByCity(cityName);
  
  if (!coordinates) {
    console.error(`Coordinates not found for ${cityName}`);
    return [];
  }
  
  // 3.1 Önce Foursquare'den çok bilinen turistik yerleri almayı deneyelim
  try {
    console.log(`Trying Foursquare API first for popular landmarks in ${cityName}`);
    const foursquareResults = await searchPopularLandmarks(
      coordinates.lat, 
      coordinates.lon,
      normalizedCityName || cityName,
      100000
    );
    
    if (foursquareResults && foursquareResults.results && foursquareResults.results.length > 0) {
      console.log(`Got ${foursquareResults.results.length} landmarks from Foursquare Popular Landmarks API`);
      
      // En fazla 8 yer al ve Wikipedia ile zenginleştir
      const landmarks = await Promise.all(
        foursquareResults.results.slice(0, 8).map(async (place: FSQPlace) => {
          const category = place.categories && place.categories.length > 0 ? 
            place.categories[0].name.toLowerCase() : 'landmark';
          
          const baseLandmark: Landmark = {
            id: place.fsq_id,
            name: place.name,
            description: place.description || enrichDescription(place.name, cityName, category),
            imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name)},landmark`,
            category: place.categories && place.categories.length > 0 ? 
              place.categories[0].name : 'landmark'
          };
          
          // Wikipedia ile zenginleştir
          return await enrichLandmarkData(baseLandmark, cityName);
        })
      );
      
      console.log(`Returning ${landmarks.length} Wikipedia-enriched Foursquare landmarks`);
      return landmarks;
    }
  } catch (err) {
    console.error('Foursquare Popular Landmarks API error:', err);
  }
  
  // 3.2 Şehirdeki önemli noktaları OpenTripMap'ten al
  const places = await searchOTMPlaces(
    coordinates.lat,
    coordinates.lon,
    100000, // 100km radius  
    15     // 15 sonuç (10'dan fazla)
  );
  
  // Eğer sonuç yoksa, Foursquare'den popüler turistik noktaları almayı dene
  if (!places || places.length === 0) {
    try {
      console.log(`No OTM results for ${cityName}, trying Foursquare API`);
      const foursquareResults = await searchFSQPlaces(
        coordinates.lat, 
        coordinates.lon,
        'tourist attraction', 
        100000
      ) as FSQSearchResult;
      
      if (foursquareResults && foursquareResults.results && foursquareResults.results.length > 0) {
        const landmarks = await Promise.all(
          foursquareResults.results.slice(0, 8).map(async (place: FSQPlace) => {
            const category = place.categories && place.categories.length > 0 ? 
              place.categories[0].name.toLowerCase() : 'landmark';
            
            const baseLandmark: Landmark = {
              id: place.fsq_id,
              name: place.name,
              description: place.description || enrichDescription(place.name, cityName, category),
              imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(place.name)},landmark`,
              category: place.categories && place.categories.length > 0 ? 
                place.categories[0].name : 'landmark'
            };
            
            // Wikipedia ile zenginleştir
            return await enrichLandmarkData(baseLandmark, cityName);
          })
        );
        
        return landmarks;
      }
    } catch (err) {
      console.error('Foursquare fallback error:', err);
    }
    
    return [];
  }

  // 4. OpenTripMap sonuçlarını işle ve Wikipedia ile zenginleştir
  const validPlaces = places.filter((place: any) => 
    place && place.name && place.name.trim() !== ''
  );
  
  console.log(`Processing ${validPlaces.length} valid OTM places for ${cityName}`);
  
  const landmarks = await Promise.all(
    validPlaces.slice(0, 8).map(async (place: any, index: number) => {
      let detailedPlace = place;
      
      // Eğer description yoksa detayları al
      if (!place.description || place.description.trim() === '') {
        try {
          const placeDetails = await getOTMPlaceDetails(place.xid);
          if (placeDetails && placeDetails.description) {
            detailedPlace = { ...place, description: placeDetails.description };
          }
        } catch (err) {
          console.error(`Error fetching OTM details for ${place.name}:`, err);
        }
      }
      
      const baseLandmark: Landmark = {
        id: place.xid || `${cityName}-${index}`,
        name: detailedPlace.name,
        description: detailedPlace.description || enrichDescription(detailedPlace.name, cityName, place.categories?.[0]),
        imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(detailedPlace.name)},landmark`,
        category: place.categories && place.categories.length > 0 ? place.categories[0] : 'landmark'
      };
      
      // Wikipedia ile zenginleştir
      return await enrichLandmarkData(baseLandmark, cityName);
    })
  );
  
  console.log(`Returning ${landmarks.length} Wikipedia-enriched OTM landmarks for ${cityName}`);
  return landmarks;
};

/**
 * Şehir detaylarını ve landmarkları bir arada al - local asset'ler ve Wikipedia entegrasyonu ile
 */
export const fetchCityDetails = async (cityId: string, cityName: string): Promise<City> => {
  try {
    console.log(`Fetching city details for: ${cityName} (ID: ${cityId})`);
    
    // Şehir ID'si ile popüler landmark listesindeki karşılığını kontrol et
    const popularLandmarksKey = cityIdToPopularLandmarkKey[cityId.toLowerCase()];
    
    if (popularLandmarksKey) {
      console.log(`Found known city match: ${popularLandmarksKey} for ID: ${cityId}`);
    } else {
      console.log(`No predefined mapping for city ID: ${cityId}, using name: ${cityName}`);
    }
    
    // Önce local asset'i dene
    console.log(`Using local asset for city: ${cityName}`);
    let cityImageUrl = getCityLocalImage(cityId, cityName);
    
    // Eğer placeholder ise Wikipedia'dan almayı dene
    if (cityImageUrl === cityAssets.placeholder) {
      console.log(`Local asset is placeholder, trying Wikipedia for: ${cityName}`);
      const wikipediaImageUrl = await getCityImageFromWikipedia(cityName);
      
      if (wikipediaImageUrl) {
        console.log(`Using Wikipedia image for: ${cityName}`);
        cityImageUrl = wikipediaImageUrl;
      } else {
        console.log(`No Wikipedia image, trying Unsplash for: ${cityName}`);
        const unsplashImageUrl = await fetchCityImage(cityName);
        if (unsplashImageUrl) {
          cityImageUrl = unsplashImageUrl;
        } else {
          // Son çare olarak placeholder kullan
          cityImageUrl = cityAssets.placeholder;
        }
      }
    }
    
    console.log(`Final city image result: ${typeof cityImageUrl === 'string' ? 'URL' : 'Local Asset'}`);
    
    // Şehirdeki önemli noktaları al - eğer popüler bir şehirse, önce o listeyi kullan
    let landmarks: Landmark[] = [];
    if (popularLandmarksKey) {
      console.log(`Using landmarks for known city: ${popularLandmarksKey} (from ID: ${cityId})`);
      landmarks = await fetchCityLandmarks(popularLandmarksKey);
    } else {
      console.log(`Fetching landmarks for city by name: ${cityName}`);
      landmarks = await fetchCityLandmarks(cityName);
    }
    
    console.log(`Got ${landmarks.length} Wikipedia-enriched landmarks for ${cityName}`);
    
    if (landmarks.length > 0) {
      console.log('First landmark sample:', JSON.stringify({
        name: landmarks[0].name,
        imageUrl: landmarks[0].imageUrl ? 'exists' : 'missing',
        description_length: landmarks[0].description.length,
        wikiTitle: (landmarks[0] as any).wikiTitle || 'none'
      }, null, 2));
    }
    
    // Şehir açıklaması oluştur - varsayılan açıklama veya özel açıklama
    const cityDescription = defaultCities.find(city => 
      city.id === cityId || 
      city.name.toLowerCase() === cityName.toLowerCase())?.description || 
      `${cityName}, dünyanın en etkileyici şehirlerinden biridir. Kültürel zenginlikleri ve turistik mekânlarıyla her yıl milyonlarca ziyaretçi ağırlar.`;
    
    // Şehir verilerini hazırla
    const cityData = {
      id: cityId,
      name: cityName,
      description: cityDescription,
      imageUrl: cityImageUrl,
      landmarks
    };
    
    console.log(`Returning city data for ${cityName} with ${landmarks.length} Wikipedia-enriched landmarks and local assets`);
    return cityData;
  } catch (error) {
    console.error(`Error fetching city details for ${cityName}:`, error);
    
    // Hata durumunda local asset ile varsayılan veri döndür
    return {
      id: cityId,
      name: cityName,
      description: `${cityName}, dünyanın en etkileyici şehirlerinden biridir.`,
      imageUrl: getCityLocalImage(cityId, cityName),
      landmarks: []
    };
  }
};