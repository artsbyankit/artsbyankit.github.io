/* ArtsByAnkit service worker.
   Strategy:
   - Navigation (HTML): network-first, so fresh deploys are never stale.
   - Same-origin static assets (hashed /assets/*, images): cache-first,
     immutable once fetched, so repeat visits are instant. */
const VERSION = 'v2'
const CACHE = `artsbyankit-${VERSION}`
const FONT_CACHE = `${CACHE}-fonts`

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['/']))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE && key !== FONT_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh.ok) cache.put(request, fresh.clone())
    return fresh
  } catch {
    const hit = await cache.match(request)
    return hit || (await cache.match('/index.html'))
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName || CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Google Fonts (cross-origin stylesheet + woff2): cache-first with its own
  // cache so the version-cache purge never drops fonts mid-session.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE))
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (/\.(png|webp|jpg|jpeg|svg|gif|woff2?|pdf)(\?|$)/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request))
  }
})
