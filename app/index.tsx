import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnBoarding';
import MainScreen from '../screens/MainScreen';
import Favorite from '../screens/Favorite';
import Search from '../screens/Search';
import SmartChat from '../screens/SmartChat';
import Profile from '../screens/Profile';
import Notifications from '../screens/Notifications';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import CityGuideContent from '../components/CityGuide/CityGuideContent';
import ContentScreen from '../screens/ContentScreen';
import { RootStackParamList } from '../navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="SmartChat" component={SmartChat} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen 
          name="CityGuideContent" 
          component={CityGuideContent} 
          options={({ route }) => ({ 
            title: route.params.name || 'Şehir Detayı',
            headerShown: true 
          })} 
        />
        <Stack.Screen 
          name="Content" 
          component={ContentScreen} 
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
} 