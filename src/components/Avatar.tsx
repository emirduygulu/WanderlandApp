import React from 'react';
import { StyleSheet, View } from 'react-native';

// Avatar özellikleri
interface AvatarProps {
  size?: number;
  style?: any;
}

// Basit statik avatar bileşeni - SVG yerine renk kullanıyor
const Avatar = ({ 
  size = 100, 
  style
}: AvatarProps) => {
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
        }, 
        style
      ]}
    >
      {/* Avatar yerine renkli bir daire gösteriyoruz */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B00', 
    borderWidth: 2,
    borderColor: '#FFFFFF',
  }
});

export default Avatar; 