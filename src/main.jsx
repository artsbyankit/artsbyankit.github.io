import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './fonts.css'
import './theme.js' // 🎨 MATERIAL EDITOR — colors live here
import './index.css'
import './themeColor.js'
import App from './App.jsx'
import { initLiquidGlass } from './liquidGlass.js'

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
const root = document.getElementById('root')
// Production pages arrive pre-rendered (vite.config.js): hydrate that HTML in
// place. If the HTML was rendered for a different path (an offline fallback, a
// host serving the home page for unknown URLs), it can't be hydrated, so it is
// replaced. Dev and the 404 shell start empty and render from scratch.
const path = window.location.pathname.replace(/\/+$/, '') || '/'
if (root.firstElementChild && root.dataset.path === path) {
  hydrateRoot(root, app)
} else {
  root.replaceChildren()
  createRoot(root).render(app)
}
initLiquidGlass()

// Offline/instant repeat-visit caching — production only (dev uses HMR).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Firefox Android doesn't always composite backdrop-filter until a full
// repaint — that's why frost "appears" only after switching apps. Nudge ONCE
// after load; repeated toggling does more harm than good.
window.addEventListener('load', () => {
  setTimeout(() => {
    const el = document.documentElement
    el.style.transform = 'translateZ(0)'
    requestAnimationFrame(() => {
      el.style.transform = ''
    })
  }, 400)
})
