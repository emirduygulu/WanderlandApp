// SeasonalCitiesService.ts - Mevsimsel şehir önerileri servisi

export interface SeasonalCity {
  id: string;
  name: string;
  country: string;
  description: string;
  highlights: string[];
  bestMonths: string[];
  averageTemp: string;
  imageUrl: string;
  rating: number;
}

export interface SeasonData {
  title: string;
  description: string;
  cities: SeasonalCity[];
  generalTips: string[];
}

// Genişletilmiş mevsimsel şehir verileri
const EXTENDED_SEASONAL_CITIES = {
  winter: [
    {
      id: 'zurich_winter',
      name: 'Zürih',
      country: 'İsviçre',
      description: 'Alp Dağları\'nın eteklerinde kar sporları ve romantik kış atmosferi için idealdir. Noel pazarları ve sıcak çikolata deneyimi unutulmazdır.',
      highlights: ['Kayak ve Snowboard', 'Alp Manzarası', 'Noel Pazarları', 'Termal Banyolar'],
      bestMonths: ['Aralık', 'Ocak', 'Şubat'],
      averageTemp: '-2°C ile 5°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 'salzburg_winter',
      name: 'Salzburg',
      country: 'Avusturya',
      description: 'Mozart\'ın doğum yeri, kar altında daha da büyüleyici. Barok mimari ve kar sporları bir arada.',
      highlights: ['Hohensalzburg Kalesi', 'Mozart Müzesi', 'Kar Sporları', 'Klassik Müzik'],
      bestMonths: ['Aralık', 'Ocak', 'Şubat'],
      averageTemp: '-3°C ile 4°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 'reykjavik_winter',
      name: 'Reykjavik',
      country: 'İzlanda',
      description: 'Kuzey ışıkları ve jeotermal kaynaklar için mükemmel destinasyon. Doğal güzellikler kış aylarında daha etkileyici.',
      highlights: ['Kuzey Işıkları', 'Blue Lagoon', 'Jeotermal Havuzlar', 'Buzul Mağaraları'],
      bestMonths: ['Kasım', 'Aralık', 'Ocak', 'Şubat'],
      averageTemp: '-1°C ile 3°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1539066319547-6c0d014b2b5e?q=80&w=800&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 'prague_winter',
      name: 'Prag',
      country: 'Çek Cumhuriyeti',
      description: 'Kar altında masalsı görünen tarihi sokaklar ve sıcak şarap içebileceğiniz geleneksel kafeler.',
      highlights: ['Charles Köprüsü', 'Prag Kalesi', 'Sıcak Şarap', 'Tarihi Merkez'],
      bestMonths: ['Aralık', 'Ocak', 'Şubat'],
      averageTemp: '-2°C ile 4°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1578922747193-8e9ec0abfb6d?q=80&w=800&auto=format&fit=crop',
      rating: 4.6
    }
  ],
  spring: [
    {
      id: 'paris_spring',
      name: 'Paris',
      country: 'Fransa',
      description: 'Çiçeklenen ağaçlar ve parklar ile romantizmin başkenti. Açık hava kafeleri ve Seine nehri kıyısında keyifli yürüyüşler.',
      highlights: ['Tuileries Bahçeleri', 'Seine Nehri Turu', 'Açık Hava Kafeleri', 'Lale Zamanı'],
      bestMonths: ['Mart', 'Nisan', 'Mayıs'],
      averageTemp: '10°C ile 18°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=800&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 'istanbul_spring',
      name: 'İstanbul',
      country: 'Türkiye',
      description: 'Lale festivali zamanı şehir bir renk cümbüşüne dönüşür. Ilıman hava turistik yerleri gezmek için ideal.',
      highlights: ['Lale Festivali', 'Emirgan Parkı', 'Boğaz Turu', 'Baharda Türk Çayı'],
      bestMonths: ['Nisan', 'Mayıs'],
      averageTemp: '12°C ile 20°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=800&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 'amsterdam_spring',
      name: 'Amsterdam',
      country: 'Hollanda',
      description: 'Lale mevsimi ve renkli çiçek bahçeleri. Keukenhof bahçeleri ve kanal turu için mükemmel zaman.',
      highlights: ['Keukenhof Bahçeleri', 'Kanal Turu', 'Bisiklet Gezisi', 'Çiçek Pazarları'],
      bestMonths: ['Nisan', 'Mayıs'],
      averageTemp: '8°C ile 16°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1583251032774-33a5b1e69e93?q=80&w=800&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 'kyoto_spring',
      name: 'Kyoto',
      country: 'Japonya',
      description: 'Kiraz çiçeği (sakura) festivali ile ünlü. Geleneksel Japon bahçeleri ve tapınakları çiçeklerle süslenir.',
      highlights: ['Kiraz Çiçeği', 'Bamboo Forest', 'Geleneksel Bahçeler', 'Tapınaklar'],
      bestMonths: ['Mart', 'Nisan', 'Mayıs'],
      averageTemp: '10°C ile 18°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=800&auto=format&fit=crop',
      rating: 4.9
    }
  ],
  summer: [
    {
      id: 'barcelona_summer',
      name: 'Barcelona',
      country: 'İspanya',
      description: 'Akdeniz sahilleri, Gaudí\'nin eserleri ve canlı gece hayatı. Plajlar ve tapas için ideal sezon.',
      highlights: ['Barceloneta Plajı', 'Sagrada Familia', 'Park Güell', 'Tapas ve Sangria'],
      bestMonths: ['Haziran', 'Temmuz', 'Ağustos'],
      averageTemp: '20°C ile 28°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 'antalya_summer',
      name: 'Antalya',
      country: 'Türkiye',
      description: 'Turkuaz suları ve altın kumlu plajları. Antik kentler ve su sporları bir arada.',
      highlights: ['Konyaaltı Plajı', 'Kaleiçi', 'Aspendos', 'Su Sporları'],
      bestMonths: ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül'],
      averageTemp: '25°C ile 32°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 'santorini_summer',
      name: 'Santorini',
      country: 'Yunanistan',
      description: 'Beyaz evler, mavi kubbeler ve nefes kesen gün batımları. Romantik tatil için mükemmel.',
      highlights: ['Oia Günbatımı', 'Beyaz Evler', 'Volkanik Plajlar', 'Yunan Mutfağı'],
      bestMonths: ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül'],
      averageTemp: '22°C ile 28°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 'venice_summer',
      name: 'Venedik',
      country: 'İtalya',
      description: 'Gondol turları ve canlı yaz festivalleri. Sıcak akşamlarda San Marco Meydanı\'nda müzik.',
      highlights: ['Gondol Turu', 'San Marco Meydanı', 'Murano Adası', 'İtalyan Gelato'],
      bestMonths: ['Mayıs', 'Haziran', 'Temmuz', 'Ağustos'],
      averageTemp: '20°C ile 27°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=800&auto=format&fit=crop',
      rating: 4.6
    }
  ],
  autumn: [
    {
      id: 'london_autumn',
      name: 'Londra',
      country: 'İngiltere',
      description: 'Sonbahar yaprakları ve müze sezonunun başlangıcı. Pub kültürü ve tiyatro gösterileri.',
      highlights: ['Hyde Park', 'British Museum', 'Tiyatro Sezonu', 'Pub Kültürü'],
      bestMonths: ['Eylül', 'Ekim', 'Kasım'],
      averageTemp: '8°C ile 15°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 'newyork_autumn',
      name: 'New York',
      country: 'ABD',
      description: 'Central Park\'ın sonbahar renkleri ve Broadway sezonu. Alışveriş ve sanat için ideal.',
      highlights: ['Central Park', 'Broadway Show', 'Metropolitan Museum', 'Fifth Avenue'],
      bestMonths: ['Eylül', 'Ekim', 'Kasım'],
      averageTemp: '10°C ile 18°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=800&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 'tokyo_autumn',
      name: 'Tokyo',
      country: 'Japonya',
      description: 'Momiji (sonbahar yaprakları) festivali. Japon bahçeleri kızıl ve sarı renklere bürünür.',
      highlights: ['Momiji Avlama', 'Japon Bahçeleri', 'Sıcak Ramen', 'Tapınaklar'],
      bestMonths: ['Ekim', 'Kasım'],
      averageTemp: '12°C ile 20°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 'bruges_autumn',
      name: 'Brügge',
      country: 'Belçika',
      description: 'Ortaçağ\'dan kalma sokaklar ve kanal kenarundan sonbahar manzaraları. Çikolata ve bira deneyimi.',
      highlights: ['Ortaçağ Mimarisi', 'Kanal Turu', 'Belçika Çikolatası', 'Bira Tadımı'],
      bestMonths: ['Eylül', 'Ekim'],
      averageTemp: '8°C ile 16°C arası',
      imageUrl: 'https://images.unsplash.com/photo-1559564484-3a6b98bd9ba5?q=80&w=800&auto=format&fit=crop',
      rating: 4.6
    }
  ]
};

