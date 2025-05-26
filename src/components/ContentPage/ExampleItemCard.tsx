import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type ItemCardProps = {
  item: {
    id: string;
    name: string;
    location: string;
    description: string;
    rating: number;
    reviews: number;
    distance: string;
    amenities?: number;
    imageUrl: string;
    isFavorite?: boolean;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Content'>;

const ExampleItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('Content', {
      item: {
        ...item,
        images: [
          { id: '1', uri: item.imageUrl },
        ],
      },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#E17055" />
          <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({item.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2C3E50',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 2,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 2,
  },
  reviews: {
    fontSize: 10,
    color: '#7F8C8D',
    marginLeft: 2,
  },
});

export default ExampleItemCard; 