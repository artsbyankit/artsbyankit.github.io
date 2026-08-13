/* ============================================================
   🎨 MATERIAL EDITOR / STYLE GUIDE
   ------------------------------------------------------------
   This is the ONE file where you change colors.
   Edit a value here → save → localhost:5173 updates instantly,
   everywhere it's applied (buttons, text, bg, badges…).
   ============================================================ */

/* ---------- ACCENT — none. Monochrome ink, like the text ----------
   Everything that used to be "accent colored" now wears the same
   near-black as body text. Clean, editorial, zero color noise. */
export const accent = '#EDEBDD';

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

/* Reactive shine: the white specular glow on CTAs keeps a faint tint
   of whatever the background is doing — pure white core, bg-aware soul.
   Works with ANY accent since the shine never borrows accent hue. */
export const REACTIVE_SHINE = true;

/* ============================================================
   Everything below wires these values into the whole site.
   You normally never need to touch this part.
   ============================================================ */

let shine = 'hsl(210 45% 96%)';

export function setLiveShine(v) {
  shine = v;
  applyTheme();
}

function applyTheme() {
  const vars = `
    --bg: ${bgPalette.base};
    --text: ${ink.text};
    --muted: ${ink.muted};
    --accent: ${accent};
    --shine: ${shine};
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
