import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import CategoryContent from '../../components/ExploreCategory/CategoryContent';
import { RootStackParamList } from '../../navigation/types';

type CategoryDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;

const CategoryDetailScreen = () => {
  const navigation = useNavigation<CategoryDetailScreenNavigationProp>();
  const route = useRoute<CategoryDetailScreenRouteProp>();
  
  // Route'dan kategori ID'sini al
  const { id, name } = route.params;
  
  useEffect(() => {
    console.log('📱 CategoryDetailScreen - Kategori ID:', id);
    console.log('📱 CategoryDetailScreen - Kategori adı:', name);
  }, [id, name]);
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      <CategoryContent categoryId={id} onBack={handleBack} />
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