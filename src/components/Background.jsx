// Fluted-glass background — one effect per tier (desktop/tablet/mobile),
// exactly one visible at any width. Flute count is DYNAMIC: derived from the
// live width of the page's .container column so the vertical lines keep the
// same horizontal rhythm as the content (no stray half-flutes at the padding),
// and re-measured on resize for all three modes.
import { useEffect, useState } from 'react'
import { bgPalette } from '../theme.js'

// Target distance between flute lines inside the content column, per tier.
const TARGET_SPACING = { desktop: 62, tablet: 48, mobile: 36 }

function useFluteCounts() {
  const [counts, setCounts] = useState({ desktop: 22, tablet: 17, mobile: 11 })

  useEffect(() => {
    let timer = null

    const compute = () => {
      const container = document.querySelector('.container')
      if (!container) return
      const cw = container.getBoundingClientRect().width
      if (!cw) return
      const vw = window.innerWidth

      // Lines per tier: fit a whole number of flutes inside the CONTENT
      // column, then extend the same rhythm across the full viewport so
      // content edges land ON a line instead of mid-gap.
      const next = {}
      for (const tier of Object.keys(TARGET_SPACING)) {
        const n = Math.max(3, Math.round(cw / TARGET_SPACING[tier]))
        const rhythm = cw / n
        next[tier] = Math.max(4, Math.round(vw / rhythm))
      }
      setCounts((prev) =>
        prev.desktop === next.desktop && prev.tablet === next.tablet && prev.mobile === next.mobile
          ? prev
          : next,
      )
    }

    compute()
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(compute, 150)
    })
    if (document.querySelector('.container')) ro.observe(document.querySelector('.container'))
    window.addEventListener('resize', () => {
      clearTimeout(timer)
      timer = setTimeout(compute, 150)
    })
    return () => {
      ro.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return counts
}

export default function Background() {
  const flutes = useFluteCounts()
  const common = {
    'data-aifx': 'fluted-glass',
    'data-aifx-colors': bgPalette.colors.join(','),
    'data-aifx-bg': bgPalette.base,
    'data-aifx-flute-angle': '90',
  }

  return (
    <div className="bg-host" aria-hidden="true">
      <div {...common} data-aifx-flutes={flutes.desktop} className="bg-effect bg-effect-desktop" />
      <div {...common} data-aifx-flutes={flutes.tablet} className="bg-effect bg-effect-tablet" />
      <div {...common} data-aifx-flutes={flutes.mobile} className="bg-effect bg-effect-mobile" />
    </div>
  )
}
