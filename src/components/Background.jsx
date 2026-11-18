// Site background: a fixed powder-blue ramp (index.css, .bg-host::before) with
// one WebGL layer painted over it: soft clouds, a dither dot grid and a live
// ASCII plasma field.
//
// Everything in the layer lives in *page* space: it scrolls with the content,
// glyph for glyph, and because it is generated procedurally it never ends — the
// page can be any length and there is no tile or seam.
//
// Interaction: the field swells under the mouse, a click sends a ripple through
// it, and scrolling makes it flow a little faster. On load the glyphs "decode"
// in, top first. Reduced motion keeps only the scroll-following.
//
// The whole layer is one fragment shader, so the CPU computes nothing per
// pixel. A canvas-2D renderer (glyphs only) is kept for browsers without WebGL.
//
// In-house and dependency-free: no third-party animation runtime, no network
// requests, nothing for the CSP in vite.config.js to allow.
// Ink colours are derived from src/theme.js — edit the palette there and the
// field follows.
import { useEffect, useRef } from 'react'
import { bgPalette } from '../theme'

// ASCII density ramp: blank → sparse → dense. Stops at '%' because '@' fuses
// into a blob at this glyph size.
const RAMP = ' .,:-=+*#%'

// Roughly how many characters fit across the viewport. Fewer = bigger glyphs.
const MAX_COLS = 150

// Overall strength of the glyph layer.
const GLYPH_OPACITY = 0.85

const MAX_INKS = 8
const MAX_RIPPLES = 3
const RIPPLE_LIFE = 1.8 // seconds
const REVEAL_TIME = 1.1 // seconds

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;
uniform vec2 u_res;      // canvas size, device px
uniform vec2 u_cell;     // glyph cell, device px
uniform float u_dpr;
uniform float u_scroll;  // page scroll, device px
uniform float u_time;    // field clock (speeds up while scrolling)
uniform float u_reveal;  // 0 → 1 load-in progress
uniform float u_lane;    // how much to calm the centre reading column
uniform vec3 u_pointer;  // xy: page device px, z: strength 0..1
uniform vec4 u_ripples[${MAX_RIPPLES}]; // xy: page device px, z: age 0..1, w: on
uniform float u_chars;
uniform float u_inkCount;
uniform vec4 u_tints[${MAX_INKS}];
uniform sampler2D u_atlas;

vec4 tintAt(float i) {
  vec4 c = u_tints[0];
  for (int k = 1; k < ${MAX_INKS}; k++) {
    if (float(k) <= i + 0.5) c = u_tints[k];
  }
  return c;
}

float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

// 4x4 ordered dither, so the discrete character ramp reads as a smooth field.
float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.5 * vnoise(p);
  v += 0.25 * vnoise(p * 2.03 + 17.0);
  v += 0.125 * vnoise(p * 4.01 + 31.0);
  return v / 0.875;
}

// Plasma: interfering waves on a doubly warped domain. Every term is bounded
// and position-independent, so the field looks the same a mile down the page.
float plasma(vec2 p, float t) {
  vec2 q = p + 0.18 * vec2(sin(p.y * 3.3 + t * 0.6), sin(p.x * 2.9 - t * 0.5));
  q += 0.06 * vec2(sin(q.y * 7.1 - t * 0.8), sin(q.x * 6.3 + t * 0.7));
  vec2 r = vec2(sin(q.x * 1.7 + t * 0.3), sin(q.y * 1.9 - t * 0.25));
  float v = sin(q.x * 8.0 + t * 1.1)
          + sin(q.y * 7.0 - t * 0.9)
          + sin((q.x + q.y) * 5.0 + t * 1.3)
          + sin(length(r) * 9.0 - t);
  return v * 0.25;
}

// "Over" compositing in premultiplied space.
void over(inout vec4 dst, vec3 rgb, float a) {
  dst.rgb = rgb * a + dst.rgb * (1.0 - a);
  dst.a = a + dst.a * (1.0 - a);
}

