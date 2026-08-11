import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const RAINBOW = Array.from({ length: 7 })
const TAIL = Array.from({ length: 9 })
const LEGS = Array.from({ length: 15 })
const BREAD = Array.from({ length: 18 })
const HEAD = Array.from({ length: 30 })

function RainbowCat() {
  return (
    <svg className="animation-rainbow-cat" viewBox="0 0 70 20" aria-hidden="true">
      <defs>
        <linearGradient id="rainbow-colors" x1="0.5" x2="0.5" y2="1">
          <stop className="rainbow-color1" offset="0" />
          <stop className="rainbow-color1" offset="0.167" />
          <stop className="rainbow-color2" offset="0.167" />
          <stop className="rainbow-color2" offset="0.335" />
          <stop className="rainbow-color3" offset="0.335" />
          <stop className="rainbow-color3" offset="0.5" />
          <stop className="rainbow-color4" offset="0.5" />
          <stop className="rainbow-color4" offset="0.669" />
          <stop className="rainbow-color5" offset="0.669" />
          <stop className="rainbow-color5" offset="0.833" />
          <stop className="rainbow-color6" offset="0.833" />
          <stop className="rainbow-color6" offset="1" />
        </linearGradient>
      </defs>
      <g className="rainbow-cat">
        <g className="rainbow">
          {RAINBOW.map((_, i) => (
            <rect key={i} />
          ))}
        </g>
        <g className="cat">
          <g className="cat-tail" transform="translate(40, 5.5)">
            {TAIL.map((_, i) => (
              <rect key={i} />
            ))}
          </g>
          <g className="cat-legs" transform="translate(43, 5.5)">
            {LEGS.map((_, i) => (
              <rect key={i} />
            ))}
          </g>
          <g className="cat-bread" transform="translate(43, 5.5)">
            {BREAD.map((_, i) => (
              <rect key={i} />
            ))}
          </g>
          <g className="cat-head" transform="translate(43, 5.5)">
            {HEAD.map((_, i) => (
              <rect key={i} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}

export default function Cat() {
  const [flies, setFlies] = useState([])
  const flyId = useRef(0)

  const launch = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const id = ++flyId.current
    const side = Math.random() > 0.5 ? 'left' : 'right'
    const top = 5 + Math.random() * 85
    const dur = 2.8 + Math.random() * 1.4
    setFlies((f) => [...f, { id, side, top, dur }])
    setTimeout(() => setFlies((f) => f.filter((x) => x.id !== id)), 5000)
  }

  return (
    <>
      <span className="cat-logo" onDoubleClick={launch} aria-hidden="true">
        <span className="cat-logo-dot"></span>
      </span>
      {createPortal(
        <>
          {flies.map((f) => (
            <span
              key={f.id}
              className={`fly-cat${f.side === 'right' ? ' from-right' : ''}`}
              style={{ '--fly-top': `${f.top}%`, '--fly-dur': `${f.dur}s` }}
            >
              <RainbowCat />
            </span>
          ))}
        </>,
        document.body,
      )}
    </>
  )
}
