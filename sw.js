const CACHE = 'crossword-helper-v1';
const SHELL = ['/', '/index.html', '/app.js', '/style.css', '/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Network-first for API calls; cache-first for the app shell.
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (url.hostname === 'api.datamuse.com' || url.hostname === 'api.dictionaryapi.dev') {
        // Always try network for API calls; fall through to browser default on failure.
        return;
    }
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
