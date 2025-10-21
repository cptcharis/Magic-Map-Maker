const CACHE_NAME = 'magic-map-maker-cache-v2';
const DYNAMIC_CACHE_NAME = 'magic-map-dynamic-cache-v2';

// Static assets that are fundamental to the app's structure.
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon-192.svg',
  '/icon-512.svg',
  '/manifest.json'
];

// On install, cache the static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// On fetch, implement a cache-first strategy
self.addEventListener('fetch', event => {
  // For requests to external resources (like the CDN), use a cache-first strategy
  // but always try to update the cache in the background.
  if (event.request.url.includes('aistudiocdn.com')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          // Return cached version immediately, while the fetch happens in the background.
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // For local assets, use a standard cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, and cache it for next time
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      }
    )
  );
});