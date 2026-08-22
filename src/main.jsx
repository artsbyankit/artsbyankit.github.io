import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './theme.js' // 🎨 MATERIAL EDITOR — colors live here
import './adaptiveAccent.js' // accent reacts to the animated bg
import './index.css'
import './themeColor.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Offline/instant repeat-visit caching — production only (dev uses HMR).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// The AIDesigner runtime injects its "Made in AIDesigner" badge into <body>;
// remove it as soon as it appears so it never lingers on the page.
new MutationObserver(() => {
  document.querySelectorAll('[data-aifx-wm]').forEach((el) => el.remove())
}).observe(document.documentElement, { childList: true, subtree: true })

// Watchdog: if the effect runtime loaded but never materialized a canvas in
// the visible bg tier (happens on some Firefox/Android builds), retry it once.
setTimeout(() => {
  const tier = [...document.querySelectorAll('.bg-effect')].find(
    (el) => getComputedStyle(el).display !== 'none',
  )
  if (tier && !tier.querySelector('canvas')) {
    const retry = document.createElement('script')
    retry.src = 'https://cdn.aidesigner.ai/effects/runtime/v1.js'
    retry.async = true
    document.body.appendChild(retry)
  }
}, 3000)

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
