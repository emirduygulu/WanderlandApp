// Category API Service
import { searchFSQPlaces, getFSQPlaceDetails } from './Foursquare';
import { searchOTMPlaces, getOTMPlaceDetails } from './OneTripMap';
import { getDefaultLocation } from './Location';
import { SEASONAL_CITIES, POPULAR_LANDMARKS } from '../data/PopulerLandmarks';
import { fetchLandmarkImage } from './Unsplash';

// Types
export interface PlaceItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  description?: string;
  highlights?: string[];
  category?: string;
}

export interface CategoryData {
  title: string;
  description: string;
  items: PlaceItem[];
}

// Kategori tanımlamaları - kullanılabilecek kategoriler
type CategoryIds = 'winter' | 'spring' | 'summer' | 'autumn' | 'restaurants' | 'parks' | 'entertainment' | 'historical' | 'cafes';

// Kategori veri yapısı
interface CategoryInfo {
  title: string;
  description: string;
  fsqQuery: string;
  otmCategory: string;
}

// Kategori tanımlamaları
const categoryMapping: Record<CategoryIds, CategoryInfo> = {
  
  // Mevsim bazlı kategoriler
  winter: {
    title: 'Kış Rotaları',
    description: 'Kış mevsiminde ziyaret edebileceğiniz en iyi yerler',
    fsqQuery: 'kayak kış tatil',
    otmCategory: 'winter_sports,skiing',
  },
  spring: {
    title: 'İlkbahar Rotaları',
    description: 'İlkbahar mevsiminde çiçeklenme ve doğanın uyanışını görebileceğiniz yerler',
    fsqQuery: 'bahçe çiçek festival',
    otmCategory: 'gardens,natural',
  },
  summer: {
    title: 'Yaz Tatil Rotaları',
    description: 'Yaz mevsiminde deniz, kum ve güneşin tadını çıkarabileceğiniz yerler',
    fsqQuery: 'plaj sahil marina',
    otmCategory: 'beaches,resorts',
  },
  autumn: {
    title: 'Sonbahar Rotaları',
    description: 'Sonbahar mevsiminde renklerin dansını görebileceğiniz yerler',
    fsqQuery: 'orman göl doğa yürüyüşü',
    otmCategory: 'natural,hiking',
  },
  
  // Yeni kategoriler: Keşif alanları
  restaurants: {
    title: 'Restoranlar',
    description: 'İstanbul\'da öne çıkan en iyi restoranlar',
    fsqQuery: 'restaurant fine dining',
    otmCategory: 'foods,restaurants',
  },
  parks: {
    title: 'Yeşil Alanlar',
    description: 'İstanbul\'un en güzel parkları ve doğal alanları',
    fsqQuery: 'park bahçe yeşil alan',
    otmCategory: 'gardens,natural,parks',
  },
  entertainment: {
    title: 'Eğlence Alanları',
    description: 'İstanbul\'da eğlenceli vakit geçirebileceğiniz yerler',
    fsqQuery: 'eğlence sinema tiyatro',
    otmCategory: 'entertainment,cinemas,theatres',
  },
  historical: {
    title: 'Tarihi Yerler',
    description: 'İstanbul\'un zengin tarihini yansıtan önemli noktalar',
    fsqQuery: 'tarih müze saray',
    otmCategory: 'historic,architecture,museums',
  },
  cafes: {
    title: 'Kafe ve Barlar',
    description: 'İstanbul\'un en popüler kafe ve barları',
    fsqQuery: 'cafe bar',
    otmCategory: 'cafes,bars,foods',
  }
};

// Keşif butonlarını ve kategorileri eşleştirme
export const DISCOVER_CATEGORIES = {
  "Hepsi": "all",
  "Restoranlar": "restaurants",
  "Yeşil Alanlar": "parks",
  "Eğlence Alanları": "entertainment",
  "Tarihi Yerler": "historical",
  "Kafe ve Barlar": "cafes",
};

