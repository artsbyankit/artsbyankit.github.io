import { Component } from 'react'

const RELOAD_KEY = 'chunk-reload'
const RELOAD_GAP_MS = 30000

// After a deploy, a tab left open can ask for a page file that no longer exists. One reload
// fetches the new version. The time check stops a real outage from reloading forever.
const isStaleChunk = (error) =>
  /dynamically imported module|importing a module script|loading (css )?chunk/i.test(error?.message || '')

// Keeps a failure in one page from blanking the whole site: the nav and footer stay up.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error(error)
    if (!isStaleChunk(error)) return
    try {
      const last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0
      if (Date.now() - last < RELOAD_GAP_MS) return
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    window.location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="notfound container" role="alert">
        <h1>Something went wrong</h1>
        <p>This page couldn’t load. Please reload, or email ArtsByAnkit@gmail.com if it keeps happening.</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload the page
        </button>
      </div>
    )
  }
}
