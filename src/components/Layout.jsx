import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import CursorSpotlight from './CursorSpotlight'
import FerroDock from './FerroDock'
import Background from './Background'

function Navbar() {
  const [open, setOpen] = useState(false)
  const glassRef = useRef(null)

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
      <FerroDock targetRef={glassRef} />
      <div className="dock-glass" ref={glassRef}>
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
        <span>© {new Date().getFullYear()} Ankit · Made with ♥ and paws</span>
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
      document.querySelectorAll('.card, .btn, .skill-box, .social-big a, .nav-links a')

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
      <CursorSpotlight />
      <svg className="lg-filters" width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="lg-ca" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="cyan"
            />
            <feOffset in="red" dx="-2" dy="0" result="redS" />
            <feOffset in="cyan" dx="2" dy="0" result="cyanS" />
            <feBlend in="redS" in2="cyanS" mode="screen" />
          </filter>
        </defs>
      </svg>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <LayoutEffects />
      <div className="noise-overlay" aria-hidden="true"></div>
    </>
  )
}
