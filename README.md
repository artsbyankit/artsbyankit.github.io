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
- `src/index.css` — design system, themes, styling
- `public/` — static assets (resume, backgrounds, favicon)

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys the site automatically to https://artsbyankit.github.io
