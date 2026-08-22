// Adaptive accent — the UI accent reacts to the animated fluted-glass bg.
//
// Subscribes to the single bg sampler (themeColor.js → onBgSample) instead
// of reading pixels itself. Accent hue = bg hue + 125° (steel blue → rose
// zone). Values ease toward the target each tick, so the accent *glides*
// with the flowing glass instead of jittering. Falls back to the static
// theme.js palette whenever sampling fails.
import { setLiveAccent } from './theme.js'
import { onBgSample } from './themeColor.js'

const EASE = 0.05 // per-sample lerp factor — lower = dreamier

let cur = null // eased { deep, strong, bright } in HSL

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

const targetFromRgb = (rgb) => {
  const [h] = rgbToHsl(rgb[0], rgb[1], rgb[2])
  const accentHue = (h + 125) % 360
  return {
    deep: { h: accentHue, s: 0.38, l: 0.56 },
    strong: { h: accentHue, s: 0.32, l: 0.45 },
    bright: { h: (accentHue + 350) % 360, s: 0.62, l: 0.85 },
  }
}

const lerp = (a, b, t) => a + (b - a) * t
const lerpHue = (a, b, t) => {
  const d = ((b - a + 540) % 360) - 180
  return (a + d * t + 360) % 360
}

const hsl = ({ h, s, l }) =>
  `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`

onBgSample((rgb) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const target = targetFromRgb(rgb)
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
})
