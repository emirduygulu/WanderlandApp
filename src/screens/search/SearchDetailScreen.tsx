import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import { SearchResult } from '../../services/SearchService';

type SearchDetailNavigationProp = StackNavigationProp<RootStackParamList, 'SearchDetail'>;

interface RouteParams {
  result: SearchResult;
}

// Genişletilmiş bilgiler için arayüz
interface ExtendedInfo {
  website?: string;
  phone?: string;
  openingHours?: string;
  priceLevel?: string;
  wikipediaUrl?: string;
  language?: 'tr' | 'en';
}

const SearchDetailScreen = () => {
  const navigation = useNavigation<SearchDetailNavigationProp>();
  const route = useRoute();
  const { result } = route.params as RouteParams;
  
  const [isFavorited, setIsFavorited] = useState(false);

  // Wiki URL'i varsa website olarak kullan
  const extendedInfo: ExtendedInfo = {
    ...(result.additionalInfo || {}),
    // Wikipedia URL'i varsa website olarak göster
    website: result.additionalInfo?.wikipediaUrl
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${result.name}\n\n${result.description}\n\nKonum: ${result.location.city || result.location.address || 'Bilinmiyor'}`,
        title: result.name,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleOpenLocation = () => {
    if (result.location.coordinates) {
      const { lat, lng } = result.location.coordinates;
      const url = `https://maps.google.com/?q=${lat},${lng}`;
      Linking.openURL(url);
    } else if (result.location.address) {
      const url = `https://maps.google.com/?q=${encodeURIComponent(result.location.address)}`;
      Linking.openURL(url);
    }
  };

  const handleOpenWebsite = () => {
    if (extendedInfo.website) {
      Linking.openURL(extendedInfo.website);
    }
  };

  const handleCall = () => {
    if (extendedInfo.phone) {
      Linking.openURL(`tel:${extendedInfo.phone}`);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Burada favorilere ekleme/çıkarma işlemi yapılabilir
  };

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      'landmark': 'location',
      'monument': 'library',
      'place': 'business',
      'city': 'map'
    };
    return icons[type as keyof typeof icons] || 'location';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'landmark': '#FF6B6B',
      'monument': '#4ECDC4',
      'place': '#45B7D1',
      'city': '#96CEB4'
    };
    return colors[type as keyof typeof colors] || '#FF6B6B';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'landmark': 'Turistik Yer',
      'monument': 'Anıt/Tarihi Yapı',
      'place': 'Mekan',
      'city': 'Şehir'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Kaynak etiketi düzeltme
  const getSourceLabel = (source: string) => {
    if (source === 'wikipedia') return 'Wikipedia';
    return 'Diğer Kaynak';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: result.imageUrl }} style={styles.heroImage} />
          
          {/* Header Overlay */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorited ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorited ? "#FF6B6B" : "#fff"} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(result.type) }]}>
            <Ionicons name={getTypeIcon(result.type)} size={16} color="#fff" />
            <Text style={styles.typeText}>{getTypeLabel(result.type)}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title and Rating */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{result.name}</Text>
            {result.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.ratingText}>{result.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          
          {/* Category and Source */}
          <View style={styles.metaContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{result.category}</Text>
            </View>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>
                {getSourceLabel(result.source)}
              </Text>
            </View>
          </View>

          {/* Location Info */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color={Colors.light.icon} />
            <View style={styles.locationContent}>
              <Text style={styles.locationText}>
                {result.location.city && result.location.country 
                  ? `${result.location.city}, ${result.location.country}`
                  : result.location.address || 'Konum bilgisi mevcut değil'
                }
              </Text>
              {result.location.coordinates && (
                <TouchableOpacity style={styles.directionsButton} onPress={handleOpenLocation}>
                  <Ionicons name="navigate" size={16} color="#fff" />
                  <Text style={styles.directionsText}>Yol Tarifi</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{result.description}</Text>
          </View>

          {/* Additional Info - Wikipedia bilgisi varsa */}
          {result.additionalInfo?.wikipediaUrl && (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.sectionTitle}>Detaylar</Text>
              
              <TouchableOpacity style={styles.infoItem} onPress={handleOpenWebsite}>
                <Ionicons name="globe-outline" size={20} color={Colors.light.icon} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={[styles.infoValue, styles.linkText]}>
                    Wikipedia
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>

              {result.additionalInfo?.language && (
                <View style={styles.infoItem}>
                  <Ionicons name="language-outline" size={20} color="#666" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Dil</Text>
                    <Text style={styles.infoValue}>
                      {result.additionalInfo.language === 'tr' ? 'Türkçe' : 'İngilizce'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
            
            <View style={styles.actionGrid}>
              {result.location.coordinates && (
                <TouchableOpacity style={styles.quickAction} onPress={handleOpenLocation}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#4ECDC420' }]}>
                    <Ionicons name="map" size={24} color="#4ECDC4" />
                  </View>
                  <Text style={styles.quickActionText}>Haritada Gör</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.quickAction} onPress={handleShare}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#45B7D120' }]}>
                  <Ionicons name="share-social" size={24} color="#45B7D1" />
                </View>
                <Text style={styles.quickActionText}>Paylaş</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAction} onPress={toggleFavorite}>
                <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B6B20' }]}>
                  <Ionicons 
                    name={isFavorited ? "heart" : "heart-outline"} 
                    size={24} 
                    color="#FF6B6B" 
                  />
                </View>
                <Text style={styles.quickActionText}>
                  {isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                </Text>
              </TouchableOpacity>

              {extendedInfo.website && (
                <TouchableOpacity style={styles.quickAction} onPress={handleOpenWebsite}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#96CEB420' }]}>
                    <Ionicons name="globe" size={24} color="#96CEB4" />
                  </View>
                  <Text style={styles.quickActionText}>Wikipedia</Text>
                </TouchableOpacity>
              )}
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  typeBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  contentContainer: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: Colors.light.icon + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryText: {
    color: Colors.light.icon,
    fontSize: 12,
    fontWeight: '600',
  },
  sourceBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  sourceText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  locationContent: {
    flex: 1,
    marginLeft: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.icon,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  directionsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  additionalInfoContainer: {
    marginBottom: 25,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  linkText: {
    color: Colors.light.icon,
  },
  actionsContainer: {
    marginBottom: 25,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginVertical: 5,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SearchDetailScreen; 