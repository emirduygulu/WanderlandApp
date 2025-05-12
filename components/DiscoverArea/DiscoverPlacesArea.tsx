import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

// Ekran genişliğini alıyoruz
const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.45
const SPACING = 15

// Örnek veri
const places = [
  {
    id: '1',
    title: 'Milano Park',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.0,
    reviews: 36,
    bgColor: '#6EE7B7', 
  },
  {
    id: '2',
    title: 'Milano Mountains',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.0,
    reviews: 36,
    bgColor: '#93C5FD', 
  },
  {
    id: '3',
    title: 'City Center',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.2,
    reviews: 42,
    bgColor: '#FCD34D', 
  },
  {
    id: '4',
    title: 'Historic Square',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.5,
    reviews: 28,
    bgColor: '#F87171', 
  },
  {
    id: '5',
    title: 'Beach Resort',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.8,
    reviews: 56,
    bgColor: '#6EE7B7',
  },
  {
    id: '6',
    title: 'Grand Museum',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.6,
    reviews: 67,
    bgColor: '#93C5FD',
  },
  {
    id: '7',
    title: 'Modern Art Gallery',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.1,
    reviews: 45,
    bgColor: '#FCD34D',
  },
  {
    id: '8',
    title: 'Urban Gardens',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.3,
    reviews: 33,
    bgColor: '#F87171',
  },
  {
    id: '9',
    title: 'Skyline View',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.7,
    reviews: 49,
    bgColor: '#6EE7B7',
  },
  {
    id: '10',
    title: 'Sunset Bridge',
    location: 'Sant Paulo, Milan, Italy',
    rating: 4.4,
    reviews: 38,
    bgColor: '#93C5FD',
  },
]

const DiscoverPlacesArea = () => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
      >
        {places.map((place) => (
          <TouchableOpacity key={place.id} style={styles.card}>
            <View 
              style={[styles.imageContainer, { backgroundColor: place.bgColor }]}
            />
            <View style={styles.contentArea}>
              <Text style={styles.title}>{place.title}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.location}>{place.location}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{place.rating}</Text>
                <Text style={styles.reviews}>{place.reviews} Reviews</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default DiscoverPlacesArea;

const styles = StyleSheet.create({

  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: SPACING,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 24,
  },
  contentArea: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 18,
    marginTop: -110,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    fontSize: 11,
    color: '#6B7280',
  },
});