// Genel mevsimsel ipuçları
const SEASONAL_TIPS = {
  winter: [
    'Kat kat giyinin ve su geçirmez botlar tercih edin',
    'Erken kararmaya karşı gün programınızı erkenden yapın',
    'Sıcak içecekler ve yerel kış lezzetlerini deneyin',
    'Müze ve kapalı alanlar için daha fazla zaman ayırın'
  ],
  spring: [
    'Değişken havalar için hem ince hem kalın kıyafet alın',
    'Çiçek festivalleri için önceden bilgi alın',
    'Açık hava aktiviteleri için güneş kremi unutmayın',
    'Yağmur yağması ihtimaline karşı şemsiye taşıyın'
  ],
  summer: [
    'Bol su için ve güneş koruyucu kullanın',
    'Erken saatlerde açık hava aktivitelerini tercih edin',
    'Hafif renkli ve nefes alan kumaşlar seçin',
    'Sıcaklığa karşı kliması olan mekanları tercih edin'
  ],
  autumn: [
    'Rüzgarlık ve orta kalınlıkta ceketler alın',
    'Erken hava kararmalarına karşı program yapın',
    'Sonbahar fotoğrafları için kamera hazırlayın',
    'Sıcak içecek deneyimi için yerel kafeleri keşfedin'
  ]
};

