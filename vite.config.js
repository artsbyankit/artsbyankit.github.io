import { defineConfig, build as viteBuild } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SITE_URL, notFoundMeta, person, routes } from './src/data/routes.js'
import { themeCss } from './src/theme.js'

// GitHub Pages can't set response headers, so the policy ships as a meta tag
// (production only — Vite's dev server needs inline scripts for HMR).
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'", // React style props and runtime-injected styles
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// JSON inside <script>: escape "<" so no string can close the tag.
const jsonScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

function renderPage(html, { title, description, url, preload, image, imageAlt }) {
  const t = escapeAttr(title)
  const d = escapeAttr(description)
  const setContent = (attr, name, value) =>
    html.replace(new RegExp(`(<meta\\s+${attr}="${name}"\\s+content=")[^"]*"`), `$1${value}"`)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
  html = setContent('name', 'description', d)
  html = setContent('property', 'og:title', t)
  html = setContent('property', 'og:description', d)
  html = setContent('name', 'twitter:title', t)
  html = setContent('name', 'twitter:description', d)
  if (url) {
    html = setContent('property', 'og:url', url)
    html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
  }
  if (image) {
    html = setContent('property', 'og:image', `${SITE_URL}${image}`)
    html = setContent('name', 'twitter:image', `${SITE_URL}${image}`)
    if (imageAlt) {
      html = setContent('property', 'og:image:alt', escapeAttr(imageAlt))
      html = setContent('name', 'twitter:image:alt', escapeAttr(imageAlt))
    }
  }
  if (preload) {
    const attrs = [
      `href="${preload.href}"`,
      preload.type && `type="${preload.type}"`,
      preload.srcset && `imagesrcset="${preload.srcset}"`,
      preload.sizes && `imagesizes="${preload.sizes}"`,
    ].filter(Boolean)
    html = html.replace('</head>', `  <link rel="preload" as="image" fetchpriority="high" ${attrs.join(' ')} />\n  </head>`)
  }
  return html
}

// Structured data per route: the person on every page, the site on the home
// page, and a CreativeWork for each case study.
function structuredData(route) {
  const graph = [person]
  if (route.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: route.title,
      description: route.description,
      author: { '@id': person['@id'] },
    })
  }
  if (route.caseStudy) {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${SITE_URL}${route.path}#work`,
      url: `${SITE_URL}${route.path}`,
      name: route.caseStudy.name,
      genre: route.caseStudy.genre,
      description: route.description,
      image: route.image && `${SITE_URL}${route.image}`,
      ...(/^\d{4}$/.test(route.caseStudy.year ?? '') && { dateCreated: route.caseStudy.year }),
      author: { '@id': person['@id'] },
      creator: { '@id': person['@id'] },
    })
  }
  return jsonScript({ '@context': 'https://schema.org', '@graph': graph })
}

// Last commit date of a route's source files, for the sitemap's <lastmod>.
// Needs full git history in CI (see deploy.yml: fetch-depth: 0).
function lastModified(files = []) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { encoding: 'utf8' }).trim() || null
  } catch {
    return null
  }
}

// Pre-render every route to static HTML at build time: a server build of
// src/entry-server.jsx renders each page (lazy chunks included), and the HTML
// goes into that route's file. Visitors see content before any JS runs (the
// home H1 is no longer waiting on the bundle to paint), crawlers get real
// text, and the client hydrates it (src/main.jsx).
async function prerenderer() {
  const outDir = resolve('node_modules/.cache/prerender')
  await viteBuild({
    configFile: false,
    logLevel: 'warn',
    plugins: [react()],
    // Font CSS from @fontsource is imported by page modules; bundle it so Node
    // never tries to import a .css file.
    ssr: { noExternal: [/^@fontsource/] },
    build: {
      ssr: 'src/entry-server.jsx',
      outDir,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
    },
  })
  const mod = await import(`${pathToFileURL(resolve(outDir, 'entry-server.mjs')).href}?t=${Date.now()}`)
  return {
    render: mod.render,
    cleanup: () => rmSync(outDir, { recursive: true, force: true }),
  }
}

// Route → the lazy page chunks it needs.
const PAGES = { '/work': ['Projects'], '/about': ['About'], '/contact': ['Contact'] }

