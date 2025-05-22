import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface ImageGalleryItem {
  id: string;
  uri: string;
}

interface ContentPageProps {
  id?: string;
  name: string;
  location: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  amenities?: number;
  images: ImageGalleryItem[];
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const ContentPage: React.FC<ContentPageProps> = ({
  name,
  location,
  description,
  rating,
  reviews,
  distance,
  amenities,
  images,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const navigation = useNavigation();
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoritePress = () => {
    setFavorite(!favorite);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <ImageBackground
          source={{ uri: images[0]?.uri || 'https://source.unsplash.com/random/800x600/?nature' }}
          style={styles.headerImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlayTop}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.galleryContainer}>
            <View style={styles.galleryPreview}>
              {images.slice(0, 3).map((image, index) => (
                <TouchableOpacity key={image.id || index} style={styles.thumbnailContainer}>
                  {index === 0 && (
                    <View style={styles.playButton}>
                      <Ionicons name="play" size={24} color="#fff" />
                    </View>
                  )}
                  <Image 
                    source={{ uri: image.uri }} 
                    style={styles.thumbnail} 
                  />
                </TouchableOpacity>
              ))}
              {images.length > 3 && (
                <TouchableOpacity style={styles.morePhotosButton}>
                  <Text style={styles.morePhotosText}>10+</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity style={styles.expandButton}>
              <Ionicons name="expand-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={18} color="#E17055" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.favoriteButton, favorite ? styles.favoriteActive : {}]}
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={favorite ? "#fff" : "#E17055"} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={20} color="#E17055" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>({reviews})</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker-distance" size={22} color="#3498DB" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{distance}</Text>
              <Text style={styles.statLabel}>Mesafe</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <MaterialIcons name="restaurant" size={22} color="#2ECC71" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{amenities || 0}</Text>
              <Text style={styles.statLabel}>Rest.</Text>
            </View>
          </View>
        </View>
        
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
        
        
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Şimdi Keşfet</Text>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 400,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  overlayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  galleryPreview: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  thumbnailContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginVertical: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morePhotosButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  morePhotosText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E17055',
  },
  favoriteActive: {
    backgroundColor: '#E17055',
    borderColor: '#E17055',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statTextContainer: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#7F8C8D',
  },
  bookButton: {
    marginTop: 30,
    backgroundColor: '#E17055',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 40,
  },
});

export default ContentPage;
