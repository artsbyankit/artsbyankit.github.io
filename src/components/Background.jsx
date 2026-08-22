import { bgPalette } from '../theme.js'

export default function Background() {
  return (
    <div className="bg-host" aria-hidden="true">
      {/* Noise Shimmer — same palette on every tier; shimmer/contrast/speed
          tuned per the AIDesigner recipe. isolate-style stacking is handled
          by .bg-host (position + z-index) in CSS. */}
      <div
        data-aifx="noise-shimmer"
        data-aifx-colors="#a3c2de,#a3c2de,#e2e6e9"
        data-aifx-bg="#82a7cd"
        data-aifx-shimmer="0.63"
        data-aifx-contrast="0.5"
        data-aifx-speed="0.82"
        className="bg-effect bg-effect-desktop"
      />
      <div
        data-aifx="noise-shimmer"
        data-aifx-colors="#a3c2de,#a3c2de,#e2e6e9"
        data-aifx-bg="#82a7cd"
        data-aifx-shimmer="0.63"
        data-aifx-contrast="0.5"
        data-aifx-speed="0.82"
        className="bg-effect bg-effect-tablet"
      />
      <div
        data-aifx="noise-shimmer"
        data-aifx-colors="#a3c2de,#a3c2de,#e2e6e9"
        data-aifx-bg="#82a7cd"
        data-aifx-shimmer="0.63"
        data-aifx-contrast="0.5"
        data-aifx-speed="0.82"
        className="bg-effect bg-effect-mobile"
      />
    </div>
  )
}
