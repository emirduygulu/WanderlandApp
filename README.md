# Wanderland: Seyahat ve Gezi Rehberi Uygulaması

## Proje Açıklaması

Wanderland, seyahat severlerin yeni yerler keşfetmesini, gezi planları yapmasını ve deneyimlerini paylaşmasını sağlayan kapsamlı bir mobil uygulamadır. Uygulama, kullanıcıların:

- Popüler seyahat destinasyonlarını keşfetmesine
- Şehir rehberlerine erişmesine
- Seyahat blogları oluşturmasına ve okumasına
- Favori yerlerini kaydetmesine
- Akıllı sohbet asistanı ile seyahat önerileri almasına

olanak tanır. React Native ve Expo ile geliştirilen bu uygulama, iOS ve Android platformlarında sorunsuz çalışır.

## Kullanılan API ve Teknolojiler

### Ana Teknolojiler
- **React Native**: Mobil uygulama geliştirme çerçevesi
- **Expo**: React Native uygulamaları için geliştirme aracı
- **TypeScript**: Tip güvenliği sağlayan JavaScript üst kümesi

### Veri Depolama ve Kimlik Doğrulama
- **Supabase**: Backend hizmetleri için kullanılan açık kaynaklı Firebase alternatifi
  - Kullanıcı kimlik doğrulama
  - Veritabanı (Profil, blog yazıları, favori yerler vb.)
  - Depolama (Kullanıcı avatarları, blog görselleri)

### Navigasyon ve UI
- **React Navigation**: Ekranlar arası geçiş için navigasyon çözümü
  - Stack Navigator: Sayfa yığını navigasyonu
  - Bottom Tab Navigator: Alt sekme navigasyonu
- **Expo Vector Icons**: İkonlar için kullanılan kütüphane
- **React Native Reanimated**: Animasyonlar için kullanılan kütüphane

### Konum ve Harita Servisleri
- **Expo Location**: Kullanıcı konumunu almak için
- **React Native Google Places Autocomplete**: Yer arama ve otomatik tamamlama

### Diğer Önemli Kütüphaneler
- **AsyncStorage**: Yerel depolama için
- **Expo Image Picker**: Görsel seçimi için
- **React Native Webview**: Web içeriği görüntülemek için

## Uygulamanın Çalışma Şekli

### 1. Kullanıcı Kimlik Doğrulama
Uygulama, Supabase kimlik doğrulama sistemi ile kullanıcı kaydı ve girişi sağlar. Kullanıcılar, e-posta/şifre ile kayıt olabilir veya giriş yapabilir. Kullanıcı bilgileri Supabase veritabanında güvenli bir şekilde saklanır.

### 2. Ana Sayfa ve Keşif
Ana sayfa, kullanıcıya özelleştirilmiş içerik sunar:
- Favori keşifler bölümü
- Şehir rehberleri
- Kategori bazlı gezilecek yerler
- Son eklenen blog yazıları

Kullanıcılar kategorilere göre filtreleme yapabilir ve ilgi alanlarına göre yerler keşfedebilir.

### 3. Blog Sistemi
Kullanıcılar kendi seyahat deneyimlerini paylaşabilir:
- Blog yazısı oluşturma
- Fotoğraf ekleme
- Yer bilgisi ekleme
- Diğer kullanıcıların bloglarını okuma ve beğenme

### 4. Favori Yerler
Kullanıcılar beğendikleri yerleri favorilerine ekleyebilir ve daha sonra hızlıca erişebilir.

### 5. Arama Özelliği
Gelişmiş arama özelliği ile:
- Yer ismine göre arama
- Kategoriye göre arama
- Şehirlere göre arama

### 6. Akıllı Sohbet Asistanı
Yapay zeka destekli sohbet asistanı, kullanıcılara:
- Seyahat önerileri sunma
- Sorulara yanıt verme
- Gezi planı oluşturma
konularında yardımcı olur.

### 7. Kullanıcı Profili
Kullanıcılar profillerini özelleştirebilir:
- Avatar seçimi
- Kişisel bilgi düzenleme
- Gizlilik ayarları

## Kurulum ve Çalıştırma

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Uygulamayı başlatın:

   ```bash
   npx expo start
   ```

Bu komutla birlikte aşağıdaki seçeneklere sahip olacaksınız:

- Development build ile çalıştırma
- Android emülatöründe açma
- iOS simülatöründe açma
- Expo Go uygulaması ile test etme

## Geliştirme

Uygulama geliştirmeye başlamak için `app` dizinindeki dosyaları düzenleyebilirsiniz. Bu proje, dosya tabanlı yönlendirme (file-based routing) kullanmaktadır.

## Katkıda Bulunma

Projeye katkıda bulunmak için:
1. Bu repo'yu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
