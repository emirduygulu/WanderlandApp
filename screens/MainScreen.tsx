import React from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Favorite from './Favorite';
import Search from './Search';
import SmartChat from './SmartChat';
import Profile from './Profile';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Input from '../components/Input';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  Home: undefined;
  Favorite: undefined;
  Search: undefined;
  SmartChat: undefined;
  Profile: undefined;
  Notifications: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator();

// Diğer tab'lar için başlıklı wrapper
const TabScreenWrapper = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>{title}</Text>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

// Ana sayfa için bildirim ikonlu özel başlık
const HomeTabHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabTitle}>Wanderland</Text>
      <TouchableOpacity 
        style={styles.notificationIcon}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
      </TouchableOpacity>
    </View>
  );
};

// Ana sayfa içeriği
const HomeContent = () => {
  return (
    <View style={styles.homeContent}>
      <Text style={styles.welcomeText}>Wanderland'e Hoş Geldiniz</Text>
      <Text style={styles.subtitleText}>Seyahat deneyiminizi keşfedin</Text>
      
      {/* Buraya ana sayfa içeriği eklenebilir */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Öne Çıkan Yerler</Text>
        {/* Öne çıkan yerler buraya gelecek */}
      </View>
      <Input />
    </View>
  );
};

// Ana sayfa wrapper
const HomeWrapper = () => {
  return (
    <View style={styles.screenContainer}>
      <HomeTabHeader />
      <View style={styles.content}>
        <HomeContent />
      </View>
    </View>
  );
};

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#EFEFEF',
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="home" size={24} color={focused ? Colors.light.tint : '#999'} />
            ),
          }}
        >
          {() => <HomeWrapper />}
        </Tab.Screen>
        <Tab.Screen
          name="FavoriteTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons name="favorite-border" size={24} color={focused ? Colors.light.tint : '#999'} />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Favoriler">
              <Favorite />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SearchTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="search" size={24} color={focused ? Colors.light.tint : '#999'} />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Arama">
              <Search />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SmartChatTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="logo-wechat" size={24} color={focused ? Colors.light.tint : '#999'} />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="SmartTraveller">
              <SmartChat />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="ProfileTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name="person" size={24} color={focused ? Colors.light.tint : '#999'} />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Profil">
              <Profile />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabHeader: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: Colors.light.background,
    position: 'relative',
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  notificationIcon: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  featuredSection: {
    width: '100%',
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 15,
  }
});

export default MainScreen; 