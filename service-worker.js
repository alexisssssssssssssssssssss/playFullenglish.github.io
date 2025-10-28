// Service Worker para PlayfulEnglish PWA
const CACHE_NAME = 'playfulenglish';
const urlsToCache = [
  '/',
  '/index.html',
  '/ayuda.html',
  '/inicioSesion.html',
  '/juego1.html',
  '/juego2.html',
  '/juego3.html',
  '/registrar.html',
  '/sobrenosotros.html',
  '/js/ayuda.js',
  '/js/dashboard.js',
  '/js/dashboard2.js',
  '/js/dashboard3.js',
  '/js/dashboard4.js',
  '/js/dashboard5.js',
  '/js/juego1.js',
  '/js/juego2.js',
  '/js/juego3.js',
  '/estilos/ayuda.css',
  '/estilosdashboard.css',
  '/estilos/index.css',
  '/estilos/iniciosesion.css',
  '/estilos/juego1.css',
  '/estilos/juego2.css',
  '/estilos/juego3.css',
  '/estilos/sobre_nosotros.css',
  '/estilos/stylejuego2.css',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
  // Agrega aquí más archivos que quieras que funcionen offline
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devuélvelo
        if (response) {
          return response;
        }
        
        // Si no, haz la petición a la red
        return fetch(event.request).then(response => {
          // Verifica que sea una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona la respuesta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});