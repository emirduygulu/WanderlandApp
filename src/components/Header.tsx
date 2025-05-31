import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from "../constants/Colors";
import Avatar from "./Avatar";

interface HeaderProps {
  userName?: string;
  onTravelerCardPress?: () => void;
  userEmail?: string;
  onAvatarPress?: () => void;
}

const Header = ({ 
  userName = "Wanderlander", 
  userEmail,
  onTravelerCardPress = () => {},
  onAvatarPress
}: HeaderProps) => {
  const greeting = getGreeting();
  
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <TouchableOpacity onPress={onAvatarPress} disabled={!onAvatarPress}>
          <Avatar 
            size={50}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName || 'Wanderlander'}!</Text>
          <Text style={styles.exploreText}>Dünyayı Wanderland ile Keşfet</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.cardButton} onPress={onTravelerCardPress}>
        <Ionicons name="compass-outline" size={24} color="#000" />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  )
}

const getGreeting = (): string => {
  const hours = new Date().getHours();
  if (hours < 12) return "Günaydın";
  if (hours < 18) return "İyi Günler";
  return "İyi Akşamlar";
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  textContainer: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exploreText: {
    fontSize: 18,
    color: '#333',
  },
  cardButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
  }
});

export default Header;