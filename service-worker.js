/* Zipsnap service worker — app shell cache.
   index.html is served NETWORK-FIRST so new deploys show up immediately;
   it only falls back to cache when the phone is offline. Bump CACHE on any change. */
const CACHE = 'zipsnap-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Never touch API calls (OpenAI / JobTread) — always live network.
  if (req.method !== 'GET' || /api\.openai\.com|api\.jobtread\.com/.test(req.url)) return;

  const url = new URL(req.url);
  const isDoc = req.mode === 'navigate' || req.destination === 'document'
    || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');

  if (isDoc) {
    // network-first: get the freshest app, fall back to cache when offline
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // other assets: cache-first for speed
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
