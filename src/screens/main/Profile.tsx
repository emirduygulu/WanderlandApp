import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/types';


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState('Kullanıcı');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Kullanıcı durumunu izle ve kullanıcı null olduğunda Login ekranına yönlendir
  useEffect(() => {
    if (user === null) {
      navigation.navigate('Login');
    } else if (user) {
      // Kullanıcı adını ayarla (Supabase user metadata'dan veya e-postadan)
      if (user.user_metadata && user.user_metadata.name) {
        setUserName(user.user_metadata.name);
      } else if (user.email) {
        const nameFromEmail = user.email.split('@')[0];
        setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
      
      // E-posta adresini ayarla
      if (user.email) {
        setUserEmail(user.email);
      }
    }
  }, [user, navigation]);

  const stats = [
    { title: 'Reward Points', value: '360' },
    { title: 'Travel Trips', value: '238' },
    { title: 'Bucket List', value: '473' },
  ];

  // Çıkış işlemi için ayrı bir fonksiyon oluşturuyoruz
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // useEffect içinde yönlendirme yapılacağı için burada navigation kullanmıyoruz
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: '👤', title: 'Profili Düzenle', onPress: () => navigation.navigate('EditProfile') },
    { icon: '🎭', title: 'Avatar Seç', onPress: () => navigation.navigate('AvatarSelector') },
    { icon: '🔖', title: 'Favoriler', onPress: () => navigation.navigate('Favorite') },
    { icon: '✈️', title: 'Önceki Seyahatler', onPress: () => {} },
    { icon: '⚙️', title: 'Ayarlar', onPress: () => navigation.navigate('Settings') },
    { icon: 'ℹ️', title: 'Versiyon', onPress: () => Alert.alert('Uygulama Versiyonu', 'Wanderland v1.0.0') },
    { icon: '🚪', title: 'Çıkış Yap', onPress: handleLogout },
  ];

  // Avatar değiştirme ekranına yönlendirme
  const handleAvatarChange = () => {
    navigation.navigate('AvatarSelector');
  };

  // Kullanıcı yoksa Loading gösterme yerine direkt boş bir sayfa döndürüyoruz
  // useEffect hook'u zaten yönlendirmeyi sağlayacak
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <TouchableOpacity onPress={handleAvatarChange}>
          <Avatar
            size={100}
            style={styles.profileImage}
          />
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarText}>Değiştir</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
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
            disabled={loading && item.title === 'Çıkış Yap'}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            {item.title === 'Çıkış Yap' && loading ? (
              <ActivityIndicator size="small" color="#FF6B00" />
            ) : (
              <Text style={styles.menuArrow}>{'>'}</Text>
            )}
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
    fontSize: 16,
    color: '#FF6B00',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    borderWidth: 3,
    borderColor: '#FF6B00',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  editAvatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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