// İstanbul için önerilen yerler listesi - kategori bazlı
export const ISTANBUL_PLACES: Record<string, PlaceItem[]> = {
  restaurants: [
    {
      id: 'rest_1',
      name: 'Mikla Restaurant',
      location: 'Beyoğlu, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
      description: 'Modern Türk ve Akdeniz mutfağını buluşturan lüks bir restoran. İstanbul\'un panoramik manzarasına sahiptir.',
      category: 'restaurants'
    },
    {
      id: 'rest_2',
      name: 'Nusr-Et Steakhouse',
      location: 'Etiler, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Nusret Gökçe tarafından kurulan dünyaca ünlü steakhouse zinciri. Et severlerin uğrak noktasıdır.',
      category: 'restaurants'
    },
    {
      id: 'rest_3',
      name: 'Pandeli',
      location: 'Fatih, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=800&auto=format&fit=crop',
      rating: 4.6,
      description: 'Mısır Çarşısı\'nın üst katında bulunan, 1901\'den beri hizmet veren tarihi Türk mutfağı restoranı.',
      category: 'restaurants'
    },
    {
      id: 'rest_4',
      name: 'Çiya Sofrası',
      location: 'Kadıköy, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Anadolu\'nun geleneksel lezzetlerini sunan, özellikle unutulmaya yüz tutmuş yemekleri menüsünde bulunduran restoran.',
      category: 'restaurants'
    }
  ],
  parks: [
    {
      id: 'park_1',
      name: 'Yıldız Parkı',
      location: 'Beşiktaş, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Osmanlı döneminden kalma tarihi bir koruya sahip, Boğaz manzaralı geniş bir park. Yürüyüş rotaları ve piknik alanlarıyla ünlüdür.',
      category: 'parks'
    },
    {
      id: 'park_2',
      name: 'Emirgan Korusu',
      location: 'Sarıyer, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1586081070913-60c6c6c65afc?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
      description: 'Özellikle ilkbaharda düzenlenen lale festivaliyle ünlü, tarihi köşklere sahip büyük bir park.',
      category: 'parks'
    },
    {
      id: 'park_3',
      name: 'Atatürk Arboretumu',
      location: 'Sarıyer, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=800&auto=format&fit=crop',
      rating: 4.6,
      description: 'Çok sayıda yerli ve yabancı bitki türüne ev sahipliği yapan, doğa yürüyüşleri için ideal bir botanik bahçesi.',
      category: 'parks'
    },
    {
      id: 'park_4',
      name: 'Belgrad Ormanı',
      location: 'Sarıyer, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop',
      rating: 4.5,
      description: 'İstanbul\'un en büyük doğal alanlarından biri, koşu ve yürüyüş parkurlarıyla sporseverlerin gözdesi.',
      category: 'parks'
    }
  ],
  entertainment: [
    {
      id: 'ent_1',
      name: 'Vialand (Isfanbul)',
      location: 'Eyüp, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=800&auto=format&fit=crop',
      rating: 4.4,
      description: 'Türkiye\'nin en büyük tema parklarından biri. Heyecan verici roller coasterlar ve eğlence alanlarıyla aileler için ideal.',
      category: 'entertainment'
    },
    {
      id: 'ent_2',
      name: 'Cinemaximum',
      location: 'Çeşitli lokasyonlar, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?q=80&w=800&auto=format&fit=crop',
      rating: 4.5,
      description: 'Türkiye\'nin en büyük sinema zinciri. IMAX ve 4DX gibi teknolojilerle film izleme deneyimi sunar.',
      category: 'entertainment'
    },
    {
      id: 'ent_3',
      name: 'İstanbul Akvaryum',
      location: 'Florya, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
      rating: 4.6,
      description: 'Avrupa\'nın en büyük akvaryumlarından biri, deniz canlılarını yakından görebileceğiniz tematik alanlar sunar.',
      category: 'entertainment'
    },
    {
      id: 'ent_4',
      name: 'Zorlu PSM',
      location: 'Beşiktaş, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Konserler, tiyatro gösterileri ve sanatsal etkinlikler için İstanbul\'un en prestijli performans sanatları merkezi.',
      category: 'entertainment'
    }
  ],
  historical: [
    {
      id: 'hist_1',
      name: 'Topkapı Sarayı',
      location: 'Fatih, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1604849329148-aeef269a5156?q=80&w=800&auto=format&fit=crop',
      rating: 4.9,
      description: 'Osmanlı İmparatorluğu\'nun yönetim merkezi olarak kullanılan, 15. yüzyıldan kalma saray kompleksi.',
      category: 'historical'
    },
    {
      id: 'hist_2',
      name: 'Ayasofya',
      location: 'Fatih, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=800&auto=format&fit=crop',
      rating: 4.9,
      description: 'Bizans döneminde katedral, Osmanlı döneminde cami ve bir süre müze olarak hizmet vermiş, şimdi tekrar cami olarak açılan tarihi yapı.',
      category: 'historical'
    },
    {
      id: 'hist_3',
      name: 'Dolmabahçe Sarayı',
      location: 'Beşiktaş, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1626675484865-8b805ca59697?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
      description: 'Osmanlı İmparatorluğu\'nun son dönemlerinde inşa edilmiş, Avrupa tarzı mimariye sahip görkemli saray.',
      category: 'historical'
    },
    {
      id: 'hist_4',
      name: 'Yerebatan Sarnıcı',
      location: 'Fatih, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1632163274615-6d292733a387?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Bizans döneminde şehrin su ihtiyacını karşılamak üzere inşa edilmiş, etkileyici sütunlara sahip yeraltı su deposu.',
      category: 'historical'
    }
  ],
  cafes: [
    {
      id: 'cafe_1',
      name: 'Bebek Kahve',
      location: 'Bebek, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=800&auto=format&fit=crop',
      rating: 4.6,
      description: 'Boğaz manzarasına karşı kahve içebileceğiniz, İstanbul\'un klasikleşmiş kafelerinden biri.',
      category: 'cafes'
    },
    {
      id: 'cafe_2',
      name: 'Norm Coffee',
      location: 'Kadıköy, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
      rating: 4.7,
      description: 'Specialty kahve tutkunları için kaliteli çekirdeklerin kullanıldığı, minimalist tasarımıyla öne çıkan kafe.',
      category: 'cafes'
    },
    {
      id: 'cafe_3',
      name: 'Mandabatmaz',
      location: 'Beyoğlu, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=80&w=800&auto=format&fit=crop',
      rating: 4.5,
      description: 'İstanbul\'un en iyi Türk kahvesini sunan, geleneksel tarzını koruyan küçük ve otantik kafe.',
      category: 'cafes'
    },
    {
      id: 'cafe_4',
      name: 'Alexandra Cocktail Bar',
      location: 'Beyoğlu, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
      rating: 4.8,
      description: 'Yaratıcı kokteylleri ve ambiyansıyla öne çıkan, İstanbul\'un en sevilen barlarından biri.',
      category: 'cafes'
    }
  ]
};

