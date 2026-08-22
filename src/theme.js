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
  deep: '#bd6d8c', // readable petal rose — button borders/text on light bg
  strong: '#a25575', // pressed/hover depth
  bright: '#f1c6d9', // rose petal — highlights, eyebrows, bullets
};

/* ---------- BACKGROUND (fluted-glass ramp) ---------- */
export const bgPalette = {
  base: '#597b9e',
  colors: ['#597b9e', '#bce2f7', '#a3c2de', '#e2e6e9'],
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

const vars = `
  --bg: ${bgPalette.base};
  --text: ${ink.text};
  --muted: ${ink.muted};
  --accent: ${accent.deep};
  --accent-strong: ${accent.strong};
  --accent-bright: ${accent.bright};
  --green: ${semantics.green};
  --persona-goals: ${semantics.goals};
  --persona-pains: ${semantics.pains};
  --persona-jtbd: ${semantics.jtbd};
  --persona-impl: ${semantics.impl};
`;

function applyTheme() {
  let el = document.getElementById('app-theme-vars');
  if (!el) {
    el = document.createElement('style');
    el.id = 'app-theme-vars';
    document.head.appendChild(el);
  }
  el.textContent = `:root { ${vars} }`;
}

applyTheme();
