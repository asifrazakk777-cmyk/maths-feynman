'use strict';
/* Maths Feynman Techniques — service-worker.js
   Caches the whole app on first visit so it opens instantly and works fully
   offline afterwards. Bump CACHE_NAME whenever the app files change. */
const CACHE_NAME = 'mft-cache-v2';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){ return cache.addAll(APP_SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  const req = event.request;
  const url = new URL(req.url);
  /* Only same-origin GETs. External links (e.g. "Explore more online") are never touched. */
  if(req.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function(cached){
      const network = fetch(req).then(function(res){
        if(res && res.status === 200){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){
        if(cached) return cached;
        /* Offline navigation to any page -> serve the app shell */
        if(req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
      return cached || network;
    })
  );
});
