// LIMINA Service Worker - Device & Push Notifications
// Handlers for system alerts across Desktop & Android browsers

const SW_VERSION = 'limina-v1.0.0';

self.addEventListener('install', (event) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming push events (from Push API / future backend push server)
self.addEventListener('push', (event) => {
  let data = {
    title: 'LIMINA IDX Risk Alert',
    body: 'Terdeteksi pergerakan anomali pada emiten yang dipantau.',
    url: '/dashboard',
    tag: 'limina-risk-alert',
    badge: '/favicon.svg',
    icon: '/favicon.svg',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch {
      data.body = event.data.text() || data.body;
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.svg',
    badge: data.badge || '/favicon.svg',
    tag: data.tag || 'limina-risk-alert',
    renotify: true,
    data: {
      url: data.url || '/dashboard',
      timestamp: Date.now(),
    },
    vibrate: [200, 100, 200, 100, 250],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle click on the system notification (Desktop notification banner / Android notification tray)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || '/';
  // Security: Ensure URL stays within same origin
  let targetUrl = self.location.origin;
  try {
    const parsed = new URL(rawUrl, self.location.origin);
    if (parsed.origin === self.location.origin) {
      targetUrl = parsed.href;
    }
  } catch {
    targetUrl = self.location.origin;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          if ('navigate' in client && client.url !== targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window/tab
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Handle messages from client tabs
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, options);
  }
});
