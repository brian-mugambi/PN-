const SHELL = "pn-shell-v3";
const IMAGES = "pn-images-v2";
const MAX_IMAGES = 150;

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SHELL).then((c) =>
      Promise.allSettled(["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"].map((u) => c.add(u)))
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== IMAGES).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(name, max) {
  const c = await caches.open(name);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.destination === "image") {
    e.respondWith(
      caches.open(IMAGES).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req)
          .then((r) => { if (r && (r.ok || r.type === "opaque")) { c.put(req, r.clone()); trim(IMAGES, MAX_IMAGES); } return r; })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(SHELL).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req)
          .then((r) => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      caches.open(SHELL).then(async (c) => {
        const hit = await c.match("/");
        const net = fetch(req)
          .then((r) => { if (r && r.ok) c.put("/", r.clone()); return r; })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  e.respondWith(
    caches.open(SHELL).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req)
        .then((r) => { if (r && r.ok) c.put(req, r.clone()); return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const card = e.notification.data && e.notification.data.card;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) { if (card) c.postMessage({ pnOpen: card }); return c.focus(); }
      }
      return self.clients.openWindow("/");
    })
  );
});
