const CACHE_NAME = 'cheongju-youth-film-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install event - caching basic static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serving cached content and caching new items
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Skip Firebase requests, Firestore database, and Cloud auth requests
  if (
    url.origin !== self.location.origin && 
    !url.host.includes('googleapis.com') && 
    !url.host.includes('gstatic.com')
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh in background to update cache (Stale-While-Revalidate)
        fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          })
          .catch(() => { /* Silent failure for offline bg fetches */ });
        return cachedResponse;
      }

      return fetch(e.request)
        .then((networkResponse) => {
          // Cache successful assets from the local origin
          if (networkResponse.status === 200 && url.origin === self.location.origin) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to the SPA root if navigation fails and user is offline
          if (e.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        });
    })
  );
});
