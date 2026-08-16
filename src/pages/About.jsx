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
                For the past seven years I've worked across product teams, studios, and
                remote companies — starting as a UI/UX intern at PushStart, designing
                client projects at Unizyr Technologies, creating motion at Azrael
                Services, and now designing digital products at Cimpress.
              </p>
              <p>
                My approach is user-centered and delivery-focused: research that informs
                decisions, prototypes that answer questions, and interfaces that are as
                pleasant to maintain as they are to use. I'm constantly learning and
                refining my design process.
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
              <h4>User Research</h4>
              <p>Interviews, journey mapping, and heuristic audits that ground every decision in evidence.</p>
            </div>
            <div className="skill-box reveal">
              <h4>Wireframing & Prototyping</h4>
              <p>From lo-fi wireframes to interactive prototypes that answer real questions early.</p>
            </div>
            <div className="skill-box reveal">
              <h4>User Flows & Information Architecture</h4>
              <p>Structuring information and mapping journeys so products feel obvious to use.</p>
            </div>
            <div className="skill-box reveal">
              <h4>Usability Testing</h4>
              <p>Testing with real users to find friction and validate ideas before they ship.</p>
            </div>
            <div className="skill-box reveal">
              <h4>Design Systems</h4>
              <p>Token-based, documented libraries that scale across teams and products.</p>
            </div>
            <div className="skill-box reveal">
              <h4>Accessibility</h4>
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
              <h4>Design tools</h4>
              <ul className="tool-list">
                <li>Figma</li>
                <li>Adobe XD</li>
                <li>InVision Studio</li>
                <li>LottieFiles</li>
              </ul>
            </div>
            <div className="skill-box reveal">
              <h4>Adobe Suite</h4>
              <ul className="tool-list">
                <li>After Effects</li>
                <li>Illustrator</li>
                <li>Photoshop</li>
                <li>Lightroom</li>
                <li>Premiere Pro</li>
              </ul>
            </div>
            <div className="skill-box reveal">
              <h4>Languages</h4>
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
              <span className="year">Aug 2025 — Present</span>
              <div>
                <h4>UI/UX Designer</h4>
                <p className="tl-role">Cimpress · Remote, Ahmedabad, India</p>
                <ul>
                  <li>Supported UX research, wireframing, and UI design for digital products.</li>
                  <li>Worked with cross-functional teams to deliver user-focused design solutions.</li>
                  <li>Contributed to maintaining visual consistency and usability standards.</li>
                </ul>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">Jan 2022 — Dec 2024</span>
              <div>
                <h4>Motion Designer</h4>
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
                <h4>UI/UX Designer</h4>
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
                <h4>Intern UI/UX Designer</h4>
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

      <section className="section section-flush">
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
                <h4>B.Tech, Information Technology</h4>
                <p className="tl-role">DA-IICT · Gandhinagar, India</p>
              </div>
            </div>
            <div className="tl-item">
              <span className="year">2014</span>
              <div>
                <h4>12th Science (HSC)</h4>
                <p className="tl-role">GS &amp; HSEB · Gandhinagar, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
