/* ============================================================
   🎨 MATERIAL EDITOR / STYLE GUIDE
   ------------------------------------------------------------
   This is the ONE file where you change colors.
   Edit a value → save → localhost:5173 updates instantly,
   everywhere it's applied (buttons, text, bg, badges…).
   Like editing a material preset in C4D: change the slot
   once, every object using it updates automatically.
   ============================================================ */

/* ---------- ACCENT (the hero color family) ---------- */
const accent = {
  deep: '#7e5f93', // readable plum-lavender — button borders/text on light bg
  strong: '#6b4d80', // pressed/hover depth
  bright: '#dacae2', // lavender mist — highlights, eyebrows, bullets
};

/* ============================================================
   🎛️ BEHAVIOUR SWITCHES
   ============================================================ */

/* Adaptive accent: samples the animated bg and derives the accent
   automatically (bg hue + 125° → steel blue always yields pink).
   Set true to let the background drive accent colors again;
   while false, whatever you pick above stays untouched. */
export const ADAPTIVE_ACCENT = false;

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
   Everything below wires these values into the whole site.
   You normally never need to touch this part.
   ============================================================ */

/* Live accent slots — adaptiveAccent.js can override these at
   runtime so the accent reacts to the animated background. */
const live = { ...accent };

export function setLiveAccent(next) {
  if (next.deep) live.deep = next.deep;
  if (next.strong) live.strong = next.strong;
  if (next.bright) live.bright = next.bright;
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
