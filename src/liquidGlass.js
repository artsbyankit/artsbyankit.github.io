// Liquid glass — real refraction for every glass surface, not just a blur.
//
// Each surface is modelled as a slab of glass with a rounded bevel. For every
// pixel a vertical light ray enters the curved surface, bends by Snell's law,
// and travels through the glass to the backdrop plane; how far it landed
// sideways becomes one pixel of a displacement map. Small surfaces also get a
// separate pass per colour channel, each bending slightly differently, for the
// faint rainbow fringe of real glass (dispersion).
//
// Any CSS rule using `backdrop-filter: var(--lg-filter, ...)` opts in: the rules
// are found by reading the stylesheet, and each matching element gets a filter
// built for its exact size and corner radius.
//
// backdrop-filter: url() only renders in Chromium. Other browsers, low-spec
// machines and reduced-transparency users never get --lg-filter, so the CSS
// falls back to the site's standard --frost recipe.

// Optical settings, overridable per surface with --lg-* custom properties.
const OPTICS = {
  ior: ['--lg-ior', 1.5],
  bezel: ['--lg-bezel', 0.55], // curved edge width, relative to the corner radius
  bezelMax: ['--lg-bezel-max', 28], // px; raise it and the whole surface becomes a lens
  thickness: ['--lg-thickness', 1.45], // glass height, relative to the bezel
  dispersion: ['--lg-dispersion', 0.05], // how much more blue bends than red
  saturate: ['--lg-saturate', 1.3],
  rim: ['--lg-rim-blur', -1], // 0 or more: frost only the centre, keep the bent rim sharp
  dome: ['--lg-dome', -1], // 0 or more: a true glass dome on a base this thick (relative to the bezel)
  marble: ['--lg-marble', 0], // 1: a solid glass sphere resting on the page, instead of a dome
  soften: ['--lg-soften', 0], // px of anti-aliasing after the bend, which browsers don't do themselves
}
const BEZEL_MIN = 6
const SMALL_AREA = 60000 // px², below this a surface can afford dispersion
// A map is the single most expensive part of the filter, and its cost follows its pixel
// count, not the surface's. It's a smooth gradient that the browser scales up cleanly, so
// each kind of surface uses the smallest map that still looks the same.
const MAP_SCALE = { panel: 0.25, lens: 0.5, marble: 1, plain: 0.5 }
const DOCK_MAP_SCALE = 0.5
const RESIZE_SETTLE_MS = 140 // wait out animations like the dock swell
const MAX_FILTERS = 80
const SLOW_FPS = 40
const SLOW_WINDOWS = 4 // seconds in a row
const WATCH_MS = 45000

const SVG_NS = 'http://www.w3.org/2000/svg'
const CHANNELS = {
  r: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
  g: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0',
  b: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0',
}

const filters = new Map() // "w x h x r" -> url(#id), shared between same-size surfaces
let defs = null
let sliceCount = 0

// Squircle bevel: 0 at the outer edge, 1 where the surface goes flat.
const bevel = (t) => (1 - (1 - t) ** 4) ** 0.25

// Sideways travel of a ray hitting the bevel at `t` (0 edge, 1 flat). Negative:
// the ray bends inward, toward the surface's centre.
function refractedOffset(t, bezel, thickness, ior) {
  const eps = 0.005
  const slope = (thickness * (bevel(t + eps) - bevel(t - eps))) / (2 * eps * bezel)
  const len = Math.hypot(slope, 1)
  const cosI = 1 / len
  const eta = 1 / ior
  const k = 1 - eta * eta * (1 - cosI * cosI)
  const bend = eta * cosI - Math.sqrt(k)
  const rayOut = (bend * slope) / len
  const rayDown = eta - bend / len
  return (rayOut / rayDown) * thickness * bevel(t)
}

// Sideways travel through a spherical dome, per unit of bezel, for a ray landing a
// fraction r of the way from the centre to the rim. Snell's law, nothing fitted:
// the ray enters at asin(r), bends to asin(r / ior) and crosses the glass below it.
function domeOffset(r, base, ior) {
  const incident = Math.asin(r)
  const refracted = Math.asin(r / ior)
  return -(Math.sqrt(1 - r * r) + base) * Math.tan(incident - refracted)
}

