export default function Background() {
  return (
    <>
      <div className="bg-fallback" aria-hidden="true"></div>
      <img className="bg-layer bg-video-file" src="/background.jpg" alt="" aria-hidden="true" draggable="false" />
      <div className="bg-tint" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
    </>
  )
}
