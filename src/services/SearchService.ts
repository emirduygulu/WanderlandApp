import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCityImage } from './Unsplash';
import { fetchLandmarkInfo, getHighQualityWikipediaImage } from './WikipediaService';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  location: {
    city?: string;
    country?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  popularity?: number;
  type: 'landmark' | 'place' | 'city' | 'monument';
  source: 'wikipedia';
  score?: number;
  additionalInfo?: {
    wikipediaUrl?: string;
    language?: 'tr' | 'en';
  };
}

export interface SearchFilters {
  category?: string[];
  minRating?: number;
  type?: ('landmark' | 'place' | 'city' | 'monument')[];
}

// İzin verilen turizm kategorileri
const ALLOWED_TRAVEL_KEYWORDS = [
  // Yerler ve Şehirler
  'şehir', 'city', 'kent', 'il', 'ilçe', 'belde', 'kasaba', 'köy',
  'ülke', 'country', 'devlet', 'cumhuriyet',
  
  // Tarihi Yerler
  'tarihi', 'historical', 'antik', 'ancient', 'harabe', 'ruins',
  'kale', 'castle', 'saray', 'palace', 'köşk', 'villa',
  'cami', 'mosque', 'kilise', 'church', 'sinagog', 'temple',
  'anıt', 'monument', 'mezar', 'tomb', 'türbe', 'mausoleum',
  'müze', 'museum', 'galeri', 'gallery', 'kütüphane', 'library',
  
  // Doğal Yerler
  'park', 'garden', 'bahçe', 'orman', 'forest', 'plaj', 'beach',
  'göl', 'lake', 'deniz', 'sea', 'nehir', 'river', 'şelale', 'waterfall',
  'dağ', 'mountain', 'tepe', 'hill', 'vadi', 'valley', 'ada', 'island',
  'milli park', 'national park', 'tabiat', 'nature', 'rezerv', 'reserve',
  
  // Eğlence ve Aktivite
  'tiyatro', 'theater', 'opera', 'konser', 'concert', 'sinema', 'cinema',
  'eğlence', 'entertainment', 'tema park', 'theme park', 'lunapark',
  'aqua', 'su parkı', 'water park', 'kayak', 'ski', 'golf',
  'spor kompleksi', 'sports complex', 'stadyum', 'stadium', 'arena',
  
  // Yeme İçme
  'restoran', 'restaurant', 'lokanta', 'cafe', 'kahve', 'coffee',
  'bar', 'pub', 'meyhane', 'tavern', 'çay evi', 'tea house',
  'pastane', 'bakery', 'fast food', 'yemek', 'food', 'mutfak', 'cuisine',
  
  // Alışveriş
  'çarşı', 'market', 'bazaar', 'pazar', 'alışveriş', 'shopping',
  'mağaza', 'store', 'butik', 'boutique', 'avm', 'mall',
  
  // Konaklama
  'otel', 'hotel', 'motel', 'pansiyon', 'pension', 'hostel',
  'resort', 'tatil köyü', 'kamp', 'camping',
  
  // Ulaşım ve Yapılar
  'köprü', 'bridge', 'kule', 'tower', 'liman', 'port',
  'havaalanı', 'airport', 'tren istasyonu', 'train station', 'metro'
];

