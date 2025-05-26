import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

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

const notificationsData = [
  { id: '1', text: 'Yeni bir mesajınız var', time: '10 dk önce' },
  { id: '2', text: 'Profilinizi güncelleyin', time: '2 saat önce' },
  { id: '3', text: 'Yeni seyahat önerileri', time: '1 gün önce' },
]

const Notifications = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Bildirimler</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={notificationsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.notificationText}>{item.text}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  }
})

export default Notifications 