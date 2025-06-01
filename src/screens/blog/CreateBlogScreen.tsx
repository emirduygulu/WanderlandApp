import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import { RootStackParamList } from '../../navigation/types';

type CreateBlogNavigationProp = StackNavigationProp<RootStackParamList, 'CreateBlog'>;

const CreateBlogScreen = () => {
  const navigation = useNavigation<CreateBlogNavigationProp>();
  const { addBlog } = useBlog();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Doğa & Tarih',
    'Deniz & Tarih', 
    'Kültür & Macera',
    'Deniz & Relaxation',
    'Doğa & Wellness',
    'Gastronomi',
    'Şehir Turu',
    'Dağcılık',
  ];

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf seçebilmek için galeri erişim iznine ihtiyacımız var.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf çekebilmek için kamera erişim iznine ihtiyacımız var.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Fotoğraf Seç',
      'Nereden fotoğraf eklemek istiyorsunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Galeri', onPress: pickImage },
        { text: 'Kamera', onPress: takePhoto },
      ]
    );
  };

  const pickAdditionalImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAdditionalImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const takeAdditionalPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf çekebilmek için kamera erişim iznine ihtiyacımız var.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAdditionalImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const showAdditionalImagePicker = () => {
    Alert.alert(
      'Ek Fotoğraf Ekle',
      'Nereden fotoğraf eklemek istiyorsunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Galeri', onPress: pickAdditionalImage },
        { text: 'Kamera', onPress: takeAdditionalPhoto },
      ]
    );
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Hata', 'Lütfen blog başlığını girin.');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Hata', 'Lütfen blog içeriğini girin.');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Hata', 'Lütfen konum bilgisini girin.');
      return false;
    }
    if (!category) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin.');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Kullanıcı adını belirleme
      let authorName = 'Anonim Gezgin';
      if (user) {
        if (user.user_metadata && user.user_metadata.name) {
          authorName = user.user_metadata.name;
        } else if (user.email) {
          const nameFromEmail = user.email.split('@')[0];
          authorName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        }
      }

      // Yeni blog objesini oluştur
      const newBlog = {
        blogTitle: title.trim(),
        blogContent: content.trim(),
        yazar: authorName,
        kategori: category,
        resim: selectedImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
        konum: location.trim(),
        additionalImages: additionalImages.length > 0 ? additionalImages : undefined,
      };

      // Blog'u context'e ekle
      addBlog(newBlog);
      
      Alert.alert(
        'Başarılı!',
        'Blogunuz başarıyla yayınlandı.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Blog yayınlanırken bir hata oluştu.');
      console.error('Blog publish error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (title || content || location || selectedImage || additionalImages.length > 0) {
      Alert.alert(
        'Değişiklikleri Kaydet',
        'Yazdığınız içerik kaybolacak. Çıkmak istediğinizden emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          { 
            text: 'Çık', 
            style: 'destructive',
            onPress: () => navigation.goBack()
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Blog</Text>
          <TouchableOpacity 
            style={[styles.publishButton, (!title || !content || isLoading) && styles.disabledButton]}
            onPress={handlePublish}
            disabled={!title || !content || isLoading}
          >
            <Text style={[styles.publishText, (!title || !content || isLoading) && styles.disabledText]}>
              {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Section */}
          <TouchableOpacity style={styles.imageSection} onPress={showImagePicker}>
            {selectedImage ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.imageOverlayText}>Değiştir</Text>
                </View>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={48} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Kapak fotoğrafı ekle</Text>
                <Text style={styles.imagePlaceholderSubtext}>Seyahatinizden güzel bir fotoğraf seçin</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Başlık</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Blog başlığınızı yazın..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Location Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Konum</Text>
            <TextInput
              style={styles.input}
              placeholder="Hangi şehir, ülke..."
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Kategori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.selectedCategoryChip
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      category === cat && styles.selectedCategoryChipText
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Content Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>İçerik</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Seyahat deneyiminizi anlatın... Neler yaşadınız, neler gördünüz, tavsiyeleriniz neler?"
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{content.length} karakter</Text>
          </View>

          {/* Ek Görseller */}
          <View style={styles.inputSection}>
            <View style={styles.additionalImagesHeader}>
              <Text style={styles.label}>Ek Görseller (İsteğe Bağlı)</Text>
              <TouchableOpacity style={styles.addImageButton} onPress={showAdditionalImagePicker}>
                <Ionicons name="add" size={20} color="#0A7EA5" />
                <Text style={styles.addImageText}>Ekle</Text>
              </TouchableOpacity>
            </View>
            
            {additionalImages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.additionalImagesContainer}>
                {additionalImages.map((imageUri, index) => (
                  <View key={index} style={styles.additionalImageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles.additionalImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => removeAdditionalImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            
            {additionalImages.length === 0 && (
              <View style={styles.additionalImagesEmpty}>
                <Ionicons name="images-outline" size={32} color="#ccc" />
                <Text style={styles.additionalImagesEmptyText}>Blogunuzu daha çekici hale getirmek için ek fotoğraflar ekleyebilirsiniz</Text>
              </View>
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 İpuçları</Text>
            <Text style={styles.tipsText}>
              • Detaylı anlatım okuyucuları daha çok etkiler{'\n'}
              • Fotoğraflarınızı hikayenizle uyumlu seçin{'\n'}
              • Tavsiyelerinizi paylaşmayı unutmayın{'\n'}
              • Samimi ve kişisel bir dil kullanın
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  publishButton: {
    backgroundColor: '#0A7EA5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  publishText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageSection: {
    marginVertical: 16,
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  contentInput: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 200,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryChip: {
    backgroundColor: '#0A7EA5',
    borderColor: '#0A7EA5',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  additionalImagesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0A7EA5',
    marginVertical: 8,
  },
  addImageText: {
    color: '#0A7EA5',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  additionalImagesContainer: {
    marginTop: 16,
  },
  additionalImageWrapper: {
    marginRight: 8,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
  },
  additionalImagesEmpty: {
    height: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalImagesEmptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
    marginHorizontal: 16,
  },
});

export default CreateBlogScreen; 