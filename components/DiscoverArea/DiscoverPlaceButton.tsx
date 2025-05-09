import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const DiscoverPlaceButton = () => {
  const [activeTab, setActiveTab] = useState("all");

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    // Burada ilgili kategoriye göre filtreleme işlemleri yapılacak
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keşfetmeye Başla</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === "Hepsi" && styles.activeTab]}
          onPress={() => handleTabPress("Hepsi")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="grid-outline"
              size={20}
              color={activeTab === "Hepsi" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Hepsi" && styles.activeTabText]}>Hepsi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Restoranlar" && styles.activeTab]}
          onPress={() => handleTabPress("Restoranlar")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="restaurant-outline"
              size={20}
              color={activeTab === "Restoranlar" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Restoranlar" && styles.activeTabText]}>Restoranlar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Yeşil Alanlar" && styles.activeTab]}
          onPress={() => handleTabPress("Yeşil Alanlar")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="leaf-outline"
              size={20}
              color={activeTab === "Yeşil Alanlar" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Yeşil Alanlar" && styles.activeTabText]}>Yeşil Alanlar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Eğlence Alanları" && styles.activeTab]}
          onPress={() => handleTabPress("Eğlence Alanları")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="film-outline"
              size={20}
              color={activeTab === "Eğlence Alanları" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Eğlence Alanları" && styles.activeTabText]}>Eğlence Alanları</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Tarihi Yerler" && styles.activeTab]}
          onPress={() => handleTabPress("Tarihi Yerler")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="business-outline"
              size={20}
              color={activeTab === "Tarihi Yerler" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Tarihi Yerler" && styles.activeTabText]}>Tarihi Yerler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Kafe ve Barlar" && styles.activeTab]}
          onPress={() => handleTabPress("Kafe ve Barlar")}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="cafe-outline"
              size={20}
              color={activeTab === "Kafe ve Barlar" ? "#fff" : "#777"}
            />
          </View>
          <Text style={[styles.tabText, activeTab === "Kafe ve Barlar" && styles.activeTabText]}>Kafe ve Barlar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: Colors.light.tint,
  },
  iconContainer: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: "#777",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default DiscoverPlaceButton;
