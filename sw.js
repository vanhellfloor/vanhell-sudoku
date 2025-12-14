const CACHE_NAME = 'sudoku-journey-v1';

// Files to cache immediately when the app starts
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // We use a Cache-First strategy:
  // 1. Check if the file is in the cache.
  // 2. If yes, serve it immediately (Offline support!).
  // 3. If no, fetch it from the internet, then save it in the cache for next time.
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Clone the response because it can only be consumed once
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API calls or analytics if we had them, 
          // but here we cache everything (ESM modules, fonts, etc.)
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});