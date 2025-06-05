import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import CityGuideArea from "../../components/CityGuide/CityGuideArea";
import DiscoverPlaceButton from "../../components/DiscoverArea/DiscoverPlaceButton";
import DiscoverPlacesArea from "../../components/DiscoverArea/DiscoverPlacesArea";
import Category from "../../components/ExploreCategory/Category";
import Header from "../../components/Header";
import Input from "../../components/Search/Input";
import BlogCard from "../../components/TravelBlog/BlogCard";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { RootStackParamList } from "../../navigation/types";
import FavoritesScreen from "../favorite/FavoritesScreen";
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
  const { user } = useAuth();
  const { blogs } = useBlog();
  const [userName, setUserName] = useState('Wanderlander');
  const [userEmail, setUserEmail] = useState('');
  
  // Kullanıcı bilgilerini kontrol et
  useEffect(() => {
    if (user) {
      if (user.user_metadata && user.user_metadata.name) {
        // Supabase user metadata'dan isim bilgisini al
        setUserName(user.user_metadata.name);
      } else if (user.email) {
        // Email'den kullanıcı adı oluştur
        const nameFromEmail = user.email.split('@')[0];
        setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
      
      // E-posta adresini ayarla
      if (user.email) {
        setUserEmail(user.email);
      }
    } else {
      // Kullanıcı giriş yapmamışsa varsayılan ad kullan
      setUserName('Wanderlander');
      setUserEmail('');
    }
  }, [user]);
  
  const handleTravelerCardPress = () => {
    Alert.alert(
      "Gezgin Kartı",
      "Bu özellik yakında aktif olacak! Farklı kültürler hakkında bilgiler edinebileceksiniz.",
      [{ text: "Tamam", onPress: () => console.log("Gezgin Kartı butonu tıklandı") }]
    );
  };

  const handleBlogPress = (blog: any) => {
    console.log('Blog selected:', blog.blogTitle);
    navigation.navigate('BlogDetail', { blog });
  };

  const handleViewAllBlogs = () => {
    console.log('View all blogs pressed');
    navigation.navigate('TravelBlogScreen');
  };

  return (
    <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
      <Header 
        userName={userName || 'Wanderlander'}
        userEmail={userEmail || ''}
        onTravelerCardPress={() => navigation.navigate('Notifications')}
        onAvatarPress={() => navigation.navigate('AvatarSelector')}
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
        
        {/* Son Blog Yazıları */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son Blog Yazıları</Text>
            <TouchableOpacity onPress={handleViewAllBlogs}>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.blogScrollContainer}
          >
            {blogs.slice(0, 3).map((blog, index) => (
              <View key={blog.id} style={[styles.blogCardWrapper, index === 0 && styles.firstBlogCard]}>
                <BlogCard 
                  blog={blog} 
                  onPress={() => handleBlogPress(blog)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
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
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();

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
          {() => <FavoritesScreen />}
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
          {() => <Search />}
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
          {() => <SmartChat />}
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
          listeners={{
            tabPress: (e) => {
              // Kullanıcı giriş yapmamışsa, tab tıklamasını engelle ve Login'e yönlendir
              if (!user) {
                e.preventDefault();
                navigation.navigate('Login');
              }
            },
          }}
        >
          {() => <Profile />}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  viewAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  blogScrollContainer: {
    paddingLeft: 0,
  },
  blogCardWrapper: {
    width: 300,
    marginRight: 16,
  },
  firstBlogCard: {
    marginLeft: 0,
  },
});

export default MainScreen;
