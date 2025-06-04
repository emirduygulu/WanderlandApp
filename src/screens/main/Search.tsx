import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import {
  CategorySuggestion,
  clearSearchHistory,
  getCategorySuggestions,
  getPopularSearches,
  getSearchHistory,
  removeFromSearchHistory,
  searchPlaces
} from '../../services/SearchService';

type SearchNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

const Search = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches] = useState<string[]>(getPopularSearches());
  const [categorySuggestions] = useState<Record<string, CategorySuggestion>>(getCategorySuggestions());
  
  // Kategori listelemesi için kullanılacak diziler
  const [displayedCategories] = useState<string[]>([
    'Tarihi Yerler', 'Doğa', 'Müzeler', 'Şehir Merkezi', 'Plajlar', 'Gastronomi'
  ]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.log('History load error:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchPlaces(query.trim());
      // Arama geçmişini yeniden yükle
      await loadSearchHistory();
      
      navigation.navigate('SearchResults', { 
        query: query.trim(), 
        results 
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Kategori bazlı arama fonksiyonu
  const handleCategorySearch = (categoryName: string) => {
    // İlk olarak kategoriye tıklandığını belirt
    console.log(`📂 Kategori seçildi: ${categoryName}`);
    
    // Kategori için sonuçlar sayfasına git
    navigation.navigate('SearchResults', { 
      query: categoryName, 
      category: categoryName, 
      isCategorySearch: true,
      results: [] 
    });
  };

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.log('Clear history error:', error);
    }
  };

  const handleRemoveFromHistory = async (query: string) => {
    try {
      await removeFromSearchHistory(query);
      await loadSearchHistory();
    } catch (error) {
      console.log('Remove from history error:', error);
    }
  };

  const renderPopularSearchItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.popularItem}
      onPress={() => handlePopularSearch(item)}
    >
      <Ionicons name="trending-up" size={16} color={Colors.light.icon} />
      <Text style={styles.popularText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handlePopularSearch(item)}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.historyText}>{item}</Text>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleRemoveFromHistory(item)}
      >
        <Ionicons name="close" size={14} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Kategorilerin renklerini belirleyen yardımcı fonksiyon
  const getCategoryColor = (index: number): { bg: string, fg: string } => {
    const colors = [
      { bg: '#FF6B6B20', fg: '#FF6B6B' }, // Kırmızı
      { bg: '#4ECDC420', fg: '#4ECDC4' }, // Yeşil
      { bg: '#45B7D120', fg: '#45B7D1' }, // Mavi
      { bg: '#FFA50020', fg: '#FFA500' }, // Turuncu
      { bg: '#9370DB20', fg: '#9370DB' }, // Mor
      { bg: '#3CB37120', fg: '#3CB371' }  // Koyu Yeşil
    ];
    return colors[index % colors.length];
  };

  // İkonları belirleyen yardımcı fonksiyon
  const getCategoryIcon = (categoryName: string): string => {
    return categorySuggestions[categoryName]?.icon || 'bookmark';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Keşfet</Text>
        <Text style={styles.subtitle}>Nereyi ziyaret etmek istiyorsun?</Text>
      </View>

      {/* Arama Kutusı */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Anıtkabir, Ayasofya, Kapadokya..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            returnKeyType="search"
          />
          {isSearching ? (
            <ActivityIndicator size="small" color={Colors.light.icon} />
          ) : searchQuery.length > 0 ? (
            <TouchableOpacity 
              onPress={() => handleSearch(searchQuery)}
              style={styles.searchButton}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Popüler Aramalar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={20} color={Colors.light.icon} />
            <Text style={styles.sectionTitle}>Popüler Aramalar</Text>
          </View>
          
          <FlatList
            data={popularSearches}
            renderItem={renderPopularSearchItem}
            keyExtractor={(item) => item}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.popularGrid}
          />
        </View>

        {/* Arama Geçmişi */}
        {searchHistory.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.sectionTitle}>Son Aramalar</Text>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
                <Text style={styles.clearText}>Temizle</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={searchHistory.slice(0, 5)}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => `${item}-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Kategori Önerileri */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="apps" size={20} color="#1E90FF" />
            <Text style={styles.sectionTitle}>Kategoriler</Text>
          </View>
          
          <View style={styles.suggestionsContainer}>
            {displayedCategories.map((categoryName, index) => {
              const category = categorySuggestions[categoryName];
              const colors = getCategoryColor(index);
              const icon = getCategoryIcon(categoryName);
              
              return (
                <TouchableOpacity 
                  key={categoryName}
                  style={[styles.suggestionCard, { backgroundColor: colors.bg }]}
                  onPress={() => handleCategorySearch(categoryName)}
                >
                  <Ionicons name={icon as any} size={24} color={colors.fg} />
                  <Text style={styles.suggestionTitle}>{category.name}</Text>
                  <Text style={styles.suggestionDesc}>{category.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  popularGrid: {
    paddingVertical: 5,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  popularText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
  },
  clearButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  clearText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  suggestionDesc: {
    fontSize: 12,
    color: '#666',
  },
});

export default Search;