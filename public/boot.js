// Low-spec profile (weak iGPU laptops: <=4 CPU cores): soften glass blur via the
// --frost token. Macs and desktops never see it.
// Lives in its own file (not inline) so the Content-Security-Policy can forbid
// inline scripts.
if ((navigator.hardwareConcurrency || 8) <= 4) {
  document.documentElement.classList.add('low-spec')
}
