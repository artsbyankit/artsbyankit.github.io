export default function Background() {
  return (
    <div className="bg-host" aria-hidden="true">
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#7b1103,#1b090a"
        data-aifx-bg="#000000"
        className="bg-effect bg-effect-desktop"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#597b9e,#bce2f7,#a3c2de,#e2e6e9"
        data-aifx-bg="#597b9e"
        data-aifx-flutes="18"
        className="bg-effect bg-effect-tablet"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#597b9e,#bce2f7,#a3c2de,#e2e6e9"
        data-aifx-bg="#9b9ee0"
        data-aifx-flutes="8"
        className="bg-effect bg-effect-mobile"
      />
      <div className="vignette" />
    </div>
  )
}
