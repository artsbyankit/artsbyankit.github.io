# Portfolio Project — Setup, Handoff & OpenCode Prompt
Folder: `G:\My Drive\artsbyankit.github.io`  (Google Drive — syncs to cloud)
Live site: https://artsbyankit.github.io
Repo: https://github.com/artsbyankit/artsbyankit.github.io

===========================================================
PART 1 — PROMPT TO PASTE INTO OPENCODE ON ANOTHER PC
===========================================================

Copy and paste the block below into opencode on any other computer
(open opencode, then paste this as your first message):

-----------------------------------------------------------
PROMPT START
-----------------------------------------------------------
You are helping me continue work on my UI/UX portfolio website.

PROJECT LOCATION: "G:\My Drive\artsbyankit.github.io"
LIVE URL: https://artsbyankit.github.io
GIT REMOTE: https://github.com/artsbyankit/artsbyankit.github.io (branch: main)

WHAT THIS PROJECT IS:
A React 19 + Vite 8 single-page portfolio for a UI/UX designer
(Ankit Patel) with pages: Home, Work (case studies), About, Contact.
Uses react-router-dom (BrowserRouter). Deployed FREE on GitHub Pages via
a GitHub Actions workflow that auto-builds and auto-deploys on every push
to main. Theme: macOS "Liquid Glass" style with a dark/light toggle
(dark default), skyblue-to-purple accent gradient, animated gradient
orbs, cursor-following spotlight, hover spotlights on cards/buttons,
scroll-reveal, blur vignette, and a film-grain noise overlay.

STACK & VERSIONS: Node.js 24 (LTS) installed via winget
("winget install --id OpenJS.NodeJS.LTS"), npm 11+, git, GitHub CLI (gh).

USEFUL COMMANDS (run inside the project folder):
- npm install          # first time / when deps change
- npm run dev          # local dev server (hot reload)
- npm run build        # production build into /dist
- npm run preview      # serve the production build locally
- npm run lint         # oxlint static checks
- git add -A; git commit -m "msg"; git push   # deploys automatically

