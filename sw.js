// sw.js - Service Worker uninstaller
// This script will unregister the service worker and clear all associated caches.

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => {
        return caches.keys();
      })
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // Claim clients to be able to control them.
        return self.clients.claim();
      })
      .then(() => {
        // Force a reload of all clients to ensure they get the fresh version.
        self.clients.matchAll().then(clients => {
            clients.forEach(client => client.navigate(client.url));
        });
      })
  );
});
