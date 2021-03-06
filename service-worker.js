var cacheStorageKey = "picture-to-colouring-page-v1";

var cachedPaths = [
  "/picture-to-colouring-page/",
  "index.html",
  "assets/style.css",
  "assets/logo.svg",
  "assets/logo-512.png",
  "assets/maskable_icon.png",
  "assets/index.js",
];

self.addEventListener("install", (event) => {
  const install = async () => {
    const cache = await caches.open(cacheStorageKey);
    await cache.addAll(cachedPaths);
  };
  event.waitUntil(install());
});

self.addEventListener("activate", (event) => {
  const activate = async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== cacheStorageKey)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  };
  event.waitUntil(activate());
});

self.addEventListener("fetch", async (event) => {
  const response = await caches.match(event.request);
  if (response) {
    return event.respondWith(response);
  }
  return;
});
