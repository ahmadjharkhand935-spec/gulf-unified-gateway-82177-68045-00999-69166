// Service worker tuned for SPA correctness and safe updates
// - Network-first for navigations to always get the latest index.html
// - Cache-first (with background refresh) for static assets
// - Avoids serving a stale index.html that can point to missing hashed assets

const CACHE_VERSION = 'gulf-gateway-v3';
const ASSET_CACHE = `${CACHE_VERSION}-assets`;
const APP_SHELL = [
  '/',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  // Activate this SW immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(ASSET_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  // Claim clients and clean old caches
  self.clients && self.clients.claim && self.clients.claim();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== ASSET_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Always prefer network for navigations (index.html)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          // Optionally update cached root for offline fallback
          const copy = networkRes.clone();
          caches.open(ASSET_CACHE).then((cache) => cache.put('/', copy));
          return networkRes;
        })
        .catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // For GET requests to static assets, use cache-first and refresh in background
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const isStaticAsset =
      url.pathname.startsWith('/assets/') ||
      /\.(?:js|css|png|jpg|jpeg|gif|svg|webp|woff2|ico)$/.test(url.pathname);

    if (isStaticAsset) {
      event.respondWith(
        caches.match(req).then((cached) => {
          const fetchPromise = fetch(req).then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const copy = networkRes.clone();
              caches.open(ASSET_CACHE).then((cache) => cache.put(req, copy));
            }
            return networkRes;
          });
          return cached || fetchPromise;
        })
      );
    }
  }
});
