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
      description: "Japonya'nın başkenti, teknoloji ve geleneklerin buluşma noktası.",
      image: require('../../assets/city/tokyo.jpg'),
    },
    {
      id: '002',
      name: 'Paris',
      description: "Fransa'nın başkenti, sanatın ve romantizmin şehri.",
      image: require('../../assets/city/paris.jpg'),
    },
    {
      id: '003',
      name: 'New York City',
      description: "Amerika'nın simge şehri, asla uyumayan şehir olarak bilinir.",
      image: require('../../assets/city/nyc.jpg'),
    },
    {
      id: '004',
      name: 'İstanbul',
      description: "Avrupa ve Asya'yı birleştiren tarihi ve kültürel bir merkez.",
      image: require('../../assets/city/istanbul.jpg'),
    },
    {
      id: '005',
      name: 'Barcelona',
      description: "İspanya'nın renkli şehri, Gaudí mimarisi ve sahilleriyle ünlü.",
      image: require('../../assets/city/barcelona.jpg'),
    },
    {
      id: '006',
      name: 'Cape Town',
      description: "Güney Afrika'da doğal güzellikleri ve Table Mountain ile tanınır.",
      image: require('../../assets/city/capetown.jpg'),
    },
    {
      id: '007',
      name: 'Roma',
      description: "İtalya'nın başkenti, antik yapıları ve tarihiyle ünlü.",
      image: require('../../assets/city/roma.jpg'),
    },
    {
      id: '008',
      name: 'Bali',
      description: "Endonezya'da tropikal bir cennet, plajları ve tapınaklarıyla meşhur.",
      image: require('../../assets/city/bali.jpg'),
    },
    {
      id: '009',
      name: 'Norveç',
      description: "Doğal güzellikleri, fiyortları ve kuzey ışıklarıyla ünlü İskandinav ülkesi.",
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