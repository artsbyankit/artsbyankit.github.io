import { useLayoutEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import projects from '../data/projects'

const FLOW = [
  {
    title: 'Define',
    desc: 'Problem statement, goals, scope IN/OUT, 4 target roles, success metrics mapped to cited benchmarks.',
  },
  {
    title: 'Research',
    desc: 'Market research, competitor analysis, and honest secondary-research synthesis — no invented interviews.',
  },
  {
    title: 'Analyze & Plan',
    desc: '4 personas, journey maps, task flows, information architecture, and jobs-to-be-done.',
  },
  {
    title: 'Design',
    desc: 'Wireframes → visual design: content-first specs for 7 web + 12 mobile screens, design principles, status colors, typography scale, component system.',
  },
  {
    title: 'Prototype & Test',
    desc: 'Clickable Figma flows: web reorder, operator scan-load, rider earnings to POD; usability plan, moderated tests, prioritized iteration.',
  },
  {
    title: 'Deliver',
    desc: 'Handoff, case study, portfolio.',
  },
]

function FlowChart() {
  const containerRef = useRef(null)
  const nodeRefs = useRef([])
  const loopRefs = useRef([])
  const [markerId] = useState(() => `flow-arrow-${Math.random().toString(36).slice(2, 9)}`)
  const [paths, setPaths] = useState(null)
  const [labels, setLabels] = useState(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const compute = () => {
      const cr = container.getBoundingClientRect()
      const rects = nodeRefs.current.map((n) => {
        const r = n.getBoundingClientRect()
        return {
          left: r.left - cr.left,
          right: r.right - cr.left,
          top: r.top - cr.top,
          bottom: r.bottom - cr.top,
        }
      })

      const left = (i) => rects[i].left
      const right = (i) => rects[i].right
      const top = (i) => rects[i].top
      const bottom = (i) => rects[i].bottom
      const cx = (i) => (rects[i].left + rects[i].right) / 2
      const cy = (i) => (rects[i].top + rects[i].bottom) / 2

      const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
      const norm = (v) => {
        const l = Math.hypot(v[0], v[1]) || 1
        return [v[0] / l, v[1] / l]
      }

      // straight segments joined by rounded corners
      const ortho = (pts, r) => {
        if (pts.length < 2) return ''
        let d = `M ${pts[0][0]} ${pts[0][1]}`
        for (let i = 1; i < pts.length - 1; i++) {
          const p0 = pts[i - 1]
          const p1 = pts[i]
          const p2 = pts[i + 1]
          const v1 = norm([p1[0] - p0[0], p1[1] - p0[1]])
          const v2 = norm([p2[0] - p1[0], p2[1] - p1[1]])
          const rad = Math.min(r, dist(p0, p1) * 0.45, dist(p1, p2) * 0.45)
          const s = [p1[0] - v1[0] * rad, p1[1] - v1[1] * rad]
          const e = [p1[0] + v2[0] * rad, p1[1] + v2[1] * rad]
          d += ` L ${s[0]} ${s[1]} Q ${p1[0]} ${p1[1]} ${e[0]} ${e[1]}`
        }
        const last = pts[pts.length - 1]
        d += ` L ${last[0]} ${last[1]}`
        return d
      }

      // main chain: Start → Define → Research → Analyze → Design → Prototype → Deliver → End
      const main = []
      for (let i = 0; i < rects.length - 1; i++) {
        main.push(`M ${cx(i)} ${bottom(i)} L ${cx(i + 1)} ${top(i + 1)}`)
      }

      // feedback loops on the sides (dashed) — side offset scales with width
      // so lines and labels always stay clear of the cards and the container edge
      const side = Math.max(76, Math.min(124, cr.width * 0.08))
      const ix = Math.min(right(4) + side, cr.width - 76)
      const px = Math.max(left(5) - side, 76)

      const iteratePts = [
        [right(4), cy(4)],
        [ix, cy(4)],
        [ix, cy(2)],
        [right(2), cy(2)],
      ]
      const postPts = [
        [left(5), cy(5)],
        [px, cy(5)],
        [px, cy(1)],
        [left(1), cy(1)],
      ]

      const loops = [
        { d: ortho(iteratePts, 20), label: 'iterate' },
        { d: ortho(postPts, 20), label: 'post-launch' },
      ]

      setPaths({ main, loops })
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(container)
    return () => ro.disconnect()
  }, [markerId])

  // place each loop label with its center anchored exactly on the
  // middle of its drawn path
  useLayoutEffect(() => {
    if (!paths) {
      setLabels(null)
      return
    }
    const next = {}
    paths.loops.forEach((l, i) => {
      const el = loopRefs.current[i]
      if (!el) return
      const p = el.getPointAtLength(el.getTotalLength() / 2)
      next[l.label] = { x: p.x, y: p.y }
    })
    setLabels(next)
  }, [paths])

  return (
    <div
      className="flow"
      ref={containerRef}
      role="img"
      aria-label="Process flowchart: Define, Research, Analyze and Plan, Design, Prototype and Test, Deliver, connected top to bottom by arrows, with a dashed iterate loop from Prototype and Test back to Analyze and Plan, and a dashed post-launch loop from Deliver back to Research"
    >
      <span className="flow-legend" aria-hidden="true">
        <span className="flow-legend-dot"></span> iterate
        <span className="flow-legend-sep"></span>
        <span className="flow-legend-dot"></span> post-launch
      </span>

      <svg className="flow-svg" aria-hidden="true">
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" className="flow-arrow" />
          </marker>
        </defs>
        {paths?.main.map((d, i) => (
          <path key={`m${i}`} d={d} className="flow-path" markerEnd={`url(#${markerId})`} />
        ))}
        {paths?.loops.map((l, i) => (
          <path
            key={`l${i}`}
            ref={(el) => {
              loopRefs.current[i] = el
            }}
            d={l.d}
            className="flow-path flow-loop-path"
            markerEnd={`url(#${markerId})`}
          />
        ))}
      </svg>

      {paths?.loops.map((l) =>
        labels?.[l.label] ? (
          <span
            key={l.label}
            className="flow-loop-label"
            style={{ left: labels[l.label].x, top: labels[l.label].y }}
          >
            {l.label}
          </span>
        ) : null,
      )}

      <div className="flow-stack">
        {FLOW.map((node, i) => (
          <div
            key={node.title}
            className="fc-node fc-process"
            ref={(el) => {
              nodeRefs.current[i] = el
            }}
          >
            <span className="fc-title">{node.title}</span>
            <span className="fc-desc">{node.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCallout({ stat }) {
  return (
    <div className="skill-box stat-callout">
      <span className="stat-value">{stat.value}</span>
      <span className="stat-label">{stat.label}</span>
      {stat.url ? (
        <a className="stat-source" href={stat.url} target="_blank" rel="noreferrer">
          Source: {stat.source} ↗
        </a>
      ) : (
        <span className="stat-source">Source: {stat.source}</span>
      )}
    </div>
  )
}

function DistroNetDetail({ project }) {
  const cs = project.cs

  return (
    <>
      <section className="page-head">
        <div className="container">
          <Link to="/work" className="cs-back">
            ← All projects
          </Link>

          <div className="eyebrow">Case study · July {project.year}</div>
          <h1>{project.title}</h1>
          <p className="cs-tagline">{cs.tagline}</p>
          <p className="text-muted">{cs.intro}</p>

          <div className="cs-meta">
            {cs.chips.map((chip) => (
              <span className="tag" key={chip}>
                {chip}
              </span>
            ))}
          </div>

          {project.inProgress && (
            <div className="cs-progress">
              <span className="cs-progress-dot" aria-hidden="true"></span>
              <span>{cs.status.label}</span>
            </div>
          )}

          <div className="cs-cover cs-asset" style={{ background: project.gradient }}>
            <span className="replace-me">Replace me — hero mock (web + mobile)</span>
            <span className="cover-title">{project.title}</span>
            <span className="cs-cover-sub">Web + Mobile · B2B operations platform</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The Problem</div>
              <h2 className="section-title">Operators run on disconnected tools</h2>
            </div>
          </div>

          <div className="about-text">
            <p className="cs-statement">{cs.problem.statement}</p>
            <p>{cs.problem.context}</p>
          </div>

          <div className="skill-list stat-grid">
            {cs.problem.stats.map((stat) => (
              <StatCallout key={stat.value} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The People</div>
              <h2 className="section-title">Four roles, one connected platform</h2>
            </div>
          </div>

          <div className="persona-grid">
            {cs.personas.map((p) => (
              <article className="persona-card" key={p.name}>
                <div className="persona-photo cs-asset">
                  {p.photo ? (
                    <img className="persona-img" src={p.photo} alt={`${p.name} portrait`} loading="lazy" />
                  ) : (
                    <>
                      <span className="persona-initial">{p.name[0]}</span>
                      <span className="replace-me">Replace me — {p.name} portrait</span>
                    </>
                  )}
                </div>
                <div className="persona-body">
                  <div className="persona-head">
                    <h3>
                      {p.name} <span className="persona-role">{p.role}</span>
                    </h3>
                    <span className="chip">
                      {p.platformIcon} {p.platform}
                    </span>
                  </div>
                  <blockquote className="persona-quote">{p.quote}</blockquote>

                  <dl className="persona-details">
                    <div>
                      <dt>Profile</dt>
                      <dd>{p.profile}</dd>
                    </div>
                    <div>
                      <dt>Context</dt>
                      <dd>{p.context}</dd>
                    </div>
                    <div>
                      <dt>Device</dt>
                      <dd>{p.device}</dd>
                    </div>
                  </dl>
                </div>

                <div className="persona-blocks">
                  <div>
                    <h4 className="block-goals">Goals</h4>
                    <ul className="feature-list">
                      {p.goals.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="block-pains">Pains</h4>
                    <ul className="feature-list">
                      {p.pains.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="block-jtbd">Jobs to be done</h4>
                    <ul className="feature-list">
                      {p.jtbd.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="block-impl">Design implications</h4>
                    <ul className="feature-list">
                      {p.implications.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
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
              <div className="eyebrow">The Product</div>
              <h2 className="section-title">One platform, two surfaces.</h2>
            </div>
          </div>

          <div className="skill-list product-grid">
            {[cs.product.desktop, cs.product.mobile].map((col) => (
              <div className="skill-box product-col" key={col.title}>
                <h4>{col.title}</h4>
                <p className="product-for">For {col.for}</p>
                <ul className="feature-list">
                  {col.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="cs-note">
            <strong>Deliberately out of scope — product thinking:</strong>
            <ul>
              {cs.product.outOfScope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <blockquote className="cs-quote">{cs.product.quote}</blockquote>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Design Screens</div>
              <h2 className="section-title">Coming with Step 5</h2>
            </div>
          </div>

          <div className="cs-gallery">
            <div className="frame wide cs-asset">
              <span className="replace-me">Replace me — web dashboard (hi-fi)</span>
            </div>
            <div className="frame cs-asset">
              <span className="replace-me">Replace me — mobile operator app</span>
            </div>
            <div className="frame cs-asset">
              <span className="replace-me">Replace me — rider app / dark mode</span>
            </div>
            <div className="frame cs-asset">
              <span className="replace-me">Replace me — offline / empty state</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The Process</div>
              <h2 className="section-title">Define to deliver, step by step</h2>
            </div>
          </div>

          <FlowChart />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Design System</div>
              <h2 className="section-title">One language of status</h2>
            </div>
          </div>

          <div className="skill-list status-legend">
            {cs.designSystem.status.map((s) => (
              <div className="skill-box status-item" key={s.name}>
                <span className="status-chip" style={{ background: s.color }}></span>
                <div>
                  <strong>{s.name}</strong>
                  <p>{s.meaning}</p>
                </div>
              </div>
            ))}
          </div>

          <blockquote className="cs-quote">“{cs.designSystem.motionQuote}”</blockquote>

          <div className="about-text">
            <p>{cs.designSystem.lightDark}</p>
            <p>
              <strong>Brand primary:</strong>{' '}
              <span className="swatch-inline">
                <span className="swatch" style={{ background: cs.designSystem.brand }}></span>
                {cs.designSystem.brand}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The Prototype</div>
              <h2 className="section-title">Try the flows</h2>
            </div>
          </div>

          <div className="proto-embed cs-asset">
            <span className="replace-me">Replace me — embed public Figma prototype (Step 6)</span>
            <div className="proto-placeholder">
              <p>{cs.prototype.note}</p>
              <ul className="tool-list flow-cards">
                {cs.prototype.flows.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Results &amp; Metrics</div>
              <h2 className="section-title">Benchmarks vs design goals</h2>
            </div>
          </div>

          <p className="cs-honesty">{cs.metrics.note}</p>

          <div className="metrics-table">
            <div className="metrics-row metrics-head">
              <span>Metric</span>
              <span>Concept target</span>
              <span>Type</span>
            </div>
            {cs.metrics.rows.map((row) => (
              <div className="metrics-row" key={row.metric}>
                <span>{row.metric}</span>
                <span className="metrics-target">{row.target}</span>
                <span className={`metrics-type ${row.type}`}>
                  {row.type === 'benchmark' ? 'Industry-benchmarked' : 'Design goal'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Reflection</div>
              <h2 className="section-title">Written at the end</h2>
            </div>
          </div>

          <div className="about-text">
            <p>
              What I'd do differently, what I'd build next, and lessons learned — written once the
              project wraps up at Step 8.
            </p>
          </div>
        </div>
      </section>

      <section className="section cs-next-section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">More case studies</div>
              <h2 className="section-title">Keep exploring</h2>
            </div>
          </div>

          <div className="cs-next-cards">
            {projects
              .filter((p) => p.slug !== project.slug)
              .slice(0, 2)
              .map((p) => (
                <Link to={`/work/${p.slug}`} className="cs-next-card" key={p.slug}>
                  <span className="cs-next-emoji">{p.emoji}</span>
                  <span>
                    <strong>{p.title}</strong>
                    <small>{p.excerpt}</small>
                  </span>
                  <span className="cs-next-arrow">→</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}

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

  if (project.cs) {
    return <DistroNetDetail project={project} />
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