// Ana fonksiyon - Mevsimsel şehir verilerini getir
export const getSeasonalCities = (season: 'winter' | 'spring' | 'summer' | 'autumn'): SeasonData => {
  const cities = EXTENDED_SEASONAL_CITIES[season] || [];
  
  const seasonNames = {
    winter: 'Kış Rotaları',
    spring: 'İlkbahar Rotaları', 
    summer: 'Yaz Tatil Rotaları',
    autumn: 'Sonbahar Rotaları'
  };
  
  const seasonDescriptions = {
    winter: 'Kar manzaraları, kayak sporları ve sıcak atmosferler için en iyi şehirler',
    spring: 'Çiçeklenme ve doğanın uyanışını görebileceğiniz en güzel destinasyonlar',
    summer: 'Deniz, güneş ve yaz eğlencesi için mükemmel tatil şehirleri',
    autumn: 'Sonbahar renkleri ve sakin atmosfer için ideal seyahat noktaları'
  };
  
  return {
    title: seasonNames[season],
    description: seasonDescriptions[season],
    cities: cities,
    generalTips: SEASONAL_TIPS[season]
  };
};

// Tüm mevsimlerin özetini getir
export const getAllSeasonsOverview = (): Array<{season: string, title: string, cityCount: number}> => {
  return [
    { season: 'winter', title: 'Kış Rotaları', cityCount: EXTENDED_SEASONAL_CITIES.winter.length },
    { season: 'spring', title: 'İlkbahar Rotaları', cityCount: EXTENDED_SEASONAL_CITIES.spring.length },
    { season: 'summer', title: 'Yaz Tatil Rotaları', cityCount: EXTENDED_SEASONAL_CITIES.summer.length },
    { season: 'autumn', title: 'Sonbahar Rotaları', cityCount: EXTENDED_SEASONAL_CITIES.autumn.length }
  ];
};

// Belirli bir şehri tüm mevsimlerde ara
export const findCityInAllSeasons = (cityName: string): Array<{season: string, city: SeasonalCity}> => {
  const results: Array<{season: string, city: SeasonalCity}> = [];
  
  Object.entries(EXTENDED_SEASONAL_CITIES).forEach(([season, cities]) => {
    const foundCity = cities.find(city => 
      city.name.toLowerCase().includes(cityName.toLowerCase())
    );
    if (foundCity) {
      results.push({ season, city: foundCity });
    }
  });
  
  return results;
};

export default {
  getSeasonalCities,
  getAllSeasonsOverview,
  findCityInAllSeasons
}; 