const CACHE_NAME = "events-app-v1"
const OFFLINE_URL = "/offline"

// Assets to cache
const ASSETS_TO_CACHE = ["/", "/offline", "/api/events", "/favicon.ico"]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )

  // Activate the new service worker immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )

  // Claim clients immediately
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser-extension requests and non-http requests
  if (!event.request.url.startsWith("http")) return

  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const clonedResponse = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse)
          })

          return response
        })
        .catch(() => {
          // If network request fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }

            // If not in cache, return offline data
            return caches.match("/api/events").then((offlineData) => {
              return (
                offlineData || new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } })
              )
            })
          })
        }),
    )
    return
  }

  // For non-API requests, use a "stale-while-revalidate" strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Use cached response immediately if available
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update the cache with the new response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })

          return networkResponse
        })
        .catch((error) => {
          console.log("Fetch failed; returning offline page instead.", error)

          // If the fetch fails (e.g., offline), return the offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL).then((offlineResponse) => {
              return offlineResponse
            })
          }

          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })

      return cachedResponse || fetchPromise
    }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()

    const options = {
      body: data.body || "New notification",
      icon: data.icon || "/favicon.ico",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/",
      },
    }

    event.waitUntil(self.registration.showNotification(data.title || "Events App Notification", options))
  }
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // If a window client is already open, focus it
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus()
        }
      }

      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "/")
      }
    }),
  )
})
