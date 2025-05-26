import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Category = () => {
  const navigation = useNavigation();
  
  const categories = [
    {
      id: 'winter',
      name: 'Kış',
      icon: require('../../assets/icon/winter.png')
    },
    {
      id: 'spring',
      name: 'İlkbahar',
      icon: require('../../assets/icon/flowers.png')
    },
    {
      id: 'summer',
      name: 'Yaz',
      icon: require('../../assets/icon/island.png')
    },
    {
      id: 'autumn',
      name: 'Sonbahar',
      icon: require('../../assets/icon/autumn.png')
    }
  ];

  // Kategori seçildiğinde navigasyon ile detay sayfasına git
  const handleCategorySelect = (categoryId: string) => {
    // @ts-ignore (Navigation tipini basitleştirmek için)
    navigation.navigate('CategoryDetail', { categoryId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kategori Keşfet</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id} 
            style={styles.categoryItem}
            onPress={() => handleCategorySelect(category.id)}
          >
            <View style={styles.iconContainer}>
              <Image source={category.icon} style={styles.icon} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>                     
  )
}

export default Category;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    paddingHorizontal: 5,
  },
  scrollContainer: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  categoryItem: {
    width: 90,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  }
});