// Yasaklı kategoriler (seyahat/turizm dışı)
const BLOCKED_KEYWORDS = [
  // Kişiler
  'doğum', 'birth', 'ölüm', 'death', 'yaşam', 'life', 'biyografi', 'biography',
  'siyasetçi', 'politician', 'başkan', 'president', 'başbakan', 'minister',
  'kral', 'king', 'kraliçe', 'queen', 'sultan', 'padişah',
  'yazar', 'author', 'şair', 'poet', 'sanatçı', 'artist', 'müzisyen', 'musician',
  'oyuncu', 'actor', 'aktör', 'actress', 'sporcu', 'athlete',
  
  // Spor Takımları ve Kulüpler
  'futbol kulübü', 'football club', 'spor kulübü', 'sports club',
  'takım', 'team', 'kulüp', 'club', 'fc', 'sk', 'gsk',
  
  // Soyut Kavramlar
  'teori', 'theory', 'felsefe', 'philosophy', 'din', 'religion',
  'ideoloji', 'ideology', 'politika', 'politics', 'parti', 'party',
  'anlaşma', 'agreement', 'antlaşma', 'treaty', 'savaş', 'war',
  'devrim', 'revolution', 'hareket', 'movement',
  
  // Bilim ve Teknoloji (akademik)
  'algoritma', 'algorithm', 'yazılım', 'software', 'program', 'programming',
  'matematik', 'mathematics', 'fizik', 'physics', 'kimya', 'chemistry',
  'biyoloji', 'biology', 'tıp', 'medicine', 'hastalık', 'disease',
  
  // Medya ve Eğlence Sektörü
  'film', 'movie', 'dizi', 'series', 'kitap', 'book', 'roman', 'novel',
  'albüm', 'album', 'şarkı', 'song', 'cd', 'dvd',
  
  // Hayvanlar ve Diğer Canlılar
  'hayvan', 'animal', 'tür', 'species', 'canlı', 'living', 'bitki', 'plant',
  'memeli', 'mammal', 'sürüngen', 'reptile', 'kuş', 'bird', 'balık', 'fish',
  'böcek', 'insect', 'mikrop', 'germ', 'bakteri', 'bacteria', 'virüs', 'virus',
  'mantar', 'fungus', 'ağaç', 'tree', 'çiçek', 'flower', 'ot', 'grass',
  'köpek', 'dog', 'kedi', 'cat', 'at', 'horse', 'inek', 'cow', 'koyun', 'sheep',
  'tavuk', 'chicken', 'domuz', 'pig', 'aslan', 'lion', 'kaplan', 'tiger',
  'ayı', 'bear', 'kurt', 'wolf', 'tilki', 'fox', 'tavşan', 'rabbit',
  'fare', 'mouse', 'sincap', 'squirrel', 'geyik', 'deer', 'zürafa', 'giraffe',
  'fil', 'elephant', 'maymun', 'monkey', 'gorilla', 'şempanze', 'chimpanzee',
  'penguen', 'penguin', 'fok', 'seal', 'balina', 'whale', 'yunus', 'dolphin',
  'köpekbalığı', 'shark', 'yılan', 'snake', 'kertenkele', 'lizard', 'timsah', 'crocodile',
  'kaplumbağa', 'turtle', 'kurbağa', 'frog', 'böcek', 'insect', 'arı', 'bee',
  'karınca', 'ant', 'kelebek', 'butterfly', 'örümcek', 'spider', 'akrep', 'scorpion'
];

