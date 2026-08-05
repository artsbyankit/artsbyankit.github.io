import { useEffect, useRef } from 'react'

const N = 64
const RADIUS = 320
const KM = 2600
const KS = 0.12
const KREST = 0.06
const KP = 0.55
const DAMP = 0.8
const MAX_DISP = 26
const MARGIN = 70
const EPS = 300

function roundedRectPerimeter(hw, hh, rr, n) {
  const seg = (x0, y0, x1, y1, len) => ({ x0, y0, dx: x1 - x0, dy: y1 - y0, len })
  const arc = (cx, cy, r, a0, a1) => ({ cx, cy, r, a0, a1, len: (a1 - a0) * r })
  const edges = [
    seg(-hw + rr, -hh, hw - rr, -hh, 2 * (hw - rr)),
    arc(hw - rr, -hh + rr, rr, -Math.PI / 2, 0),
    seg(hw, -hh + rr, hw, hh - rr, 2 * (hh - rr)),
    arc(hw - rr, hh - rr, rr, 0, Math.PI / 2),
    seg(hw - rr, hh, -hw + rr, hh, 2 * (hw - rr)),
    arc(-hw + rr, hh - rr, rr, Math.PI / 2, Math.PI),
    seg(-hw, hh - rr, -hw, -hh + rr, 2 * (hh - rr)),
    arc(-hw + rr, -hh + rr, rr, Math.PI, (3 * Math.PI) / 2),
  ]
  const total = edges.reduce((s, e) => s + e.len, 0)
  const step = total / n
  const pts = []
  let idx = 0
  let off = 0
  for (let i = 0; i < n; i++) {
    const t = i * step
    while (idx < edges.length - 1 && off + edges[idx].len < t) {
      off += edges[idx].len
      idx++
    }
    const e = edges[idx]
    const u = (t - off) / e.len
    if (e.dx !== undefined) {
      pts.push({ x: e.x0 + e.dx * u, y: e.y0 + e.dy * u })
    } else {
      const a = e.a0 + (e.a1 - e.a0) * u
      pts.push({ x: e.cx + e.r * Math.cos(a), y: e.cy + e.r * Math.sin(a) })
    }
  }
  return pts
}

function trace(ctx, pts) {
  const n = pts.length
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    ctx.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y,
    )
  }
  ctx.closePath()
}

export default function FerroDock({ targetRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef.current
    if (!canvas || !target) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let rest = []
    let pts = []
    let magnet = { x: 0, y: -9999, active: false }
    let raf = 0

    const areaOf = (list) => {
      let a = 0
      for (let i = 0; i < list.length; i++) {
        const p = list[i]
        const q = list[(i + 1) % list.length]
        a += p.x * q.y - q.x * p.y
      }
      return Math.abs(a) / 2
    }

    const build = () => {
      const r = target.getBoundingClientRect()
      w = r.width + MARGIN * 2
      h = r.height + MARGIN * 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cx = w / 2
      const cy = h / 2
      const hw = r.width / 2
      const hh = r.height / 2
      const rr = Math.min(hw, hh)
      rest = roundedRectPerimeter(hw, hh, rr, N).map((p) => ({ x: p.x + cx, y: p.y + cy }))
      pts = rest.map((p) => ({ x: p.x, y: p.y, vx: 0, vy: 0 }))
      magnet = { x: cx, y: -9999, active: false }
    }

    const onPointer = (e) => {
      const cr = canvas.getBoundingClientRect()
      magnet.x = e.clientX - cr.left
      magnet.y = e.clientY - cr.top
      magnet.active = true
    }
    const onLeave = () => {
      magnet.active = false
    }

    const step = () => {
      const n = pts.length
      let cx = 0
      let cy = 0
      for (let i = 0; i < n; i++) {
        cx += pts[i].x
        cy += pts[i].y
      }
      cx /= n
      cy /= n
      const area = areaOf(pts)
      const A0 = areaOf(rest)

      for (let i = 0; i < n; i++) {
        const p = pts[i]
        let fx = 0
        let fy = 0

        if (magnet.active) {
          const dx = magnet.x - p.x
          const dy = magnet.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          let fade = 1 - dist / RADIUS
          if (fade > 0) {
            fade *= fade
            const inv = fade / Math.pow(dist * dist + EPS, 1.5)
            fx += KM * dx * inv
            fy += KM * dy * inv
          }
        }

        for (const j of [(i - 1 + n) % n, (i + 1) % n]) {
          const q = pts[j]
          const dx = q.x - p.x
          const dy = q.y - p.y
          const d = Math.hypot(dx, dy) || 1
          const L0 = Math.hypot(rest[i].x - rest[j].x, rest[i].y - rest[j].y)
          const s = (KS * (d - L0)) / d
          fx += s * dx
          fy += s * dy
        }

        fx += KREST * (rest[i].x - p.x)
        fy += KREST * (rest[i].y - p.y)

        const nx = p.x - cx
        const ny = p.y - cy
        const nl = Math.hypot(nx, ny) || 1
        const dp = KP * (A0 - area)
        fx += (dp * nx) / nl
        fy += (dp * ny) / nl

        p.vx = (p.vx + fx) * DAMP
        p.vy = (p.vy + fy) * DAMP
        p.x += p.vx
        p.y += p.vy

        let dx = p.x - rest[i].x
        let dy = p.y - rest[i].y
        const d = Math.hypot(dx, dy)
        if (d > MAX_DISP) {
          p.x = rest[i].x + (dx / d) * MAX_DISP
          p.y = rest[i].y + (dy / d) * MAX_DISP
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.save()
      ctx.shadowColor = 'rgba(46, 204, 113, 0.5)'
      ctx.shadowBlur = 26
      ctx.fillStyle = 'rgba(46, 204, 113, 0.14)'
      trace(ctx, pts)
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(130, 230, 175, 0.1)'
      trace(ctx, pts)
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      step()
      draw()
      raf = requestAnimationFrame(loop)
    }

    build()
    raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(build)
    ro.observe(target)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [targetRef])

  return <canvas ref={canvasRef} className="dock-fluid" aria-hidden="true" />
}
