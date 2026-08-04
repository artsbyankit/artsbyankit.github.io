import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'

export default function Home() {
  const featured = projects.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-tag">
            <span className="pulse"></span>
            Available for freelance projects
          </div>
          <h1>
            I craft digital products people <span className="gradient-text">love to use</span>
          </h1>
          <p className="lead">
            I'm Ankit, a UI/UX designer turning complex problems into clear, beautiful
            experiences. I design apps, websites, and design systems from first sketch to
            shipped product.
          </p>
          <div className="hero-actions">
            <Link to="/work" className="btn btn-primary">
              View my work
            </Link>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn">
              Download resume ↓
            </a>
            <Link to="/contact" className="btn">
              Get in touch
            </Link>
          </div>
          <div className="hero-meta">
            <span>
              <strong>6+</strong> years designing
            </span>
            <span>
              <strong>40+</strong> projects shipped
            </span>
            <span>
              <strong>12</strong> happy clients
            </span>
          </div>
        </div>
      </section>

      <div className="tools-strip">
        <div className="container">
          <div className="tools-strip-inner">
            <span>Figma</span>
            <span>·</span>
            <span>UI Design</span>
            <span>·</span>
            <span>UX Research</span>
            <span>·</span>
            <span>Prototyping</span>
            <span>·</span>
            <span>Design Systems</span>
            <span>·</span>
            <span>Usability Testing</span>
            <span>·</span>
            <span>Interaction Design</span>
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
            <Link to="/work" className="btn">
              All projects <span>→</span>
            </Link>
          </div>
          <div className="work-grid">
            {featured.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="portrait">👨‍🎨</div>
            <div className="about-text">
              <div className="eyebrow">About me</div>
              <h2>Design with empathy, shipped with precision</h2>
              <p>
                I believe great design starts with understanding people — their goals,
                their frustrations, the small moments that matter. For the past six years
                I've partnered with startups and product teams to research, design, and
                ship interfaces that feel obvious.
              </p>
              <p>
                When I'm not in Figma, I'm studying design systems, mentoring junior
                designers, or testing my latest side project.
              </p>
              <div className="stat-row">
                <div className="stat">
                  <strong>40+</strong>
                  <span>Projects delivered</span>
                </div>
                <div className="stat">
                  <strong>98%</strong>
                  <span>Client satisfaction</span>
                </div>
                <div className="stat">
                  <strong>6</strong>
                  <span>Design awards</span>
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
            I'm currently accepting new projects for freelance and full-time roles. Tell
            me about your product and I'll get back to you within 48 hours.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  )
}