IMPORTANT CONVENTIONS:
- Do NOT edit files in /dist (generated) or /node_modules.
- Content for case studies lives in src/data/projects.js.
- Page layouts: src/pages/*.jsx. Navbar/Footer: src/components/Layout.jsx.
- All styling is in src/index.css using CSS variables (dark default +
  html[data-theme='light'] overrides).
- The resume PDF is public/resume.pdf (URL: /resume.pdf).
- Social links are in src/components/Layout.jsx (footer) and
  src/pages/Contact.jsx. Order: LinkedIn, Telegram, WhatsApp, Behance,
  Instagram, GitHub.
- Always run "npm run build" after changes to verify, then lint.
- After every change: git add -A, git commit, git push. GitHub Actions
  rebuilds and redeploys automatically in ~1 minute.

WHAT I NEED FROM YOU:
When I give you a task, make the change, verify with npm run build,
then commit and push. Explain briefly what you changed. If the site is
blank after deploy, check the GitHub Actions run status and the
"artifacts"; a known gotcha is the GitHub Pages deployment being served
an old build.
-----------------------------------------------------------
PROMPT END
-----------------------------------------------------------

===========================================================
PART 2 — WHAT WAS DONE TO SET UP EVERYTHING (FULL DETAIL)
===========================================================

---- 2.1 MACHINE SETUP (this PC) ----
- Installed Node.js LTS 24.18.1 + npm via:
    winget install --id OpenJS.NodeJS.LTS --accept-package-agreements
- git 2.54 (already installed).
- Installed GitHub CLI via:
    winget install --id GitHub.cli --accept-package-agreements
- Authenticated GitHub CLI + granted the workflow scope:
    gh auth login        (browser flow, one-time code)
    gh auth refresh -h github.com -s workflow
  The 'workflow' scope is REQUIRED so git can push the file
  .github/workflows/deploy.yml.

---- 2.2 PROJECT SCAFFOLD ----
- Created the React + Vite project:
    npm create vite@latest portfolio -- --template react
- Installed dependencies:
    npm install
    npm install react-router-dom gh-pages
  (gh-pages is installed but deployment actually uses GitHub Actions,
   so gh-pages is not required anymore.)

---- 2.3 FILES & STRUCTURE ----
C:\portfolio  (local copy)  ->  G:\My Drive\artsbyankit.github.io (sync)
- index.html               Browser title "Ankit Patel - UI/UX Designer",
                           Google Fonts (Inter + Space Grotesk), and an
                           inline anti-flash script that sets the saved
                           theme (data-theme) before React loads.
- vite.config.js           base: '/'; includes a tiny Vite plugin that
                           copies dist/index.html to dist/404.html on
                           build (needed for client-side routing on GH Pages).
- package.json             scripts: dev, build, lint, preview, deploy.
                           "homepage": "https://artsbyankit.github.io"
- src/main.jsx             mounts <App/> inside <BrowserRouter>.
- src/App.jsx              routes: /, /work, /work/:slug, /about, /contact,
                           * (fallback -> Home).
- src/index.css            full design system + light/dark themes +
                           glass styling + all visual effects.
- src/data/projects.js     6 placeholder case studies (edit these).
- src/components/
    Layout.jsx             Navbar (glass, theme toggle, mobile menu),
                           Footer (socials), orb/vignette/noise overlays,
                           reveal + spotlight tracking effects.
    ProjectCard.jsx        Card used on Home/Work grids.
    CursorSpotlight.jsx    smooth mouse-following glow.
- src/pages/               Home.jsx, Projects.jsx, CaseStudy.jsx,
                           About.jsx, Contact.jsx.
- public/resume.pdf        resume, served at /resume.pdf.
- .github/workflows/deploy.yml  THE auto-deploy pipeline (see 2.5).
- CHANGES.md               change log of everything done.

---- 2.4 THEME / DESIGN SYSTEM ----
- Dark mode is the default. Light mode is defined under
  html[data-theme='light'] in src/index.css. Both are variable-driven.
- Theme choice is saved in localStorage key 'theme' and applied via a
  <script> in index.html (no flash) and a toggle in the navbar.
- Accent gradient: skyblue -> purple (#8b5cf6 -> #3b82f6 -> #38bdf8).
- Liquid Glass look: frosted glass ONLY on the navbar (chrome), per
  Apple's guidance that content stays clean/solid. Content cards are
  solid surfaces with soft shadows and rounded corners.
- Effects added:
  - animated liquid-gradient background orbs (.bg-orbs, @keyframes float)
  - cursor-following spotlight (.cursor-spot + CursorSpotlight.jsx)
  - per-element hover spotlight on cards/buttons/skill-boxes/social pills
    (::after radial-gradient at CSS vars --mx/--my)
  - scroll reveal (.reveal -> .in via IntersectionObserver)
  - blur vignette (.vignette)
  - film-grain noise overlay (.noise-overlay, inline SVG feTurbulence)
  - all respect prefers-reduced-motion.

---- 2.5 GITHUB PAGES DEPLOYMENT (the important part) ----
1. Repo must be named exactly artsbyankit.github.io to get the
   username.github.io URL:
     gh repo create artsbyankit.github.io --public --source . --push
2. The workflow file .github/workflows/deploy.yml:
     on: push to main (and manual workflow_dispatch)
     permissions: contents:read, pages:write, id-token:write
     Job 'build': checkout -> setup-node 22 with npm cache ->
        npm ci -> npm run build -> actions/upload-pages-artifact@v3
        (path: ./dist)
     Job 'deploy' (needs build): environment github-pages ->
        actions/deploy-pages@v4
3. Pages publishing source must be "GitHub Actions" (build_type workflow).
   For a USER site (username.github.io) the source cannot be a gh-pages
   branch, so we set it via the API:
     gh api -X PUT repos/artsbyankit/artsbyankit.github.io/pages \
        -F build_type=workflow -f source[branch]=main -f source[path]=/
4. Every `git push` to main automatically rebuilds and redeploys
   (takes about 1 minute). Watch it:
     gh run list --repo artsbyankit/artsbyankit.github.io
     gh run watch <run-id> --repo artsbyankit/artsbyankit.github.io
5. KNOWN GOTCHA (why the site was once blank): when the repo is created,
   GitHub auto-enables Pages from the main branch (a "legacy" build that
   publishes the raw SOURCE, which renders blank). Fix = switch to the
   workflow source (2.5 step 3) and re-run the workflow:
     gh workflow run deploy.yml --repo artsbyankit/artsbyankit.github.io
6. Client-side routing: routes like /work/payflow are handled with
   BrowserRouter + the copied 404.html fallback. Direct refresh on a
   deep link returns HTTP 404 status but serves the app shell, and React
   renders the correct page.

---- 2.6 CONTENT / HOW TO EDIT ----
- Case studies: edit src/data/projects.js. Each project has slug, title,
  category, year, role, duration, tools, emoji, gradient, excerpt,
  overview, problem, process[], solution, results[]. Real screenshots can
  be added into the case-study gallery placeholders on each project page.
- Email: currently artsbyankit@duck.com (src/pages/Contact.jsx).
- Socials order: LinkedIn, Telegram, WhatsApp, Behance, Instagram, GitHub.
- Resume: replace public/resume.pdf with the latest PDF (keep the name).

---- 2.7 LOCAL PREVIEW vs LIVE ----
- npm run dev  -> fast dev server, hot reload.
- npm run preview -> serves the exact production build (best for final check).
- Differences: no CDN cache locally; no HTTPS locally; deep-link refresh
  is handled by the 404.html fallback on GitHub. Results are otherwise
  identical because GitHub runs the same `npm run build`.

---- 2.8 WORKING FROM ANOTHER COMPUTER ----
1. Make sure G:\My Drive is synced (Google Drive for Desktop) on the
   other PC, or copy the whole folder there.
2. Install Node.js LTS (winget install --id OpenJS.NodeJS.LTS).
3. Open a terminal in the folder, run: npm install  (first time only).
4. Preview: npm run dev  (then open the printed http://localhost:5173).
5. Make edits -> git add -A -> git commit -m "msg" -> git push.
   (First push will ask you to sign in to GitHub once.)
6. The site auto-rebuilds and redeploys. No other manual step needed.
