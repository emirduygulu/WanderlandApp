import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

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
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    // @ts-ignore (Navigation tipini basitleştirmek için)
    navigation.navigate('CategoryDetail', { 
      id: categoryId,
      name: categoryName 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mevsimsel Şehir Önerileri</Text>
      <Text style={styles.subtitle}>Mevsimlere göre dünyanın en güzel şehirlerini keşfedin</Text>
      
      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          snapToInterval={width / 3.5}
          decelerationRate="fast"
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(category.id, category.name)}
            >
              <View style={styles.iconContainer}>
                <Image source={category.icon} style={styles.icon} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>                     
  )
}

export default Category;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    paddingHorizontal: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  categoriesWrapper: {
    overflow: 'visible',
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingLeft: 5,
    paddingRight: 20,
  },
  categoryItem: {
    width: width / 3.5,
    height: 110,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 22,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});