// The same ray, followed all the way through a solid sphere of radius 1 resting on
// the page: bent going in, bent again coming out, then on down to the page. It lands
// close to the middle (a strong magnification) and past it near the rim (the flipped
// image in a real marble). Rays that would miss the page are eased onto the far edge.
function marbleOffset(r, ior) {
  const incident = Math.asin(r)
  const refracted = Math.asin(r / ior)
  const turn = 2 * (incident - refracted)
  const exitX = Math.sin(2 * refracted - incident)
  const exitZ = -Math.cos(incident - 2 * refracted)
  const fall = Math.cos(turn)
  const landed = fall > 0.05 ? exitX - ((exitZ + 1) / fall) * Math.sin(turn) : -Infinity
  // Soft limit: stays true in the middle, never leaves the marble.
  const eased = landed < -0.55 ? -0.55 - 0.4 * Math.tanh((-landed - 0.55) / 0.4) : landed
  return eased - r
}

function buildMap(w, h, radius, optics, capped = true, fullSize = false) {
  const marble = optics.marble > 0
  const dome = marble || optics.dome >= 0
  const kind = optics.rim >= 0 ? 'panel' : marble ? 'marble' : dome ? 'lens' : 'plain'
  const res = fullSize ? 1 : MAP_SCALE[kind]
  const mw = Math.round(w * res)
  const mh = Math.round(h * res)
  const wanted = radius * optics.bezel
  const bezel = capped ? Math.min(Math.max(wanted, BEZEL_MIN), optics.bezelMax) : wanted
  const thickness = bezel * optics.thickness

  const steps = dome ? 256 : 64
  const table = new Float32Array(steps + 1)
  let max = 0
  for (let i = 0; i < steps; i++) {
    table[i] = marble
      ? marbleOffset(1 - i / steps, optics.ior) * bezel
      : dome
      ? domeOffset(1 - i / steps, optics.dome, optics.ior) * bezel
      : refractedOffset(Math.max(i / steps, 0.02), bezel, thickness, optics.ior)
    max = Math.max(max, Math.abs(table[i]))
  }
  max = max || 1

  const canvas = document.createElement('canvas')
  canvas.width = mw
  canvas.height = mh
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(mw, mh)
  const split = optics.rim >= 0
  const maskCanvas = split ? document.createElement('canvas') : null
  const maskImg = split ? ctx.createImageData(mw, mh) : null
  const hw = w / 2
  const hh = h / 2

  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const o = (y * mw + x) * 4
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 128
      img.data[o + 3] = 255
      // Signed distance to the rounded rectangle, plus its outward direction.
      const px = (x + 0.5) / res - hw
      const py = (y + 0.5) / res - hh
      const qx = Math.abs(px) - (hw - radius)
      const qy = Math.abs(py) - (hh - radius)
      const corner = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
      const dist = radius - corner - Math.min(Math.max(qx, qy), 0)
      if (dist <= 0 || dist >= bezel) continue
      let nx = 0
      let ny = 0
      if (corner > 0) {
        nx = (Math.max(qx, 0) / corner) * Math.sign(px)
        ny = (Math.max(qy, 0) / corner) * Math.sign(py)
      } else if (qx > qy) {
        nx = Math.sign(px)
      } else {
        ny = Math.sign(py)
      }
      const at = (dist / bezel) * steps
      const low = Math.floor(at)
      const offset = (dome ? table[low] + (table[low + 1] - table[low]) * (at - low) : table[low]) / max
      img.data[o] = 128 + nx * offset * 127
      img.data[o + 1] = 128 + ny * offset * 127
      if (split) {
        maskImg.data[o] = maskImg.data[o + 1] = maskImg.data[o + 2] = 255
        maskImg.data[o + 3] = 255 * Math.min(1, (1 - dist / bezel) * 1.7)
      }
    }
  }
  ctx.putImageData(img, 0, 0)
  if (split) {
    maskCanvas.width = mw
    maskCanvas.height = mh
    maskCanvas.getContext('2d').putImageData(maskImg, 0, 0)
  }
  return { canvas, maskCanvas, scale: max * 2 }
}