// Turizm kategorisi kontrol fonksiyonu
const isTravelRelated = (title: string, extract: string): boolean => {
  const lowerTitle = title.toLowerCase();
  const lowerExtract = extract.toLowerCase();
  const fullText = (lowerTitle + ' ' + lowerExtract);
  
  // ADIM 1: İzin verilen turizm anahtar kelimeleri kontrol et
  // Bu liste en yüksek önceliğe sahip, bunlardan biri varsa hemen kabul et
  const priorityTravelKeywords = [
    'saray', 'palace', 'müze', 'museum', 'köprü', 'bridge', 
    'kule', 'tower', 'anıt', 'monument', 'cami', 'mosque',
    'kilise', 'church', 'park', 'bahçe', 'garden', 'plaj', 'beach',
    'şelale', 'waterfall', 'göl', 'lake', 'sahil', 'coast', 'shore',
    'çarşı', 'market', 'bazaar', 'kale', 'castle', 'antik', 'ancient'
  ];
  
  for (const keyword of priorityTravelKeywords) {
    if (fullText.includes(keyword)) {
      console.log(`✅ Öncelikli turizm anahtar kelimesi bulundu: "${keyword}"`);
      return true;
    }
  }
  
  // ADIM 2: Başlıkta yasaklı kategoriler var mı kontrol et
  // Eğer başlık tamamen yasaklı bir kategoriyse filtrele
  let hasForbiddenTitle = false;
  
  // Spor takımı kontrolü
  if (/[^\w]fc$|^fc[^\w]|[^\w]sk$|^sk[^\w]|kulüb|spor/i.test(lowerTitle)) {
    console.log(`❌ Spor takımı tespit edildi: "${title}"`);
    hasForbiddenTitle = true;
  }
  
  // Canlı türleri kontrolü - sadece tam eşleşmeler
  const animalTerms = [
    'köpek', 'dog', 'kedi', 'cat', 'aslan', 'lion', 'kaplan', 'tiger',
    'ayı', 'bear', 'kuş', 'bird', 'balık', 'fish'
  ];
  
  // Başlığın tam olarak yasaklı bir hayvan/bitki olup olmadığını kontrol et
  for (const term of animalTerms) {
    // Tam kelime eşleşmesi için regex kullan
    const regex = new RegExp(`^${term}$|^${term}[^a-zğüşıöç]|[^a-zğüşıöç]${term}$|[^a-zğüşıöç]${term}[^a-zğüşıöç]`, 'i');
    if (regex.test(lowerTitle) && !priorityTravelKeywords.some(keyword => lowerTitle.includes(keyword))) {
      console.log(`❌ Başlıkta hayvan/bitki ismi tespit edildi: "${term}"`);
      hasForbiddenTitle = true;
      break;
    }
  }
  
  // Siyasetçi/ünlü kontrolü
  if (/başkan|president|bakan|minister|kral|king|kraliçe|queen|artist|musician|actor|actress/i.test(lowerTitle)) {
    console.log(`❌ Siyasetçi/ünlü tespit edildi: "${title}"`);
    hasForbiddenTitle = true;
  }
  
  // Eğer başlıkta turizm terimi geçiyorsa, yasaklı kategorileri yoksay
  for (const keyword of ALLOWED_TRAVEL_KEYWORDS) {
    if (lowerTitle.includes(keyword)) {
      console.log(`🔄 Başlıkta yasaklı kategori var ama turizm terimi de var: "${keyword}"`);
      hasForbiddenTitle = false;
      break;
    }
  }
  
  if (hasForbiddenTitle) {
    return false;
  }
  
  // ADIM 3: Açıklamada izin verilen turizm terimleri var mı kontrol et
  for (const allowedTerm of ALLOWED_TRAVEL_KEYWORDS) {
    if (fullText.includes(allowedTerm)) {
      console.log(`✅ İzin verilen turizm kategorisi: "${allowedTerm}"`);
      return true;
    }
  }
  
  // ADIM 4: Türkiye'deki bilinen yerleşim yerleri kontrolü
  const turkishLocationNames = [
    'türkiye', 'turkey', 'anadolu', 'anatolia',
    'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'adana', 
    'konya', 'gaziantep', 'mersin', 'kayseri', 'eskişehir'
  ];
  
  const hasLocationName = turkishLocationNames.some(location => 
    fullText.includes(location.toLowerCase())
  );
  
  if (hasLocationName) {
    console.log(`✅ Türkiye lokasyon tespit edildi`);
    return true;
  }
  
  // ADIM 5: İçeriğin çoğunlukla yasaklı kategorilerde olup olmadığını kontrol et
  // Yasaklı terimlerin sayısını say
  let blockedTermCount = 0;
  for (const blockedTerm of BLOCKED_KEYWORDS) {
    if (fullText.includes(blockedTerm)) {
      blockedTermCount++;
    }
  }
  
  // Eğer çok sayıda yasaklı terim varsa, muhtemelen ilgisiz bir içeriktir
  if (blockedTermCount > 3) {
    console.log(`❌ Çok sayıda yasaklı terim (${blockedTermCount}) tespit edildi`);
    return false;
  }
  
  console.log(`⚠️ Turizm kategorisi belirsiz, varsayılan olarak kabul edildi: "${title}"`);
  return true;
};

