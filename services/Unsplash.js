const UNSPLASH_ACCESS_KEY = 'MalVsThwwgVonpReaVqB04yFZNIFjP4O3Ee-IKjq85A'; 

export const fetchCityImage = async (city) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return null; // Görsel bulunamadı
    }
  } catch (error) {
    console.error('Unsplash API Hatası:', error);
    return null;
  }
};

// Landmark için görsel getir (şehir adı + landmark adı kombinasyonu)
export const fetchLandmarkImage = async (city, landmarkName) => {
  try {
    const query = `${landmarkName} ${city}`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      // Eğer landmark+şehir bulunamazsa sadece landmark ismiyle dene
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(landmarkName)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.results && fallbackData.results.length > 0) {
        return fallbackData.results[0].urls.regular;
      }
      return null;
    }
  } catch (error) {
    console.error('Unsplash API Landmark Hatası:', error);
    return null;
  }
};

// Landmark görsellerini ön yükleme fonksiyonu (performans için)
export const preloadLandmarkImages = async (landmarks) => {
  const imagePromises = {};
  
  for (const city in landmarks) {
    imagePromises[city] = [];
    
    for (const landmark of landmarks[city]) {
      const promise = fetchLandmarkImage(city, landmark.name);
      imagePromises[city].push(promise);
    }
  }
  
  // Tüm promise'ları bekle
  const results = {};
  for (const city in imagePromises) {
    results[city] = await Promise.all(imagePromises[city]);
  }
  
  return results;
};