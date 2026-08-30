// Service worker minimal — cuma buat memenuhi syarat "installable" PWA.
// Tidak melakukan caching agresif supaya data (dashboard, transaksi, dll)
// selalu diambil fresh dari API, bukan dari cache basi.
const CACHE_NAME = 'office-app-shell-v1';
const APP_SHELL = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: selalu coba internet dulu (data harus fresh),
// fallback ke cache cuma kalau offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
