// Service Worker — PWA caching + Web Push notifications
// Caches fonts and static assets for faster loads

const CACHE_NAME = 'cattory-v4';
const PRECACHE_URLS = [
  '/',
  '/kanban',
  '/calendar',
  '/backlog',
  '/tareas-creadas',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy: always try network, fall back to cache
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never cache Supabase API responses (authenticated data — privacy risk)
  if (url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    return;
  }

  // Cache same-origin static assets, fonts, and CDN resources
  const cacheable = url.origin === self.location.origin
    || url.hostname.includes('fonts.googleapis.com')
    || url.hostname.includes('fonts.gstatic.com')
    || url.hostname.includes('cdn.jsdelivr.net');

  if (!cacheable) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── Web Push Notification Handling ──────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'Cattory', body: event.data.text() };
  }

  const title = data.title || 'Cattory';
  const options = {
    body: data.body || '',
    icon: '/apple-touch-icon.png',
    badge: '/favicon-32x32.png',
    tag: data.type === 'daily_digest' ? 'daily-digest' : `notif-${data.task_id || Date.now()}`,
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      type: data.type,
      task_id: data.task_id,
    },
    actions: data.type === 'daily_digest'
      ? [{ action: 'open', title: 'Ver tareas' }]
      : [
          { action: 'open', title: 'Ver tarea' },
          { action: 'dismiss', title: 'Descartar' },
        ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlPath = event.notification.data?.url || '/';
  const fullUrl = new URL(urlPath, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === fullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(fullUrl);
    })
  );
});
