import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

const Input = ({ onSearch }: { onSearch?: (text: string, placeId?: string) => void }) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    
      
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#C0C0C0" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Keşfetmeye başla..."
          placeholderTextColor="#A9A9A9"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.light.icon} style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  loader: {
    marginRight: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 14,
    paddingHorizontal: 16,
  },
});

export default Input;