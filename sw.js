const CACHE = 'svoy-nastroy-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fp = fetch(event.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((cache) => cache.put(event.request, c)); return r; }).catch(() => cached);
      return cached || fp;
    })
  );
});
