import * as Location from 'expo-location';

export const getUserLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return null;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Default koordinatlar (konum alınamadığında kullanılabilir)
export const getDefaultLocation = () => {
  return {
    latitude: 41.0082, // İstanbul (varsayılan)
    longitude: 28.9784,
  };
};

// Popüler şehirler için koordinatlar
export const getPopularCityLocations = () => {
  return [
    {
      id: 'istanbul',
      name: 'İstanbul',
      latitude: 41.0082,
      longitude: 28.9784,
    },
    {
      id: 'ankara',
      name: 'Ankara',
      latitude: 39.9334,
      longitude: 32.8597,
    },
    {
      id: 'izmir',
      name: 'İzmir',
      latitude: 38.4237,
      longitude: 27.1428,
    },
    {
      id: 'antalya',
      name: 'Antalya',
      latitude: 36.8969,
      longitude: 30.7133,
    },
    {
      id: 'kapadokya',
      name: 'Kapadokya',
      latitude: 38.6431,
      longitude: 34.8266,
    },
    {
      id: 'paris',
      name: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    {
      id: 'rome',
      name: 'Roma',
      latitude: 41.9028,
      longitude: 12.4964,
    },
    {
      id: 'newyork',
      name: 'New York',
      latitude: 40.7128,
      longitude: -74.0060,
    },
  ];
};