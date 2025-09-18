// Service Worker for cervello.me
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cervello-cache-${CACHE_VERSION}`;

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/src/email-shield.js'
];

// External resources to cache after first load
const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@600&family=Roboto:wght@100&display=swap',
    'https://use.fontawesome.com/releases/v5.15.4/css/all.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name.startsWith('cervello-cache-') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Handle different types of resources
    if (request.url.includes('googletagmanager') || request.url.includes('google-analytics')) {
        // Network only for analytics
        event.respondWith(fetch(request).catch(() => new Response()));
        return;
    }
    
    if (request.url.includes('fonts.googleapis') || request.url.includes('fonts.gstatic')) {
        // Cache fonts for 1 year
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(request).then(response => {
                    if (response) return response;
                    
                    return fetch(request).then(response => {
                        if (response.status === 200) {
                            cache.put(request, response.clone());
                        }
                        return response;
                    });
                });
            })
        );
        return;
    }
    
    // Cache first strategy for static assets
    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) {
                // Return cached version and update in background
                event.waitUntil(
                    fetch(request).then(response => {
                        if (response.status === 200) {
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => {})
                );
                return cached;
            }
            
            // Not in cache, fetch from network
            return fetch(request).then(response => {
                if (response.status === 200 && request.url.startsWith('http')) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Offline fallback
                if (request.destination === 'document') {
                    return caches.match('/');
                }
            });
        })
    );
});