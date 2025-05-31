const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// React Native için Node.js modül polyfill'leri
config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('isomorphic-webcrypto'),
  http: require.resolve('@tradle/react-native-http'),
  https: require.resolve('https-browserify'),
  url: require.resolve('url'),
  zlib: require.resolve('browserify-zlib'),
  process: require.resolve('process/browser'),
};

// Problemli modülleri tamamen devre dışı bırakıldı
config.resolver.blockList = [
  /node_modules\/react-native-randombytes\/.*/,
  /node_modules\/react-native-crypto\/.*/
];

module.exports = config; 