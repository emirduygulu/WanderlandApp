import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  useEffect(() => {
    const checkLaunch = async () => {
      const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
      if (alreadyLaunched === null) {
        await AsyncStorage.setItem('alreadyLaunched', 'true');
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Main');
      }
    };
   checkLaunch();
  }, [navigation]);

  const handleStart = async () => {
    const alreadyLaunched = await AsyncStorage.getItem('alreadyLaunched');
    if (alreadyLaunched === null) {
      await AsyncStorage.setItem('alreadyLaunched', 'true');
      navigation.replace('Onboarding');
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.imageLogo} source={require("../assets/logo/wl-logonew.png")} />
      <Image style={styles.imageLogoText} source={require("../assets/logo/wl-textnew.png")} />
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startText}>Başla</Text>
        <Ionicons name="arrow-forward-circle-outline" size={24} color={Colors.light.background} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.light.background
  },
  imageLogo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },

  imageLogoText: {
    width: 250,
    height: 300,
    resizeMode: 'contain',
  },
  startButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',

  },
  icon: {
    marginLeft: 5
  }
});

export default SplashScreen;
