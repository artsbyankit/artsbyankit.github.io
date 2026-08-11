export default function Contact() {
  return (
    <>
      <section className="contact-big">
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1>
            Let's build something <span className="gradient-text">great together</span>
          </h1>
          <p>
            Whether you have a product idea, a project in need of a designer, or just want
            to talk design — my inbox is open. I reply to every message within 48 hours.
          </p>
          <div className="contact-actions">
            <a className="btn btn-primary" href="mailto:ArtsByAnkit@gmail.com">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m2 7 10 6L22 7" />
              </svg>
              ArtsByAnkit@gmail.com
            </a>
            <a className="btn" href="tel:+918758789018">
              +91 87587 89018
            </a>
            <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">
              Download resume ↓
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="social-big">
          <a href="https://www.linkedin.com/in/artsbyankit" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://t.me/MadeByAnkit" target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href="https://web.whatsapp.com/send?phone=918758789018" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href="https://www.behance.net/ArtByAnkit" target="_blank" rel="noreferrer">
            Behance
          </a>
          <a href="https://www.instagram.com/artsbyankit" target="_blank" rel="noreferrer">
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
