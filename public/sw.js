/* ArtsByAnkit service worker.
   Strategy:
   - Navigation (HTML): network-first, so fresh deploys are never stale.
   - Hashed build output (/assets/name-HASH.ext): cache-first, immutable.
   - Other same-origin static files (images, resume): serve from cache and
     refresh in the background — their URLs don't change when the file does,
     so cache-first would pin returning visitors to an old copy forever.
   - Hygiene: a "last active" timestamp is written on every visit; if the
     site goes unused for STALE_DAYS the SW wipes its own caches so nothing
     lingers on the user's device after they stop coming back. */
const VERSION = 'v5'
const CACHE = `artsbyankit-${VERSION}`
const META_CACHE = 'artsbyankit-meta'
const ACTIVE_KEY = 'last-active'
const STALE_MS = 30 * 24 * 60 * 60 * 1000 // 30 days without a visit
const MIN_UPDATE_MS = 60 * 1000 // throttle timestamp writes to 1/min
const HASHED_ASSET = /^\/assets\/.+-[\w-]{8}\.[a-z0-9]+$/i
const MAX_ENTRIES = 160 // every deploy adds new file names, so the cache has to be bounded
const STATIC_FILE = /\.(png|webp|avif|jpg|jpeg|svg|gif|woff2?|pdf|js)$/i

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
            .filter((key) => key !== CACHE && key !== META_CACHE)
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

// Oldest entries go first. Anything removed is simply fetched again when needed.
async function trim(cache) {
  const keys = await cache.keys()
  await Promise.all(keys.slice(0, Math.max(keys.length - MAX_ENTRIES, 0)).map((key) => cache.delete(key)))
}

async function store(cache, request, response) {
  await cache.put(request, response)
  await trim(cache)
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const fresh = await fetch(request)
    if (fresh.ok) store(cache, request, fresh.clone()).catch(() => {})
    return fresh
  } catch {
    // Offline: the exact page if we have it, otherwise the app shell (the
    // client-side router renders any route from it).
    const hit = await cache.match(request)
    return hit || (await cache.match('/'))
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok) store(cache, request, response.clone()).catch(() => {})
  return response
}

async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(event.request)
  const refresh = fetch(event.request).then((response) => {
    if (response.ok) store(cache, event.request, response.clone()).catch(() => {})
    return response
  })
  if (!hit) return refresh
  event.waitUntil(refresh.catch(() => {}))
  return hit
}

let lastPurgeCheck = 0

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.waitUntil(setActive())
  // Only re-check staleness occasionally, not on every single request.
  const now = Date.now()
  if (now - lastPurgeCheck > 10 * 60 * 1000) {
    lastPurgeCheck = now
    event.waitUntil(purgeIfStale())
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (HASHED_ASSET.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (STATIC_FILE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event))
  }
})
