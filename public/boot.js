// Butter-mode: cap the animated backdrop's render resolution at 1x —
// 4x fewer fragments for the fluted shader, visually invisible on a
// soft glass pattern. No FPS cap: the loop follows the display's
// refresh (120Hz ProMotion etc.) so the glass flows at native rate.
//
// Low-spec profile (weak iGPU laptops: <=4 CPU cores): drop the canvas
// to 0.75x resolution, soften glass blur via the --frost token, and
// slow the flute drift. Macs and desktops never see it.
//
// The backdrop drifts slowly, so 30 redraws a second looks the same as 60. Skipped redraws
// also spare every glass surface above it from being recalculated. The effect's motion is
// clock-based, so it keeps its speed. Only the effect's canvases are affected.
;(function () {
  var GAP_MS = 32
  var last = new WeakMap()
  function cap(proto, name) {
    var draw = proto && proto[name]
    if (!draw) return
    proto[name] = function () {
      var canvas = this.canvas
      if (canvas && canvas.closest && canvas.closest('[data-aifx]')) {
        var now = performance.now()
        if (now - (last.get(canvas) || 0) < GAP_MS) return
        last.set(canvas, now)
      }
      return draw.apply(this, arguments)
    }
  }
  ;['WebGLRenderingContext', 'WebGL2RenderingContext'].forEach(function (type) {
    var proto = window[type] && window[type].prototype
    cap(proto, 'drawArrays')
    cap(proto, 'drawElements')
  })
})()

// Lives in its own file (not inline) so the Content-Security-Policy can forbid
// inline scripts. Must load before the effect runtime in index.html.
window.__AIFX_MAX_DPR__ = 1
if ((navigator.hardwareConcurrency || 8) <= 4) {
  window.__AIFX_MAX_DPR__ = 0.75
  document.documentElement.classList.add('low-spec')
}
