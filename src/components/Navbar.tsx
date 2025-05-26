import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Uygulama içindeki tüm route'ları tanımlayan tip
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

// Navigation için tip tanımı
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NavbarProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const Navbar = ({ activeTab, onChangeTab }: NavbarProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handleTabPress = (tab: string, screenName: keyof RootStackParamList) => {
    onChangeTab(tab);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'home' && styles.activeTab]} 
        onPress={() => handleTabPress('home', 'Home')}
      >
        <Ionicons name="home" size={24} color={activeTab === 'home' ? Colors.light.tint : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'favorite-border' && styles.activeTab]} 
        onPress={() => handleTabPress('favorite-border', 'Favorite')}
      >
        <MaterialIcons name="favorite-border" size={24} color={activeTab === 'favorite-border' ? Colors.light.tint : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'search' && styles.activeTab]} 
        onPress={() => handleTabPress('search', 'Search')}
      >
        <Ionicons name="search" size={24} color={activeTab === 'search' ? Colors.light.tint : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.tab, activeTab === 'logo-wechat' && styles.activeTab]} 
        onPress={() => handleTabPress('logo-wechat', 'SmartChat')}
      >
        <Ionicons name="logo-wechat" size={24} color={activeTab === 'logo-wechat' ? Colors.light.tint : '#999'} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'profile' && styles.activeTab]} 
        onPress={() => handleTabPress('profile', 'Profile')}
      >
        <Ionicons name="person" size={24} color={activeTab === 'profile' ? Colors.light.tint : '#999'} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingVertical: 5,
    height: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Aktif sekme için özel stil
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  activeTabText: {
    color: Colors.light.tint,
    fontWeight: '500',
  }
});

export default Navbar;