const CACHE_NAME = 'nfticket-v1.0.0'
const OFFLINE_PAGE = '/offline'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
]

// API routes that should be cached
const API_CACHE_ROUTES = [
  '/api/v1/events',
  '/api/v1/categories',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker installed')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Error caching static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return

  // Strategy for different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request))
  } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    // Static assets - Cache first
    event.respondWith(cacheFirstStrategy(request))
  } else {
    // HTML pages - Network first with offline fallback
    event.respondWith(networkFirstWithOfflineFallback(request))
  }
})

// Network first strategy (for API calls)
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME)
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Clone the response before caching
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', request.url)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return a custom offline response for API calls
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Sin conexión a internet',
        offline: true 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    )
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Asset not available offline:', request.url)
    return new Response('Asset not available offline', { status: 503 })
  }
}

// Network first with offline fallback (for HTML pages)
async function networkFirstWithOfflineFallback(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Page not available online, checking cache:', request.url)
    
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    const offlineResponse = await cache.match(OFFLINE_PAGE)
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Fallback HTML if offline page is not available
    return new Response(
      `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sin conexión - TIX</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0; padding: 2rem; text-align: center; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; min-height: 100vh;
              display: flex; flex-direction: column; justify-content: center;
            }
            .container { max-width: 400px; margin: 0 auto; }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
            p { font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9; }
            button { 
              background: white; color: #667eea; border: none; 
              padding: 0.75rem 1.5rem; border-radius: 0.5rem;
              font-size: 1rem; cursor: pointer; font-weight: 600;
            }
            button:hover { background: #f8f9fa; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>Sin conexión</h1>
            <p>Parece que no tienes conexión a internet. Verifica tu conexión e intenta de nuevo.</p>
            <button onclick="window.location.reload()">Intentar de nuevo</button>
          </div>
        </body>
      </html>`,
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200 
      }
    )
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle any pending form submissions or data sync
  console.log('Performing background sync...')
}

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ver'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ],
    tag: data.tag || 'tix-notification',
    renotify: true
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'TIX', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus()
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Handle share target
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  if (url.pathname === '/share' && event.request.method === 'GET') {
    event.respondWith(handleShareTarget(event.request))
  }
})

async function handleShareTarget(request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title')
  const text = url.searchParams.get('text')
  const shareUrl = url.searchParams.get('url')
  
  // Redirect to main app with shared data
  const targetUrl = `/?share=1&title=${encodeURIComponent(title || '')}&text=${encodeURIComponent(text || '')}&url=${encodeURIComponent(shareUrl || '')}`
  
  return Response.redirect(targetUrl, 302)
}