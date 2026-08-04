import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import CursorSpotlight from './CursorSpotlight'

function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const close = () => setOpen(false)
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-dot"></span>
          ankit<span className="gradient-text">.design</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
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
        </nav>

        <button
          type="button"
          className="theme-toggle"
          aria-label="Toggle dark or light theme"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Ankit. Designed & built with care.</span>
        <div className="footer-social">
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
          <a href="https://www.linkedin.com/in/artsbyankit" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://t.me/MadeByAnkit" target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href="https://web.whatsapp.com/send?phone=918758789018" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="https://www.behance.net/ArtByAnkit" target="_blank" rel="noreferrer">
            Behance
          </a>
          <a href="https://www.instagram.com/artsbyankit" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://github.com/artsbyankit" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
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
      document.querySelectorAll('.card, .btn, .skill-box, .social-big a, .footer-social a')

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

  return null
}

export default function Layout() {
  return (
    <>
      <div className="bg-orbs" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </div>
      <div className="vignette" aria-hidden="true"></div>
      <CursorSpotlight />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LayoutEffects />
      <div className="noise-overlay" aria-hidden="true"></div>
    </>
  )
}
