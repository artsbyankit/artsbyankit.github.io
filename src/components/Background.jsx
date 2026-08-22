import { bgPalette } from '../theme.js'

export default function Background() {
  return (
    <div className="bg-host" aria-hidden="true">
      <div
        data-aifx="fluted-glass"
        data-aifx-colors={bgPalette.colors.join(',')}
        data-aifx-bg={bgPalette.base}
        className="bg-effect bg-effect-desktop"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors={bgPalette.colors.join(',')}
        data-aifx-bg={bgPalette.base}
        data-aifx-flutes="18"
        className="bg-effect bg-effect-tablet"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors={bgPalette.colors.join(',')}
        data-aifx-bg={bgPalette.base}
        data-aifx-flutes="8"
        className="bg-effect bg-effect-mobile"
      />
      <div className="vignette" />
    </div>
  )
}
