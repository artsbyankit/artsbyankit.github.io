import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'

export default function CaseStudy() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="notfound container">
        <h1>404</h1>
        <p>That case study doesn't exist yet.</p>
        <Link to="/work" className="btn btn-primary">
          Back to work
        </Link>
      </div>
    )
  }

  return (
    <>
      <section className="cs-hero container">
        <Link to="/work" className="cs-back">
          ← All projects
        </Link>
        <h1>{project.title}</h1>
        <p className="text-muted">{project.excerpt}</p>

        <div className="cs-meta">
          <span className="tag">{project.category}</span>
          <span className="tag">{project.year}</span>
          <span className="tag">Role: {project.role}</span>
          <span className="tag">Duration: {project.duration}</span>
        </div>

        <div className="cs-cover" style={{ background: project.gradient }}>
          <span className="cover-title">{project.title}</span>
        </div>
      </section>

      <section className="container">
        <div className="cs-section">
          <h3>Overview</h3>
          <div className="body">
            <p>{project.overview}</p>
            <p>
              <strong>Tools:</strong> {project.tools.join(' · ')}
            </p>
          </div>
        </div>

        <div className="cs-section">
          <h3>Problem</h3>
          <div className="body">
            <p>{project.problem}</p>
          </div>
        </div>

        <div className="cs-section">
          <h3>Process</h3>
          <div className="body">
            <ul>
              {project.process.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cs-section">
          <h3>Solution</h3>
          <div className="body">
            <p>{project.solution}</p>
          </div>
        </div>

        <div className="cs-section">
          <h3>Outcome</h3>
          <div className="body">
            <ul>
              {project.results.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cs-gallery" style={{ paddingBottom: 96 }}>
          <div className="frame wide">Replace this with a screenshot of your final design</div>
          <div className="frame">Add a wireframe or flow diagram here</div>
          <div className="frame">Add a design detail or component close-up here</div>
        </div>
      </section>
    </>
  )
}
