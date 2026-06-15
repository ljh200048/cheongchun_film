import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StatusBar } from '@capacitor/status-bar';

// Hide mobile top status bar (time, battery, WiFi status) on native application startup
const initNativeStatusBar = async () => {
  try {
    await StatusBar.hide();
  } catch (err) {
    console.log('Mobile Top StatusBar setup bypassed (running in web/PWA browser mode)', err);
  }
};
initNativeStatusBar();

// Register Service Worker for PWA (Progressive Web App) offline support & installability
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('청춘필름 PWA Service Worker Registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('청춘필름 PWA Service Worker Registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

