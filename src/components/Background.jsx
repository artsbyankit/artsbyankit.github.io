// Site background: the powder-blue ramp (index.css, .bg-host::before) with a
// live ASCII plasma field painted over it.
//
// The field runs as one WebGL fragment shader: the CPU computes nothing per
// frame, so it stays smooth even at a fine character grid. A canvas-2D
// renderer is kept as a fallback for browsers without WebGL.
//
// In-house and dependency-free: no third-party animation runtime, no network
// requests, nothing for the CSP in vite.config.js to allow.
// Ink colours are derived from src/theme.js — edit the palette there and the
// plasma follows automatically.
import { useEffect, useRef } from 'react'
import { bgPalette } from '../theme'

// Classic ASCII density ramp: blank → sparse → dense. Stops at '%' because '@'
// fuses into a blob at this glyph size.
const RAMP = ' .:-=+*#%'

// Roughly how many characters fit across the viewport. Fewer = bigger glyphs.
const MAX_COLS = 150

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;

varying vec2 v_uv;
uniform vec2 u_res;
uniform vec2 u_cell;
uniform float u_time;
uniform float u_chars;
uniform float u_inkCount;
uniform sampler2D u_atlas;
uniform vec4 u_tint0;
uniform vec4 u_tint1;
uniform vec4 u_tint2;
uniform vec4 u_tint3;
uniform vec4 u_tint4;
uniform vec4 u_tint5;
uniform vec4 u_tint6;
uniform vec4 u_tint7;

