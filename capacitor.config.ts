import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cheongchunfilm.app',
  appName: '청춘필름',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
