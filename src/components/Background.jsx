export default function Background() {
  return (
    <div className="bg-host" aria-hidden="true">
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#7b1103,#1b090a"
        data-aifx-bg="#000000"
        className="bg-effect bg-effect-web"
      />
      <div
        data-aifx="fluted-glass"
        data-aifx-colors="#1b090a,#550d07,#7b1103,#b81602"
        data-aifx-bg="#000000"
        data-aifx-flutes="8"
        className="bg-effect bg-effect-mobile"
      />
      <div className="vignette" />
    </div>
  )
}
