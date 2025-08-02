const CACHE_NAME = 'yara-agency-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Static assets to cache
const staticAssets = [
  '/',
  '/about',
  '/services',
  '/portfolio',
  '/contact',
  '/blog',
  '/manifest.json',
  // Add your main CSS and JS bundles here - these will be updated by build process
];

// Cache strategies
const cacheStrategies = {
  // Cache first for static assets (images, fonts, etc.)
  static: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\.(?:woff|woff2|ttf|eot)$/,
    /\.(?:css|js)$/
  ],
  
  // Network first for API calls and dynamic content
  networkFirst: [
    /\/api\//,
    /supabase/,
    /\/auth/,
    /\/admin/,
    /\/profile/
  ],
  
  // Stale while revalidate for HTML pages
  staleWhileRevalidate: [
    /^https:\/\/[^\/]+\/?$/,
    /\/about/,
    /\/services/,
    /\/portfolio/,
    /\/contact/,
    /\/blog/
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(staticAssets);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Cleanup complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Skip sensitive paths that should never be cached
  const sensitivePatterns = [
    /\/auth/,
    /\/admin/,
    /\/profile/,
    /supabase.*\/auth\//,
    /supabase.*\/functions\//
  ];
  
  for (const pattern of sensitivePatterns) {
    if (pattern.test(request.url)) {
      return;
    }
  }

  // Determine cache strategy
  const strategy = getCacheStrategy(request.url);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Determine which cache strategy to use
function getCacheStrategy(url) {
  // Check for static assets
  for (const pattern of cacheStrategies.static) {
    if (pattern.test(url)) {
      return 'cacheFirst';
    }
  }
  
  // Check for network-first resources
  for (const pattern of cacheStrategies.networkFirst) {
    if (pattern.test(url)) {
      return 'networkFirst';
    }
  }
  
  // Check for stale-while-revalidate resources
  for (const pattern of cacheStrategies.staleWhileRevalidate) {
    if (pattern.test(url)) {
      return 'staleWhileRevalidate';
    }
  }
  
  // Default to network first
  return 'networkFirst';
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request);
    case 'networkFirst':
      return networkFirst(request);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request);
    default:
      return networkFirst(request);
  }
}

// Cache first strategy
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Start network request in background
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return null;
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkPromise.catch(() => {
      // Ignore network errors when we have cache
    });
    return cachedResponse;
  }
  
  // No cache, wait for network
  try {
    const networkResponse = await networkPromise;
    if (networkResponse) {
      return networkResponse;
    }
  } catch (error) {
    console.error('Network request failed:', error);
  }
  
  return new Response('Offline - Resource not available', { 
    status: 503,
    statusText: 'Service Unavailable' 
  });
}

// Handle background sync for forms and other actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form when back online
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB or localStorage
    // This would be implemented based on your form handling
    console.log('Service Worker: Syncing contact form submissions');
  } catch (error) {
    console.error('Service Worker: Failed to sync contact form', error);
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'yara-notification',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Yara Agency', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});