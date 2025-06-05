import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface BlogPost {
  id: number;
  blogTitle: string;
  blogContent: string;
  yazar: string;
  tarih: string;
  kategori: string;
  resim: ImageSourcePropType;
  konum: string;
  okunmaSuresi: string;
}

interface BlogCardProps {
  blog: BlogPost;
  onPress: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={blog.resim} style={styles.image} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{blog.kategori}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {blog.blogTitle}
        </Text>
        
        <Text style={styles.content} numberOfLines={3}>
          {blog.blogContent}
        </Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.authorText}>{blog.yazar}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.locationText}>{blog.konum}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.date}>{blog.tarih}</Text>
          <View style={styles.readTimeContainer}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.readTime}>{blog.okunmaSuresi}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 0,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    height: 450,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(10, 126, 165, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});

export default BlogCard;