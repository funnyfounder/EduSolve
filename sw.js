// Minimal Service Worker - Network Only for AI-based app
// EduSolve requires internet connection to function

self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Pass all requests directly to network (no caching)
  event.respondWith(fetch(event.request));
});
