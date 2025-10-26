// public/sw.js
const CACHE_NAME = 'ecom-admin-v1'
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/images/hero/desktop/img1.webp',
  
  // Add critical assets
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    )
  }
})
