import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CityGuideContent from '../components/CityGuide/CityGuideContent';
import LoginScreen from '../screens/auth/LoginPage';
import RegisterScreen from '../screens/auth/Register';
import BlogDetailScreen from '../screens/blog/BlogDetailScreen';
import CreateBlogScreen from '../screens/blog/CreateBlogScreen';
import TravelBlogScreen from '../screens/blog/TravelBlogScreen';
import Favorite from '../screens/main/Favorite';
import MainScreen from '../screens/main/MainScreen';
import Notifications from '../screens/main/Notifications';
import Profile from '../screens/main/Profile';
import Search from '../screens/main/Search';
import SmartChat from '../screens/main/SmartChat';
import CategoryDetailScreen from '../screens/modals/CategoryDetailScreen';
import ContentScreen from '../screens/modals/ContentScreen';
import OnboardingScreen from '../screens/OnBoarding';
import AvatarSelector from '../screens/profile/AvatarSelector';
import EditProfile from '../screens/profile/EditProfile';
import Settings from '../screens/profile/Settings';
import SplashScreen from '../screens/SplashScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="SmartChat" component={SmartChat} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AvatarSelector" component={AvatarSelector} />
      <Stack.Screen name="Settings" component={Settings} />
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
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
      <Stack.Screen name="CreateBlog" component={CreateBlogScreen} />
      <Stack.Screen name="TravelBlogScreen" component={TravelBlogScreen} />
    </Stack.Navigator>
  );
}; 