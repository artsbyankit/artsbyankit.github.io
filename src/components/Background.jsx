// Vanta.FOG background — one instance for every tier (Vanta handles resize
// itself, so the old desktop/tablet/mobile triple-layer is gone).
// Scripts load from CDN in index.html; init is retried by a small watchdog
// until window.VANTA exists. Fallback gradient lives under it in CSS.
import { useEffect } from 'react'
import { bgPalette } from '../theme.js'

const hex = (h) => '0x' + h.slice(1)

export default function Background() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let fx = null
    let tries = 0
    const el = document.getElementById('bg-fog')

    const boot = () => {
      if (cancelled || !el || fx) return
      if (!window.VANTA || !window.THREE) {
        if (++tries < 40) setTimeout(boot, 250) // ~10s watchdog
        return
      }
      fx = window.VANTA.FOG({
        el,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        blurFactor: 0.54,
        speed: 0.9,
        zoom: 0.9,
        // brand ramp — same family as bgPalette
        highlightColor: hex(bgPalette.colors[3]),
        midtoneColor: hex(bgPalette.colors[2]),
        lowlightColor: hex(bgPalette.base),
        baseColor: hex(bgPalette.base),
      })
    }

    let cancelled = false
    boot()
    return () => {
      cancelled = true
      if (fx) fx.destroy()
    }
  }, [])

  return (
    <div className="bg-host" aria-hidden="true">
      <div id="bg-fog" className="bg-effect bg-effect-desktop" />
    </div>
  )
}
