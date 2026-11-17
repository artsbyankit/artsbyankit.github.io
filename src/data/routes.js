// Per-route page metadata. Used at runtime (Layout) to update the tab title and
// description on navigation, and at build time (vite.config.js) to emit a real
// HTML file per route, so crawlers get a 200 and the right title for each page.
import projects from './projects.js'

export const SITE_URL = 'https://artsbyankit.github.io'
const SITE_TITLE = 'Ankit Patel - UI/UX Designer'
const SITE_DESCRIPTION =
  'Ankit Patel, UI/UX designer in Gujarat, India, with a motion design background. Simple apps for the people big apps forget. Open to full-time remote roles.'

export const routes = [
  { path: '/', title: SITE_TITLE, description: SITE_DESCRIPTION },
  {
    path: '/work',
    title: `Work - ${SITE_TITLE}`,
    description:
      'Selected UI/UX case studies across mobile apps, web platforms, and brand identity — the problem, the process, and the decisions behind the design.',
  },
  {
    path: '/about',
    title: `About - ${SITE_TITLE}`,
    description:
      'About Ankit Patel — UI/UX designer with 3+ years across startups, studios, and remote teams, plus a background in motion design.',
    preload: { href: '/about-me.avif', type: 'image/avif' },
  },
  {
    path: '/contact',
    title: `Contact - ${SITE_TITLE}`,
    description: "Hiring a UI/UX designer? Get in touch with Ankit Patel, open to full-time remote roles.",
  },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} - Ankit Patel`,
    description: p.excerpt,
    preload: p.preload,
  })),
]

export const notFoundMeta = {
  title: `Page not found - ${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
}

export function metaFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return routes.find((r) => r.path === path) || null
}
