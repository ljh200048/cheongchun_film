import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cheongchunfilm.app',
  appName: '청춘필름',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://cheongchun.cloud',
    allowNavigation: [
      'cheongchun.cloud',
      '*.cheongchun.cloud',
      'cheongchunfilm.netlify.app',
      '*.netlify.app',
      'cheongchunfilm-mobile.firebaseapp.com',
      '*.firebaseapp.com'
    ]
  }
};

export default config;
