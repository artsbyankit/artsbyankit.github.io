// Guards the production build: fails CI if pages go missing, downloads grow past their
// budgets, or something that shouldn't ship ends up public. Run after `npm run build`.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { routes } from '../src/data/routes.js'

const DIST = 'dist'
// Gzipped KB, set a little above today's sizes so growth has to be a decision.
const BUDGET_KB = { entryJs: 110, entryCss: 18, largestPageJs: 20 }
const SECRET = /ghp_[A-Za-z0-9]{20,}|github_pat_|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY/

const errors = []
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
const gzipKb = (file) => gzipSync(readFileSync(file)).length / 1024
const files = walk(DIST)

for (const { path, title } of routes) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`)
  if (!existsSync(file)) {
    errors.push(`Missing page: ${path}`)
    continue
  }
  const html = readFileSync(file, 'utf8')
  if (path !== '/' && !html.includes(`<title>${title.replace(/&/g, '&amp;')}</title>`)) errors.push(`Wrong title: ${path}`)
  if (!html.includes('rel="canonical"')) errors.push(`No canonical link: ${path}`)
  if (!html.includes('Content-Security-Policy')) errors.push(`No content security policy: ${path}`)
}
for (const name of ['404.html', 'sitemap.xml', 'robots.txt', 'sw.js']) {
  if (!existsSync(join(DIST, name))) errors.push(`Missing file: ${name}`)
}

const index = readFileSync(join(DIST, 'index.html'), 'utf8')
const entry = [...index.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => join(DIST, m[1]))
const entryJs = entry.filter((f) => f.endsWith('.js')).reduce((sum, f) => sum + gzipKb(f), 0)
const entryCss = entry.filter((f) => f.endsWith('.css')).reduce((sum, f) => sum + gzipKb(f), 0)
const pageJs = Math.max(
  ...files.filter((f) => f.endsWith('.js') && f.includes('assets') && !entry.includes(f)).map(gzipKb),
)
const report = { entryJs, entryCss, largestPageJs: pageJs }
for (const [name, kb] of Object.entries(report)) {
  console.log(`${name}: ${kb.toFixed(1)} KB gzipped (budget ${BUDGET_KB[name]})`)
  if (kb > BUDGET_KB[name]) errors.push(`${name} is over budget: ${kb.toFixed(1)} KB`)
}

for (const file of files) {
  if (file.endsWith('.map')) errors.push(`Source map shipped: ${file}`)
  if (/\.(html|js|css|json|txt|xml|svg)$/.test(file) && statSync(file).size < 5e6 && SECRET.test(readFileSync(file, 'utf8'))) {
    errors.push(`Possible secret in: ${file}`)
  }
}

if (errors.length) {
  console.error(`\nBuild check failed:\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`Build check passed: ${routes.length} routes, ${files.length} files.`)
