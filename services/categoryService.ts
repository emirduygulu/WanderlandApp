// Category API Service
import { searchFSQPlaces, getFSQPlaceDetails } from './Foursquare';
import { searchOTMPlaces, getOTMPlaceDetails } from './OneTripMap';
import { getDefaultLocation } from './Location';

// Types
export interface PlaceItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
}

export interface CategoryData {
  title: string;
  description: string;
  items: PlaceItem[];
}

// Kategori tanımlamaları - kullanılabilecek kategoriler
type CategoryIds = 'mountain' | 'beach' | 'historical' | 'entertainment';

// Kategori veri yapısı
interface CategoryInfo {
  title: string;
  description: string;
  fsqQuery: string;
  otmCategory: string;
}

// Kategori tanımlamaları
const categoryMapping: Record<CategoryIds, CategoryInfo> = {
  mountain: {
    title: 'Doğa Rotaları',
    description: 'En popüler doğa rotaları ve keşfedilecek yerler',
    fsqQuery: 'orman parkı milli park doğa',
    otmCategory: 'natural',
  },
  beach: {
    title: 'En İyi Plajlar',
    description: 'Türkiye\'nin en güzel plajları ve sahil bölgeleri',
    fsqQuery: 'plaj deniz sahil',
    otmCategory: 'beaches',
  },
  historical: {
    title: 'Tarihi Yerler',
    description: 'Türkiye\'nin zengin tarihi ve kültürel mirasları',
    fsqQuery: 'tarihi müze antik',
    otmCategory: 'cultural,historic',
  },
  entertainment: {
    title: 'Eğlence Mekanları',
    description: 'En popüler eğlence mekanları ve aktiviteler',
    fsqQuery: 'eğlence tema parkı aquapark',
    otmCategory: 'amusements',
  }
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
    const location = getDefaultLocation();
    const { latitude, longitude } = location;
    const category = categoryMapping[validCategoryId];
    
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
    }
  };

  const validCategoryId = categoryId as CategoryIds;
  const defaultCategory = categoryMapping[validCategoryId] || {
    title: 'Kategori',
    description: 'Kategori bulunamadı',
  };

  return mockCategories[categoryId] || {
    title: defaultCategory.title,
    description: defaultCategory.description,
    items: []
  };
}; 