const channelPass = (channel, factor, scale) => `
  <feDisplacementMap in="soft" in2="map" scale="${(scale * factor).toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="d${channel}" />
  <feColorMatrix in="d${channel}" type="matrix" values="${CHANNELS[channel]} 0 0 0 1 0" result="${channel}" />`

function filterMarkup(w, h, optics, { href, maskHref, scale }) {
  // Big cards, as on iOS: a heavily frosted centre inside a sharper, bent rim.
  if (maskHref) {
    return `
      <feGaussianBlur in="SourceGraphic" stdDeviation="${optics.blur}" result="soft" />
      <feImage href="${href}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map" />
      <feImage href="${maskHref}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="edge" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="bent" />
      <feComposite in="bent" in2="edge" operator="in" result="rim" />
      <feMerge result="out"><feMergeNode in="soft" /><feMergeNode in="rim" /></feMerge>
      <feColorMatrix in="out" type="saturate" values="${optics.saturate}" />`
  }
  const refract =
    w * h < SMALL_AREA && optics.dispersion > 0
      ? `${channelPass('r', 1 - optics.dispersion * 0.8, scale)}
         ${channelPass('g', 1, scale)}
         ${channelPass('b', 1 + optics.dispersion, scale)}
         <feBlend in="r" in2="g" mode="screen" result="rg" />
         <feBlend in="rg" in2="b" mode="screen" result="out" />`
      : `<feDisplacementMap in="soft" in2="map" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G" result="out" />`
  const soften = optics.soften > 0 ? `<feGaussianBlur in="out" stdDeviation="${optics.soften}" result="out" />` : ''
  return `
    <feGaussianBlur in="SourceGraphic" stdDeviation="${optics.blur}" result="soft" />
    <feImage href="${href}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map" />
    ${refract}
    ${soften}
    <feColorMatrix in="out" type="saturate" values="${optics.saturate}" />`
}

