/* Trip Planner service worker — app shell cache + runtime font cache */
const VERSION = "trip-v3";
const SHELL = VERSION + "-shell";
const RUNTIME = VERSION + "-runtime";

const SHELL_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(SHELL).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k !== SHELL && k !== RUNTIME;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Fonts: cache-first, fall back to network, tolerate offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) {
          const copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () {
          return new Response("", { status: 200, headers: { "Content-Type": "text/css" } });
        });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Navigations: network-first so updates land, cache as backup.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(SHELL).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (hit) {
          return hit || caches.match("./");
        });
      })
    );
    return;
  }

  // Everything else: cache-first.
  event.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(SHELL).then(function (c) { c.put(req, copy); });
        return res;
      });
    })
  );
});