void main() {
  // Viewport position (device px, y down) and the matching page position.
  vec2 view = vec2(v_uv.x, 1.0 - v_uv.y) * u_res;
  vec2 page = view + vec2(0.0, u_scroll);
  // Normalised to the viewport height: same shapes at any window size.
  vec2 p = page / u_res.y;
  float layerIn = smoothstep(0.0, 0.6, u_reveal);

  vec4 col = vec4(0.0);

  // Soft clouds: white highlights and deeper-blue pools, drifting very slowly.
  float cloud = fbm(p * 1.3 + vec2(u_time * 0.015, 0.0));
  over(col, vec3(1.0), smoothstep(0.52, 0.82, cloud) * 0.5 * layerIn);
  over(col, vec3(0.51, 0.655, 0.804), smoothstep(0.42, 0.12, cloud) * 0.45 * layerIn);

  // Fine dither dot grid (7 CSS px), appearing in patches.
  vec2 css = page / u_dpr;
  float dots = 1.0 - smoothstep(0.9, 1.3, length(mod(css, 7.0) - 3.5));
  float patches = smoothstep(0.5, 0.78, vnoise(p * 1.6 + 7.0));
  over(col, vec3(0.275, 0.431, 0.686), dots * patches * 0.1 * layerIn);

  // ASCII glyphs, locked to a page-space grid.
  vec2 cellPos = page / u_cell;
  vec2 cell = floor(cellPos);
  vec2 f = fract(cellPos);
  vec2 cp = (cell + 0.5) * u_cell / u_res.y;

  float v = plasma(cp, u_time);
  // Large, slow "weather": some stretches of the page are calmer than others.
  float weather = smoothstep(0.2, 0.8, vnoise(cp * 0.45 + vec2(0.0, u_time * 0.03)));
  float shade = clamp(v * 0.5 + 0.5, 0.0, 1.0);
  shade = clamp((shade - 0.5) * 1.75 + 0.46 - (1.0 - weather) * 0.12, 0.0, 1.0);

  // Calmer centre column where the text sits (wide screens only).
  float cx = (cell.x + 0.5) * u_cell.x / u_res.x - 0.5;
  shade -= u_lane * exp(-cx * cx / 0.06);

  // Pointer: a soft swell of denser glyphs that follows the mouse.
  vec2 pc = u_pointer.xy / u_res.y;
  float dist = length(cp - pc);
  float near = u_pointer.z * exp(-dist * dist / 0.012);
  shade += near * 0.4;

  // Click ripples: a ring of dense glyphs travelling outward.
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    vec4 rp = u_ripples[i];
    if (rp.w > 0.5) {
      float age = rp.z;
      float d = length(cp - rp.xy / u_res.y);
      float ring = d - age * 0.75;
      shade += (1.0 - age) * (1.0 - age) * 0.55 * exp(-ring * ring / 0.0016);
    }
  }

  shade = clamp(shade + (bayer4(cell) - 0.5) * 0.11, 0.0, 1.0);

  // Decode-in: each cell appears at its own moment, top of the screen first.
  float cellHash = hash(cell);
  float delay = 0.55 * cellHash + 0.35 * clamp(view.y / u_res.y, 0.0, 1.0);
  float shown = smoothstep(delay, delay + 0.1, u_reveal);
  // Before it settles, a cell flickers through random glyphs.
  float scramble = (1.0 - shown) * step(0.001, u_reveal);
  if (scramble > 0.0) {
    shade = mix(shade, hash(cell + floor(u_reveal * 24.0)), scramble);
  }

  float level = shade * u_chars;
  float ci = min(floor(level), u_chars - 1.0);
  if (ci > 0.5) {
    vec2 uv = vec2((ci + clamp(f.x, 0.0, 0.999)) / u_chars, clamp(f.y, 0.0, 0.999));
    float a = texture2D(u_atlas, uv).a;
    // Between ramp steps, glyph opacity carries the remainder: smoother tone.
    a *= 0.72 + 0.28 * fract(level);
    // Ink blends continuously along the palette instead of stepping.
    float t = (ci / (u_chars - 1.0)) * (u_inkCount - 1.0);
    vec4 tint = mix(tintAt(floor(t)), tintAt(min(floor(t) + 1.0, u_inkCount - 1.0)), fract(t));
    // Near the pointer, ink leans toward the palette's deepest blue.
    tint = mix(tint, tintAt(u_inkCount - 1.0), near * 0.6);
    over(col, tint.rgb, tint.a * a * ${GLYPH_OPACITY.toFixed(2)} * max(shown, scramble * 0.6));
  }

  gl_FragColor = col.a > 0.0 ? vec4(col.rgb / col.a, col.a) : vec4(0.0);
}
`

const hexToRgb = (hex) => {
  const m = /^#?([\da-f]{6})$/i.exec(String(hex).trim())
  if (!m) return [130, 167, 205] // bgPalette.base as a safe fallback
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const luminance = (rgb) => (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255

// Ink ramp for sparse → dense glyphs: the bgPalette from lightest down to its
// deepest blue. Nothing darker than the palette's own blue, so the field never
// competes with the dark body text sitting on top of it.
function inkRamp() {
  const seen = new Set()
  return [bgPalette.base, ...(bgPalette.colors || [])]
    .filter((hex) => typeof hex === 'string')
    .map((hex) => hex.trim())
    .filter((hex) => !seen.has(hex.toLowerCase()) && seen.add(hex.toLowerCase()))
    .map((hex) => ({ hex, lum: luminance(hexToRgb(hex)) }))
    .sort((a, b) => b.lum - a.lum)
    .slice(0, MAX_INKS)
    .map((tone, i, list) => ({ hex: tone.hex, alpha: 0.55 + (0.4 * i) / Math.max(1, list.length - 1) }))
}

// Glyph strip: one white cell per ramp character, sized to a single grid cell.
function buildAtlas(cellW, cellH, dpr) {
  const font = `600 ${Math.round(cellH * 0.92)}px ui-monospace, 'SF Mono', Menlo, Consolas, monospace`
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.ceil(RAMP.length * cellW * dpr))
  canvas.height = Math.max(1, Math.ceil(cellH * dpr))
  const g = canvas.getContext('2d')
  if (!g) return canvas
  g.scale(dpr, dpr)
  g.font = font
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = '#ffffff'
  for (let i = 0; i < RAMP.length; i++) {
    if (RAMP[i] === ' ') continue
    g.fillText(RAMP[i], i * cellW + cellW / 2, cellH / 2 + cellH * 0.04)
  }
  return canvas
}

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn('Background shader:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function buildProgram(gl) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

// Slower devices and data-saver users get a lower frame rate for the drift.
// Scrolling and the pointer always repaint at full rate.
function driftFps() {
  const saveData = navigator.connection?.saveData
  const cores = navigator.hardwareConcurrency || 8
  return saveData || cores <= 4 ? 20 : 30
}

function startWebGL(canvas, gl, reduceMotion) {
  const program = buildProgram(gl)
  const buffer = gl.createBuffer()
  const atlasTexture = gl.createTexture()
  if (!program || !buffer || !atlasTexture) return null

  const u = (name) => gl.getUniformLocation(program, name)
  const loc = {
    atlas: u('u_atlas'),
    res: u('u_res'),
    cell: u('u_cell'),
    dpr: u('u_dpr'),
    scroll: u('u_scroll'),
    time: u('u_time'),
    reveal: u('u_reveal'),
    lane: u('u_lane'),
    pointer: u('u_pointer'),
    ripples: u('u_ripples'),
    chars: u('u_chars'),
    inkCount: u('u_inkCount'),
    tints: u('u_tints'),
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  gl.bindTexture(gl.TEXTURE_2D, atlasTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
  gl.disable(gl.BLEND) // the shader composites its own layers
  gl.useProgram(program)
  gl.uniform1i(loc.atlas, 0)
  gl.uniform1f(loc.chars, RAMP.length)

  const ramp = inkRamp()
  const tints = new Float32Array(MAX_INKS * 4)
  ramp.forEach((tone, i) => {
    const [r, g, b] = hexToRgb(tone.hex)
    tints.set([r / 255, g / 255, b / 255, tone.alpha], i * 4)
  })
  gl.uniform4fv(loc.tints, tints)
  gl.uniform1f(loc.inkCount, ramp.length)

  const frameMs = 1000 / driftFps()
  const ripples = []
  const rippleData = new Float32Array(MAX_RIPPLES * 4)
  // Pointer target (viewport CSS px), the smoothed position actually drawn,
  // and its eased strength.
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, on: false, strength: 0 }

  let dpr = 1
  let clock = 0.8
  let reveal = reduceMotion.matches ? 1 : 0
  let raf = 0
  let lastNow = 0
  let lastPaint = 0
  let lastScroll = window.scrollY
  let flow = 0 // extra field speed from scrolling, decays to 0
  let resizeTimer = 0
  let dead = false

  const size = () => {
    const w = Math.max(1, Math.round(window.innerWidth))
    const h = Math.max(1, Math.round(window.innerHeight))
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cellW = Math.max(7, Math.min(14, w / MAX_COLS))
    const cellH = cellW * 1.32
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(loc.res, canvas.width, canvas.height)
    gl.uniform2f(loc.cell, cellW * dpr, cellH * dpr)
    gl.uniform1f(loc.dpr, dpr)
    gl.uniform1f(loc.lane, w >= 900 ? 0.14 : 0)
    gl.bindTexture(gl.TEXTURE_2D, atlasTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildAtlas(cellW, cellH, dpr))
  }

  const paint = (now = performance.now()) => {
    if (dead) return
    const scroll = window.scrollY
    lastScroll = scroll
    gl.uniform1f(loc.scroll, scroll * dpr)
    gl.uniform1f(loc.time, clock)
    gl.uniform1f(loc.reveal, reveal)
    gl.uniform3f(loc.pointer, pointer.sx * dpr, (pointer.sy + scroll) * dpr, pointer.strength)
    rippleData.fill(0)
    ripples.forEach((r, i) => {
      rippleData.set([r.x * dpr, r.y * dpr, Math.min(1, (now - r.born) / 1000 / RIPPLE_LIFE), 1], i * 4)
    })
    gl.uniform4fv(loc.ripples, rippleData)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  // One loop for everything. The drift itself only needs 20–30 fps, but
  // scrolling, the pointer, ripples and the load-in repaint every frame.
  const frame = (now) => {
    raf = requestAnimationFrame(frame)
    const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0
    lastNow = now

    const scrollDelta = window.scrollY - lastScroll
    if (scrollDelta) flow = Math.min(3, flow + Math.abs(scrollDelta) / 400)
    flow *= Math.exp(-dt * 2.5)

    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 10)
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 10)
    const target = pointer.on ? 1 : 0
    pointer.strength += (target - pointer.strength) * Math.min(1, dt * 6)
    if (Math.abs(target - pointer.strength) < 0.005) pointer.strength = target

    while (ripples.length && now - ripples[0].born > RIPPLE_LIFE * 1000) ripples.shift()
    if (reveal < 1) reveal = Math.min(1, reveal + dt / REVEAL_TIME)

    const busy =
      scrollDelta !== 0 || pointer.strength > 0 || ripples.length > 0 || reveal < 1 || flow > 0.01
    if (!busy && now - lastPaint < frameMs) return

    clock += (lastPaint ? (now - lastPaint) / 1000 : 0) * (0.5 + flow * 0.6)
    lastPaint = now
    paint(now)
  }

  const start = () => {
    if (raf || dead || reduceMotion.matches) return
    lastNow = 0
    lastPaint = 0
    raf = requestAnimationFrame(frame)
  }

  const stop = () => {
    if (!raf) return
    cancelAnimationFrame(raf)
    raf = 0
  }

  // Reduced motion: no autonomous animation, but the field still scrolls with
  // the page like any other content.
  let scrollQueued = false
  const onScroll = () => {
    if (raf || scrollQueued) return
    scrollQueued = true
    requestAnimationFrame(() => {
      scrollQueued = false
      paint()
    })
  }

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion.matches) return
    if (!pointer.on && pointer.strength === 0) {
      pointer.sx = e.clientX
      pointer.sy = e.clientY
    }
    pointer.x = e.clientX
    pointer.y = e.clientY
    pointer.on = true
  }
  const onPointerOut = (e) => {
    if (!e.relatedTarget) pointer.on = false
  }
  const onPointerDown = (e) => {
    if (reduceMotion.matches || !e.isPrimary) return
    if (ripples.length >= MAX_RIPPLES) ripples.shift()
    ripples.push({ x: e.clientX, y: e.clientY + window.scrollY, born: performance.now() })
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      size()
      paint()
    }, 150)
  }

  const onVisibility = () => (document.hidden ? stop() : start())

  const onMotion = () => {
    if (reduceMotion.matches) {
      stop()
      reveal = 1
      ripples.length = 0
      pointer.on = false
      pointer.strength = 0
      paint()
    } else {
      start()
    }
  }

  const onContextLost = (e) => {
    e.preventDefault()
    dead = true
    stop()
  }
  const onContextRestored = () => window.location.reload()

  size()
  paint()
  start()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.addEventListener('pointerout', onPointerOut)
  document.addEventListener('visibilitychange', onVisibility)
  reduceMotion.addEventListener('change', onMotion)
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  return () => {
    stop()
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('visibilitychange', onVisibility)
    reduceMotion.removeEventListener('change', onMotion)
    canvas.removeEventListener('webglcontextlost', onContextLost)
    canvas.removeEventListener('webglcontextrestored', onContextRestored)
    gl.deleteTexture(atlasTexture)
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }
}

// Canvas 2D fallback: glyphs only, coarser grid and a slow tick — this path is
// only for browsers without WebGL, where throttle matters more than crispness.
function startCanvas2D(canvas, reduceMotion) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  let w = 0
  let h = 0
  let dpr = 1
  let cellW = 12
  let cellH = 16
  let clock = 0.8
  let atlases = []

  const draw = () => {
    if (!w || !atlases.length) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    const scroll = window.scrollY
    const firstRow = Math.floor(scroll / cellH)
    const rows = Math.ceil(h / cellH) + 1
    const cols = Math.ceil(w / cellW) + 1
    const lastChar = RAMP.length - 1
    const lastInk = atlases.length - 1
    for (let r = 0; r < rows; r++) {
      const pageY = (firstRow + r) * cellH
      const y = pageY - scroll
      const py = (pageY + cellH / 2) / h
      for (let col = 0; col < cols; col++) {
        const px = (col * cellW + cellW / 2) / h
        const qx = px + 0.18 * Math.sin(py * 3.3 + clock * 0.6)
        const qy = py + 0.18 * Math.sin(px * 2.9 - clock * 0.5)
        const rr = Math.hypot(Math.sin(qx * 1.7 + clock * 0.3), Math.sin(qy * 1.9 - clock * 0.25))
        const v =
          (Math.sin(qx * 8 + clock * 1.1) +
            Math.sin(qy * 7 - clock * 0.9) +
            Math.sin((qx + qy) * 5 + clock * 1.3) +
            Math.sin(rr * 9 - clock)) *
          0.25
        const n = Math.min(1, Math.max(0, (v * 0.5) * 1.75 + 0.46))
        const ci = Math.min(lastChar, (n * RAMP.length) | 0)
        if (ci === 0) continue
        const ink = Math.min(lastInk, ((ci / lastChar) * atlases.length) | 0)
        ctx.drawImage(atlases[ink], ci * cellW * dpr, 0, cellW * dpr, cellH * dpr, col * cellW, y, cellW, cellH)
      }
    }
  }

  const resize = () => {
    w = Math.max(1, Math.round(window.innerWidth))
    h = Math.max(1, Math.round(window.innerHeight))
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    cellW = Math.max(9, Math.min(18, w / 90))
    cellH = cellW * 1.32
    atlases = inkRamp().map((tone) => {
      const strip = buildAtlas(cellW, cellH, dpr)
      const tinted = document.createElement('canvas')
      tinted.width = strip.width
      tinted.height = strip.height
      const g = tinted.getContext('2d')
      if (g) {
        g.globalAlpha = tone.alpha * GLYPH_OPACITY
        g.drawImage(strip, 0, 0)
        g.globalCompositeOperation = 'source-in'
        g.fillStyle = tone.hex
        g.fillRect(0, 0, tinted.width, tinted.height)
      }
      return tinted
    })
    draw()
  }

  let timer = 0
  const tick = () => {
    clock += 1 / 24
    draw()
    timer = setTimeout(tick, 1000 / 12)
  }
  let queued = false
  const onScroll = () => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      draw()
    })
  }

  resize()
  if (!reduceMotion.matches) tick()
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    clearTimeout(timer)
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', onScroll)
  }
}

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })
    return (gl && startWebGL(canvas, gl, reduceMotion)) || startCanvas2D(canvas, reduceMotion) || undefined
  }, [])

  return (
    <div className="bg-host" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-plasma" />
    </div>
  )
}
