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
      try {
        fx = window.VANTA.FOG({
          el,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          // exact shape of the vantajs.com fog preset
          backgroundAlpha: 1,
          blurFactor: 0.53,
          speed: 1,
          zoom: 0.9,
          scale: 2,
          scaleMobile: 4,
          // our blues — demo-style mapping: the DEEPEST blue sits in the
          // lowlight slot (that's what gives the vantajs demo its punch),
          // light gray stays as the cloud body
          highlightColor: hex(bgPalette.colors[1]), // #bce2f7 bright crests
          midtoneColor: hex(bgPalette.colors[2]), // #a3c2de mid clouds
          lowlightColor: hex(bgPalette.base), // #82a7cd deep shadows
          baseColor: hex(bgPalette.colors[3]), // #e2e6e9 sky body
        })
        console.info('[bg] Vanta.FOG ready')
      } catch (err) {
        console.error('[bg] Vanta.FOG failed:', err)
      }
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
