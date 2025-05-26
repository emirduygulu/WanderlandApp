import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DISCOVER_CATEGORIES } from '../../services/categoryService';

interface DiscoverPlaceButtonProps {
  onSelectCategory: (category: string) => void;
}

const DiscoverPlaceButton: React.FC<DiscoverPlaceButtonProps> = ({ onSelectCategory }) => {
  const [activeTab, setActiveTab] = useState('Hepsi');

  const handlePress = (tabName: string) => {
    setActiveTab(tabName);
    onSelectCategory(tabName);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {Object.keys(DISCOVER_CATEGORIES).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              activeTab === category && styles.activeTab,
            ]}
            onPress={() => handlePress(category)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#60A5FA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DiscoverPlaceButton;
