const CACHE_NAME = 'daily-v0.8.0';

const PRECACHE_URLS = [
  '/',
  '/inbox',
  '/diary',
  '/stats',
  '/archive',
  '/settings',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Supabase API 요청은 캐시 건너뜀
  if (request.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached ?? fetchPromise;
    })
  );
});
