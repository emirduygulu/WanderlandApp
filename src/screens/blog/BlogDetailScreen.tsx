import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../../navigation/types';

type BlogDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BlogDetail'>;

const BlogDetailScreen = () => {
  const navigation = useNavigation<BlogDetailNavigationProp>();
  const route = useRoute();
  const { blog } = route.params as { blog: any };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${blog.blogTitle}\n\n${blog.blogContent.substring(0, 200)}...`,
        title: blog.blogTitle,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={blog.resim} style={styles.heroImage} />
          
          {/* Header Overlay */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{blog.kategori}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>{blog.blogTitle}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.authorSection}>
              <View style={styles.authorAvatar}>
                <Ionicons name="person" size={20} color="#0A7EA5" />
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{blog.yazar}</Text>
                <Text style={styles.publishDate}>{blog.tarih}</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{blog.okunmaSuresi}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.statText}>{blog.konum}</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.articleContent}>
            <Text style={styles.contentText}>{blog.blogContent}</Text>
            
            {/* Extended content - you can add more sections here */}
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Seyahat Deneyimi</Text>
              <Text style={styles.contentText}>
                Bu seyahat deneyimi gerçekten unutulmaz anlar yaşamamı sağladı. Her detayın 
                kendine has güzelliği vardı ve bu güzellikleri sizlerle paylaşmak istedim.
              </Text>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Tavsiyeler</Text>
              <Text style={styles.contentText}>
                • En iyi zaman: İlkbahar ve sonbahar ayları{'\n'}
                • Konaklama: Merkezi konumlarda kalmanızı tavsiye ederim{'\n'}
                • Ulaşım: Toplu taşımayı tercih edebilirsiniz{'\n'}
                • Bütçe: Orta seviye bir bütçe yeterli olacaktır
              </Text>
            </View>

            {/* Ek Görseller */}
            {blog.additionalImages && blog.additionalImages.length > 0 && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>Fotoğraf Galerisi</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {blog.additionalImages.map((imageUri: string, index: number) => (
                    <Image 
                      key={index} 
                      source={{ uri: imageUri }} 
                      style={styles.galleryImage} 
                    />
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons name="heart-outline" size={20} color="#FF6B6B" />
              <Text style={styles.likeText}>Beğen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.commentButton}>
              <Ionicons name="chatbubble-outline" size={20} color="#0A7EA5" />
              <Text style={styles.commentText}>Yorum Yap</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={20} color="#FFA500" />
              <Text style={styles.bookmarkText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(10, 126, 165, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  publishDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  articleContent: {
    marginBottom: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  contentSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  likeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  commentText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#0A7EA5',
    fontWeight: '500',
  },
  bookmarkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  bookmarkText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '500',
  },
  galleryImage: {
    width: 150,
    height: 100,
    resizeMode: 'cover',
    marginRight: 12,
    borderRadius: 8,
  },
});

export default BlogDetailScreen; 