function createFilter(id, w, h, optics, map) {
  if (!defs) {
    const svg = document.createElementNS(SVG_NS, 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.position = 'absolute'
    defs = document.createElementNS(SVG_NS, 'defs')
    svg.appendChild(defs)
    document.body.appendChild(svg)
  }

  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.id = id
  filter.setAttribute('filterUnits', 'userSpaceOnUse')
  filter.setAttribute('primitiveUnits', 'userSpaceOnUse')
  filter.setAttribute('x', '0')
  filter.setAttribute('y', '0')
  filter.setAttribute('width', w)
  filter.setAttribute('height', h)
  filter.setAttribute('color-interpolation-filters', 'sRGB')
  filter.innerHTML = filterMarkup(w, h, optics, map)
  defs.appendChild(filter)
  return `url(#${id})`
}

function filterFor(w, h, radius, optics) {
  const key = [w, h, radius, ...Object.values(optics)].join('x').replace(/\./g, '_')
  if (filters.has(key)) return filters.get(key)

  const { canvas, maskCanvas, scale } = buildMap(w, h, radius, optics)
  const value = createFilter(`liquid-glass-${key}`, w, h, optics, {
    href: canvas.toDataURL('image/png'),
    maskHref: maskCanvas?.toDataURL('image/png'),
    scale,
  })
  filters.set(key, value)
  return value
}

// A pill that swells (the nav dock) is cut into left cap, middle and right cap,
// each with its own fixed filter. Scaling them is GPU work and never rebuilds a
// filter. The caps only ever scale uniformly, so they stay true half-circles at
// any size, while the middle (which bends light vertically only) absorbs the
// extra width.
function buildSlices(box, w, h, optics) {
  const size = Math.round(h)
  const cap = size / 2
  // A backdrop filter can only sample inside its own box, so each piece is wider
  // than what shows, leaving it real background to bend, and is clipped back.
  const room = Math.ceil(size * 0.75)
  const midPad = 8
  const midWidth = Math.max(Math.round(w - h), 1)
  const { canvas, scale } = buildMap(size + room * 2 + 4, size, cap, optics, false, true)
  const cut = (x, width) => {
    const part = document.createElement('canvas')
    part.width = Math.max(Math.round(width * DOCK_MAP_SCALE), 1)
    part.height = Math.round(size * DOCK_MAP_SCALE)
    const ctx = part.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(canvas, x, 0, width, size, 0, 0, part.width, part.height)
    return part.toDataURL('image/png')
  }
  const place = (name, width, sourceX, sourceWidth, clip, passes = optics) => {
    const el = box.querySelector(`.lg-slice-${name}`)
    el.style.width = `${width}px`
    el.style.height = `${size}px`
    el.style.clipPath = clip
    const map = { href: cut(sourceX, sourceWidth), scale }
    el.style.setProperty('--lg-slice', createFilter(`liquid-glass-slice-${name}-${++sliceCount}`, width, size, passes, map))
    return el
  }
  return {
    size,
    midWidth,
    midPad,
    left: place('left', cap + room, 0, cap + room, `inset(0 ${room}px 0 0 round ${cap}px 0 0 ${cap}px)`),
    mid: place('mid', midWidth + midPad * 2, cap + room, 4, `inset(0 ${midPad}px)`, { ...optics, dispersion: 0 }),
    right: place('right', cap + room, cap + room + 4, cap + room, `inset(0 0 0 ${room}px round 0 ${cap}px ${cap}px 0)`),
  }
}

function placeSlices({ size, midWidth, midPad, left, mid, right }, width, height) {
  const s = height / size
  const overlap = 0.5 // hides hairline gaps at fractional scales
  const sx = (width - height + overlap * 2) / midWidth
  left.style.transform = `scale(${s})`
  right.style.transform = `scale(${s})`
  mid.style.transform = `translateX(${height / 2 - overlap - midPad * sx}px) scale(${sx}, ${s})`
}

// Every selector in the stylesheet that opts in via var(--lg-filter, ...).
function glassSelector() {
  const found = []
  const walk = (rules) => {
    for (const rule of rules) {
      if (rule.cssRules && !rule.selectorText) walk(rule.cssRules)
      else if (rule.selectorText && rule.cssText.includes('--lg-filter,')) found.push(rule.selectorText)
    }
  }
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules)
    } catch {
      /* cross-origin sheet */
    }
  }
  return found.join(', ')
}

function radiusOf(style, w, h) {
  const raw = style.borderTopLeftRadius
  const value = parseFloat(raw) || 0
  const px = raw.endsWith('%') ? (value / 100) * Math.min(w, h) : value
  return Math.round(Math.min(px, w / 2, h / 2))
}

// A little frost scales with size: tags stay crystal clear, while panels that
// hold paragraphs of text keep them readable over the moving background. A rule
// can override it with --lg-blur (the dock floats over everything, so it does).
function blurOf(style, w, h) {
  const custom = parseFloat(style.getPropertyValue('--lg-blur'))
  if (!Number.isNaN(custom)) return custom
  return h < 80 ? 0.5 : w * h < SMALL_AREA ? 1.5 : 3
}

function opticsOf(style, w, h) {
  const optics = { blur: blurOf(style, w, h) }
  for (const [name, [prop, fallback]] of Object.entries(OPTICS)) {
    const value = parseFloat(style.getPropertyValue(prop))
    optics[name] = Number.isNaN(value) ? fallback : value
  }
  return optics
}

