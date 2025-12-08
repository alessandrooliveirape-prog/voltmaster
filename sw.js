
const CACHE_NAME = 'voltmaster-pro-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalação: Cache inicial do "Shell" do app
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força ativação imediata do novo SW
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Ativação: Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume controle das páginas imediatamente
});

// Interceptação de Requisições: Estratégia Cache First Dinâmica
self.addEventListener('fetch', (event) => {
  // Ignora requisições que não sejam GET ou esquemas não-http
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Se estiver no cache, retorna imediatamente (rápido & offline)
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Se não, busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Verifica se a resposta é válida
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // 3. Clona a resposta e salva no cache para a próxima vez
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // 4. Fallback Offline: Se for navegação (HTML) e falhar, retorna index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
