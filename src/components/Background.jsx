import { useEffect, useRef } from 'react'

export default function Background() {
  const imgRef = useRef(null)

  useEffect(() => {
    let raf = 0
    let mx = 0
    let my = 0
    let sy = 0
    let tx = 0
    let ty = 0
    let baseBeta = null

    const coarse = window.matchMedia('(pointer: coarse)').matches

    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onOrient = (e) => {
      if (e.gamma == null) return
      if (baseBeta === null) baseBeta = e.beta || 0
      mx = Math.max(-1, Math.min(1, (e.gamma || 0) / 25))
      my = Math.max(-1, Math.min(1, ((e.beta || 0) - baseBeta) / 25))
    }

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      sy = h > 0 ? window.scrollY / h : 0
    }

    const tick = () => {
      tx += (mx * 90 - tx) * 0.06
      ty += (my * 70 + sy * 90 - ty) * 0.06
      const el = imgRef.current
      if (el) {
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(1.35)`
      }
      raf = requestAnimationFrame(tick)
    }

    if (coarse) {
      const listen = () => window.addEventListener('deviceorientation', onOrient, true)
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((s) => {
            if (s === 'granted') listen()
          })
          .catch(() => {})
      } else {
        listen()
      }
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      if (coarse) {
        window.removeEventListener('deviceorientation', onOrient, true)
      } else {
        window.removeEventListener('mousemove', onMove)
      }
    }
  }, [])

  return (
    <>
      <div className="bg-fallback" aria-hidden="true"></div>
      <picture>
        <source type="image/webp" srcSet="/background.webp" />
        <img
          ref={imgRef}
          className="bg-layer bg-video-file"
          src="/background.jpg"
          alt=""
          aria-hidden="true"
          draggable="false"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="bg-tint" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
    </>
  )
}
