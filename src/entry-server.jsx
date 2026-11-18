// Build-time pre-render entry (used only by vite.config.js, never shipped to
// the browser). Renders a route to static HTML with every lazy page chunk
// resolved, so each page's HTML arrives with its content already in it.
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'

async function renderOnce(url) {
  const errors = []
  const { prelude } = await prerenderToNodeStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
    {
      onError: (error) => errors.push(error),
      // React outlines large Suspense boundaries into deferred segments (NestCare
      // is big enough to trigger it); for a static page we want it all inline.
      progressiveChunkSize: Number.MAX_SAFE_INTEGER,
    },
  )
  if (errors.length) throw new Error(`Pre-render of ${url} failed:\n${errors.map((e) => e.stack || e).join('\n')}`)
  const chunks = []
  for await (const chunk of prelude) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export async function render(url) {
  // The first pass makes React.lazy load this route's page modules. A boundary
  // that suspends is emitted as a deferred segment plus an inline <script> to
  // reveal it — which the CSP blocks — so the second pass, with every lazy
  // module already resolved, is the one that ships: plain HTML, no scripts.
  await renderOnce(url)
  const html = await renderOnce(url)
  if (/<script|<template/.test(html)) {
    const at = html.search(/<script|<template/)
    throw new Error(`Pre-render of ${url} still contains deferred Suspense segments: …${html.slice(Math.max(0, at - 200), at + 200)}…`)
  }
  return html
}
