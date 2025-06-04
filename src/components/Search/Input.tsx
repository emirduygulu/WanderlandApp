import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { searchPlaces } from '../../services/SearchService';

interface SearchInputProps {
  onSearch?: (query: string, results: any[]) => void;
  placeholder?: string;
}

const Input = ({ onSearch, placeholder = "Keşfetmeye başla..." }: SearchInputProps) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError('Lütfen aramak istediğiniz yeri yazın');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchPlaces(searchText.trim());
      
      if (results.length === 0) {
        setError('Sonuç bulunamadı');
      } else {
        onSearch?.(searchText.trim(), results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Arama sırasında bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#C0C0C0" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (error) clearError();
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          editable={!isLoading}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.light.icon} style={styles.loader} />
        ) : (
          <TouchableOpacity 
            style={[
              styles.searchButton,
              (!searchText.trim() || isLoading) && styles.searchButtonDisabled
            ]} 
            onPress={handleSearch}
            disabled={!searchText.trim() || isLoading}
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError} style={styles.errorCloseButton}>
            <Ionicons name="close" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingLeft: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  searchButton: {
    backgroundColor: Colors.light.icon,
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loader: {
    marginRight: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B20',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    flex: 1,
  },
  errorCloseButton: {
    padding: 2,
  },
});

export default Input;