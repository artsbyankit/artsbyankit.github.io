import { Suspense, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import Background from './Background'

function Navbar() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const links = (
    <>
      <NavLink to="/" end onClick={close}>
        Home
      </NavLink>
      <NavLink to="/work" onClick={close}>
        Work
      </NavLink>
      <NavLink to="/about" onClick={close}>
        About
      </NavLink>
      <NavLink to="/contact" className="nav-cta" onClick={close}>
        Let's talk
      </NavLink>
    </>
  )

  return (
    <header className="dock">
      <div className="dock-glass">
        <Link to="/" className="logo" onClick={close} title="Ankit Patel — UI/UX Designer">
          <span className="logo-dot"></span>
          Ankit Patel
        </Link>

        <span className="nav-divider" aria-hidden="true"></span>

        <nav className="nav-links">{links}</nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {open &&
        createPortal(
          <nav className="nav-links nav-links-mobile">{links}</nav>,
          document.body,
        )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>🤍 Built with treats, tail wags &amp; a little bit of magic ✨🐾</span>
      </div>
    </footer>
  )
}

function LayoutEffects() {
  const location = useLocation()

  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [location.pathname])

  useEffect(() => {
    let raf = null
    const targets = () =>
      document.querySelectorAll('.card-body, .skill-box, .btn, .social-big a, .nav-links a')

    const onMove = (e) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        targets().forEach((el) => {
          const r = el.getBoundingClientRect()
          el.style.setProperty('--mx', `${e.clientX - r.left}px`)
          el.style.setProperty('--my', `${e.clientY - r.top}px`)
        })
        raf = null
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 640px)').matches) return
    const dock = document.querySelector('.dock-glass')
    if (!dock) return
    const items = () => [...dock.querySelectorAll('.nav-links:not(.nav-links-mobile) a')]
    const BASE_H = 62
    const EXPAND_H = 82
    const SCALE = 1.45
    const LEAVE_MS = 170
    const STEP_MS = 90
    const HOLD_MS = 140
    const GROW_MS = 110
    const RETURN_STEP = 80
    const RETURN_BASE = 60
    let target = null
    let active = false
    let leaveTimer = null
    let departTimer = null
    let timers = []

    const later = (fn, ms) => timers.push(setTimeout(fn, ms))

    const clearAll = () => {
      if (leaveTimer) clearTimeout(leaveTimer)
      if (departTimer) clearTimeout(departTimer)
      leaveTimer = null
      departTimer = null
      timers.forEach(clearTimeout)
      timers = []
      dock.classList.remove('has-target')
      items().forEach((it) => {
        it.classList.remove('nav-green')
        it.classList.remove('nav-flash')
      })
    }

    // Grow only the hovered item, anchored to its left edge so it pushes
    // neighbors apart with a margin — the 12px gaps flex open (dynamic spaces).
    const grow = (el) => {
      const g = (SCALE - 1) * el.offsetWidth
      el.style.marginRight = `${g}px`
      el.style.transform = `scale(${SCALE})`
    }

    const shrink = (el) => {
      el.style.marginRight = '0px'
      el.style.transform = 'scale(1)'
    }

    // Dock swells dynamically: height AND side padding grow together, so the
    // green dot sits further from the left edge the bigger the dock gets.
    const setDock = (h) => {
      dock.style.height = `${h}px`
      dock.style.setProperty('--dock-grow', `${h - BASE_H}px`)
    }

    // Railway track: the green runs from "Let's talk" toward the hovered item,
    // flashing the edges of each station it passes (Work, About), then landing
    // and staying on the target. Edges only — no text is ever tinted.
    const hover = (el) => {
      const prev = target
      const list = items()
      const prevIdx = prev ? list.indexOf(prev) : list.length - 1
      const idx = list.indexOf(el)
      clearAll()
      if (prev) shrink(prev)
      target = el
      active = true
      dock.classList.add('has-target')
      // The train departs from wherever the green currently is (the previous
      // target, or "Let's talk") and only runs as far as the new target — so
      // Home -> Work is a single short hop, not a round trip via About.
      const dir = prevIdx <= idx ? 1 : -1
      const station = []
      for (let j = prevIdx; dir > 0 ? j <= idx : j >= idx; j += dir) station.push(j)
      let arrival = 0
      station.forEach((j, k) => {
        const delay = k * STEP_MS
        arrival = delay
        later(() => {
          if (j === idx) {
            list[j].classList.add('nav-green')
          } else {
            list[j].classList.add('nav-flash')
            later(() => list[j].classList.remove('nav-flash'), HOLD_MS)
          }
        }, delay)
      })
      later(() => {
        grow(el)
        setDock(EXPAND_H)
      }, Math.max(0, arrival - GROW_MS))
    }

    // On leaving, the green travels back in reverse (Work, About), the target
    // shrinks back to normal size, and "Let's talk" only lights once the green
    // has had time to arrive from where it was.
    const leave = () => {
      if (!active && !target) return
      const list = items()
      const t = target
      const idx = t ? list.indexOf(t) : list.length - 1
      // Give the reverse flashes time to finish so no station stays lit.
      const lastFlash = idx < list.length - 2 ? (list.length - 2 - idx) * STEP_MS + HOLD_MS : 0
      const total = Math.max((list.length - 1 - idx) * RETURN_STEP + RETURN_BASE, lastFlash)
      const mid = Math.round(total / 2)
      if (leaveTimer) clearTimeout(leaveTimer)
      if (departTimer) clearTimeout(departTimer)
      timers.forEach(clearTimeout)
      timers = []
      if (t) {
        departTimer = setTimeout(() => {
          t.classList.remove('nav-green')
          shrink(t)
        }, mid)
      }
      for (let j = idx + 1; j <= list.length - 2; j++) {
        const it = list[j]
        const delay = (j - idx) * STEP_MS
        later(() => {
          it.classList.add('nav-flash')
          later(() => it.classList.remove('nav-flash'), HOLD_MS)
        }, delay)
      }
      leaveTimer = setTimeout(() => {
        if (t) {
          t.classList.remove('nav-green')
          shrink(t)
          dock.classList.remove('has-target')
        }
        setDock(BASE_H)
        active = false
        target = null
      }, total)
    }

    const onItemEnter = (el) => () => hover(el)
    const listeners = items().map((el) => {
      const fn = onItemEnter(el)
      el.addEventListener('mouseenter', fn)
      return [el, fn]
    })

    const onDockLeave = () => {
      clearTimeout(leaveTimer)
      leaveTimer = setTimeout(leave, LEAVE_MS)
    }

    const onDocLeave = () => leave()

    dock.addEventListener('mouseleave', onDockLeave)
    document.addEventListener('mouseleave', onDocLeave)

    return () => {
      clearAll()
      listeners.forEach(([el, fn]) => el.removeEventListener('mouseenter', fn))
      dock.removeEventListener('mouseleave', onDockLeave)
      document.removeEventListener('mouseleave', onDocLeave)
      items().forEach((it) => {
        it.style.transform = ''
        it.style.marginRight = ''
        it.classList.remove('nav-green')
        it.classList.remove('nav-flash')
      })
      dock.style.height = ''
      dock.style.removeProperty('--dock-grow')
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const vg = () => document.querySelector('.vignette')
    let targetX = 50
    let targetY = 50
    let curX = 50
    let curY = 50
    let raf = null

    const tick = () => {
      curX += (targetX - curX) * 0.09
      curY += (targetY - curY) * 0.09
      const el = vg()
      if (el) {
        el.style.setProperty('--vx', `${curX}%`)
        el.style.setProperty('--vy', `${curY}%`)
      }
      if (Math.abs(targetX - curX) < 0.05 && Math.abs(targetY - curY) < 0.05) {
        raf = null
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 100
      targetY = (e.clientY / window.innerHeight) * 100
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}

export default function Layout() {
  return (
    <>
      <Background />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <LayoutEffects />
      <div className="noise-overlay" aria-hidden="true"></div>
    </>
  )
}
