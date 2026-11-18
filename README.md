# Ankit Patel — UI/UX Designer Portfolio

Personal portfolio site built with React 19, Vite 8, and React Router. Deployed to GitHub Pages via GitHub Actions.

## Pages

- Home
- Work (case studies)
- About
- Contact

## Development

```bash
npm install     # install dependencies
npm run dev     # local dev server
npm run build   # production build to /dist
npm run lint    # run oxlint
npm run preview # serve the production build
```

## Project structure

- `src/pages/` — page layouts
- `src/components/` — shared components (Layout, ProjectCard)
- `src/data/projects.js` — case study content
- `src/data/routes.js` — page titles and descriptions (new pages must be added here to get their own HTML file and sitemap entry)
- `src/theme.js` — colors
- `src/liquidGlass.js` — the refractive glass engine
- `src/index.css` — design system, themes, styling
- `src/data/caseStudies.js` — full case-study detail (kept out of the entry bundle)
- `src/entry-server.jsx` — build-time pre-render entry (not shipped)
- `public/` — static assets (resume, favicon, `og/` social images per case study)

## Build pipeline

`npm run build` pre-renders every route to static HTML (`vite.config.js`), so pages show content before JavaScript loads and the client hydrates it. Each route's HTML also preloads its page code, CSS and fonts, and carries JSON-LD structured data; the sitemap gets `<lastmod>` dates from git. `npm run check` fails the build if a page isn't pre-rendered, a social image is missing, or bundles grow past their budgets. CI also runs Lighthouse (`lighthouserc.json`) and keeps the report as a workflow artifact.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys the site automatically to https://artsbyankit.github.io
