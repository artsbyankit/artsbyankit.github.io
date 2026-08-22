// Dynamic browser theme-color that follows the fluted-glass background.
// The AIDesigner effect renders into a <canvas> inside the .bg-effect divs.
// We sample that canvas (top-center, where browser chrome sits) right after
// the effect's own rAF frame, so we read real rendered pixels. If the canvas
// can't be read (blank drawing buffer, no WebGL, effect not loaded yet) we
// fall back to a slow walk of the four brand blues — same hue family.
//
// This is the SINGLE bg sampler for the whole app: other modules subscribe
// via onBgSample() instead of doing their own readPixels (each call stalls
// the GPU pipeline — multiple samplers caused visible hitches on phones).
import { bgPalette } from './theme.js'

const BRAND = [bgPalette.base, bgPalette.colors[2], bgPalette.colors[1]]
const SAMPLE_MS = 600 // each readPixels stalls the GPU pipeline; fewer = smoother FF
const MIN_DELTA = 10

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

const listeners = new Set()
export function onBgSample(cb) {
  listeners.add(cb)
}

let metaEl = null
function meta() {
  if (!metaEl) {
    metaEl = document.querySelector('meta[name="theme-color"]')
    if (!metaEl) {
      metaEl = document.createElement('meta')
      metaEl.name = 'theme-color'
      document.head.appendChild(metaEl)
    }
  }
  return metaEl
}

let last = null
let lastWrite = 0

function writeIfChanged(rgb) {
  const now = performance.now()
  if (now - lastWrite < SAMPLE_MS) return
  if (!last || Math.hypot(rgb[0] - last[0], rgb[1] - last[1], rgb[2] - last[2]) > MIN_DELTA) {
    last = rgb
    lastWrite = now
    meta().content = `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`
  }
}

function visibleEffectCanvas() {
  for (const el of document.querySelectorAll('.bg-effect')) {
    if (getComputedStyle(el).display !== 'none') return el.querySelector('canvas')
  }
  return document.querySelector('.bg-host canvas')
}

function readWebGL(canvas) {
  if (!canvas || canvas.width === 0 || canvas.height === 0) return null
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  if (!gl) return null
  const x = Math.min(Math.max(Math.floor(canvas.width / 2), 0), canvas.width - 1)
  const y = Math.min(Math.max(Math.floor(canvas.height / 2), 0), canvas.height - 1)
  const px = new Uint8Array(4)
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
  if (px[3] === 0) return null
  if (px[0] + px[1] + px[2] < 30) return null // blank / cleared drawing buffer
  return [px[0], px[1], px[2]]
}

function brandWalk(ts) {
  const t = (ts / 7000) % 1
  const seg = t * (BRAND.length - 1)
  const i = Math.min(Math.floor(seg), BRAND.length - 2)
  const f = seg - i
  const a = hexToRgb(BRAND[i])
  const b = hexToRgb(BRAND[i + 1])
  return a.map((v, k) => v + (b[k] - v) * f)
}

let lastRead = 0

function loop(ts) {
  requestAnimationFrame(loop)
  if (document.hidden) return
  // Throttle GPU reads — readPixels forces a GPU→CPU sync, which is cheap
  // on desktop but can starve the effect's own render loop on phones.
  if (ts - lastRead < SAMPLE_MS) return
  lastRead = ts
  const rgb = readWebGL(visibleEffectCanvas()) || brandWalk(ts)
  writeIfChanged(rgb)
  for (const cb of listeners) cb(rgb)
}

requestAnimationFrame(loop)
