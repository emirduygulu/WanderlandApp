import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CategoryContent from '../components/ExploreCategory/CategoryContent';

// Route parametreleri tipi
type CategoryDetailRouteParams = {
  CategoryDetail: {
    categoryId: string;
  };
};

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CategoryDetailRouteParams, 'CategoryDetail'>>();
  
  // Route'dan kategori ID'sini al
  const { categoryId } = route.params;
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <CategoryContent categoryId={categoryId} onBack={handleBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CategoryDetailScreen; 