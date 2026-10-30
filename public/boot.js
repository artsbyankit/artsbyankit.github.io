// Butter-mode: cap the animated backdrop's render resolution at 1x —
// 4x fewer fragments for the fluted shader, visually invisible on a
// soft glass pattern. No FPS cap: the loop follows the display's
// refresh (120Hz ProMotion etc.) so the glass flows at native rate.
//
// Low-spec profile (weak iGPU laptops: <=4 CPU cores): drop the canvas
// to 0.75x resolution, soften glass blur via the --frost token, and
// slow the flute drift. Macs and desktops never see it.
//
// Lives in its own file (not inline) so the Content-Security-Policy can forbid
// inline scripts. Must load before the effect runtime in index.html.
window.__AIFX_MAX_DPR__ = 1
if ((navigator.hardwareConcurrency || 8) <= 4) {
  window.__AIFX_MAX_DPR__ = 0.75
  document.documentElement.classList.add('low-spec')
}
