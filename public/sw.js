// PitchHook PWA Service Worker
const CACHE_NAME = "pitchhook-shell-v1";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Install event: cache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// Activate event: clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch event: Shell caching for offline support
// IMPORTANT: Do not cache Google AI API calls or /api/* endpoints
self.addEventListener("fetch", (event) => {
  // Only process GET requests
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // Exclude API requests (do not cache Google AI API calls or internal /api/* endpoints)
  if (
    url.pathname.startsWith("/api") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("google.com") ||
    url.hostname.includes("generativelanguage")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Fetch from network to update cache (Stale-While-Revalidate pattern)
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === "basic" || networkResponse.type === "cors")
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails (offline), fall back to cached shell for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    }),
  );
});
