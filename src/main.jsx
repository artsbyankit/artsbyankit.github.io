import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
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