vec4 tintAt(float i) {
  vec4 c = u_tint0;
  if (i >= 0.5) c = u_tint1;
  if (i >= 1.5) c = u_tint2;
  if (i >= 2.5) c = u_tint3;
  if (i >= 3.5) c = u_tint4;
  if (i >= 4.5) c = u_tint5;
  if (i >= 5.5) c = u_tint6;
  if (i >= 6.5) c = u_tint7;
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

void main() {
  vec2 px = v_uv * u_res;
  vec2 cellPos = px / u_cell;
  vec2 cell = floor(cellPos);
  vec2 f = fract(cellPos);

  // Normalised to the viewport height: same plasma shape at any window size.
  float scale = 1.0 / u_res.y;
  vec2 n = cell * u_cell * scale - vec2(0.5 * u_res.x / u_res.y, 0.5);

  // Four broad interfering waves — the classic plasma field, original code.
  float d = length(vec2(n.x, n.y * 0.9));
  float v = sin(n.x * 9.5 + u_time * 1.1)
          + sin(n.y * 8.5 - u_time * 0.9)
          + sin((n.x + n.y) * 5.5 + u_time * 1.35)
          + sin(d * 9.0 - u_time);

  float shade = clamp((v + 4.0) * 0.125, 0.0, 1.0);
  shade = clamp((shade - 0.5) * 1.75 + 0.46, 0.0, 1.0);
  shade = clamp(shade + (bayer4(cell) - 0.5) * 0.122, 0.0, 1.0);

  float ci = min(floor(shade * u_chars), u_chars - 1.0);
  if (ci < 0.5) {
    gl_FragColor = vec4(0.0);
  } else {
    vec2 uv = vec2((ci + clamp(f.x, 0.0, 0.999)) / u_chars, clamp(f.y, 0.0, 0.999));
    float a = texture2D(u_atlas, uv).a;
    float idx = min(u_inkCount - 1.0, floor((ci / (u_chars - 1.0)) * u_inkCount));
    vec4 tint = tintAt(idx);
    gl_FragColor = vec4(tint.rgb, tint.a * a);
  }
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
  const tones = []
  const add = (hex) => {
    if (typeof hex !== 'string') return
    const key = hex.trim().toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    tones.push({ hex: hex.trim() })
  }
  ;[bgPalette.base, ...(bgPalette.colors || [])]
    .map((hex) => ({ hex, lum: luminance(hexToRgb(hex)) }))
    .sort((a, b) => b.lum - a.lum)
    .forEach((tone) => add(tone.hex))
  // Sparse cells stay pale and quiet; the densest only reach the palette's
  // deepest blue, with a little more body so the texture still reads.
  return tones.slice(0, 8).map((tone, i, list) => {
    const position = i / Math.max(1, list.length - 1)
    return { ...tone, alpha: 0.55 + 0.4 * position }
  })
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

export default function Background() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false })

    let w = 0
    let h = 0
    let dpr = 1
    let cellW = 13
    let cellH = 17
    let clock = 0.8
    let raf = 0
    let lastTick = 0
    let resizeTimer = 0
    let dead = false

    const size = () => {
      w = Math.max(1, Math.round(window.innerWidth))
      h = Math.max(1, Math.round(window.innerHeight))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cellW = Math.max(7, Math.min(14, w / MAX_COLS))
      cellH = cellW * 1.32
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    // ---------- WebGL path ----------
    if (gl) {
      const program = buildProgram(gl)
      const buffer = gl.createBuffer()
      const atlasTexture = gl.createTexture()

      if (program && buffer && atlasTexture) {
        const loc = {
          atlas: gl.getUniformLocation(program, 'u_atlas'),
          res: gl.getUniformLocation(program, 'u_res'),
          cell: gl.getUniformLocation(program, 'u_cell'),
          time: gl.getUniformLocation(program, 'u_time'),
          chars: gl.getUniformLocation(program, 'u_chars'),
          inkCount: gl.getUniformLocation(program, 'u_inkCount'),
          tints: Array.from({ length: 8 }, (_, i) => gl.getUniformLocation(program, `u_tint${i}`)),
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
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.useProgram(program)

        const uploadAtlas = () => {
          gl.bindTexture(gl.TEXTURE_2D, atlasTexture)
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            buildAtlas(cellW, cellH, dpr),
          )
        }

        const uploadInks = () => {
          const ramp = inkRamp()
          const fallback = [0.07, 0.13, 0.22, ramp[ramp.length - 1].alpha]
          ramp.forEach((tone, i) => {
            const [r, g, b] = hexToRgb(tone.hex)
            gl.uniform4f(loc.tints[i], r / 255, g / 255, b / 255, tone.alpha)
          })
          for (let i = ramp.length; i < 8; i++) {
            gl.uniform4f(loc.tints[i], fallback[0], fallback[1], fallback[2], 0)
          }
          gl.uniform1f(loc.inkCount, ramp.length)
        }

        const paint = () => {
          if (dead) return
          gl.viewport(0, 0, canvas.width, canvas.height)
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT)
          gl.uniform1i(loc.atlas, 0)
          gl.uniform2f(loc.res, canvas.width, canvas.height)
          gl.uniform2f(loc.cell, cellW * dpr, cellH * dpr)
          gl.uniform1f(loc.time, clock)
          gl.uniform1f(loc.chars, RAMP.length)
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }

        const resize = () => {
          size()
          uploadAtlas()
          paint()
        }

        const frame = (now) => {
          raf = requestAnimationFrame(frame)
          if (!lastTick) lastTick = now
          const delta = now - lastTick
          // 30 fps is plenty for a slow plasma, and it halves the cost of the
          // frosted glass re-blurring the moving backdrop.
          if (delta < 1000 / 30) return
          lastTick = now
          clock += Math.min(0.2, delta / 1000) * 0.5
          paint()
        }

        const start = () => {
          if (raf || reduceMotion.matches) return
          lastTick = 0
          raf = requestAnimationFrame(frame)
        }

        const stop = () => {
          if (!raf) return
          cancelAnimationFrame(raf)
          raf = 0
        }

        const onResize = () => {
          clearTimeout(resizeTimer)
          resizeTimer = setTimeout(() => {
            resize()
            start()
          }, 150)
        }

        const onVisibility = () => {
          if (document.hidden) stop()
          else start()
        }

        const onMotion = () => {
          if (reduceMotion.matches) {
            stop()
            clock = 0.8
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

        const onContextRestored = () => {
          dead = false
          window.location.reload()
        }

        uploadInks()
        resize()
        start()

        window.addEventListener('resize', onResize)
        document.addEventListener('visibilitychange', onVisibility)
        reduceMotion.addEventListener('change', onMotion)
        canvas.addEventListener('webglcontextlost', onContextLost)
        canvas.addEventListener('webglcontextrestored', onContextRestored)

        // Repaint if the palette in theme.js is swapped at runtime.
        let paletteKey = inkRamp().map((tone) => tone.hex).join('|')
        const themePoller = window.setInterval(() => {
          const next = inkRamp().map((tone) => tone.hex).join('|')
          if (next === paletteKey) return
          paletteKey = next
          uploadInks()
          paint()
        }, 2000)

        return () => {
          stop()
          clearTimeout(resizeTimer)
          clearInterval(themePoller)
          window.removeEventListener('resize', onResize)
          document.removeEventListener('visibilitychange', onVisibility)
          reduceMotion.removeEventListener('change', onMotion)
          canvas.removeEventListener('webglcontextlost', onContextLost)
          canvas.removeEventListener('webglcontextrestored', onContextRestored)
          gl.deleteTexture(atlasTexture)
          gl.deleteBuffer(buffer)
          gl.deleteProgram(program)
        }
      }
    }

    // ---------- Canvas 2D fallback ----------
    // Coarser grid and a slow tick: this path is only for browsers without
    // WebGL, where throttle matters more than crispness.
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let atlases = []
    let cols = 0
    let rows = 0

    const draw = () => {
      if (!w || !atlases.length) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const lastChar = RAMP.length - 1
      const inkCount = atlases.length
      const lastInk = inkCount - 1
      const scale = 1 / h
      const aspect = w / h

      for (let row = 0; row < rows; row++) {
        const y = row * cellH
        const ny = y * scale - 0.5
        for (let col = 0; col < cols; col++) {
          const x = col * cellW
          const nx = x * scale - 0.5 * aspect
          const d = Math.hypot(nx, ny * 0.9)
          let v = Math.sin(nx * 9.5 + clock * 1.1)
          v += Math.sin(ny * 8.5 - clock * 0.9)
          v += Math.sin((nx + ny) * 5.5 + clock * 1.35)
          v += Math.sin(d * 9 - clock)
          const n = Math.min(1, Math.max(0, ((v + 4) / 8 - 0.5) * 1.75 + 0.46))
          const charIndex = Math.min(lastChar, Math.max(0, (n * lastChar + 0.5) | 0))
          if (charIndex === 0) continue
          const inkIndex = Math.min(lastInk, ((charIndex / lastChar) * inkCount) | 0)
          ctx.drawImage(
            atlases[inkIndex],
            charIndex * cellW * dpr,
            0,
            cellW * dpr,
            cellH * dpr,
            x,
            y,
            cellW,
            cellH,
          )
        }
      }
    }

    const resize = () => {
      size()
      cellW = Math.max(9, Math.min(18, w / 90))
      cellH = cellW * 1.32
      cols = Math.ceil(w / cellW) + 1
      rows = Math.ceil(h / cellH) + 1
      atlases = inkRamp().map((tone) => {
        const strip = buildAtlas(cellW, cellH, dpr)
        const tinted = document.createElement('canvas')
        tinted.width = strip.width
        tinted.height = strip.height
        const g = tinted.getContext('2d')
        if (g) {
          g.globalAlpha = tone.alpha
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
      clock += 1 / 12
      draw()
      timer = setTimeout(tick, 1000 / 12)
    }

    resize()
    if (!reduceMotion.matches) tick()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="bg-host" aria-hidden="true">
      <canvas ref={canvasRef} className="bg-plasma" />
    </div>
  )
}
