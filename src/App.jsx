import { lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AccentPicker from './AccentPicker'
import Home from './pages/Home'

const Projects = lazy(() => import('./pages/Projects'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

export default function App() {
  // Fetch the lazy route chunks once the browser is idle, so navigation
  // between pages is instant without blocking the first paint.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1))
    idle(() => {
      import('./pages/Projects')
      import('./pages/About')
      import('./pages/Contact')
      import('./pages/CaseStudy')
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
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
      {/* Dev-only live accent picker — renders nothing without ?picker */}
      <AccentPicker />
    </>
  )
}
