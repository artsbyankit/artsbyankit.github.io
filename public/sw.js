/* ArtsByAnkit service worker.
   Strategy:
   - Navigation (HTML): network-first, so fresh deploys are never stale.
   - Same-origin static assets (hashed /assets/*, images): cache-first,
     immutable once fetched, so repeat visits are instant.
   - Google Fonts: cache-first in a dedicated cache.
   - Hygiene: a "last active" timestamp is written on every visit; if the
     site goes unused for STALE_DAYS the SW wipes its own caches so nothing
     lingers on the user's device after they stop coming back. */
const VERSION = 'v4'
const CACHE = `artsbyankit-${VERSION}`
const FONT_CACHE = `${CACHE}-fonts`
const META_CACHE = 'artsbyankit-meta'
const ACTIVE_KEY = 'last-active'
const STALE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days without a visit
const MIN_UPDATE_MS = 60 * 1000 // throttle timestamp writes to 1/min

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
            .filter((key) => key !== CACHE && key !== FONT_CACHE && key !== META_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => purgeIfStale())
      .then(() => self.clients.claim()),
  )
})

async function setActive() {
  try {
    const cache = await caches.open(META_CACHE)
    const now = Date.now()
    const hit = await cache.match(ACTIVE_KEY)
    if (hit) {
      const prev = Number(await hit.text())
      if (now - prev < MIN_UPDATE_MS) return
    }
    await cache.put(ACTIVE_KEY, new Response(String(now)))
  } catch {
    /* best effort — never break the page over bookkeeping */
  }
}

async function purgeIfStale() {
  try {
    const cache = await caches.open(META_CACHE)
    const hit = await cache.match(ACTIVE_KEY)
    if (!hit) return
    const lastActive = Number(await hit.text())
    if (Date.now() - lastActive <= STALE_MS) return
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  } catch {
    /* best effort */
  }
}

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

let lastPurgeCheck = 0

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  setActive()
  // Only re-check staleness occasionally, not on every single request.
  const now = Date.now()
  if (now - lastPurgeCheck > 10 * 60 * 1000) {
    lastPurgeCheck = now
    purgeIfStale()
  }

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

// Re-check periodically while the SW is alive, so caches are released even
// if the tab stays open but idle for weeks.
setInterval(purgeIfStale, 6 * 60 * 60 * 1000)
