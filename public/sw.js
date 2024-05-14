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
        cache.addAll([
          "/",
          "/css/output.css",
          "/error/404_error",
          "/error/offline",
          "/images/login_image.svg",
          "/javascripts/dashboard/dashboard_script.js",
          "/javascripts/add_plant/add_plant_script.js",
          "/javascripts/add_plant/add_plant_idb_utility.js",
          "/javascripts/chat/chat_script.js",
          "/javascripts/chat/chat_idb_utility.js",
          "/javascripts/chat/chat_rendering_script.js",

          "/javascripts/user/user_script.js",
          "/javascripts/user/user_render_script.js",
        ]);
      } catch {
        log("error occured while caching...");
      }
    })()
  );
});

self.addEventListener("fetch", function (event) {
  log(event.request.url);
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return getOfflinePage().then((response) => {
            return (
              response ||
              get404Page().then(
                (response) =>
                  response ||
                  new Response(
                    "You are offline and the requested content is not cached.",
                    {
                      status: 404,
                      statusText: "Not Found",
                    }
                  )
              )
            );
          });
        });
      })
  );
});

function getOfflinePage() {
  return caches.match("/error/offline");
}

function get404Page() {
  return caches.match("/error/404_error");
}
