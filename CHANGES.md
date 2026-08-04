# CHANGES — artsbyankit.github.io portfolio

Folder for tracking changes to the portfolio site.
Live site: https://artsbyankit.github.io
Project source lives at: C:\portfolio

## Change log

### 2026-08-04 — Interactive effects
- Added a cursor-following spotlight (smooth trailing glow over the whole page).
- Added per-element hover spotlight: cards, buttons, skill boxes, and social pills glow at the exact cursor position.
- Added scroll-reveal animation: project cards and skill boxes fade/slide in as they enter the viewport (respects reduced-motion).
- Background orbs are now animated (liquid gradient drift).
- Added a soft blur vignette (edges gently darken) and a subtle film-grain noise overlay across the page.

### 2026-08-04 — Clean Liquid Glass refinement
- Following Apple's guidance (glass = chrome only), removed frosted glass from content cards, skill boxes, gallery frames, portrait, and social pills. These are now clean solid surfaces.
- Glass blur now applies only to the navbar (and its mobile dropdown) — the one "sheet" that floats above content, per Apple's layer economy.
- Kept serene blue/white ambient orbs, soft shadows, rounded corners, skyblue/purple accents, and dark/light toggle.

### 2026-08-04 — Liquid Glass (macOS Tahoe-style) redesign
- Full theme redesigned to Apple Liquid Glass aesthetic: frosted glass panels, translucent cards, soft specular highlights, large rounded corners, serene blue/white palette.
- Added floating ambient gradient orbs behind the page (violet/blue/sky) that the glass surfaces blur and refract.
- Applied glass treatment to navbar, buttons, project cards, skill boxes, social links, hero tag, and case-study gallery frames via `backdrop-filter` + inset highlights.
- Works in both dark and light modes (toggle still available).

### 2026-08-04 — Theme: skyblue/purple gradient + dark/light toggle
- Accent gradient changed from violet/pink/amber to skyblue/purple (`#8b5cf6 → #3b82f6 → #38bdf8`) across buttons, headings, links, and hovers.
- Added dark/light theme toggle button in the navbar (sun/moon icon). Dark mode is the default; choice is saved in localStorage and remembered.
- Anti-flash script added to `index.html` so the correct theme applies before the page renders.

### 2026-08-04 — Social links updated
- Contact page + footer: LinkedIn, Telegram, WhatsApp, Behance, Instagram, GitHub (in that order). Dribbble removed.

### 2026-08-04 — Title update + Contact cleanup
- Browser tab / bookmark title changed to "Ankit Patel - UI/UX Designer" (edit in `index.html`).
- Removed the "Start a project" button from the Contact page. It was a mailto: shortcut that opened a pre-filled email (To: artsbyankit@duck.com, Subject: Freelance inquiry). Contact page now shows the email button + Download resume button.
- Note: re-bookmark the site to see the new title; existing bookmarks keep the old one.

### 2026-08-04 — Site title update
- Changed browser tab / bookmark title from "Ankit · UI/UX Designer & Case Studies" to "Ankit · UI/UX Designer" (edit in `index.html`), then to "Ankit Patel - UI/UX Designer".
- Note: re-bookmark the site to see the new title; existing bookmarks keep the old one.

### 2026-08-04 — Email + resume added
- Contact email changed to artsbyankit@duck.com (Contact page).
- Resume PDF copied into the site at `public/resume.pdf`, live at https://artsbyankit.github.io/resume.pdf.
- "Download resume" links added to Home hero, Contact page, and footer.

### 2026-08-04 — Initial build
- React + Vite portfolio site scaffolded and deployed to GitHub Pages via GitHub Actions (auto build + deploy on every push to `main`).
- Pages: Home, Work (6 case-study projects), About, Contact.
- Project content is editable in `C:\portfolio\src\data\projects.js`.
