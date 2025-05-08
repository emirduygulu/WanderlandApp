import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/OnBoarding";
import MainScreen from "../screens/MainScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Favorite from "@/screens/Favorite";
import Profile from "@/screens/Profile";
import Search from "@/screens/Search";
import SmartChat from "@/screens/SmartChat";
import Notifications from "@/screens/Notifications";

const Stack = createStackNavigator();

export default function Page() {
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
