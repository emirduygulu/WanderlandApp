import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';


type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Sınırların Ötesinde Kültürleri Keşfet',
      description: 'Şehirlerin tarihine, mutfağına ve gizli hazinelerine ilham verici bir yolculuğa çık. Her yeri canlı kılan kültürel hikâyelere dal.',
      image: require('../assets/boarding/culturelimage.jpg'),
    },
    {
      id: 2,
      title: 'Dünyanın Lezzetlerini Tat',
      description: 'Sokak lezzetlerinden ikonik yemeklere kadar, her ülkenin mutfağını keşfet ve en iyi tatları nerede bulabileceğini öğren.',
      image: require('../assets/boarding/foodimage.jpg'),
    },
    {
      id: 3,
      title: 'Akıllı Seyahat Yardımcınla Tanış',
      description: 'Nereye gitsem, ne yesem diye mi düşünüyorsun? Yapay zeka destekli asistanımız sana özel önerilerle yolculuğunu planlasın.',
      image: require('../assets/boarding/foodimage.jpg'),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Main');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Atla</Text>
      </TouchableOpacity>

      <View style={styles.slideContainer}>
        <Image source={slides[currentSlide].image} style={styles.image} />
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentSlide === slides.length - 1 ? 'Başla' : 'İleri'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: Colors.light.tint,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.light.tint,
    width: 20,
  },
  nextButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen; 