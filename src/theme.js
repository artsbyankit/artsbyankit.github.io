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

/* ---------- BACKGROUND (powder-blue gradient) ---------- */
export const bgPalette = {
  base: '#82a7cd',
  colors: ['#82a7cd', '#bce2f7', '#a3c2de', '#e2e6e9'],
};

/* ---------- INK & PAPER ---------- */
const ink = {
  text: '#12233a',
  muted: 'rgba(18, 35, 58, 0.82)', // at least 4.5:1 on the darkest background blue
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

/* The white specular glow on CTAs, with a faint tint of the powder blue.
   (It used to follow the background's hue at runtime, but the palette's hues
   only span ~9°, so it never visibly changed.) */
const shine = 'hsl(210 45% 96%)';

export const themeCss = () => `:root { ${themeVars()} }`;

function themeVars() {
  return `
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
}

function applyTheme() {
  if (typeof document === 'undefined') return; // pre-render (vite.config.js) inlines themeCss() instead
  let el = document.getElementById('app-theme-vars');
  if (!el) {
    el = document.createElement('style');
    el.id = 'app-theme-vars';
    document.head.appendChild(el);
  }
  el.textContent = themeCss();
}

applyTheme();