// Arama skorlama fonksiyonu
const calculateSearchScore = (resultName: string, searchQuery: string): number => {
  const query = searchQuery.toLowerCase().trim();
  const name = resultName.toLowerCase().trim();
  
  // Tam eşleşme en yüksek skor
  if (name === query) return 100;
  
  // Kelimeleri ayır
  const queryWords = query.split(/\s+/);
  const nameWords = name.split(/\s+/);
  
  let score = 0;
  
  // Tam kelime eşleşmeleri
  for (const queryWord of queryWords) {
    for (const nameWord of nameWords) {
      if (nameWord === queryWord) {
        score += 40; // Tam kelime eşleşmesi artırıldı
      } else if (nameWord.includes(queryWord) && queryWord.length > 2) {
        score += 20; // Kısmi kelime eşleşmesi
      } else if (queryWord.includes(nameWord) && nameWord.length > 2) {
        score += 15; // Ters kısmi eşleşme
      }
    }
  }
  
  // İsim query ile başlıyorsa yüksek bonus
  if (name.startsWith(query)) score += 35;
  
  // Query isimde geçiyorsa bonus
  if (name.includes(query)) score += 25;
  
  // Uzunluk benzerliği bonusu
  const lengthDiff = Math.abs(name.length - query.length);
  if (lengthDiff <= 3) score += 15;
  
  return Math.min(score, 100);
};

// Görsel doğrulama ve alma fonksiyonu
const getValidatedImage = async (wikipediaImageUrl: string, searchQuery: string): Promise<string> => {
  console.log(`🖼️ Görsel alınıyor: ${searchQuery}`);
  
  // Wikipedia görseli varsa önce onu dene
  if (wikipediaImageUrl) {
    try {
      const highQualityUrl = getHighQualityWikipediaImage(wikipediaImageUrl, 800);
      console.log(`📸 Wikipedia görseli yüksek kaliteye çevrildi: ${highQualityUrl}`);
      
      // URL test et
      const testResponse = await fetch(highQualityUrl, { 
        method: 'HEAD'
      });
      
      if (testResponse.ok) {
        console.log(`✅ Wikipedia görseli geçerli`);
        return highQualityUrl;
      }
    } catch (error) {
      console.log(`⚠️ Wikipedia görseli test hatası:`, error);
    }
  }
  
  // Wikipedia görseli yoksa veya çalışmıyorsa Unsplash'ten al
  try {
    console.log(`🔄 Unsplash'ten görsel aranıyor: ${searchQuery}`);
    const unsplashImage = await fetchCityImage(searchQuery);
    console.log(`✅ Unsplash görseli bulundu`);
    return unsplashImage;
  } catch (error) {
    console.log(`❌ Unsplash hatası, varsayılan görsel kullanılıyor`);
    return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80';
  }
};

