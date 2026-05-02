const CACHE = 'crossword-helper-v3';
const SHELL = ['index.html', 'app.js', 'style.css', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];

function withScope(path) {
    return new URL(path, self.registration.scope).toString();
}

self.addEventListener('install', e => {
    const scopedShell = SHELL.map(withScope);
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(scopedShell)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Network-first for the app shell so new deployments show up quickly.
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (url.hostname === 'api.datamuse.com' || url.hostname === 'api.dictionaryapi.dev') {
        // Always try network for API calls; fall through to browser default on failure.
        return;
    }
    if (url.origin !== self.location.origin) {
        return;
    }
    if (e.request.method !== 'GET') {
        return;
    }

    e.respondWith((async () => {
        const cache = await caches.open(CACHE);
        try {
            const fresh = await fetch(e.request);
            if (fresh && fresh.ok) {
                cache.put(e.request, fresh.clone());
            }
            return fresh;
        } catch {
            const cached = await caches.match(e.request);
            if (cached) return cached;
            throw new Error('offline');
        }
    })());
});
