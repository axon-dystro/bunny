const C = "bunny-v3",
  A = ["/", "/style.css?v=3", "/app.js", "/icon.svg", "/manifest.webmanifest"];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(C).then((c) => c.addAll(A)).then(() => self.skipWaiting())),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== C).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/")) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
