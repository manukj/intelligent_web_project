console.log("Chat Service Worker: Registered");

self.addEventListener("install", (event) => {
  console.log("Chat Service Worker: Installing....");
  event.waitUntil(
    (async () => {
      console.log("Chat Service Worker: Caching App Shell at the moment......");
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll([
          "/",
          "/css/output.css",
          "/javascripts/chat_script.js",
          "/chat/room",
          "/chat/addChatMessage",
        ]);

        // Print all the caches that are added
        const cacheKeys = await caches.keys();
        cacheKeys.forEach((key) => {
          console.log("Cache added: " + key);
        });
      } catch (error) {
        console.log("Error occurred while caching: " + error);
      }
    })()
  );
});
