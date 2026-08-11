import { useEffect, useRef, useState } from 'react'

const VIDEO_ID = 'ipf7ifVSeDU'
const START_SECONDS = 60

export default function Background() {
  const wrapRef = useRef(null)
  const playerRef = useRef(null)
  const [videoOn, setVideoOn] = useState(false)

  useEffect(() => {
    const onToggle = () => setVideoOn((v) => !v)
    window.addEventListener('portfolio:toggle-video', onToggle)
    return () => window.removeEventListener('portfolio:toggle-video', onToggle)
  }, [])

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
      start()
    }

    const onOrient = (e) => {
      if (e.gamma == null) return
      if (baseBeta === null) baseBeta = e.beta || 0
      mx = Math.max(-1, Math.min(1, (e.gamma || 0) / 25))
      my = Math.max(-1, Math.min(1, ((e.beta || 0) - baseBeta) / 25))
      start()
    }

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      sy = h > 0 ? window.scrollY / h : 0
      start()
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      tx += (mx * 4.5 - tx) * 0.06
      ty += (my * 3.5 + sy * 4.5 - ty) * 0.06
      const el = wrapRef.current
      if (el) {
        el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(1.2)`
      }
      const settled =
        Math.abs(mx * 4.5 - tx) < 0.05 && Math.abs(my * 3.5 + sy * 4.5 - ty) < 0.05
      raf = settled ? 0 : requestAnimationFrame(tick)
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

  // Create the player once on the first toggle; after that it stays mounted
  // and we only swap visibility via CSS (see render below). Tearing the node
  // down would desync React from the iframe the YT API injected.
  useEffect(() => {
    if (!videoOn || playerRef.current) return
    let cancelled = false

    const startPlayer = () => {
      if (cancelled) return
      playerRef.current = new window.YT.Player('yt-bg', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (e) => {
            e.target.mute()
            e.target.seekTo(START_SECONDS, true)
            e.target.playVideo()
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(START_SECONDS, true)
              e.target.playVideo()
            }
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      startPlayer()
    } else {
      window.onYouTubeIframeAPIReady = startPlayer
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    return () => {
      cancelled = true
    }
  }, [videoOn])

  return (
    <>
      <div className="bg-fallback" aria-hidden="true"></div>
      <div ref={wrapRef} className="bg-layer bg-video-file" aria-hidden="true">
        <picture className={videoOn ? 'bg-hidden' : 'bg-pic-wrap'}>
          <source
            type="image/webp"
            srcSet="/background-1280.webp 1280w, /background.webp 1920w"
            sizes="100vw"
          />
          <img
            className="bg-pic"
            src="/background.jpg"
            alt=""
            draggable="false"
            fetchPriority="high"
          />
        </picture>
        <div id="yt-bg" className={videoOn ? '' : 'bg-hidden'}></div>
      </div>
      <div className="bg-tint" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
    </>
  )
}
