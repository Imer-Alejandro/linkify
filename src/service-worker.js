import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const REMINDER_CACHE_KEY = 'linkify-reminders-v1'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await self.clients.claim()
    await registerPeriodicSync()
  })())
})

async function registerPeriodicSync() {
  if ('periodicSync' in self.registration) {
    try {
      await self.registration.periodicSync.register('reminders-sync', {
        minInterval: 60 * 1000
      })
    } catch (error) {
      console.warn('Periodic sync no disponible', error)
    }
  }
}

async function saveReminders(reminders) {
  const cache = await caches.open(REMINDER_CACHE_KEY)
  await cache.put('/reminders.json', new Response(JSON.stringify(reminders), {
    headers: { 'Content-Type': 'application/json' }
  }))
}

async function loadReminders() {
  const cache = await caches.open(REMINDER_CACHE_KEY)
  const response = await cache.match('/reminders.json')
  if (!response) return []
  return response.json()
}

async function showReminderNotification(reminder) {
  if (!('showNotification' in self.registration)) return

  await self.registration.showNotification(`Recordatorio: ${reminder.nombre}`, {
    body: reminder.descripcion || 'Es hora de revisar este enlace.',
    icon: '/red-mundial.png',
    tag: reminder.enlace_url,
    data: { url: reminder.enlace_url }
  })
}

async function processReminders() {
  const reminders = await loadReminders()
  const now = Date.now()
  const pending = reminders.filter((item) => {
    if (!item.reminder_enabled || !item.reminder_at || item.reminder_notified) return false
    return new Date(item.reminder_at).getTime() <= now
  })

  for (const reminder of pending) {
    await showReminderNotification(reminder)
  }

  const updated = reminders.map((item) => {
    if (!item.reminder_enabled || !item.reminder_at) return item
    const dueAt = new Date(item.reminder_at).getTime()
    if (dueAt <= now) {
      return { ...item, reminder_notified: true }
    }
    return item
  })

  await saveReminders(updated)
}

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'REMINDERS_SYNC') {
    event.waitUntil((async () => {
      await saveReminders(Array.isArray(data.reminders) ? data.reminders : [])
      await processReminders()
    })())
  }
})

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'reminders-sync') {
    event.waitUntil(processReminders())
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    for (const client of clients) {
      if (client.url.includes(url) && 'focus' in client) {
        return client.focus()
      }
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(url)
    }
    return null
  }))
})

setInterval(() => {
  void processReminders()
}, 60000)