export function initLiquidGlass() {
  if (
    !/Chrome\/|Chromium\//.test(navigator.userAgent) ||
    document.documentElement.classList.contains('low-spec') ||
    window.matchMedia('(prefers-reduced-transparency: reduce)').matches
  )
    return

  const selector = glassSelector()
  if (!selector) return
  document.documentElement.classList.add('liquid-glass')

  const tracked = new Set()
  const pending = new Set()
  let settleTimer = null

  const apply = (el) => {
    const w = el.offsetWidth
    const h = el.offsetHeight
    if (!w || !h) return
    const style = getComputedStyle(el)
    const filter = filterFor(w, h, radiusOf(style, w, h), opticsOf(style, w, h))
    el.style.setProperty('--lg-filter', filter)
  }
  // Drop filters nothing uses any more (sizes left behind by window resizes).
  const sweep = () => {
    if (filters.size <= MAX_FILTERS) return
    const inUse = new Set([...tracked].map((el) => el.style.getPropertyValue('--lg-filter')))
    for (const [key, value] of filters) {
      if (inUse.has(value)) continue
      defs.querySelector(value.slice(4, -1))?.remove()
      filters.delete(key)
    }
  }

  // A surface's first map is built right away so it never flashes frost. Later
  // size changes wait to settle, so an animation doesn't rebuild every frame.
  const ro = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      if (target.style.getPropertyValue('--lg-filter')) pending.add(target)
      else apply(target)
    }
    if (!pending.size) return
    clearTimeout(settleTimer)
    settleTimer = setTimeout(() => {
      pending.forEach((el) => el.isConnected && apply(el))
      pending.clear()
      sweep()
    }, RESIZE_SETTLE_MS)
  })

  const slices = new WeakMap()
  const follow = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const box = target.querySelector(':scope > .lg-slices')
      const { width, height } = target.getBoundingClientRect()
      if (!height) continue
      if (!slices.has(box)) slices.set(box, buildSlices(box, width, height, opticsOf(getComputedStyle(target), width, height)))
      placeSlices(slices.get(box), width, height)
    }
  })

  // Maps are built as a surface nears the screen, so nothing is computed for parts of
  // the page nobody has scrolled to. The margin is wide enough that it's ready on arrival.
  const near = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue
        near.unobserve(target)
        ro.observe(target)
      }
    },
    { rootMargin: '1200px 0px' },
  )

  const scan = () => {
    for (const el of tracked) {
      if (!el.isConnected) {
        near.unobserve(el)
        ro.unobserve(el)
        tracked.delete(el)
      }
    }
    for (const box of document.querySelectorAll('.lg-slices')) follow.observe(box.parentElement)
    for (const el of document.querySelectorAll(selector)) {
      if (el.querySelector(':scope > .lg-slices')) continue
      // Glass nested inside a backdrop-filtered parent only sees that parent, so
      // there's nothing to refract; it keeps the plain frost fallback.
      const host = el.parentElement.closest(selector)
      if (!tracked.has(el) && (!host || getComputedStyle(host).backdropFilter === 'none')) {
        tracked.add(el)
        near.observe(el)
      }
    }
  }

  let queued = false
  new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      scan()
    })
  }).observe(document.body, { childList: true, subtree: true })
  scan()
  watchFrameRate()
}

// Slower machines keep the nav and cards as real glass but drop it on small controls,
// which are the most numerous. Only sustained slowness counts, only while the page is in
// front (browsers throttle pages behind other windows), and the check stops itself.
function watchFrameRate() {
  const root = document.documentElement
  try {
    if (sessionStorage.getItem('lg-lite')) {
      root.classList.add('lg-lite')
      return
    }
  } catch {
    /* storage can be blocked; the check below still works */
  }
  const started = performance.now()
  let frames = 0
  let windowStart = started
  let slow = 0
  const tick = (now) => {
    frames++
    if (now - windowStart >= 1000) {
      const fps = (frames * 1000) / (now - windowStart)
      const watching = !document.hidden && document.hasFocus()
      slow = watching && fps < SLOW_FPS ? slow + 1 : 0
      frames = 0
      windowStart = now
      if (slow >= SLOW_WINDOWS) {
        root.classList.add('lg-lite')
        try {
          sessionStorage.setItem('lg-lite', '1')
        } catch {
          /* fine, it just re-checks on the next visit */
        }
        return
      }
    }
    if (now - started < WATCH_MS) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
