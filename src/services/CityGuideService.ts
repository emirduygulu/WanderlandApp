import { getFSQPlaceDetails, searchFSQPlaces, searchPopularLandmarks } from './Foursquare';
import { getCoordinatesByCity, getOTMPlaceDetails, searchOTMPlaces } from './OneTripMap';
import { fetchCityImage } from './Unsplash';


// Define type for landmark data from PopulerLandmarks.js
interface PopularLandmark {
  name: string;
  description: string;
  image: string | null;
}

// Import POPULAR_LANDMARKS with proper type definition
import { POPULAR_LANDMARKS } from '../data/PopulerLandmarks';

export interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  landmarks?: Landmark[];
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category?: string;
}

// Foursquare result type
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

// Foursquare'den dönen yerlerin açıklamalarını zenginleştirme fonksiyonu
const enrichDescription = (placeName: string, cityName: string, category?: string): string => {
  // Bu harita yerel olarak tanımlanan açıklamaları içerir - API'den açıklama alamadığımızda kullanılır
  // Açıklamalar API'den gelmediğinde kullanılacak fallback içeriği
  const citySpecificInfo: Record<string, Record<string, string>> = {
    'Paris': {
      'Eiffel': 'Paris\'in sembolü olan Eyfel Kulesi, Gustave Eiffel tarafından tasarlanmış ve 1889 yılında tamamlanmıştır. 324 metre yüksekliğindeki bu demir yapı, dünyanın en çok ziyaret edilen turistik yerlerinden biridir.',
      'Louvre': 'Dünyanın en büyük sanat müzelerinden biri olan Louvre Müzesi, Mona Lisa ve Venüs de Milo gibi dünyaca ünlü eserlere ev sahipliği yapmaktadır. Eski bir kraliyet sarayında yer alan müze, yılda 10 milyona yakın ziyaretçi ağırlar.',
      'Notre Dame': 'Notre Dame Katedrali, Fransa\'nın en önemli Gotik mimarisi örneklerinden biridir. Seine Nehri üzerindeki Île de la Cité adasında bulunan katedral, 12. yüzyılda inşa edilmeye başlanmıştır.',
      'Champs-Élysées': 'Paris\'in en ünlü caddesinin adı "Elysium Alanları" anlamına gelir. Zafer Takı\'ndan Concorde Meydanı\'na uzanan, lüks mağazalar ve kafelerle dolu olan bu cadde Paris\'in kalbidir.',
      'Arc de Triomphe': 'Zafer Takı, Napolyon\'un Austerlitz Savaşı\'ndaki zaferini kutlamak için inşa edilmiştir. Paris\'in en ikonik yapılarından biridir ve şehrin merkezi noktalarından biri olarak kabul edilir.'
    },
    'New York City': {
      'Empire State': 'New York\'un en ikonik gökdelenlerinden biri olan Empire State Binası, 1931 yılında tamamlanmış ve uzun yıllar dünyanın en yüksek binası unvanını korumuştur. 102 katlı bina, muhteşem şehir manzarası sunar.',
      'Central Park': 'Manhattan\'ın merkezinde yer alan 341 hektarlık bu büyük şehir parkı, New York\'un "yeşil akciğeri" olarak kabul edilir. İçinde göller, koşu yolları, hayvanat bahçesi ve çeşitli etkinlik alanları bulunur.',
      'Statue of Liberty': 'Özgürlük Heykeli, ABD\'ye göç eden milyonlarca kişiyi karşılayan sembol haline gelmiştir. Fransa tarafından hediye edilen bu heykel, Liberty Island\'da yer alır ve UNESCO Dünya Mirası Listesi\'ndedir.',
      'Times Square': 'New York\'un en hareketli ve ışıltılı meydanı olan Times Square, Broadway tiyatrolarının merkezi ve her yıl milyonlarca turistin ziyaret ettiği bir yerdir. Özellikle Yılbaşı kutlamaları ile ünlüdür.',
      'Brooklyn Bridge': '1883 yılında tamamlanan Brooklyn Köprüsü, Manhattan ve Brooklyn\'i birbirine bağlayan tarihi bir asma köprüdür. Dönemin en uzun asma köprüsü olan yapı, New York manzarasının önemli bir parçasıdır.'
    },
    'İstanbul': {
      'Ayasofya': 'İstanbul\'un en önemli tarihi yapılarından biri olan Ayasofya, önce kilise, sonra müze ve şimdi cami olarak hizmet vermektedir. Bizans mimarisinin şaheseri olarak kabul edilir ve muhteşem kubbesi ile ünlüdür.',
      'Mavi Cami': 'Sultan Ahmet Camii olarak da bilinen Mavi Cami, iç kısmını süsleyen mavi çinilerden dolayı bu isimle anılır. Osmanlı mimarisinin en güzel örneklerinden biridir ve 6 minaresi ile dikkat çeker.',
      'Topkapı': 'Topkapı Sarayı, yaklaşık 400 yıl boyunca Osmanlı İmparatorluğu\'nun idare merkezi ve sultanların resmi konutu olmuştur. İçinde Kutsal Emanetler Bölümü, Harem ve muhteşem bahçeler bulunur.',
      'Galata': 'Galata Kulesi, İstanbul\'un en eski ve ikonik yapılarından biridir. 14. yüzyılda Cenevizliler tarafından inşa edilen kule, Haliç ve Boğaz\'ın panoramik manzarasını sunar.',
      'Kapalıçarşı': 'Dünyanın en eski ve en büyük kapalı çarşılarından biri olan Kapalıçarşı, 500 yılı aşkın geçmişiyle İstanbul\'un ticaret merkezidir. 4000\'den fazla dükkân içeren bu labirent, geleneksel Türk el sanatlarını keşfetmek için ideal bir yerdir.'
    },
    'Londra': {
      'Big Ben': 'Aslında Elizabeth Kulesi olarak bilinen saat kulesi, içindeki çan olan "Big Ben" adıyla tanınır. Westminster Sarayı\'nın bir parçası olan bu ikonik yapı, Londra\'nın en tanınabilir sembollerinden biridir.',
      'London Eye': 'Londra\'nın en popüler turistik noktalarından biri olan London Eye, 135 metre yüksekliğindeki dünyanın en büyük dönme dolaplarından biridir. Thames Nehri kıyısında yer alır ve şehrin panoramik manzarasını sunar.',
      'Buckingham': 'Buckingham Sarayı, İngiliz Kraliyet ailesinin Londra\'daki resmi ikametgâhıdır. Nöbet değişimi törenleri ile ünlüdür ve bazı bölümleri halka açıktır.',
      'Tower Bridge': '1894 yılında tamamlanan Tower Bridge, hem köprü hem de müze olarak hizmet veren Londra\'nın en tanınabilir yapılarından biridir. Orta kısmı kaldırılabilen köprü, Thames Nehri üzerinde yer alır.',
      'British Museum': 'Dünyanın en büyük ve en eski müzelerinden biri olan British Museum, 8 milyondan fazla eserle insanlık tarihinin 2 milyon yıllık gelişimini belgeler. Mısır mumyaları ve Rosetta Taşı gibi önemli eserler burada sergilenir.'
    },
    'Roma': {
      'Colosseum': 'Roma İmparatorluğu\'nun ihtişamını yansıtan Kolezyum, antik dünyanın en büyük amfitiyatrolarından biridir. MS 70-80 yılları arasında inşa edilen yapı, 50.000\'den fazla seyirci kapasitesine sahipti ve gladyatör dövüşlerine ev sahipliği yapıyordu.',
      'Vatican': 'Vatikan, dünyanın en küçük bağımsız devleti ve Katolik Kilisesi\'nin merkezidir. St. Peter\'s Bazilikası, Vatikan Müzeleri ve Sistine Şapeli gibi sanatsal ve mimari şaheserlere ev sahipliği yapar.',
      'Trevi': 'Roma\'nın en ünlü çeşmesi olan Trevi Çeşmesi, Barok tarzda inşa edilmiştir. Geleneksel olarak buraya para atmak, Roma\'ya tekrar dönmeyi garantilediğine inanılır.',
      'Pantheon': 'Roma\'nın en iyi korunmuş antik yapısı olan Pantheon, muhteşem kubbesi ile mimari bir harikadır. MS 126 yılında tamamlanmış ve Hristiyanlık öncesi Roma tanrılarına adanmıştır.',
      'Forum': 'Roma Forumu, antik Roma\'nın kalbi sayılan bir meydan ve tapınaklar, mahkemeler ve anıtlarla çevrili bir alandı. Roma İmparatorluğu\'nun siyasi, dini ve sosyal hayatının merkezi olarak işlev görüyordu.'
    },
    'Barcelona': {
      'Sagrada Familia': 'Antoni Gaudí\'nin başyapıtı olan bu muhteşem bazilika, 1882\'den beri inşaat halindedir. Eşsiz mimarisi ve detaylı heykelleri ile Barcelona\'nın en önemli sembolüdür.',
      'Park Güell': 'Gaudí\'nin bir diğer eseri olan Park Güell, renkli mozaikler ve sıra dışı mimari formlarla dolu bir kamusal parktır. UNESCO Dünya Mirası Listesi\'nde yer alır.',
      'La Rambla': 'Barcelona\'nın ünlü yürüyüş caddesi olan La Rambla, şehir merkezindeki ağaçlı bir bulvar boyunca uzanır. Sokak sanatçıları, kafeler ve çiçekçilerle dolu olan bu cadde her zaman canlıdır.',
      'Casa Batlló': 'Gaudí tarafından tasarlanan bu apartman binası, Barcelona\'nın modernist mimarisinin en güzel örneklerinden biridir. Deniz canlılarından ilham alan tasarımı ile dikkat çeker.',
      'Camp Nou': 'FC Barcelona\'nın ev stadyumu olan Camp Nou, Avrupa\'nın en büyük futbol stadyumudur. 99.000\'den fazla kişilik kapasitesi ile futbol tutkunları için bir hac yeridir.'
    },
    'Tokyo': {
      'Tokyo Tower': 'Eyfel Kulesi\'nden esinlenerek inşa edilen Tokyo Kulesi, şehrin sembollerinden biridir. 333 metre yüksekliğindeki kule, gözlem platformları ve turistik tesisler içerir.',
      'Shibuya': 'Tokyo\'nun en hareketli ve kalabalık bölgelerinden biri olan Shibuya, ünlü yaya geçidi ile tanınır. Modern Japon gençlik kültürünün merkezi olarak kabul edilir.',
      'Meiji': 'Meiji Tapınağı, İmparator Meiji ve eşi İmparatoriçe Shōken\'in anısına yapılmış bir Şinto tapınağıdır. Geniş ormanlar içerisinde yer alan tapınak, Tokyo\'nun en popüler turistik yerlerinden biridir.',
      'Sensoji': 'Tokyo\'nun en eski Budist tapınağı olan Sensō-ji, Asakusa bölgesinde yer alır. Kaminari-mon (Gök Gürültüsü Kapısı) ve Nakamise-dori alışveriş caddesi ile ünlüdür.',
      'Skytree': 'Tokyo Skytree, 634 metre yüksekliğiyle dünyanın en yüksek kulelerinden biridir. 2012 yılında tamamlanan kule, gözlem platformları ve alışveriş merkezleri içerir.'
    }
  };

  console.log(`Enriching description for "${placeName}" in ${cityName}, category: ${category || 'unknown'}`);

  // API'den açıklama çekme girişimi yapılacak
  // Bu örnekte önce yerel veritabanında kontrol ediliyor, gerçek uygulamada API çağrısı yapılabilir
  
  // Yer adını küçük harfe çevir
  const lowerPlaceName = placeName.toLowerCase();
  
  // Şehir için özel açıklamalar var mı kontrol et
  const cityInfo = citySpecificInfo[cityName];
  if (cityInfo) {
    // Yer adı için özel bir açıklama var mı kontrol et
    for (const [keyword, description] of Object.entries(cityInfo)) {
      if (lowerPlaceName.includes(keyword.toLowerCase())) {
        console.log(`Found predefined description for ${placeName} with keyword ${keyword}`);
        return description;
      }
    }
  }
  
  // API'den landmark açıklaması almak için aşağıdaki fonksiyon kullanılabilir
  // Bu bir örnek implementasyondur ve gerçek bir API çağrısı yapılmamaktadır
  // Gerçek uygulamada burada Wikipedia, Google Places veya başka bir API kullanılabilir
  const tryGetDescriptionFromAPI = async (name: string, city: string, cat: string | undefined): Promise<string | null> => {
    // Bu fonksiyon, gerçek bir API çağrısı yaparak landmark açıklaması almayı simüle eder
    // Örnek olarak bu fonksiyon şimdilik boş bırakılmıştır
    // Gerçek uygulamada burada Wikipedia, Google Places veya başka bir API kullanılabilir
    
    // API çağrısı simülasyonu - gerçekte burada API'ye istek yapılır
    console.log(`Would fetch description from API for ${name} in ${city}, category: ${cat}`);
    return null; // API'den açıklama bulunamadı
  };
  
  // Kategori bazlı açıklamalar - API'den bilgi alamadığımızda kullanılır
  const categoryDescriptions: Record<string, string> = {
    'landmark': `${placeName}, ${cityName} şehrinin önemli tarihi ve turistik noktalarından biridir. Yıl boyunca binlerce ziyaretçiyi ağırlayan bu özel yer, şehrin kültürel mirasının bir parçasıdır.`,
    'museum': `${placeName}, ${cityName} şehrinde bulunan önemli bir müzedir. İçerdiği zengin koleksiyonlar ve sergiler ile ziyaretçilere eşsiz bir kültürel deneyim sunar.`,
    'historic': `${placeName}, ${cityName} şehrinin tarihine tanıklık eden önemli bir yapıdır. Mimari özellikleri ve tarihsel önemi ile kültür turistlerinin ilgisini çeker.`,
    'cultural': `${placeName}, ${cityName}'in kültürel yaşamında önemli bir yere sahiptir. Yerel kültürü yakından tanımak isteyenler için mutlaka görülmesi gereken bir noktadır.`,
    'nature': `${placeName}, ${cityName}'de doğal güzellikleri keşfetmek isteyenler için ideal bir yerdir. Etkileyici manzarası ile ziyaretçilerine unutulmaz anlar yaşatır.`,
    'church': `${placeName}, ${cityName}'de bulunan önemli bir dini yapıdır. Tarihi ve mimari özellikleri ile hem inanç turizmi hem de kültür turizmi açısından değerlidir.`,
    'palace': `${placeName}, ${cityName}'de yer alan muhteşem bir saraydır. Görkemli mimarisi ve zengin tarihi ile geçmişin ihtişamını günümüze taşır.`,
    'tower': `${placeName}, ${cityName} manzarasının vazgeçilmez bir parçası olan bu kule, ziyaretçilerine şehrin panoramik görüntüsünü sunar.`,
    'park': `${placeName}, ${cityName}'in yeşil alanlarından biri olan bu park, şehrin gürültüsünden uzaklaşmak isteyenler için ideal bir kaçış noktasıdır.`,
    'square': `${placeName}, ${cityName}'in merkezi noktalarından biri olan bu meydan, tarihi yapıları ve canlı atmosferi ile şehir yaşamının kalbini oluşturur.`,
    'castle': `${placeName}, ${cityName}'de bulunan bu etkileyici kale, geçmişin savunma mimarisinin güzel bir örneğidir. Tarihi atmosferi ile ziyaretçileri geçmişe götürür.`
  };
  
  // Kategori bazlı açıklama kontrolü
  if (category && categoryDescriptions[category.toLowerCase()]) {
    console.log(`Using category based description for ${placeName}, category: ${category}`);
    return categoryDescriptions[category.toLowerCase()];
  }
  
  // Varsayılan açıklama
  return `${placeName}, ${cityName} şehrinde bulunan popüler bir turistik noktadır. Şehri ziyaret eden turistlerin sıklıkla tercih ettiği bu yer, benzersiz özellikleri ile dikkat çeker.`;
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

/**
 * Popüler şehirleri API'den alır
 */
export const fetchPopularCities = async (): Promise<City[]> => {
  try {
    const cities = await Promise.all(
      defaultCities.map(async (city) => {
        try {
          // Unsplash API'den şehir görselini al
          const imageUrl = await fetchCityImage(city.name);
          return {
            ...city,
            imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(city.name)},city`
          };
        } catch (error) {
          console.error(`Error fetching image for ${city.name}:`, error);
          return {
            ...city,
            imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(city.name)},city`
          };
        }
      })
    );
    
    return cities;
  } catch (error) {
    console.error('Error fetching popular cities:', error);
    
    // Hata durumunda varsayılan görseller ile şehirleri döndür
    return defaultCities.map(city => ({
      ...city,
      imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(city.name)},city`
    }));
  }
};

/**
 * Belirli bir şehir için popüler landmark verileri alır
 */
export const fetchCityLandmarks = async (cityName: string): Promise<Landmark[]> => {
  try {
    // 1. İlk önce şehir adını normalize et
    const normalizedCityName = normalizeCity(cityName);
    console.log(`Normalized city name: ${normalizedCityName} (from: ${cityName})`);
    
    // 2. Eğer şehir, popüler landmark listesinde varsa direkt olarak onu kullan
    if (normalizedCityName && POPULAR_LANDMARKS[normalizedCityName as keyof typeof POPULAR_LANDMARKS]) {
      console.log(`Using predefined landmarks for ${normalizedCityName}`);
      
      // Manuel eklediğimiz popüler noktaları dönüştür
      const landmarks: Landmark[] = await Promise.all(
        POPULAR_LANDMARKS[normalizedCityName as keyof typeof POPULAR_LANDMARKS].map(async (landmark: PopularLandmark) => {
          // Eğer landmark'ın görüntüsü yoksa Unsplash'ten çekelim
          let imageUrl = landmark.image;
          if (!imageUrl) {
            // Daha spesifik görsel araması için özel sorgu oluştur
            const imageQuery = getAccurateImageQuery(landmark.name, normalizedCityName);
            imageUrl = await fetchCityImage(imageQuery);
          }
          
          // Daha zengin açıklama için
          let description = landmark.description;
          if (description.length < 100) {
            description = enrichDescription(landmark.name, normalizedCityName, 'landmark');
          }
          
          return {
            id: `custom_${landmark.name.replace(/\s/g, '_')}`,
            name: landmark.name,
            description: description,
            imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(landmark.name)},landmark`,
            category: 'landmark'
          };
        })
      );
      
      return landmarks;
    }
    
    // 3. Popüler landmark listesinde yoksa API'den veri al
    
    // Şehrin koordinatlarını al
    const coordinates = await getCoordinatesByCity(cityName);
    
    if (!coordinates) {
      console.error(`Coordinates not found for ${cityName}`);
      return [];
    }
    
    // 3.1 Önce Foursquare'den çok bilinen turistik yerleri almayı deneyelim
    // Foursquare bazen daha popüler yerleri daha iyi döndürüyor
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
        
        // En fazla 10 yer dönelim 
        return await Promise.all(
          foursquareResults.results.slice(0, 10).map(async (place: FSQPlace) => {
            // Daha spesifik görsel araması için özel sorgu oluştur
            const imageQuery = getAccurateImageQuery(place.name, cityName);
            const imageUrl = await fetchCityImage(imageQuery);
            
            // Eğer detay bilgisi varsa, bunu kullan
            let description = `${place.name}, ${cityName} şehrinde bulunan popüler bir turistik noktadır.`;
            if (place.description) {
              description = place.description;
            } else if (place.fsq_id) {
              try {
                const details = await getFSQPlaceDetails(place.fsq_id);
                if (details && details.description) {
                  description = details.description;
                }
              } catch (err) {
                console.error(`Error fetching details for ${place.name}:`, err);
              }
            }
            
            // Açıklamayı zenginleştir
            if (description.length < 100) {
              const category = place.categories && place.categories.length > 0 ? 
                place.categories[0].name.toLowerCase() : 'landmark';
              description = enrichDescription(place.name, cityName, category);
            }
            
            return {
              id: place.fsq_id,
              name: place.name,
              description,
              imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`,
              category: place.categories && place.categories.length > 0 ? 
                place.categories[0].name : 'landmark'
            };
          })
        );
      }
    } catch (err) {
      console.error('Foursquare initial search error:', err);
      // Hata durumunda devam et - OTM API'ye düşecek
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
          return await Promise.all(
            foursquareResults.results.slice(0, 10).map(async (place: FSQPlace) => {
              // Daha spesifik görsel araması için özel sorgu oluştur
              const imageQuery = getAccurateImageQuery(place.name, cityName);
              const imageUrl = await fetchCityImage(imageQuery);
              
              // Açıklama oluştur
              const category = place.categories && place.categories.length > 0 ? 
                place.categories[0].name.toLowerCase() : 'landmark';
              const description = enrichDescription(place.name, cityName, category);
              
              return {
                id: place.fsq_id,
                name: place.name,
                description,
                imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`,
                category: place.categories && place.categories.length > 0 ? 
                  place.categories[0].name : 'landmark'
              };
            })
          );
        }
      } catch (err) {
        console.error('Foursquare fallback error:', err);
      }
      
      return [];
    }
    
    // Her landmark için detayları al ve formatlı veri oluştur
    const landmarks = await Promise.all(
      places.map(async place => {
        try {
          // Özel eklenen landmark verisi varsa, hemen onu kullan
          if (place.custom && place.custom_data) {
            return {
              id: place.xid,
              name: place.name,
              description: place.custom_data.description || enrichDescription(place.name, cityName, 'landmark'),
              imageUrl: place.custom_data.image || await fetchCityImage(getAccurateImageQuery(place.name, cityName)),
              category: 'landmark'
            };
          }
          
          // Değilse OpenTripMap API'den detayları al
          const details = await getOTMPlaceDetails(place.xid);
          
          // Kategori bilgisi al
          let category = 'landmark';
          if (place.kinds) {
            const kinds = place.kinds.split(',');
            if (kinds.length > 0) {
              // İlk kategoriyi kullan, ancak daha spesifik kategorileri öncelikle al
              const preferredCategories = ['museum', 'historic', 'castle', 'palace', 'church', 'temple', 'tower'];
              for (const preferred of preferredCategories) {
                if (kinds.includes(preferred)) {
                  category = preferred;
                  break;
                }
              }
              if (category === 'landmark') {
                category = kinds[0];
              }
            }
          }
          
          // Açıklama oluştur veya zenginleştir
          let description = details?.wikipedia_extracts?.text || '';
          if (!description || description.length < 100) {
            description = enrichDescription(place.name, cityName, category);
          }
          
          // Görsel al
          const imageQuery = getAccurateImageQuery(place.name, cityName);
          let imageUrl = details?.preview?.source || await fetchCityImage(imageQuery);
          
          return {
            id: place.xid,
            name: place.name,
            description,
            imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`,
            category
          };
        } catch (error) {
          console.error(`Error fetching details for ${place.name}:`, error);
          
          // Hata durumunda basit veri döndür, ancak zenginleştirilmiş açıklama ile
          const description = enrichDescription(place.name, cityName, 'landmark');
          const imageQuery = getAccurateImageQuery(place.name, cityName);
          
          return {
            id: place.xid,
            name: place.name,
            description,
            imageUrl: await fetchCityImage(imageQuery) || 
                      `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`,
            category: place.kinds?.split(',')[0] || 'landmark'
          };
        }
      })
    );
    
    // En fazla 10 landmark döndür
    return landmarks.slice(0, 10);
  } catch (error) {
    console.error(`Error fetching landmarks for ${cityName}:`, error);
    return [];
  }
};

/**
 * Şehir detaylarını ve landmarkları bir arada al
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
    
    // Unsplash'den şehir görselini al
    console.log(`Fetching image for city: ${cityName}`);
    const imageUrl = await fetchCityImage(cityName);
    console.log(`City image result: ${imageUrl ? 'success' : 'null'}`);
    
    // Şehirdeki önemli noktaları al - eğer popüler bir şehirse, önce o listeyi kullan
    let landmarks: Landmark[] = [];
    if (popularLandmarksKey) {
      console.log(`Using landmarks for known city: ${popularLandmarksKey} (from ID: ${cityId})`);
      landmarks = await fetchCityLandmarks(popularLandmarksKey);
    } else {
      console.log(`Fetching landmarks for city by name: ${cityName}`);
      landmarks = await fetchCityLandmarks(cityName);
    }
    
    console.log(`Got ${landmarks.length} landmarks for ${cityName}`);
    
    if (landmarks.length > 0) {
      console.log('First landmark:', JSON.stringify({
        name: landmarks[0].name,
        imageUrl: landmarks[0].imageUrl ? 'exists' : 'missing',
        description_length: landmarks[0].description.length
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
      imageUrl: imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(cityName)},city`,
      landmarks
    };
    
    console.log(`Returning city data for ${cityName} with ${landmarks.length} landmarks`);
    return cityData;
  } catch (error) {
    console.error(`Error fetching city details for ${cityName}:`, error);
    
    // Hata durumunda varsayılan veri döndür
    return {
      id: cityId,
      name: cityName,
      description: `${cityName}, dünyanın en etkileyici şehirlerinden biridir.`,
      imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(cityName)},city`,
      landmarks: []
    };
  }
}; 