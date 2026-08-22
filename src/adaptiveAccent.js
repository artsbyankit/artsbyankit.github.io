// Reactive shine — the white specular glow on CTAs keeps a faint tint of
// whatever the animated background is doing. Subscribes to the single bg
// sampler (themeColor.js → onBgSample); accent colors are NOT touched.
import { setLiveShine, REACTIVE_SHINE } from './theme.js'
import { onBgSample } from './themeColor.js'

function rgbToHue(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === min) return 0
  const d = max - min
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return h * 360
}

onBgSample((rgb) => {
  if (!REACTIVE_SHINE) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const h = rgbToHue(rgb[0], rgb[1], rgb[2])
  setLiveShine(`hsl(${Math.round(h)} 45% 96%)`)
})
