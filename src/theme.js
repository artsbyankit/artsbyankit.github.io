/* ============================================================
   🎨 MATERIAL EDITOR / STYLE GUIDE
   ------------------------------------------------------------
   This is the ONE file where you change colors.
   Edit a value here → save → localhost:5173 updates instantly,
   everywhere it's applied (buttons, text, bg, badges…).
   Like editing a material preset in C4D: change the slot
   once, every object using it updates automatically.
   ============================================================ */

/* ---------- ACCENT — THE one color. That's it. ----------
   Hover/press depth and text-safe variants are derived from
   this single value automatically. Change this hex, done. */
export const accent = '#f2b8cf';

/* ---------- BACKGROUND (fluted-glass ramp) ---------- */
export const bgPalette = {
  base: '#82a7cd',
  colors: ['#82a7cd', '#bce2f7', '#a3c2de', '#e2e6e9'],
};

/* ---------- INK & PAPER ---------- */
const ink = {
  text: '#12233a',
  muted: 'rgba(18, 35, 58, 0.72)',
};

/* ---------- SEMANTIC COLORS ---------- */
const semantics = {
  green: '#0a8f4d', // success dots / active nav
  goals: '#0a8f4d', // persona block headers
  pains: '#d64545',
  jtbd: '#2273c8',
  impl: '#c77f1a',
};

/* ============================================================
   🎛️ BEHAVIOUR SWITCHES
   ============================================================ */

/* Adaptive accent: samples the animated bg and derives the accent
   automatically. Set true to let the background drive colors;
   while false, the single accent above stays untouched. */
export const ADAPTIVE_ACCENT = false;

/* Reactive shine: the white specular glow on CTAs keeps a faint tint
   of whatever the background is doing — pure white core, bg-aware soul.
   Works with ANY accent since the shine never borrows accent hue. */
export const REACTIVE_SHINE = true;

/* ============================================================
   Everything below wires these values into the whole site.
   You normally never need to touch this part.
   ============================================================ */

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

const hslStr = (h, s, l) =>
  `hsl(${Math.round(h)} ${Math.round(Math.min(Math.max(s, 0), 100))}% ${Math.round(
    Math.min(Math.max(l, 0), 100),
  )}%)`;

export function deriveAccentFamily(hex) {
  const [h, S, L] = hexToHsl(hex);
  return {
    deep: hslStr(h, S * 0.95, Math.max(30, L * 0.62)),
    strong: hslStr(h, S * 0.9, Math.max(24, L * 0.46)),
    bright: hslStr(h, Math.min(S * 1.12, 96), Math.min(L * 1.18 + 4, 80)),
  };
}

/* Live slots — derived from the single accent; the picker or
   adaptiveAccent can override them at runtime. */
const live = { ...deriveAccentFamily(accent), shine: 'hsl(210 45% 96%)' };

export function setLiveAccent(next) {
  if (next.deep) live.deep = next.deep;
  if (next.strong) live.strong = next.strong;
  if (next.bright) live.bright = next.bright;
  applyTheme();
}

export function setLiveShine(v) {
  live.shine = v;
  applyTheme();
}

function applyTheme() {
  const vars = `
    --bg: ${bgPalette.base};
    --text: ${ink.text};
    --muted: ${ink.muted};
    --accent: ${live.deep};
    --accent-strong: ${live.strong};
    --accent-bright: ${live.bright};
    --shine: ${live.shine};
    --green: ${semantics.green};
    --persona-goals: ${semantics.goals};
    --persona-pains: ${semantics.pains};
    --persona-jtbd: ${semantics.jtbd};
    --persona-impl: ${semantics.impl};
  `;
  let el = document.getElementById('app-theme-vars');
  if (!el) {
    el = document.createElement('style');
    el.id = 'app-theme-vars';
    document.head.appendChild(el);
  }
  el.textContent = `:root { ${vars} }`;
}

applyTheme();
