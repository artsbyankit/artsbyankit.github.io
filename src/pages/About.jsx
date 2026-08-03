export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">About me</div>
          <h1>Designer. Strategist. <span className="gradient-text">Problem solver.</span></h1>
          <p>
            I'm Ankit, a UI/UX designer who loves the messy middle of a project — where
            research turns into ideas, and ideas become interfaces people actually enjoy.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="portrait">🧑‍💻</div>
            <div className="about-text">
              <p>
                For the past six years I've worked across startups, agencies, and product
                teams, designing everything from 0-to-1 mobile apps to enterprise design
                systems. I care about the details most people never notice — spacing,
                micro-interactions, empty states — because those are the details people
                feel.
              </p>
              <p>
                My process is user-centered but delivery-focused. I believe in research
                that informs decisions, prototypes that answer questions, and interfaces
                that are as pleasant to maintain as they are to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">What I do</div>
              <h2 className="section-title">Skills & services</h2>
            </div>
          </div>
          <div className="skill-list">
            <div className="skill-box">
              <h4>UX Research</h4>
              <p>Interviews, usability testing, journey mapping, and heuristic audits to ground every decision in evidence.</p>
            </div>
            <div className="skill-box">
              <h4>UI Design</h4>
              <p>High-fidelity interfaces, visual systems, and prototypes in Figma that are pixel-perfect and developer-ready.</p>
            </div>
            <div className="skill-box">
              <h4>Design Systems</h4>
              <p>Token-based libraries, component documentation, and governance models that scale across teams.</p>
            </div>
            <div className="skill-box">
              <h4>Interaction Design</h4>
              <p>Micro-interactions, motion, and state design that make products feel alive and responsive.</p>
            </div>
            <div className="skill-box">
              <h4>Prototyping</h4>
              <p>Interactive prototypes for testing and stakeholder buy-in, from lo-fi wireframes to polished flows.</p>
            </div>
            <div className="skill-box">
              <h4>Accessibility</h4>
              <p>WCAG-aware design, inclusive patterns, and color systems tested for all vision types.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Experience</div>
              <h2 className="section-title">Where I've been</h2>
            </div>
          </div>
          <div className="timeline">
            <div className="tl-item">
              <span className="year">2023 — Now</span>
              <div>
                <h4>Senior Product Designer · Freelance</h4>
                <p>Designing products end-to-end for startups and agencies, from discovery to shipped design systems.</p>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">2021 — 2023</span>
              <div>
                <h4>Product Designer · SaaS Startup</h4>
                <p>Led redesigns of analytics dashboards and built the company design system adopted across three product lines.</p>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">2019 — 2021</span>
              <div>
                <h4>UI Designer · Design Agency</h4>
                <p>Shipped marketing sites, mobile apps, and brand identities for clients across fintech, health, and e-commerce.</p>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">2018 — 2019</span>
              <div>
                <h4>UX Designer · Studio</h4>
                <p>Learned the craft: user research, wireframes, and the value of a well-tested prototype.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
