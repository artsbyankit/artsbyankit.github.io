export default function Contact() {
  return (
    <>
      <section className="contact-big container">
        <div className="eyebrow">Contact</div>
        <h1>
          Let's build something <span className="gradient-text">great together</span>
        </h1>
        <p>
          Whether you have a product idea, a project in need of a designer, or just want
          to talk design — my inbox is open. I reply to every message within 48 hours.
        </p>
        <div className="contact-actions">
          <a className="btn btn-primary" href="mailto:artsbyankit@duck.com">
            ✉️ artsbyankit@duck.com
          </a>
          <a className="btn" href="mailto:artsbyankit@duck.com?subject=Freelance%20inquiry">
            Start a project
          </a>
          <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
            Download resume ↓
          </a>
        </div>
      </section>

      <div className="container">
        <div className="social-big">
          <a href="https://www.behance.net/" target="_blank" rel="noreferrer">
            Behance
          </a>
          <a href="https://dribbble.com/" target="_blank" rel="noreferrer">
            Dribbble
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://github.com/artsbyankit" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </>
  )
}
