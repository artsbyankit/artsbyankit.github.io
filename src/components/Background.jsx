export default function Background() {
  return (
    <div className="bg-host" aria-hidden="true">
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#0b2447,#1e3a8a,#1e40af,#2563eb"
        data-aifx-bg="#000000"
        className="bg-effect bg-effect-web"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#0b2447,#1e3a8a,#1e40af,#2563eb"
        data-aifx-bg="#000000"
        data-aifx-flutes="8"
        className="bg-effect bg-effect-mobile"
      />
      <div className="vignette" />
    </div>
  )
}
