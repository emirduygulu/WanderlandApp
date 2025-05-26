import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      // Kullanıcı oturum açmamış, profil sayfasını görmeden Login ekranına yönlendir
      navigation.navigate('Login');
    } else {
      setIsLoggedIn(true);
    }
  };

  const stats = [
    { title: 'Reward Points', value: '360' },
    { title: 'Travel Trips', value: '238' },
    { title: 'Bucket List', value: '473' },
  ];

  const menuItems = [
    { icon: '👤', title: 'Profile', onPress: () => {} },
    { icon: '🔖', title: 'Bookmarked', onPress: () => {} },
    { icon: '✈️', title: 'Previous Trips', onPress: () => {} },
    { icon: '⚙️', title: 'Settings', onPress: () => {} },
    { icon: 'ℹ️', title: 'Version', onPress: () => {} },
    { icon: '🚪', title: 'Logout', onPress: async () => {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      navigation.navigate('Login');
    }},
  ];

  // Eğer kullanıcı oturum açmamışsa loading veya boş bir içerik göster
  if (!isLoggedIn) {
    return <View style={styles.loadingContainer}></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image
          source={require('../../assets/icon/avatar.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Leonardo</Text>
        <Text style={styles.email}>leonardo@gmail.com</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Text style={styles.menuArrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  editButton: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FF6B00',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#000',
  },
  menuArrow: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;