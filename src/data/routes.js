// Per-route page metadata. Used at runtime (Layout) to update the tab title and
// description on navigation, and at build time (vite.config.js) to emit a real
// HTML file per route, so crawlers get a 200 and the right title for each page.
import projects from './projects.js'

export const SITE_URL = 'https://artsbyankit.github.io'

// Structured data (JSON-LD) for the person behind the site, added to every
// page at build time so search engines can connect the pages to one profile.
export const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Ankit Patel',
  jobTitle: 'UI/UX Designer',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/about-me.webp`,
  address: { '@type': 'PostalAddress', addressRegion: 'Gujarat', addressCountry: 'IN' },
  knowsAbout: ['UI design', 'UX research', 'Interaction design', 'Design systems', 'Motion design'],
  sameAs: [
    'https://www.linkedin.com/in/artsbyankit',
    'https://github.com/artsbyankit',
    'https://www.instagram.com/artsbyankit',
  ],
}

// Pages built from their own component file (the rest use CaseStudy's template).
const CUSTOM_PAGE = { nestcare: 'NestCare', 'silk-serenity': 'SilkSerenity', 'eat-me-first': 'EatMeFirst' }
const SITE_TITLE = 'Ankit Patel - UI/UX Designer'
const SITE_DESCRIPTION =
  'Ankit Patel, UI/UX designer in Gujarat, India, with a motion design background. Simple apps for the people big apps forget. Open to full-time remote roles.'

export const routes = [
  { path: '/', title: SITE_TITLE, description: SITE_DESCRIPTION, sources: ['src/pages/Home.jsx', 'src/data/projects.js'] },
  {
    path: '/work',
    title: `Work - ${SITE_TITLE}`,
    description:
      'Selected UI/UX case studies across mobile apps, web platforms, and brand identity — the problem, the process, and the decisions behind the design.',
    sources: ['src/pages/Projects.jsx', 'src/data/projects.js'],
  },
  {
    path: '/about',
    title: `About - ${SITE_TITLE}`,
    description:
      'About Ankit Patel — UI/UX designer with 3+ years across startups, studios, and remote teams, plus a background in motion design.',
    preload: { href: '/about-me.avif', type: 'image/avif' },
    sources: ['src/pages/About.jsx'],
  },
  {
    path: '/contact',
    title: `Contact - ${SITE_TITLE}`,
    description: "Hiring a UI/UX designer? Get in touch with Ankit Patel, open to full-time remote roles.",
    sources: ['src/pages/Contact.jsx'],
  },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    title: `${p.title} - Ankit Patel`,
    description: p.excerpt,
    preload: p.preload,
    image: `/og/${p.slug}.jpg`,
    imageAlt: `${p.title} — ${p.category}`,
    caseStudy: { name: p.title, genre: p.category, year: p.year },
    sources: [CUSTOM_PAGE[p.slug] ? `src/pages/${CUSTOM_PAGE[p.slug]}.jsx` : 'src/data/caseStudies.js'],
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