// Kategori ve tip belirleme fonksiyonu
const determineTypeAndCategory = (title: string, extract: string) => {
  const text = (title + ' ' + extract).toLowerCase();
  
  // Cami/Mosque
  if (text.includes('cami') || text.includes('mosque') || text.includes('mescit')) {
    return { category: 'Cami', type: 'monument' as const };
  }
  
  // Saray/Palace
  if (text.includes('saray') || text.includes('palace') || text.includes('köşk')) {
    return { category: 'Saray', type: 'monument' as const };
  }
  
  // Kule/Tower
  if (text.includes('kule') || text.includes('tower') || text.includes('kulesi')) {
    return { category: 'Kule', type: 'landmark' as const };
  }
  
  // Köprü/Bridge
  if (text.includes('köprü') || text.includes('bridge') || text.includes('köprüsü')) {
    return { category: 'Köprü', type: 'landmark' as const };
  }
  
  // Müze/Museum
  if (text.includes('müze') || text.includes('museum') || text.includes('müzesi')) {
    return { category: 'Müze', type: 'landmark' as const };
  }
  
  // Anıt/Monument
  if (text.includes('anıt') || text.includes('monument') || text.includes('mezar') || text.includes('türbe')) {
    return { category: 'Anıt', type: 'monument' as const };
  }
  
  // Park/Garden
  if (text.includes('park') || text.includes('bahçe') || text.includes('garden')) {
    return { category: 'Park', type: 'place' as const };
  }
  
  // Antik/Ancient
  if (text.includes('antik') || text.includes('ancient') || text.includes('harabe') || text.includes('ruins')) {
    return { category: 'Antik Kent', type: 'landmark' as const };
  }
  
  // Çarşı/Market
  if (text.includes('çarşı') || text.includes('market') || text.includes('bazaar') || text.includes('pazar')) {
    return { category: 'Çarşı', type: 'place' as const };
  }
  
  // Restoran/Restaurant
  if (text.includes('restoran') || text.includes('restaurant') || text.includes('lokanta') || text.includes('yemek')) {
    return { category: 'Restoran', type: 'place' as const };
  }
  
  // Cafe/Bar
  if (text.includes('cafe') || text.includes('kahve') || text.includes('bar') || text.includes('pub')) {
    return { category: 'Cafe/Bar', type: 'place' as const };
  }
  
  // Şehir/City
  if (text.includes('şehir') || text.includes('city') || text.includes('kent') || 
      text.includes('il') || text.includes('ilçe') || text.includes('belde')) {
    return { category: 'Şehir', type: 'city' as const };
  }
  
  // Varsayılan
  return { category: 'Landmark', type: 'landmark' as const };
};

// Ana arama fonksiyonu - Turizm sınırlamalı
export const searchPlaces = async (
  query: string, 
  filters: SearchFilters = {}
): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.trim();
  console.log(`🔍 Turizm odaklı arama başlatılıyor: "${normalizedQuery}"`);

  try {
    // Arama geçmişine ekle
    await saveSearchHistory(normalizedQuery);

    // Wikipedia'dan bilgi çek
    const wikipediaResult = await fetchLandmarkInfo(normalizedQuery);
    
    if ('error' in wikipediaResult) {
      console.log(`❌ Wikipedia'da bulunamadı: "${normalizedQuery}" - ${wikipediaResult.error}`);
      return [];
    }

    console.log(`✅ Wikipedia'da bulundu: "${wikipediaResult.title}"`);
    
    // Turizm kategorisi kontrolü - YENİ
    const isTravelContent = isTravelRelated(wikipediaResult.title, wikipediaResult.extract);
    if (!isTravelContent) {
      console.log(`🚫 Turizm kategorisi dışında, sonuç filtrelendi: "${wikipediaResult.title}"`);
      return [];
    }
    
    // Arama skoru hesapla
    const searchScore = calculateSearchScore(wikipediaResult.title, normalizedQuery);
    console.log(`📊 Arama skoru: ${searchScore}/100`);
    
    // Düşük skorlu sonuçları filtrele
    if (searchScore < 25) {
      console.log(`⏭️ Düşük arama skoru, sonuç filtrelendi: ${searchScore}`);
      return [];
    }

    // Görsel al ve doğrula
    const imageUrl = await getValidatedImage(wikipediaResult.image || '', normalizedQuery);

    // Kategori ve tip belirle
    const { category, type } = determineTypeAndCategory(wikipediaResult.title, wikipediaResult.extract);

    // Rating hesapla (arama skoruna ve içerik kalitesine göre)
    const textLength = wikipediaResult.extract.length;
    const hasImage = !!wikipediaResult.image;
    const hasCoordinates = !!wikipediaResult.coordinates;
    
    let rating = 4.0 + (searchScore / 100 * 1.0); // Arama skoruna göre 0-1 puan bonus
    if (textLength > 500) rating += 0.3;
    if (textLength > 1000) rating += 0.2;
    if (hasImage) rating += 0.2;
    if (hasCoordinates) rating += 0.2;
    if (wikipediaResult.language === 'tr') rating += 0.1; // Türkçe içerik bonusu
    rating = Math.min(rating, 5.0);

    // Popularity hesapla
    const popularity = Math.min(
      Math.floor(textLength / 10) + searchScore + (hasImage ? 10 : 0), 
      100
    );

    const result: SearchResult = {
      id: `wikipedia_${normalizedQuery.replace(/\s+/g, '_').toLowerCase()}`,
      name: wikipediaResult.title,
      description: wikipediaResult.extract,
      imageUrl,
      category,
      location: {
        coordinates: wikipediaResult.coordinates ? {
          lat: wikipediaResult.coordinates.lat,
          lng: wikipediaResult.coordinates.lng
        } : undefined,
        country: 'Türkiye'
      },
      rating,
      popularity,
      type,
      source: 'wikipedia',
      score: searchScore,
      additionalInfo: {
        wikipediaUrl: wikipediaResult.url,
        language: wikipediaResult.language
      }
    };

    // Filtreleri uygula
    if (filters.type && filters.type.length > 0 && !filters.type.includes(result.type)) {
      console.log(`⏭️ Tip filtresi uygulandı, sonuç atlandı: ${result.type}`);
      return [];
    }

    if (filters.minRating && result.rating && result.rating < filters.minRating) {
      console.log(`⏭️ Rating filtresi uygulandı, sonuç atlandı: ${result.rating}`);
      return [];
    }

    console.log(`✅ Turizm sonucu hazırlandı: ${result.name} (Skor: ${searchScore}, Kategori: ${category})`);
    return [result];

  } catch (error) {
    console.error('Wikipedia arama hatası:', error);
    return [];
  }
};

