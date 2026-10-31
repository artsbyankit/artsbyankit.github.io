// Per-route page metadata. Used at runtime (Layout) to update the tab title and
// description on navigation, and at build time (vite.config.js) to emit a real
// HTML file per route, so crawlers get a 200 and the right title for each page.
import projects from './projects.js'

export const SITE_URL = 'https://artsbyankit.github.io'
const SITE_TITLE = 'Ankit Patel - UI/UX Designer'
const SITE_DESCRIPTION =
  'Ankit Patel — UI/UX designer turning complex ideas into intuitive experiences. Product design, motion design, and design systems. Based in Bilimora, India.'

export const routes = [
  { path: '/', title: SITE_TITLE, description: SITE_DESCRIPTION },
  {
    path: '/work',
    title: `Work - ${SITE_TITLE}`,
    description:
      'Selected UI/UX case studies across mobile apps, web platforms, design systems, and e-commerce — the problem, the process, and the measurable outcome.',
  },
  {
    path: '/about',
    title: `About - ${SITE_TITLE}`,
    description:
      'About Ankit Patel — UI/UX designer with 7+ years across startups, studios, and global product teams.',
    preload: { href: '/about-me.avif', type: 'image/avif' },
  },
  {
    path: '/contact',
    title: `Contact - ${SITE_TITLE}`,
    description: "Let's build something great together. Get in touch with Ankit Patel about product and UI/UX design work.",
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
