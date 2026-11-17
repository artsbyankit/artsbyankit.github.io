import cats from '../data/cats'
export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">About me</div>
          <h1>Design that balances <span className="gradient-text">usability with clarity</span></h1>
          <p>
            I'm Ankit Patel, a UI/UX designer based in Bilimora, Gujarat, India. I'm
            passionate about solving user problems through clean, functional design and
            translating complex ideas into intuitive experiences.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="portrait">
              <picture>
                <source srcSet="/about-me.avif" type="image/avif" />
                <source srcSet="/about-me.webp" type="image/webp" />
                <img
                  src="/about-me.webp"
                  alt="Ankit Patel — UI/UX Designer"
                  width="640"
                  height="640"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>
            <div className="about-text">
              <p>
                I've worked across startups, studios, and remote teams — starting as a
                UI/UX intern at PushStart, designing client projects at Unizyr
                Technologies, and spending three years creating motion at Azrael
                Services, then designing UI/UX at Cimpress. Today I design
                independently, focused on UI/UX.
              </p>
              <p>
                Three years of making 60–70 videos a month taught me pace, feedback and
                how a screen should feel when it moves. UI/UX is the work I came back to,
                because it starts with the person, not the screen.
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
            <div className="skill-box reveal">
              <h3>User Research</h3>
              <p>Interviews, journey mapping, and heuristic audits that ground every decision in evidence.</p>
            </div>
            <div className="skill-box reveal">
              <h3>Wireframing & Prototyping</h3>
              <p>From lo-fi wireframes to interactive prototypes that answer real questions early.</p>
            </div>
            <div className="skill-box reveal">
              <h3>User Flows & Information Architecture</h3>
              <p>Structuring information and mapping journeys so products feel obvious to use.</p>
            </div>
            <div className="skill-box reveal">
              <h3>Usability Testing</h3>
              <p>Testing with real users to find friction and validate ideas before they ship.</p>
            </div>
            <div className="skill-box reveal">
              <h3>Design Systems</h3>
              <p>Token-based, documented libraries that scale across teams and products.</p>
            </div>
            <div className="skill-box reveal">
              <h3>Accessibility</h3>
              <p>WCAG-aware patterns and inclusive color systems designed for everyone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Stack</div>
              <h2 className="section-title">Tools & languages</h2>
            </div>
          </div>
          <div className="skill-list">
            <div className="skill-box reveal">
              <h3>Design tools</h3>
              <ul className="tool-list">
                <li>Figma</li>
                <li>Adobe XD</li>
                <li>LottieFiles</li>
                <li>Claude, OpenCode and other AI tools</li>
              </ul>
            </div>
            <div className="skill-box reveal">
              <h3>Adobe Suite</h3>
              <ul className="tool-list">
                <li>After Effects</li>
                <li>Illustrator</li>
                <li>Photoshop</li>
                <li>Lightroom</li>
                <li>Premiere Pro</li>
              </ul>
            </div>
            <div className="skill-box reveal">
              <h3>Languages</h3>
              <ul className="tool-list">
                <li>English</li>
                <li>Hindi</li>
                <li>Gujarati</li>
              </ul>
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
              <span className="year">2025 — Present</span>
              <div>
                <h3>Independent UI/UX Designer</h3>
                <p className="tl-role">Self-employed · Remote, Gujarat, India</p>
                <ul>
                  <li>Designed NestCare, a healthcare booking app for India’s Tier 2 &amp; 3 cities, in a team of two.</li>
                  <li>Brand, packaging, and visual design for small businesses.</li>
                  <li>Building AI into my research and design process.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">Aug 2025 — Dec 2025</span>
              <div>
                <h3>UI/UX Designer</h3>
                <p className="tl-role">Cimpress India Private Limited</p>
                <ul>
                  <li>Worked in the design team on UX and UI for digital products.</li>
                  <li>Contributed to user research, wireframes, and high-fidelity designs.</li>
                  <li>Collaborated closely with product managers and developers.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">Jan 2022 — Dec 2024</span>
              <div>
                <h3>Motion Designer</h3>
                <p className="tl-role">Azrael Services Pvt Ltd · Remote, Gurgaon, India</p>
                <ul>
                  <li>Produced high-quality motion graphics and videos for diverse clients.</li>
                  <li>Collaborated with writers, designers, and editors on concepts and storyboards.</li>
                  <li>Applied motion principles relevant to UI animations and micro-interactions.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">Nov 2021 — Jan 2022</span>
              <div>
                <h3>UI/UX Designer</h3>
                <p className="tl-role">Unizyr Technologies · Gandhinagar, India</p>
                <ul>
                  <li>Led UI/UX design for multiple client projects, from wireframes to high-fidelity UIs.</li>
                  <li>Collaborated closely with developers to ensure accurate implementation.</li>
                  <li>Trained and guided team members on UI/UX best practices.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">May 2019 — Jul 2019</span>
              <div>
                <h3>Intern UI/UX Designer</h3>
                <p className="tl-role">PushStart · Remote, Mumbai, India</p>
                <ul>
                  <li>Designed UX flows and UI assets for the company website.</li>
                  <li>Assisted in wireframing and visual design to improve usability.</li>
                  <li>Supported early-stage product design decisions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The real bosses</div>
              <h2 className="section-title">Meet the cats</h2>
            </div>
          </div>
          <div className="cat-grid">
            {cats.map((cat) => (
              <article key={cat.name} className="cat-card reveal">
                <div className={`cat-portrait pose-${cat.pose}`}>
                  {cat.photo ? (
                    <img src={cat.photo} alt={cat.name} loading="lazy" />
                  ) : (
                    <CatSilhouette pose={cat.pose} />
                  )}
                  <span className="cat-role">{cat.role}</span>
                </div>
                <div className="cat-body">
                  <div className="cat-head">
                    <h3>{cat.name}</h3>
                    <span className="cat-age">{cat.meta.split(' · ')[0]}</span>
                  </div>
                  <p className="cat-meta">{cat.meta.split(' · ').slice(1).join(' · ')}</p>
                  <p className="cat-bio">{cat.bio}</p>
                  <span className="cat-base">{cat.base}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Education</div>
              <h2 className="section-title">Where I studied</h2>
            </div>
          </div>
          <div className="timeline">
            <div className="tl-item">
              <span className="year">2014 — 2018</span>
              <div>
                <h3>B.Tech, Information Technology (coursework, not completed)</h3>
                <p className="tl-role">
                  <a
                    className="edu-link"
                    href="https://www.daiict.ac.in/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DA-IICT
                  </a>{' '}
                  · Gandhinagar, India
                </p>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">2014</span>
              <div>
                <h3>12th Science (HSC)</h3>
                <p className="tl-role">GS &amp; HSEB · Gandhinagar, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function CatSilhouette({ pose }) {
  const paths = {
    alert: 'M20 78 C14 60 16 42 26 34 L30 22 38 30 C44 27 52 27 58 30 L66 22 70 34 C80 42 82 62 76 78 M40 40 A2.5 2.5 0 1 0 40.01 40 M56 40 A2.5 2.5 0 1 0 56.01 40 M44 50 Q48 54 52 50 M8 74 C4 64 10 58 18 62',
    regal: 'M24 80 C18 58 22 38 32 32 L36 20 43 28 C47 26 53 26 57 28 L64 20 68 32 C78 40 80 62 74 80 M41 41 A2.5 2.5 0 1 0 41.01 41 M55 41 A2.5 2.5 0 1 0 55.01 41 M46 51 Q49 55 53 51 M88 76 C94 66 88 58 80 62 C92 70 84 80 72 79',
    loaf: 'M18 74 C12 60 18 46 30 42 L34 32 42 39 C48 37 54 37 60 39 L68 32 72 42 C82 48 86 62 80 74 Z M40 47 A2.2 2.2 0 1 0 40.01 47 M54 47 A2.2 2.2 0 1 0 54.01 47 M45 54 Q48 57 51 54',
  }
  return (
    <svg viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[pose] || paths.alert} />
    </svg>
  )
}
