// Service Worker para cache eficiente
const CACHE_NAME = 'sublime-v2';
const STATIC_CACHE = 'sublime-static-v2';
const DYNAMIC_CACHE = 'sublime-dynamic-v2';
const IMAGE_CACHE = 'sublime-images-v2';

// Recursos críticos para cache imediato
const criticalResources = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/performance-optimizer.js',
  '/img/logomarcasublime.png'
];

// Recursos estáticos para cache com estratégia cache-first
const staticResources = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Configurações de cache por tipo
const cacheConfig = {
  images: {
    maxEntries: 50,
    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 dias
  },
  static: {
    maxEntries: 30,
    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 dias
  },
  dynamic: {
    maxEntries: 20,
    maxAgeSeconds: 24 * 60 * 60 // 1 dia
  }
};

// Install event - cache recursos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(criticalResources)),
      caches.open(DYNAMIC_CACHE).then(cache => cache.addAll(staticResources))
    ])
  );
  self.skipWaiting();
});

// Fetch event - estratégias de cache inteligentes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia para imagens
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Estratégia para recursos estáticos
  if (isStaticResource(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Estratégia para recursos dinâmicos
  event.respondWith(handleDynamicRequest(request));
});

// Manipula requisições de imagem com cache otimizado
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache apenas imagens pequenas para economizar espaço
      const contentLength = response.headers.get('content-length');
      if (!contentLength || parseInt(contentLength) < 500000) { // 500KB
        cache.put(request, response.clone());
        await cleanupCache(IMAGE_CACHE, cacheConfig.images);
      }
    }
    return response;
  } catch (error) {
    // Retorna imagem placeholder em caso de erro
    return new Response('', { status: 404 });
  }
}

// Manipula recursos estáticos (CSS, JS, fonts)
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    // Cache-first para recursos estáticos
    fetchAndUpdateCache(request, STATIC_CACHE);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      await cleanupCache(STATIC_CACHE, cacheConfig.static);
    }
    return response;
  } catch (error) {
    return cached || new Response('', { status: 404 });
  }
}

// Manipula recursos dinâmicos (HTML, API)
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
      await cleanupCache(DYNAMIC_CACHE, cacheConfig.dynamic);
    }
    return response;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Atualiza cache em background
async function fetchAndUpdateCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
  } catch (error) {
    // Falha silenciosa para atualizações em background
  }
}

// Verifica se é recurso estático
function isStaticResource(url) {
  return url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         url.hostname === 'cdnjs.cloudflare.com';
}

// Limpa cache antigo baseado na configuração
async function cleanupCache(cacheName, config) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > config.maxEntries) {
    const keysToDelete = keys.slice(0, keys.length - config.maxEntries);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Activate event - limpa caches antigos e otimiza
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Limpa caches antigos
      caches.keys().then(cacheNames => {
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!validCaches.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Assume controle imediatamente
      self.clients.claim()
    ])
  );
});

// Mensagens do cliente para controle de cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    event.waitUntil(self.skipWaiting());
  }
});