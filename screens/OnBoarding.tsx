import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

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
      image: require('../assets/boarding/culturelimage.jpg'),
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wanderland</Text>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <Image source={slides[currentSlide].image} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
        </View>
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

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Başla' : 'İleri'}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color="#fff" 
            style={styles.nextIcon} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: Colors.light.text,
    fontFamily: 'Poppins-Bold',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: width * 0.95,
    height: height * 0.45,
    resizeMode: 'cover',
    borderRadius: 12,
    marginTop: 5,
  },
  contentContainer: {
    width: '100%',
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  nextButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextIcon: {
    marginLeft: 8,
  }
});

export default OnboardingScreen; 