// Tüm kategorileri getir
export const fetchCategories = async (): Promise<string[]> => {
  try {
    // Gerçek API'den kategori listesi gelebilir, şu an statik kullanıyoruz
    return Object.keys(categoryMapping);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Object.keys(categoryMapping);
  }
};

// Keşif yerlerini getir (Anasayfa için)
export const fetchDiscoverPlaces = async (category: string): Promise<PlaceItem[]> => {
  try {
    // "Hepsi" kategorisi seçiliyse tüm kategorilerdeki öğeleri birleştir
    if (category === "all") {
      const allPlaces: PlaceItem[] = [];
      Object.values(ISTANBUL_PLACES).forEach(places => {
        // Her kategoriden 2 yer ekle
        allPlaces.push(...places.slice(0, 2));
      });
      return allPlaces;
    }
    
    // Belirli bir kategori seçilmişse o kategorideki yerleri getir
    if (ISTANBUL_PLACES[category]) {
      return ISTANBUL_PLACES[category];
    }
    
    // Eğer kategori bulunamazsa boş dizi döndür
    return [];
  } catch (error) {
    console.error('Error fetching discover places:', error);
    return [];
  }
};

// Mevsimsel şehirler için veri dönüştürme fonksiyonu
const getSeasonalCityData = async (season: CategoryIds): Promise<PlaceItem[]> => {
  const seasonData = SEASONAL_CITIES[season];
  if (!seasonData || !Array.isArray(seasonData)) {
    console.error(`No season data found for ${season}`);
    return [];
  }

  const items: PlaceItem[] = [];

  for (const cityData of seasonData) {
    try {
      // Şehir verilerini al
      const cityName = cityData.city;
      
      // Şehir için popüler landmark varsa ilk görseli al
      let imageUrl = null;
      // TypeScript hatası için güvenli indeksleme
      const cityLandmarks = (POPULAR_LANDMARKS as Record<string, any>)[cityName];
      
      if (cityLandmarks && Array.isArray(cityLandmarks) && cityLandmarks.length > 0) {
        if (!cityLandmarks[0].image) {
          // Eğer görseli henüz çekilmemişse API'den al
          try {
            imageUrl = await fetchLandmarkImage(cityName, cityLandmarks[0].name);
          } catch (error) {
            console.error(`Error fetching image for ${cityName}:`, error);
          }
        } else {
          imageUrl = cityLandmarks[0].image;
        }
      }

      // Eğer görsel alınamadıysa varsayılan görsel kullan
      if (!imageUrl) {
        imageUrl = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(cityName)},travel`;
      }

      items.push({
        id: `seasonal_${cityName.toLowerCase().replace(/\s/g, '_')}`,
        name: cityName,
        location: cityName,
        imageUrl: imageUrl,
        rating: 4.5 + Math.random() * 0.5, // 4.5-5.0 arası random bir değer
        description: cityData.description,
        highlights: cityData.highlights
      });
    } catch (error) {
      console.error(`Error processing seasonal city data:`, error);
    }
  }

  return items;
};

// Foursquare API verilerine göre yer listesi oluşturma
const transformFSQData = async (results: any[]): Promise<PlaceItem[]> => {
  const items: PlaceItem[] = [];
  
  // En fazla 5 yer göster
  const placesToShow = results.slice(0, 5);
  
  for (const place of placesToShow) {
    try {
      // Her bir yer için detay bilgisini çek (fotoğraflar için gerekli)
      const details = await getFSQPlaceDetails(place.fsq_id);
      
      // Görsel URL'ini oluştur
      let imageUrl = 'https://source.unsplash.com/random/800x600/?nature,landscape'; // Varsayılan görsel
      
      if (details && details.photos && details.photos.length > 0) {
        const photo = details.photos[0];
        imageUrl = `${photo.prefix}original${photo.suffix}`;
      }
      
      items.push({
        id: place.fsq_id,
        name: place.name,
        location: place.location?.locality || place.location?.region || 'Turkey',
        imageUrl,
        rating: details.rating ? details.rating/2 : 4.5, // 10 üzerinden 5 üzerine çevir
      });
    } catch (error) {
      console.error('Error transforming place:', error);
    }
  }
  
  return items;
};

// Belirli bir kategorinin detaylarını getir
export const fetchCategoryData = async (categoryId: string): Promise<CategoryData> => {
  const validCategoryId = categoryId as CategoryIds;
  
  if (!categoryMapping[validCategoryId]) {
    return getMockData(categoryId);
  }
  
  try {
    const category = categoryMapping[validCategoryId];
    
    // Eğer mevsimsel kategori ise, PopulerLandmarks'dan veri al
    if (['winter', 'spring', 'summer', 'autumn'].includes(validCategoryId)) {
      const seasonalItems = await getSeasonalCityData(validCategoryId);
      
      if (seasonalItems.length > 0) {
        return {
          title: category.title,
          description: category.description,
          items: seasonalItems
        };
      }
    }
    
    // Eğer mevsimsel veriler elde edilemezse veya başka bir kategori ise
    // API'den verileri çekmeye devam et
    const location = getDefaultLocation();
    const { latitude, longitude } = location;
    
    // Foursquare API'den verileri çek
    const fsqResults = await searchFSQPlaces(
      latitude, 
      longitude, 
      category.fsqQuery
    );
    
    let items: PlaceItem[] = [];
    
    // Foursquare verilerini dönüştür
    if (fsqResults && fsqResults.results && fsqResults.results.length > 0) {
      items = await transformFSQData(fsqResults.results);
    }
    
    // Eğer hiç veri alınamadıysa veya hata oluştuysa örnek verileri göster
    if (items.length === 0) {
      const mockData = getMockData(categoryId);
      items = mockData.items;
    }
    
    return {
      title: category.title,
      description: category.description,
      items
    };
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error);
    // Hata durumunda mock veri dön
    return getMockData(categoryId);
  }
};

// API henüz hazır değilken kullanılacak mock veri
export const getMockData = (categoryId: string): CategoryData => {
  const mockCategories: Record<string, CategoryData> = {
    mountain: {
      title: 'Doğa Rotaları',
      description: 'En popüler doğa rotaları ve keşfedilecek yerler',
      items: [
        {
          id: 'm1',
          name: 'Belgrad Ormanı',
          location: 'İstanbul',
          imageUrl: 'https://source.unsplash.com/random/800x600/?forest,nature',
          rating: 4.7,
        },
        {
          id: 'm2',
          name: 'Uludağ Milli Parkı',
          location: 'Bursa',
          imageUrl: 'https://source.unsplash.com/random/800x600/?mountain,snow',
          rating: 4.8,
        },
        {
          id: 'm3',
          name: 'Ilgaz Dağı',
          location: 'Kastamonu',
          imageUrl: 'https://source.unsplash.com/random/800x600/?forest,path',
          rating: 4.6,
        }
      ]
    },
    beach: {
      title: 'En İyi Plajlar',
      description: 'Türkiye\'nin en güzel plajları ve sahil bölgeleri',
      items: [
        {
          id: 'b1',
          name: 'Ölüdeniz',
          location: 'Muğla',
          imageUrl: 'https://source.unsplash.com/random/800x600/?beach,turquoise',
          rating: 4.9,
        },
        {
          id: 'b2',
          name: 'Kaputaş Plajı',
          location: 'Antalya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?beach,cliff',
          rating: 4.8,
        },
        {
          id: 'b3',
          name: 'Çeşme Plajları',
          location: 'İzmir',
          imageUrl: 'https://source.unsplash.com/random/800x600/?beach,mediterranean',
          rating: 4.7,
        }
      ]
    },
    historical: {
      title: 'Tarihi Yerler',
      description: 'Türkiye\'nin zengin tarihi ve kültürel mirasları',
      items: [
        {
          id: 'h1',
          name: 'Ayasofya',
          location: 'İstanbul',
          imageUrl: 'https://source.unsplash.com/random/800x600/?hagia,sophia,istanbul',
          rating: 4.9,
        },
        {
          id: 'h2',
          name: 'Efes Antik Kenti',
          location: 'İzmir',
          imageUrl: 'https://source.unsplash.com/random/800x600/?ephesus,ruins',
          rating: 4.8,
        },
        {
          id: 'h3',
          name: 'Kapadokya',
          location: 'Nevşehir',
          imageUrl: 'https://source.unsplash.com/random/800x600/?cappadocia,turkey',
          rating: 4.9,
        }
      ]
    },
    entertainment: {
      title: 'Eğlence Mekanları',
      description: 'En popüler eğlence mekanları ve aktiviteler',
      items: [
        {
          id: 'e1',
          name: 'İstiklal Caddesi',
          location: 'İstanbul',
          imageUrl: 'https://source.unsplash.com/random/800x600/?istanbul,street',
          rating: 4.6,
        },
        {
          id: 'e2',
          name: 'Boğaz Turu',
          location: 'İstanbul',
          imageUrl: 'https://source.unsplash.com/random/800x600/?bosphorus,cruise',
          rating: 4.8,
        },
        {
          id: 'e3',
          name: 'Antalya Aquarium',
          location: 'Antalya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?aquarium,fish',
          rating: 4.5,
        }
      ]
    },
    // Mevsim bazlı mock veriler
    winter: {
      title: 'Kış Rotaları',
      description: 'Kış mevsiminde ziyaret edebileceğiniz en iyi yerler',
      items: [
        {
          id: 'w1',
          name: 'Uludağ',
          location: 'Bursa, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?ski,snow,mountain',
          rating: 4.8,
        },
        {
          id: 'w2',
          name: 'Palandöken',
          location: 'Erzurum, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?winter,snow,resort',
          rating: 4.7,
        },
        {
          id: 'w3',
          name: 'Kartepe',
          location: 'Kocaeli, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?snow,forest,winter',
          rating: 4.5,
        },
        {
          id: 'w4',
          name: 'Davos',
          location: 'İsviçre',
          imageUrl: 'https://source.unsplash.com/random/800x600/?davos,switzerland,snow',
          rating: 4.9,
        },
        {
          id: 'w5',
          name: 'Innsbruck',
          location: 'Avusturya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?innsbruck,austria,winter',
          rating: 4.7,
        }
      ]
    },
    spring: {
      title: 'İlkbahar Rotaları',
      description: 'İlkbahar mevsiminde çiçeklenme ve doğanın uyanışını görebileceğiniz yerler',
      items: [
        {
          id: 's1',
          name: 'Amsterdam',
          location: 'Hollanda',
          imageUrl: 'https://source.unsplash.com/random/800x600/?amsterdam,tulips,spring',
          rating: 4.8,
        },
        {
          id: 's2',
          name: 'Kyoto',
          location: 'Japonya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?kyoto,japan,cherryblossom',
          rating: 4.9,
        },
        {
          id: 's3',
          name: 'Provence',
          location: 'Fransa',
          imageUrl: 'https://source.unsplash.com/random/800x600/?provence,france,lavender',
          rating: 4.7,
        },
        {
          id: 's4',
          name: 'Emirgan Korusu',
          location: 'İstanbul, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?istanbul,park,spring',
          rating: 4.6,
        },
        {
          id: 's5',
          name: 'Keukenhof',
          location: 'Hollanda',
          imageUrl: 'https://source.unsplash.com/random/800x600/?keukenhof,netherlands,flowers',
          rating: 4.9,
        }
      ]
    },
    summer: {
      title: 'Yaz Tatil Rotaları',
      description: 'Yaz mevsiminde deniz, kum ve güneşin tadını çıkarabileceğiniz yerler',
      items: [
        {
          id: 'su1',
          name: 'Ölüdeniz',
          location: 'Muğla, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?oludeniz,turkey,beach',
          rating: 4.9,
        },
        {
          id: 'su2',
          name: 'Santorini',
          location: 'Yunanistan',
          imageUrl: 'https://source.unsplash.com/random/800x600/?santorini,greece,island',
          rating: 4.8,
        },
        {
          id: 'su3',
          name: 'Maldivler',
          location: 'Maldivler',
          imageUrl: 'https://source.unsplash.com/random/800x600/?maldives,beach,resort',
          rating: 5.0,
        },
        {
          id: 'su4',
          name: 'Amalfi Sahili',
          location: 'İtalya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?amalfi,italy,coast',
          rating: 4.7,
        },
        {
          id: 'su5',
          name: 'Ibiza',
          location: 'İspanya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?ibiza,spain,beach',
          rating: 4.6,
        }
      ]
    },
    autumn: {
      title: 'Sonbahar Rotaları',
      description: 'Sonbahar mevsiminde renklerin dansını görebileceğiniz yerler',
      items: [
        {
          id: 'a1',
          name: 'Kyoto',
          location: 'Japonya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?kyoto,japan,autumn',
          rating: 4.9,
        },
        {
          id: 'a2',
          name: 'Vermont',
          location: 'ABD',
          imageUrl: 'https://source.unsplash.com/random/800x600/?vermont,usa,fall',
          rating: 4.8,
        },
        {
          id: 'a3',
          name: 'Yedigöller',
          location: 'Bolu, Türkiye',
          imageUrl: 'https://source.unsplash.com/random/800x600/?lake,forest,autumn',
          rating: 4.7,
        },
        {
          id: 'a4',
          name: 'Bavyera',
          location: 'Almanya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?bavaria,germany,autumn',
          rating: 4.6,
        },
        {
          id: 'a5',
          name: 'Edinburgh',
          location: 'İskoçya',
          imageUrl: 'https://source.unsplash.com/random/800x600/?edinburgh,scotland,autumn',
          rating: 4.7,
        }
      ]
    }
  };
  
  return mockCategories[categoryId] || {
    title: 'Kategori',
    description: 'Bir kategori açıklaması',
    items: []
  };
}; 