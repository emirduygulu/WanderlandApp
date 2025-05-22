import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Tip tanımları
type CityType = {
  id: string;
  name: string;
  description: string;
  image: any; // require() ile kullanım için 'any' tipi
};

type RootStackParamList = {
  CityGuideContent: { name: string; description: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'CityGuideContent'>;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6;

const CityGuideArea = () => {
  const navigation = useNavigation<NavigationProp>();

  const cities: CityType[] = [
    {
      id: '001',
      name: 'Tokyo',
      description: "Japonya'nın başkenti, modern teknoloji ve geleneksel kültürün muhteşem uyumu.",
      image: require('../../assets/city/tokyo.jpg'),
    },
    {
      id: '002',
      name: 'Paris',
      description: "Fransa'nın romantik başkenti, sanat, moda ve gastronomi merkezi.",
      image: require('../../assets/city/paris.jpg'),
    },
    {
      id: '003',
      name: 'New York City',
      description: "Amerika'nın simge şehri, çok kültürlü yapısı ve ikonik gökdelenleriyle ünlü.",
      image: require('../../assets/city/nyc.jpg'),
    },
    {
      id: '004',
      name: 'London',
      description: "İngiltere'nin tarihi başkenti, kültürel çeşitliliği ve görkemli mimarisiyle dikkat çekiyor.",
      image: require('../../assets/city/istanbul.jpg'),
    },
    {
      id: '005',
      name: 'Barcelona',
      description: "İspanya'nın renkli şehri, Gaudi mimarisi ve canlı atmosferiyle büyüleyici.",
      image: require('../../assets/city/barcelona.jpg'),
    },
    {
      id: '006',
      name: 'Cape Town',
      description: "Güney Afrika'nın masa dağı manzaralı, çeşitli kültürlerin buluştuğu liman şehri.",
      image: require('../../assets/city/capetown.jpg'),
    },
    {
      id: '007',
      name: 'Rome',
      description: "İtalya'nın başkenti, antik tarihi, sanatı ve lezzetli mutfağıyla büyüleyici.",
      image: require('../../assets/city/roma.jpg'),
    },
    {
      id: '008',
      name: 'Bali',
      description: "Endonezya'nın cennet adası, tropikal plajları ve zengin kültürel mirası ile misafirperver.",
      image: require('../../assets/city/bali.jpg'),
    },
    {
      id: '009',
      name: 'Norway',
      description: "Muhteşem fiyortları, kuzey ışıkları ve etkileyici doğal manzaralarıyla İskandinav cenneti.",
      image: require('../../assets/city/norway.jpg'),
    },
  ];

  const handleCityPress = (city: CityType) => {
    navigation.navigate('CityGuideContent', {
      name: city.name,
      description: city.description,
    });
  };

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
              <Image source={city.image} style={styles.cityImage} />
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