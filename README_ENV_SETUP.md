# Wanderland Uygulaması .env Kurulumu

Bu doküman, Wanderland uygulaması için gerekli API anahtarlarının ayarlanması ve .env dosyasının oluşturulması hakkında bilgi vermektedir.

## .env Dosyası

Projenizin kök dizininde bir `.env` dosyası oluşturmalısınız. Bu dosya API anahtarlarınızı güvenli bir şekilde saklamanızı sağlar. Aşağıdaki içeriği kullanabilirsiniz:

```
# Foursquare API Key
FOURSQUARE_API_KEY=fsq3JeH31UQ+807jYa94GoyV21yM3IN48B9pML4otvksmQ0=

# OpenTripMap API Key
OTM_API_KEY=5ae2e3f221c38a28845f05b674f143e88996df66592ed1d4d38906af



## React Native Dotenv Kurulumu

React Native projelerinizde .env dosyalarını kullanabilmek için `react-native-dotenv` paketini kurmanız gerekir:

```bash
npm install react-native-dotenv --save-dev
# veya
yarn add react-native-dotenv --dev
```

Babel konfigürasyonunuzu güncelleyin (babel.config.js):

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        'moduleName': '@env',
        'path': '.env',
        'safe': false,
        'allowUndefined': true
      }]
    ]
  };
};
```

## API Bağlantıları

Uygulama şu API'leri kullanmaktadır:

1. **Foursquare API** - Mekan arama ve detay bilgisi
   - Endpoint: https://api.foursquare.com/v3
   - Dokümantasyon: https://developer.foursquare.com/reference/place-search

2. **OpenTripMap API** - Turistik yerler ve detaylar
   - Endpoint: https://api.opentripmap.com/0.1
   - Dokümantasyon: https://opentripmap.io/docs

## Servis Yapısı

Uygulama üç ana servisi içerir:

- `Foursquare.js` - Mekan araması ve detayı için
- `OneTripMap.js` - Turistik yerler ve detayları için
- `Location.js` - Kullanıcı konumunu almak için

Bu servisler, `TestDiscoverPlacesArea.tsx` bileşeni tarafından kullanılır ve mekanları bir kart yapısı içerisinde gösterir.

## Test Bileşeni

`TestDiscoverPlacesArea.tsx` bileşeni, her iki API'den verileri çeker ve bunları bir kart yapısında gösterir. Bu kartlarda şu bilgiler yer alır:

- Yer adı
- Kategori
- Konum
- Açıklama
- Puan ve yorum sayısı
- Fiyat seviyesi (varsa)
- Web sitesi (varsa)
- Navigasyon linki

Bu test bileşeni, uygulamanın API entegrasyonlarını ve veri gösterimini test etmek için kullanılabilir. 