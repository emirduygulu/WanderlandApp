import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Main: undefined;
};

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
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
    // checkLaunch();
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
      <Image style={styles.imageLogo} source={require("../assets/logo/wl-logo2.png")} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Wanderland</Text>
      </View>
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
    width: 375,
    height: 375,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 40
  },
  textContainer: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 40
  },
  text: {
    fontSize: 40,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
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
