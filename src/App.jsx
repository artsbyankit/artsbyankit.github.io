import { lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

const Projects = lazy(() => import('./pages/Projects'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
export default function App() {
  // Fetch the lazy route chunks once the browser is idle, so navigation
  // between pages is instant without blocking the first paint.
  useEffect(() => {
    if (navigator.connection?.saveData) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1))
    idle(() => {
      // Only a head start: a failure here surfaces again, handled, when the page is opened.
      const ignore = () => {}
      import('./pages/Projects').catch(ignore)
      import('./pages/About').catch(ignore)
      import('./pages/Contact').catch(ignore)
      import('./pages/CaseStudy').catch(ignore)
    })
  }, [])

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Projects />} />
          <Route path="work/:slug" element={<CaseStudy />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
