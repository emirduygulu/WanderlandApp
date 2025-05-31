import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const Settings = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  // Örnek ayarlar durumları
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [languagePreference, setLanguagePreference] = useState('Türkçe');
  
  // Dil seçimi için
  const handleLanguageSelection = () => {
    Alert.alert(
      'Dil Seçimi',
      'Şu an sadece Türkçe dil desteği bulunmaktadır. Daha fazla dil desteği yakında eklenecektir.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };
  
  // Uygulama hakkında bilgi
  const handleAbout = () => {
    Alert.alert(
      'Wanderland Hakkında',
      'Wanderland, dünyayı keşfetmek isteyenler için geliştirilmiş bir seyahat asistanı uygulamasıdır.\n\nVersiyon: 1.0.0\n\n© 2023 Wanderland',
      [{ text: 'Tamam', style: 'default' }]
    );
  };
  
  // Yardım ve destek
  const handleHelp = () => {
    Alert.alert(
      'Yardım & Destek',
      'Sorunlarınız veya sorularınız için support@wanderlandapp.com adresine e-posta gönderebilirsiniz.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Bildirimler */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Bildirimler</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Bildirimleri Etkinleştir</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {/* Görünüm */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Görünüm</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Karanlık Mod</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: '#D1D1D6', true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {/* Gizlilik */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Gizlilik</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Konum Erişimi</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#D1D1D6', true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {/* Dil */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Dil</Text>
        </View>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelection}>
          <Text style={styles.settingLabel}>Uygulama Dili</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{languagePreference}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </View>
        </TouchableOpacity>
        
        {/* Diğer */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Diğer</Text>
        </View>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <Text style={styles.settingLabel}>Uygulama Hakkında</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
          <Text style={styles.settingLabel}>Yardım & Destek</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Wanderland v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 10,
  },
  sectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    color: '#999',
    marginRight: 5,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default Settings;