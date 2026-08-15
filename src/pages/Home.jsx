import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'

export default function Home() {
  const featured = projects.slice(0, 2)

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-tag">
            <span className="pulse"></span>
            Available for freelance projects
          </div>
          <h1>
            Turning complex ideas into <span className="gradient-text">intuitive experiences</span>
          </h1>
          <p className="lead">
            I'm Ankit Patel, a UI/UX designer passionate about solving user problems through
            clean, functional design — translating complex ideas into intuitive experiences,
            and always refining the process to balance usability with clarity.
          </p>
          <div className="hero-actions">
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              Download resume
            </a>
            <Link to="/contact" className="btn">
              Get in touch
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <strong>7+</strong> years designing
            </span>
            <span>
              <strong>4</strong> companies &amp; studios
            </span>
            <span>
              <strong>3</strong> languages spoken
            </span>
          </div>
        </div>
      </section>

      <div className="tools-strip">
        <div className="container">
          <div className="tools-row">
            <span className="tag">User Research</span>
            <span className="tag">Wireframing</span>
            <span className="tag">Prototyping</span>
            <span className="tag">User Flows &amp; IA</span>
            <span className="tag">Design Systems</span>
            <span className="tag">Usability Testing</span>
            <span className="tag">Motion Design</span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Selected work</div>
              <h2 className="section-title">Featured projects</h2>
            </div>
            <Link to="/work" className="btn all-projects-head">
              All projects <span>→</span>
            </Link>
          </div>
          <div className="work-grid">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <Link to="/work" className="btn all-projects-mobile">
            All projects <span>→</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="portrait">👨‍🎨</div>
            <div className="about-text">
              <div className="eyebrow">About me</div>
              <h2>Design that balances usability with clarity</h2>
              <p>
                I'm passionate about solving user problems through clean, functional design —
                from wireframes and user flows to high-fidelity interfaces, and the motion
                that makes them feel alive.
              </p>
              <p>
                I've worked with product teams across startups, studios, and a global company
                like Cimpress — as a UI/UX designer and, before that, as a motion designer at
                Azrael Services. I'm always learning, always refining.
              </p>
              <div className="stat-row">
                <div className="stat">
                  <strong>2018</strong>
                  <span>B.Tech (IT) · DA-IICT</span>
                </div>
                <div className="stat">
                  <strong>7+</strong>
                  <span>Years in design</span>
                </div>
                <div className="stat">
                  <strong>3</strong>
                  <span>Languages spoken</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>
            Have an idea? Let's make it <span className="gradient-text">beautiful</span>
          </h2>
          <p>
            Whether you have a product idea, a project in need of a designer, or just want
            to talk design — my inbox is open. I reply to every message within 48 hours.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  )
}
