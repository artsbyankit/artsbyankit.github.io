// Adaptive accent — the UI accent reacts to the animated fluted-glass bg.
//
// Every ~200ms we sample the live WebGL canvas (same trick as themeColor.js),
// take the average color of a few points, and derive a harmonious accent:
//   accent hue = bg hue + 125°  (steel blue → rose/petal zone)
// Values ease toward the target each tick, so the accent *glides* with the
// flowing glass instead of jittering. Falls back to the static theme.js
// palette whenever the canvas can't be read.
import { setLiveAccent } from './theme.js'

const SAMPLE_MS = 200
const EASE = 0.06 // per-tick lerp factor — lower = dreamier

let cur = null // current { h, s, l } triple for deep/bright, eased

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

function visibleCanvas() {
  for (const el of document.querySelectorAll('.bg-effect')) {
    if (getComputedStyle(el).display !== 'none') {
      const c = el.querySelector('canvas')
      if (c && c.width > 0) return c
    }
  }
  return document.querySelector('.bg-host canvas')
}

function sampleBg() {
  const canvas = visibleCanvas()
  if (!canvas) return null
  const gl =
    canvas.getContext('webgl2', { preserveDrawingBuffer: true }) ||
    canvas.getContext('webgl', { preserveDrawingBuffer: true })
  if (!gl) return null

  const pts = [
    [0.3, 0.3],
    [0.7, 0.35],
    [0.5, 0.7],
  ]
  let sum = [0, 0, 0]
  let n = 0
  const px = new Uint8Array(4)
  for (const [fx, fy] of pts) {
    const x = Math.min(Math.max(Math.floor(canvas.width * fx), 0), canvas.width - 1)
    const y = Math.min(Math.max(Math.floor(canvas.height * fy), 0), canvas.height - 1)
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
    if (px[3] === 0 || px[0] + px[1] + px[2] < 30) continue // blank buffer
    sum[0] += px[0]
    sum[1] += px[1]
    sum[2] += px[2]
    n++
  }
  if (!n) return null
  return [sum[0] / n, sum[1] / n, sum[2] / n]
}

const lerp = (a, b, t) => a + (b - a) * t
const lerpHue = (a, b, t) => {
  let d = ((b - a + 540) % 360) - 180
  return (a + d * t + 360) % 360
}

function targetFromBg(rgb) {
  const [h] = rgbToHsl(rgb[0], rgb[1], rgb[2])
  const accentHue = (h + 125) % 360
  return {
    deep: { h: accentHue, s: 0.38, l: 0.56 },
    strong: { h: accentHue, s: 0.32, l: 0.45 },
    bright: { h: (accentHue + 350) % 360, s: 0.62, l: 0.85 },
  }
}

const hsl = ({ h, s, l }) =>
  `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`

let lastSample = 0

function tick(ts) {
  requestAnimationFrame(tick)
  if (document.hidden) return
  if (ts - lastSample < SAMPLE_MS) return
  lastSample = ts

  const rgb = sampleBg()
  if (!rgb) return // keep whatever we have / static fallback
  const target = targetFromBg(rgb)

  if (!cur) {
    cur = JSON.parse(JSON.stringify(target))
  } else {
    for (const k of ['deep', 'strong', 'bright']) {
      cur[k].h = lerpHue(cur[k].h, target[k].h, EASE)
      cur[k].s = lerp(cur[k].s, target[k].s, EASE)
      cur[k].l = lerp(cur[k].l, target[k].l, EASE)
    }
  }

  setLiveAccent({
    deep: hsl(cur.deep),
    strong: hsl(cur.strong),
    bright: hsl(cur.bright),
  })
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  requestAnimationFrame(tick)
}
