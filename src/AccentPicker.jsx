// 🎨 TEMP accent playground — Photoshop-style live color picker.
// Only appears when the URL contains ?picker — visitors never see it.
// Pick ONE color; the family (deep/strong/bright) is derived from it and
// fed straight into setLiveAccent(), so the entire site re-tints live.
import { useEffect, useState } from 'react'
import { setLiveAccent } from './theme.js'

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

const hsl = (h, s, l) =>
  `hsl(${Math.round(h)} ${Math.round(Math.min(Math.max(s, 0), 100))}% ${Math.round(
    Math.min(Math.max(l, 0), 100),
  )}%)`

function derive(hex) {
  const [h, s, l] = hexToHsl(hex)
  const S = s * 100
  const L = l * 100
  return {
    deep: hsl(h, S * 0.95, Math.max(30, L * 0.62)),
    strong: hsl(h, S * 0.9, Math.max(24, L * 0.46)),
    bright: hsl(h, Math.min(S * 1.12, 96), Math.min(L * 1.18 + 4, 80)),
  }
}

export default function AccentPicker() {
  const [enabled, setEnabled] = useState(false)
  const [hex, setHex] = useState('#f2b8cf')

  // Gate: only run when ?picker is in the URL; restore last session's pick
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('picker')) return
    setEnabled(true)
    const saved = localStorage.getItem('accent-pick')
    if (saved) {
      setHex(saved)
      apply(saved)
    }
  }, [])

  function apply(h) {
    setLiveAccent(derive(h))
    try {
      localStorage.setItem('accent-pick', h)
    } catch {}
  }

  function onChange(e) {
    const v = e.target.value
    setHex(v)
    apply(v)
  }

  function reset() {
    localStorage.removeItem('accent-pick')
    window.location.reload()
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`export const accent = '${hex}';`)
      alert('Copied! Paste it as the accent in src/theme.js')
    } catch {}
  }

  if (!enabled) return null

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 90,
        zIndex: 99999,
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(31,56,88,.25)',
        borderRadius: 16,
        padding: 14,
        width: 230,
        boxShadow: '0 12px 40px rgba(31,56,88,.35)',
        fontFamily: 'ui-sans-serif, system-ui',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 13, color: '#12233a', marginBottom: 10 }}>
        🎨 Accent playground
      </div>
      <input
        type="color"
        value={hex}
        onChange={onChange}
        style={{ width: '100%', height: 44, border: 'none', borderRadius: 10, cursor: 'pointer' }}
      />
      <input
        type="text"
        value={hex}
        onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && onChange(e)}
        style={{
          width: '100%',
          marginTop: 8,
          padding: '6px 8px',
          borderRadius: 8,
          border: '1px solid rgba(31,56,88,.25)',
          font: '600 13px ui-monospace, monospace',
          color: '#12233a',
        }}
      />
      <div
        style={{
          marginTop: 8,
          height: 26,
          borderRadius: 8,
          background: hex,
          border: '1px solid rgba(31,56,88,.2)',
        }}
      />
      <button onClick={copy} style={btnStyle}>
        Copy for theme.js
      </button>
      <button onClick={reset} style={{ ...btnStyle, background: 'rgba(31,56,88,.08)' }}>
        Reset
      </button>
    </div>
  )
}

const btnStyle = {
  width: '100%',
  marginTop: 8,
  padding: '8px 0',
  borderRadius: 10,
  border: 'none',
  background: '#12233a',
  color: '#fff',
  fontWeight: 700,
  fontSize: 12,
  cursor: 'pointer',
}