// Popüler aramalar
export const getPopularSearches = (): string[] => {
  return [
    'Anıtkabir',
    'Ayasofya',
    'Galata Kulesi',
    'Galata Köprüsü',
    'Sultanahmet Camii',
    'Topkapı Sarayı',
    'Kapadokya',
    'Pamukkale',
    'Efes Antik Kenti',
    'Nemrut Dağı'
  ];
};

// Kategori bazlı öneriler sistemi
export interface CategorySuggestion {
  name: string;
  places: string[];
  description: string;
  icon: string;
}

// Kategori bazlı öneriler için anahtar-değer objeleri
export const getCategorySuggestions = (): Record<string, CategorySuggestion> => {
  return {
    "Tarihi Yerler": {
      name: "Tarihi Yerler",
      description: "Antik şehirler ve anıtlar",
      icon: "library",
      places: [
        "Ayasofya",
        "Topkapı Sarayı",
        "Efes Antik Kenti",
        "Anıtkabir",
        "Dolmabahçe Sarayı",
        "Yıldız Sarayı",
        "Sultanahmet Camii",
        "Selimiye Camii",
        "Bergama Antik Kenti",
        "Göbeklitepe",
        "Truva Antik Kenti",
        "Nemrut Dağı",
        "Sümela Manastırı"
      ]
    },
    "Doğa": {
      name: "Doğa",
      description: "Milli parklar ve doğal güzellikler",
      icon: "leaf",
      places: [
        "Kapadokya",
        "Pamukkale",
        "Salda Gölü",
        "Uzungöl",
        "Abant Gölü",
        "Kelebekler Vadisi",
        "Saklıkent Kanyonu",
        "Ayder Yaylası",
        "Yedigöller Milli Parkı",
        "Ihlara Vadisi",
        "Köprülü Kanyon",
        "Nemrut Krater Gölü",
        "Kızılcahamam Soğuksu Milli Parkı",
        "Longoz Ormanları"
      ]
    },
    "Müzeler": {
      name: "Müzeler",
      description: "Kültür ve sanat müzeleri",
      icon: "school",
      places: [
        "İstanbul Arkeoloji Müzesi",
        "Anadolu Medeniyetleri Müzesi",
        "İstanbul Modern Sanat Müzesi",
        "Pera Müzesi",
        "Sakıp Sabancı Müzesi",
        "Zeugma Mozaik Müzesi",
        "Rahmi Koç Müzesi",
        "Antalya Arkeoloji Müzesi",
        "Mevlana Müzesi",
        "Topkapı Sarayı Müzesi",
        "İslam Bilim ve Teknoloji Tarihi Müzesi",
        "Çengelhan Rahmi Koç Müzesi",
        "Baksı Müzesi"
      ]
    },
    "Şehir Merkezi": {
      name: "Şehir Merkezi",
      description: "Popüler mekanlar",
      icon: "business",
      places: [
        "İstiklal Caddesi",
        "Galata Köprüsü",
        "Kapalı Çarşı",
        "Mısır Çarşısı",
        "Kızılay Meydanı",
        "Konak Meydanı",
        "Tunalı Hilmi Caddesi",
        "Kemeraltı Çarşısı",
        "Kadıköy Çarşı",
        "Konyaaltı Sahili",
        "Kordon Boyu",
        "Bağdat Caddesi",
        "Ulus Meydanı"
      ]
    },
    "Plajlar": {
      name: "Plajlar",
      description: "Turkuaz sularıyla muhteşem plajlar",
      icon: "umbrella",
      places: [
        "Ölüdeniz",
        "Patara Plajı",
        "İztuzu Plajı",
        "Çıralı Plajı",
        "Kabak Koyu",
        "Kleopatra Plajı",
        "Kaputaş Plajı",
        "Altınkum Plajı",
        "Bodrum Bitez Plajı",
        "Ilıca Plajı",
        "Akyaka Plajı",
        "Konyaaltı Plajı",
        "Gemile Koyu"
      ]
    },
    "Gastronomi": {
      name: "Gastronomi",
      description: "Lezzet durakları",
      icon: "restaurant",
      places: [
        "Hatay Mutfağı",
        "Gaziantep Mutfağı",
        "Adana Kebap",
        "İskender Kebap",
        "Tarihi Sultanahmet Köftecisi",
        "Karaköy Güllüoğlu",
        "Konyalı Lokantası",
        "Çiya Sofrası",
        "Kanaat Lokantası",
        "Köfteci Ramiz",
        "Hacı Abdullah Lokantası",
        "Pandeli Lokantası",
        "Tarihi Karaköy Balık Lokantası",
        "Hamdi Restaurant"
      ]
    }
  };
};

// Kategori bazlı yerleri getir
export const getPlacesByCategory = (categoryName: string): string[] => {
  const categories = getCategorySuggestions();
  if (categoryName in categories) {
    return categories[categoryName].places;
  }
  return [];
};

// Arama geçmişi fonksiyonları
const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 20;

export const saveSearchHistory = async (query: string): Promise<void> => {
  try {
    if (!query || query.trim().length < 2) return;
    
    const normalizedQuery = query.trim();
    const existingHistory = await getSearchHistory();
    const filteredHistory = existingHistory.filter(
      item => item.toLowerCase() !== normalizedQuery.toLowerCase()
    );
    
    const newHistory = [normalizedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Search history save error:', error);
  }
};

export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    if (historyJson) {
      const history = JSON.parse(historyJson);
      return Array.isArray(history) ? history : [];
    }
    return [];
  } catch (error) {
    console.error('Search history get error:', error);
    return [];
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Search history clear error:', error);
  }
};

export const removeFromSearchHistory = async (query: string): Promise<void> => {
  try {
    const existingHistory = await getSearchHistory();
    const filteredHistory = existingHistory.filter(
      item => item.toLowerCase() !== query.toLowerCase()
    );
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Search history remove error:', error);
  }
}; 