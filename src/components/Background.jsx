import { useEffect } from 'react'

export default function Background() {
  useEffect(() => {
    let raf = 0
    let mx = 0
    let my = 0
    let sy = 0
    let tx = 0
    let ty = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      sy = h > 0 ? window.scrollY / h : 0
    }

    const tick = () => {
      tx += (mx * 12 - tx) * 0.05
      ty += (my * 9 + sy * 36 - ty) * 0.05
      document.documentElement.style.setProperty('--bgx', `${tx.toFixed(2)}px`)
      document.documentElement.style.setProperty('--bgy', `${ty.toFixed(2)}px`)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
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
