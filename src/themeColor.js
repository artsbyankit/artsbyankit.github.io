// Dynamic browser theme-color that follows the site's powder-blue palette.
// A slow walk through the brand blues (theme.js bgPalette) sets the browser
// chrome colour.
import { bgPalette } from './theme.js'

const BRAND = [bgPalette.base, bgPalette.colors[2], bgPalette.colors[1]]
const SAMPLE_MS = 3000
const MIN_DELTA = 10

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

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

function writeIfChanged(rgb) {
  if (!last || Math.hypot(rgb[0] - last[0], rgb[1] - last[1], rgb[2] - last[2]) > MIN_DELTA) {
    last = rgb
    meta().content = `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`
  }
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

setInterval(() => {
  if (document.hidden) return
  const rgb = brandWalk(performance.now())
  writeIfChanged(rgb)
}, SAMPLE_MS)
