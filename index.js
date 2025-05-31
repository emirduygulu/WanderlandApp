// Node.js polifilleri
import { Buffer } from 'buffer';
import 'react-native-url-polyfill/auto';
global.Buffer = Buffer;

if (typeof process === 'undefined') {
  global.process = require('process/browser');
}


import cryptoMock from './src/config/cryptoFix';
global.crypto = {
  ...cryptoMock,
  subtle: {},
  getRandomValues: cryptoMock.getRandomValues
};

// Daha güvenli şekilde global değişkenleri tanımlandı 
global.randomBytes = cryptoMock.randomBytes;

global.url = require('url');

import { registerRootComponent } from 'expo';
import App from './app/index';

// Uygulamanın ana bileşenini registerRootComponent ile kaydet
registerRootComponent(App); 