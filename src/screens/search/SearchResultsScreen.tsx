import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import {
    getPlacesByCategory,
    SearchFilters,
    searchPlaces,
    SearchResult
} from '../../services/SearchService';

type SearchResultsNavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;

interface RouteParams {
  query: string;
  results?: SearchResult[];
  category?: string;
  isCategorySearch?: boolean;
}

const SearchResultsScreen = () => {
  const navigation = useNavigation<SearchResultsNavigationProp>();
  const route = useRoute();
  const { query, results: initialResults, category, isCategorySearch } = route.params as RouteParams;
  
  const [results, setResults] = useState<SearchResult[]>(initialResults || []);
  const [isLoading, setIsLoading] = useState(isCategorySearch || false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'popularity'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Kategori bazlı arama ise başlangıçta arama yap
  useEffect(() => {
    if (isCategorySearch && category) {
      searchCategoryPlaces(category);
    }
  }, [category, isCategorySearch]);

  useEffect(() => {
    if (results.length > 0) {
      applyFiltersAndSort();
    }
  }, [filters, sortBy, selectedTypes]);

  // Kategori bazlı arama fonksiyonu
  const searchCategoryPlaces = async (categoryName: string) => {
    setIsLoading(true);
    try {
      console.log(`🔍 Kategori araması yapılıyor: ${categoryName}`);
      const placesToSearch = getPlacesByCategory(categoryName);
      
      if (placesToSearch.length === 0) {
        console.log(`❌ Kategori için yer bulunamadı: ${categoryName}`);
        setIsLoading(false);
        return;
      }
      
      console.log(`✅ Kategori için ${placesToSearch.length} yer bulundu`);
      
      // İlk 3 yeri hemen ara
      const initialBatch = placesToSearch.slice(0, 3);
      let categoryResults: SearchResult[] = [];
      
      for (const place of initialBatch) {
        try {
          const placeResults = await searchPlaces(place, filters);
          if (placeResults.length > 0) {
            categoryResults.push(...placeResults);
          }
        } catch (error) {
          console.error(`Arama hatası (${place}):`, error);
        }
      }
      
      setResults(categoryResults);
      
      // Diğer yerleri arka planda ara
      setTimeout(() => {
        searchRemainingPlaces(placesToSearch.slice(3));
      }, 500);
      
    } catch (error) {
      console.error('Kategori arama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Kalan yerleri ara
  const searchRemainingPlaces = async (remainingPlaces: string[]) => {
    if (remainingPlaces.length === 0) return;
    
    const limit = Math.min(remainingPlaces.length, 7); // En fazla 7 yer daha ara
    const nextBatch = remainingPlaces.slice(0, limit);
    
    for (const place of nextBatch) {
      try {
        const placeResults = await searchPlaces(place, filters);
        if (placeResults.length > 0) {
          setResults(prev => [...prev, ...placeResults]);
        }
      } catch (error) {
        console.error(`Arama hatası (${place}):`, error);
      }
    }
  };

  const applyFiltersAndSort = () => {
    let filteredResults = [...results];

    // Tip filtreleme
    if (selectedTypes.length > 0) {
      filteredResults = filteredResults.filter(result => 
        selectedTypes.includes(result.type)
      );
    }

    // Minimum rating filtreleme
    if (filters.minRating) {
      filteredResults = filteredResults.filter(result => 
        result.rating && result.rating >= filters.minRating!
      );
    }

    // Sıralama
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        default: // relevance
          // Özel içerikler öncelikli olsun
          // Wikipedia dışı içerikler varsa önce onları göster
          const sourceA = a.source;
          const sourceB = b.source;
          if (sourceA !== 'wikipedia' && sourceB === 'wikipedia') return -1;
          if (sourceA === 'wikipedia' && sourceB !== 'wikipedia') return 1;
          
          const aScore = (a.popularity || 0) + (a.rating || 0) * 10;
          const bScore = (b.popularity || 0) + (b.rating || 0) * 10;
          return bScore - aScore;
      }
    });

    setResults(filteredResults);
  };

  // Yeniden render'ları azaltmak için memoize edilmiş işlevler
  const toggleTypeFilter = useCallback((type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isCategorySearch && category) {
        await searchCategoryPlaces(category);
      } else {
        const newResults = await searchPlaces(query, filters);
        setResults(newResults);
      }
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, isCategorySearch, query, filters]);

  const renderSearchResult = useCallback(({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      onPress={() => navigation.navigate('SearchDetail', { result: item })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.resultImage} 
        defaultSource={require('../../assets/city/placeholder.png')}
      />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.typeIndicator}>
            <Text style={styles.typeText}>
              {getTypeLabel(item.type)}
            </Text>
          </View>
        </View>

        <Text style={styles.resultDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.resultMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.metaText}>
              {item.location.city && item.location.country 
                ? `${item.location.city}, ${item.location.country}`
                : item.location.address || 'Konum bilgisi mevcut değil'
              }
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            {item.rating && (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
            <View style={styles.sourceIndicator}>
              <Text style={styles.sourceText}>{getSourceLabel(item.source)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const getTypeLabel = (type: string) => {
    const labels = {
      'landmark': 'Turistik Yer',
      'monument': 'Anıt/Tarihi Yapı',
      'place': 'Mekan',
      'city': 'Şehir'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSourceLabel = (source: string) => {
    const labels = {
      'local': 'Yerli',
      'foursquare': 'FSQ',
      'otm': 'OTM',
      'wikipedia': 'Wiki'
    };
    return labels[source as keyof typeof labels] || source;
  };

  // Kategori ikonunu belirleyen yardımcı fonksiyon
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, any> = {
      'Tarihi Yerler': 'library-outline',
      'Doğa': 'leaf-outline',
      'Müzeler': 'school-outline',
      'Şehir Merkezi': 'business-outline',
      'Plajlar': 'umbrella-outline',
      'Gastronomi': 'restaurant-outline'
    };
    return icons[categoryName] || 'apps-outline';
  };

  // Kategoriler için ikon renkleri
  const getCategoryColor = (categoryName: string): string => {
    const colors: Record<string, string> = {
      'Tarihi Yerler': '#FF6B6B',
      'Doğa': '#4ECDC4',
      'Müzeler': '#45B7D1',
      'Şehir Merkezi': '#FFA500',
      'Plajlar': '#FF9F45',
      'Gastronomi': '#FF6B6B'
    };
    return colors[categoryName] || Colors.light.primary;
  };

  // Filtreleri render et
  const renderFiltersContent = useMemo(() => (
    <View style={styles.filtersWrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContentContainer}
      >
        {/* Kategori başlığı - Sadece kategori araması ise göster */}
        {isCategorySearch && category && (
          <View style={[
            styles.categoryHeaderChip, 
            { backgroundColor: getCategoryColor(category) }
          ]}>
            <Ionicons 
              name={getCategoryIcon(category)} 
              size={16} 
              color="white" 
            />
            <Text style={styles.categoryHeaderText}>{category}</Text>
          </View>
        )}

        {/* Tip Filtreleri */}
        {['landmark', 'monument', 'place', 'city'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedTypes.includes(type) && styles.filterChipActive
            ]}
            onPress={() => toggleTypeFilter(type)}
          >
            <Text style={[
              styles.filterText,
              selectedTypes.includes(type) && styles.filterTextActive
            ]}>
              {getTypeLabel(type)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Sıralama */}
        <TouchableOpacity
          style={[styles.filterChip, styles.sortChip]}
          onPress={() => {
            const nextSort = sortBy === 'relevance' ? 'rating' : 
                           sortBy === 'rating' ? 'popularity' : 'relevance';
            setSortBy(nextSort);
          }}
        >
          <Ionicons name="swap-vertical" size={16} color={Colors.light.icon} />
          <Text style={styles.filterText}>
            {sortBy === 'relevance' ? 'İlgili' : 
             sortBy === 'rating' ? 'Puan' : 'Popüler'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  ), [isCategorySearch, category, selectedTypes, sortBy, toggleTypeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {isCategorySearch && category ? `${category}` : `"${query}"`}
          </Text>
          <Text style={styles.resultCount}>
            {results.length} sonuç bulundu
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
        >
          <Ionicons name="refresh" size={24} color={Colors.light.icon} />
        </TouchableOpacity>
      </View>

      {/* Filtreler */}
      {renderFiltersContent}

      {/* Sonuçlar */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.icon} />
          <Text style={styles.loadingText}>
            {isCategorySearch ? 'Kategori sonuçları getiriliyor...' : 'Aranıyor...'}
          </Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.emptyTitle}>Sonuç Bulunamadı</Text>
          <Text style={styles.emptyText}>
            "{isCategorySearch && category ? category : query}" için sonuç bulunamadı.
            Farklı bir arama yapmayı deneyin.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  refreshButton: {
    padding: 5,
  },
  filtersWrapper: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  filtersContentContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  categoryHeaderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeaderText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.light.icon + '20',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: Colors.light.icon,
    fontWeight: '500',
  },
  sortChip: {
    backgroundColor: '#e6f7ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: 16,
    paddingBottom: 24,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  resultContent: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  typeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#666',
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginLeft: 4,
  },
  sourceIndicator: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  sourceText: {
    fontSize: 10,
    color: '#666',
  },
  categoryContainer: {
    marginTop: 12,
    flexDirection: 'row',
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.icon,
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SearchResultsScreen; 