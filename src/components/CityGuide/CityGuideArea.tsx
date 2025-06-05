import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { City, fetchPopularCities } from '../../services/CityGuideService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CityGuideContent'>;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;

/**
 * Görsel source'unu belirle (local asset veya remote URL)
 */
const getImageSource = (imageUrl: any) => {
  // Eğer number ise (require() sonucu), local asset
  if (typeof imageUrl === 'number') {
    return imageUrl;
  }
  
  // Eğer string ise, remote URL
  if (typeof imageUrl === 'string') {
    return { uri: imageUrl };
  }
  
  // Fallback
  return require('../../assets/city/placeholder.png');
};

const CityGuideArea = () => {
  const navigation = useNavigation<NavigationProp>();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const citiesData = await fetchPopularCities();
      setCities(citiesData);
      console.log('🏙️ Loaded cities in CityGuideArea:', citiesData.map(c => ({ 
        name: c.name, 
        imageType: typeof c.imageUrl 
      })));
    } catch (err) {
      console.error('Error loading cities:', err);
      setError('Şehir verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityPress = (city: City) => {
    navigation.navigate('CityGuideContent', {
      id: city.id,
      name: city.name,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Şehirler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCities}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Dünyayı Keşfetmeye Başla</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={ITEM_WIDTH + 20}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {cities.map((city) => (
          <TouchableOpacity 
            key={city.id} 
            style={styles.cityCard}
            onPress={() => handleCityPress(city)}
          >
            <View style={styles.cityImageContainer}>
              <Image 
                source={getImageSource(city.imageUrl)}
                style={styles.cityImage}
                defaultSource={require('../../assets/city/placeholder.png')}
                onError={(error) => {
                  console.log(`❌ Image error for ${city.name}:`, error.nativeEvent.error);
                }}
                onLoad={() => {
                  console.log(`✅ Image loaded for ${city.name}`);
                }}
              />
            </View>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.cityDescription}>{city.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CityGuideArea;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  errorText: {
    color: '#E17055',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  cityCard: {
    width: ITEM_WIDTH,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityImageContainer: {
    height: 150,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  cityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cityInfo: {
    padding: 15,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cityDescription: {
    fontSize: 14,
    color: '#666',
  },
});