// One real HTML file per route (GitHub Pages serves /about from about.html with
// a 200). Without these, every deep link is answered by 404.html: it renders
// fine in a browser but returns HTTP 404, so search engines drop the page.
// Each file also gets its page's code, CSS and fonts preloaded up front, so a
// deep link doesn't discover them one round trip at a time.
function staticRoutes() {
  const pageChunks = {} // 'About' -> { js: [...], css: [...] }
  return {
    name: 'static-routes',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ]
    },
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || chunk.isEntry) continue
        const name = chunk.facadeModuleId?.match(/\/src\/pages\/(\w+)\.jsx$/)?.[1]
        if (!name) continue
        pageChunks[name] = {
          js: [chunk.fileName, ...chunk.imports],
          css: [...(chunk.viteMetadata?.importedCss ?? [])],
        }
      }
    },
    async closeBundle() {
      const read = (file) => readFileSync(resolve('dist', file), 'utf8')
      const shell = read('index.html')
      // Latin, normal-style variable fonts referenced by a CSS file: the faces
      // the first paint actually uses.
      const fontsIn = (cssFile) => [...read(cssFile).matchAll(/\/assets\/[\w.-]*-latin-wght-normal-[\w-]+\.woff2/g)].map((m) => m[0])
      const entryCss = [...shell.matchAll(/href="\/(assets\/[^"]+\.css)"/g)].map((m) => m[1])
      const baseFonts = [...new Set(entryCss.flatMap(fontsIn))]

      const pagesFor = (path) => {
        if (PAGES[path]) return PAGES[path]
        const slug = path.match(/^\/work\/(.+)$/)?.[1]
        if (!slug) return []
        const custom = Object.keys(pageChunks).find((n) => n.toLowerCase() === slug.replace(/-/g, ''))
        return custom ? ['CaseStudy', custom] : ['CaseStudy']
      }

      const headFor = (path) => {
        const chunks = pagesFor(path).map((name) => pageChunks[name]).filter(Boolean)
        const js = [...new Set(chunks.flatMap((c) => c.js))]
        const css = [...new Set(chunks.flatMap((c) => c.css))]
        const fonts = [...new Set([...baseFonts, ...css.flatMap(fontsIn)])]
        return [
          `<style id="app-theme-vars">${themeCss().replace(/\s+/g, ' ')}</style>`,
          // Without JS, scroll-reveal content must still be visible.
          '<noscript><style>.reveal { opacity: 1 !important; transform: none !important; }</style></noscript>',
          ...fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="${f}" crossorigin />`),
          ...css.map((f) => `<link rel="stylesheet" crossorigin href="/${f}" />`),
          ...js.map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`),
        ]
          .map((tag) => `    ${tag}`)
          .join('\n')
      }

      const { render, cleanup } = await prerenderer()
      try {
        for (const route of routes) {
          const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
          let html = renderPage(shell, { ...route, url: route.path === '/' ? null : url })
          html = html.replace('</head>', `${headFor(route.path)}\n    ${structuredData(route)}\n  </head>`)
          const app = await render(route.path)
          if (!app.trim()) throw new Error(`Pre-render produced no HTML for ${route.path}`)
          html = html.replace('<div id="root"></div>', `<div id="root" data-path="${route.path}">${app}</div>`)
          const file = route.path === '/' ? 'dist/index.html' : `dist${route.path}.html`
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(file, html)
        }
      } finally {
        cleanup()
      }

      // 404.html answers every unknown URL, so it can't be pre-rendered for one
      // route: it stays an empty shell the client renders into.
      writeFileSync(
        'dist/404.html',
        renderPage(shell, notFoundMeta)
          .replace(/\s*<link rel="canonical"[^>]*>/, '')
          .replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
          .replace('</head>', `${headFor('/404')}\n  </head>`),
      )

      const urls = routes
        .map((r) => {
          const lastmod = lastModified(r.sources)
          return `  <url><loc>${SITE_URL}${r.path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
        })
        .join('\n')
      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )

      for (const r of routes) {
        if (r.image && !existsSync(resolve('dist', r.image.slice(1)))) {
          throw new Error(`Missing social image for ${r.path}: public${r.image}`)
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), staticRoutes()],
  base: '/',
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|@remix-run)[\\/]/.test(
              id,
            )
          ) {
            return 'react'
          }
        },
      },
    },
  },
})
