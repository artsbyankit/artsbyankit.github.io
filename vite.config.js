import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { SITE_URL, notFoundMeta, routes } from './src/data/routes.js'

// GitHub Pages can't set response headers, so the policy ships as a meta tag
// (production only — Vite's dev server needs inline scripts for HMR).
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://cdn.aidesigner.ai",
  "style-src 'self' 'unsafe-inline'", // React style props and runtime-injected styles
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.aidesigner.ai", // effect runtime's license check
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function renderPage(html, { title, description, url, preload }) {
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

// One real HTML file per route (GitHub Pages serves /about from about.html with
// a 200). Without these, every deep link is answered by 404.html: it renders
// fine in a browser but returns HTTP 404, so search engines drop the page.
function staticRoutes() {
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
    closeBundle() {
      const shell = readFileSync('dist/index.html', 'utf8')
      for (const { path, title, description, preload } of routes) {
        if (path === '/') continue
        const file = `dist${path}.html`
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, renderPage(shell, { title, description, url: `${SITE_URL}${path}`, preload }))
      }
      writeFileSync(
        'dist/404.html',
        renderPage(shell, notFoundMeta)
          .replace(/\s*<link rel="canonical"[^>]*>/, '')
          .replace('</title>', '</title>\n    <meta name="robots" content="noindex" />'),
      )
      const urls = routes
        .map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`)
        .join('\n')
      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
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
