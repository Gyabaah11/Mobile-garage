const CACHE_NAME = 'mobile-garage-v1';
const ASSETS = ['/', '/index.html', '/styles.css', '/script.js', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Network first for everything (so form/API calls always hit the network),
  // falling back to cache only if offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
