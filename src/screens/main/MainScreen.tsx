import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import CityGuideArea from "../../components/CityGuide/CityGuideArea";
import DiscoverPlaceButton from "../../components/DiscoverArea/DiscoverPlaceButton";
import DiscoverPlacesArea from "../../components/DiscoverArea/DiscoverPlacesArea";
import Category from "../../components/ExploreCategory/Category";
import Header from "../../components/Header";
import Input from "../../components/Search/Input";
import { Colors } from "../../constants/Colors";
import { RootStackParamList } from "../../navigation/types";
import Favorite from "./Favorite";
import Profile from "./Profile";
import Search from "./Search";
import SmartChat from "./SmartChat";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const Tab = createBottomTabNavigator();

// Diğer tab'lar için başlıklı wrapper
const TabScreenWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

// Ana sayfa içeriği
const HomeContent = () => {
  const [selectedDiscoverCategory, setSelectedDiscoverCategory] = useState('Hepsi');
  const navigation = useNavigation<NavigationProp>();
  
  const handleTravelerCardPress = () => {
    Alert.alert(
      "Gezgin Kartı",
      "Bu özellik yakında aktif olacak! Farklı kültürler hakkında bilgiler edinebileceksiniz.",
      [{ text: "Tamam", onPress: () => console.log("Gezgin Kartı butonu tıklandı") }]
    );
  };

  return (
    <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
      <Header 
        userName="Emir" 
        onTravelerCardPress={handleTravelerCardPress} 
      />
      <View style={styles.searchContainer}>
        <Input />
      </View>
      <View>
        {/* Favori Keşifler */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Favori Keşifler</Text>
          <DiscoverPlaceButton onSelectCategory={(category) => setSelectedDiscoverCategory(category)} />
          <DiscoverPlacesArea categoryName={selectedDiscoverCategory} />
        </View>
        
        <CityGuideArea />
        <Category />
      </View>
      <View style={styles.spacer} />
    </ScrollView>
  );
};

// Ana sayfa wrapper
const HomeWrapper = () => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.content}>
        <HomeContent />
      </View>
    </View>
  );
};

const MainScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#EFEFEF",
            height: 60,
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? Colors.light.tint : "#999"}
              />
            ),
          }}
        >
          {() => <HomeWrapper />}
        </Tab.Screen>
        <Tab.Screen
          name="FavoriteTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="favorite-border"
                size={24}
                color={focused ? Colors.light.tint : "#999"}
              />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Favoriler">
              <Favorite />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SearchTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? Colors.light.tint : "#999"}
              />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Arama">
              <Search />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SmartChatTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="logo-wechat"
                size={24}
                color={focused ? Colors.light.tint : "#999"}
              />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="SmartTraveller">
              <SmartChat />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
        <Tab.Screen
          name="ProfileTab"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person"
                size={24}
                color={focused ? Colors.light.tint : "#999"}
              />
            ),
          }}
        >
          {() => (
            <TabScreenWrapper title="Profil">
              <Profile />
            </TabScreenWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabHeader: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: Colors.light.background,
    position: "relative",
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  homeContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  sectionContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  spacer: {
    height: 50,
  },
  searchContainer: {
    marginTop: 10,
    marginBottom: 5,
  },
  discoverSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});

export default MainScreen;
