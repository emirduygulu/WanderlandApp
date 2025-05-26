import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { City, Landmark, fetchCityDetails } from '../../services/CityGuideService';

type CityGuideContentRouteProp = RouteProp<RootStackParamList, 'CityGuideContent'>;
type CityGuideContentNavigationProp = StackNavigationProp<RootStackParamList, 'CityGuideContent'>;

// Ekran genişliğini al - responsive tasarım için
const screenWidth = Dimensions.get('window').width;

const CityGuideContent: React.FC = () => {
  const route = useRoute<CityGuideContentRouteProp>();
  const navigation = useNavigation<CityGuideContentNavigationProp>();
  const { id, name } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityData, setCityData] = useState<City | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    loadCityDetails();
  }, [id, name]);

  const loadCityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCityDetails(id, name);
      setCityData(data);
    } catch (err) {
      console.error('Error loading city details:', err);
      setError('Şehir detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToContent = (landmark: Landmark) => {
    navigation.navigate('Content', {
      item: {
        id: landmark.id,
        name: landmark.name,
        location: name, 
        description: landmark.description,
        rating: 4.5, // Varsayılan değer
        reviews: 100, // Varsayılan değer
        distance: "Şehir içi",
        imageUrl: landmark.imageUrl,
        images: [{ id: '1', uri: landmark.imageUrl }]
      }
    });
  };

  // Landmark kartı - liste görünümü
  const renderLandmarkListItem = ({ item }: { item: Landmark }) => (
    <TouchableOpacity 
      style={styles.landmarkListCard}
      onPress={() => navigateToContent(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.landmarkListImage} 
        defaultSource={require('../../assets/city/placeholder.png')}
      />
      <View style={styles.landmarkListInfo}>
        <Text style={styles.landmarkName}>{item.name}</Text>
        <Text style={styles.landmarkCategory}>{item.category || 'Turistik Yer'}</Text>
        <Text numberOfLines={2} style={styles.landmarkShortDesc}>
          {item.description.length > 100 
            ? `${item.description.substring(0, 100)}...` 
            : item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Landmark kartı - grid görünümü
  const renderLandmarkGridItem = ({ item }: { item: Landmark }) => (
    <TouchableOpacity 
      style={styles.landmarkGridCard}
      onPress={() => navigateToContent(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.landmarkGridImage} 
        defaultSource={require('../../assets/city/placeholder.png')}
      />
      <View style={styles.landmarkGridInfo}>
        <Text style={styles.landmarkGridName}>{item.name}</Text>
        <Text style={styles.landmarkGridCategory}>{item.category || 'Turistik Yer'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>{name} bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (error || !cityData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Beklenmeyen bir hata oluştu.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCityDetails}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {/* Şehir Görseli */}
          <Image 
            source={{ uri: cityData.imageUrl }} 
            style={styles.cityImage} 
            defaultSource={require('../../assets/city/placeholder.png')}
          />
        
          {/* Şehir Bilgileri */}
          <Text style={styles.title}>{cityData.name}</Text>
          <Text style={styles.description}>{cityData.description}</Text>
          
          {/* Popüler Yerler */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popüler Yerler</Text>
              
              {/* Görünüm geçiş butonları */}
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={[styles.toggleButton, activeTab === 'list' && styles.activeToggle]}
                  onPress={() => setActiveTab('list')}
                >
                  <Ionicons name="list" size={20} color={activeTab === 'list' ? "#FF6B00" : "#999"} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleButton, activeTab === 'grid' && styles.activeToggle]}
                  onPress={() => setActiveTab('grid')}
                >
                  <Ionicons name="grid" size={20} color={activeTab === 'grid' ? "#FF6B00" : "#999"} />
                </TouchableOpacity>
              </View>
            </View>
            
            {cityData.landmarks && cityData.landmarks.length > 0 ? (
              activeTab === 'list' ? (
                <FlatList
                  data={cityData.landmarks}
                  renderItem={renderLandmarkListItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  style={styles.landmarkListContainer}
                />
              ) : (
                <FlatList
                  data={cityData.landmarks}
                  renderItem={renderLandmarkGridItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  columnWrapperStyle={styles.gridColumnWrapper}
                  scrollEnabled={false}
                  style={styles.landmarkGridContainer}
                />
              )
            ) : (
              <Text style={styles.emptyText}>
                Bu şehir için kayıtlı turistik nokta bulunamadı.
              </Text>
            )}
          </View>
          
          {/* Pratik Bilgiler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pratik Bilgiler</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="airplane-outline" size={20} color="#FF6B00" style={styles.infoIcon} />
              <Text style={styles.infoText}>En yakın havalimanını öğrenmek için haritayı kontrol edin.</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="bus-outline" size={20} color="#FF6B00" style={styles.infoIcon} />
              <Text style={styles.infoText}>Şehir içi ulaşımda toplu taşıma veya taksi kullanabilirsiniz.</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={20} color="#FF6B00" style={styles.infoIcon} />
              <Text style={styles.infoText}>Yerel lezzetleri denemeyi unutmayın.</Text>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: '#E17055',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  cityImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2
  },
  toggleButton: {
    padding: 6,
    borderRadius: 6
  },
  activeToggle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  // Liste görünümü stilleri
  landmarkListContainer: {
    marginTop: 8,
  },
  landmarkListCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  landmarkListImage: {
    width: 120,
    height: 120,
  },
  landmarkListInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between'
  },
  landmarkShortDesc: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    lineHeight: 18
  },
  // Grid görünümü stilleri
  landmarkGridContainer: {
    marginTop: 8,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  landmarkGridCard: {
    width: (screenWidth - 40) / 2, 
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden'
  },
  landmarkGridImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  landmarkGridInfo: {
    padding: 10,
  },
  landmarkGridName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  landmarkGridCategory: {
    fontSize: 12,
    color: '#666',
  },
  // Ortak stiller
  landmarkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  landmarkCategory: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
});

export default CityGuideContent;