import { useEffect } from 'react'

export default function Background() {
  useEffect(() => {
    let raf = 0
    let mx = 0
    let my = 0
    let sy = 0
    let tx = 0
    let ty = 0
    let baseBeta = null

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

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
      tx += (mx * 30 - tx) * 0.05
      ty += (my * 22 + sy * 50 - ty) * 0.05
      document.documentElement.style.setProperty('--bgx', `${tx.toFixed(2)}px`)
      document.documentElement.style.setProperty('--bgy', `${ty.toFixed(2)}px`)
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
      <img className="bg-layer bg-video-file" src="/background.jpg" alt="" aria-hidden="true" draggable="false" />
      <div className="bg-tint" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
    </>
  )
}
