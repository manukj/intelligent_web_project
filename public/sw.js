const CACHE_NAME = "Plant Recognition v1.0";

console.log("Service Worker: Registered");

function log(message) {
  console.log("Service Worker: " + message);
}

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
  log("Service Worker: Installing....");
  event.waitUntil(
    (async () => {
      log("Service Worker: Caching App Shell at the moment......");
      try {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(["/", "/css/output.css"]);
      } catch {
        log("error occured while caching...");
      }
    })()
  );
});

//clear cache on reload
self.addEventListener("activate", (event) => {
  // Remove old caches
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      return keys.map(async (cache) => {
        if (cache !== cacheName) {
          log(cache);
          return await caches.delete(cache);
        }
      });
    })()
  );
});

self.addEventListener("fetch", function (event) {
  log(event.request.url);
  log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      log(response);
      return response || fetch(event.request);
    })
  );
});