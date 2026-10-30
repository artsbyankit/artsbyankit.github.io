// NestCare gets its own page: the site's glass, type and rhythm, carrying the
// project's mint, logo and sense of humour. Scoped styles are in NestCare.css.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  audienceStats,
  businessStrategy,
  competitors,
  creativeStrategy,
  designThinking,
  everTried,
  journey,
  personas,
  problems,
  surveys,
  swot,
  team,
} from '../data/nestcare'
import './NestCare.css'

const IMG = '/images/nestcare'

function Head({ eyebrow, title, children }) {
  return (
    <header className="ns-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
      </div>
      {children && <p className="ns-sub">{children}</p>}
    </header>
  )
}

const prefersStill = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The logo between two reaching hands. Every piece is its own layer from Figma, so
// the hands can reach in on load and lean toward each other with the cursor.
function Hero() {
  const ref = useRef(null)
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--nx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current.style.setProperty('--ny', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <div className="ns-hero" ref={ref} onPointerMove={onMove} role="img" aria-label="The NestCare logo between two reaching hands, on mint">
      <div
        className="ns-hero-bg"
        data-aifx="halftone"
        data-aifx-colors="#82d4c3,#d5fd07"
        data-aifx-bg="#fafaf7"
        data-aifx-dot-scale="0.45"
        data-aifx-duotone="0"
        data-aifx-contrast="1.53"
        data-aifx-scale="0.4"
        data-aifx-flow-angle="102"
        data-aifx-glow="0.67"
        data-aifx-grain="0"
        aria-hidden="true"
      />
      <img className="ns-hand ns-hand-a" src={`${IMG}/handA.webp`} alt="" />
      <img className="ns-hand ns-hand-b" src={`${IMG}/handB.webp`} alt="" />
      <img className="ns-hero-logo" src={`${IMG}/logo.webp`} alt="" />
      <img className="ns-hero-word" src={`${IMG}/wordmark.svg`} alt="" />
      <img className="ns-hero-tag" src={`${IMG}/tagline.svg`} alt="" />
    </div>
  )
}

// The curved arrow from the Figma file, redrawn as a stroke so it can draw itself.
const CurvedArrow = () => (
  <svg className="ns-arrow" viewBox="0 0 358 532" fill="none" aria-hidden="true">
    <defs>
      <filter id="ns-marker" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="3.5" />
      </filter>
    </defs>
    <g filter="url(#ns-marker)">
      <path pathLength="1" d="M333.5 23.7C245 48 215 165 189 291.7 168 390 120 483 8.5 505.7" />
      <path pathLength="1" className="ns-arrow-head" d="M35 523 8.5 505.7 27 480" />
      <circle cx="334" cy="23" r="15" />
    </g>
  </svg>
)

function CountUp({ value }) {
  const ref = useRef(null)
  const target = parseInt(value, 10)
  const suffix = value.replace(/^\d+/, '')
  const [n, setN] = useState(target)
  useEffect(() => {
    if (prefersStill()) return undefined
    let raf
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min((now - start) / 1100, 1)
        setN(Math.round(target * (1 - (1 - t) ** 3)))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target])
  return <strong ref={ref}>{n}{suffix}</strong>
}

const QUEUE_SIZE = 11
const TOKEN = QUEUE_SIZE + 1
let nextPatient = 0

// A consultation takes 4 to 7 minutes, so 6 people ahead means roughly 25 to 40.
const newQueue = () =>
  Array.from({ length: QUEUE_SIZE }, () => ({
    id: nextPatient++,
    minutes: 4 + Math.floor(Math.random() * 4),
  }))

const formatWait = (minutes) => {
  const h = Math.floor(minutes / 60)
  return h ? `${h}h ${minutes % 60}m` : `${minutes}m`
}

// The whole pitch in one switch: where you stand, with and without NestCare.
function QueueToggle() {
  const [booked, setBooked] = useState(false)
  const [queue, setQueue] = useState(newQueue)
  const current = useRef(queue)
  const ref = useRef(null)

  // Walk-in: the person being seen counts down a minute at a time, so the total
  // falls with them (50, 49, 48...). At zero they go in and everyone moves up.
  useEffect(() => {
    if (booked || prefersStill()) return undefined
    let visible = false
    let timer
    let holding = false
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(ref.current)
    const step = () => {
      let delay = 280
      if (visible && !document.hidden) {
        let q = current.current.filter((p) => !p.done)
        if (!q.length && !holding) {
          holding = true
          delay = 2400 // let "Your turn" land before starting over
        } else if (!q.length) {
          holding = false
          q = newQueue()
          delay = 900
        } else if (q[0].minutes <= 1) {
          q = [{ ...q[0], minutes: 0, done: true }, ...q.slice(1)]
          delay = 750
        } else {
          q = [{ ...q[0], minutes: q[0].minutes - 1 }, ...q.slice(1)]
        }
        current.current = q
        setQueue(q)
      }
      timer = setTimeout(step, delay)
    }
    timer = setTimeout(step, 600)
    return () => {
      clearTimeout(timer)
      io.disconnect()
    }
  }, [booked])

  const waiting = queue.filter((p) => !p.done)
  const wait = waiting.reduce((sum, p) => sum + p.minutes, 0)
  const mode = booked ? 'booked' : wait ? 'wait' : 'turn'
  const title = { booked: 'Next in line', wait: `${formatWait(wait)} estimated wait`, turn: 'Your turn, finally' }[mode]

  return (
    <div className={`ns-queue${booked ? ' booked' : ''}`} ref={ref}>
      <div className="ns-switch" role="group" aria-label="Compare a clinic visit">
        <button type="button" aria-pressed={!booked} onClick={() => setBooked(false)}>Walk-in</button>
        <button type="button" aria-pressed={booked} onClick={() => setBooked(true)}>With NestCare</button>
      </div>
      <div className="ns-line" aria-hidden="true">
        <div className="ns-doctor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3H5a1 1 0 0 0-1 1v5a5 5 0 0 0 10 0V4a1 1 0 0 0-1-1h-1" />
            <path d="M9 14v2a5 5 0 0 0 10 0v-3" />
            <circle cx="19" cy="11" r="2" />
          </svg>
          <span>Doctor</span>
        </div>
        {queue.map((p) => {
          const place = waiting.indexOf(p)
          return (
            <div className={`ns-patient${p.done ? ' done' : ''}${place === 0 ? ' front' : ''}`} key={p.id} style={{ '--i': p.done ? -1 : place }}>
              <span>{p.minutes}m</span>
              <i />
            </div>
          )
        })}
        <div className={`ns-you${mode === 'turn' ? ' front' : ''}`} style={{ '--i': waiting.length }}>
          <span>#{TOKEN}</span>
          <i />
          <b>You</b>
        </div>
      </div>
      <div className="ns-queue-copy">
        <strong key={mode}>Token {TOKEN} · {title}</strong>
        <span key={booked}>{booked ? 'Slot booked from home. Arrive when your turn is near.' : 'Every patient takes a different time, so no one can tell you when.'}</span>
      </div>
    </div>
  )
}

// Riya's visit, one click at a time. The memes get the big stage they deserve.
function JourneyStepper() {
  const [step, setStep] = useState(0)
  const s = journey.steps[step]
  return (
    <div className="ns-story">
      <ol className="ns-rail">
        {journey.steps.map((j, i) => (
          <li key={j.stage}>
            <button type="button" aria-current={i === step ? 'step' : undefined} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => setStep(i)}>
              <i>{i + 1}</i>
              <span>{j.stage}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="ns-scene" key={s.stage}>
        <div className="ns-scene-art">
          <img src={s.art} alt={`A meme showing someone feeling ${s.feeling.toLowerCase()}`} />
          <strong>{s.feeling}</strong>
        </div>
        <dl>
          <div className="j-action"><dt>Actions</dt><dd>{s.action}</dd></div>
          <div className="j-thought"><dt>Thoughts</dt><dd>{s.thought}</dd></div>
          <div className="j-opp"><dt>Opportunities</dt><dd>{s.opportunity}</dd></div>
        </dl>
      </div>
      <div className="ns-story-nav">
        <button type="button" className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button type="button" className="btn" disabled={step === journey.steps.length - 1} onClick={() => setStep(step + 1)}>Next stage →</button>
      </div>
    </div>
  )
}

const Pill = ({ tone = 'mint', children }) => <span className={`ns-pill ns-${tone}`}>{children}</span>

const List = ({ items }) => (
  <ul className="ns-list">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

function Portrait({ person, className }) {
  if (person.photo) {
    return <img className={className} src={person.photo} alt={person.name} style={{ objectPosition: person.photoPosition }} loading="lazy" />
  }
  return (
    <div className={`${className} ns-monogram`} role="img" aria-label={person.name}>
      <span>{person.monogram}</span>
    </div>
  )
}

// How far through the (long) case study you are.
function ProgressBar() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = null
    const update = () => {
      raf = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return <div className="ns-progress" ref={ref} aria-hidden="true" />
}

function Tabs({ label, options, active, onChange }) {
  return (
    <div className="ns-tabs" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === active}
          className={`ns-tab${o.id === active ? ' on' : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.logo && <img src={o.logo} alt="" width="26" height="26" loading="lazy" />}
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Competitors() {
  const [active, setActive] = useState(competitors[0].name)
  const c = competitors.find((x) => x.name === active)
  return (
    <>
      <Tabs
        label="Competitor"
        active={active}
        onChange={setActive}
        options={competitors.map((x) => ({ id: x.name, label: x.name, logo: x.logo }))}
      />
      <div className="ns-grid-2" key={active}>
        <article className="ns-glass ns-panel">
          <Pill>Pros</Pill>
          <List items={c.pros} />
        </article>
        <article className="ns-glass ns-panel ns-warm">
          <Pill tone="coral">Cons</Pill>
          <List items={c.cons} />
        </article>
      </div>
    </>
  )
}

function Surveys() {
  const [active, setActive] = useState(surveys[0].id)
  const s = surveys.find((x) => x.id === active)
  return (
    <>
      <Tabs label="Survey group" active={active} onChange={setActive} options={surveys} />
      <p className="ns-tab-intro">{s.intro}</p>
      <div className="ns-glass ns-panel ns-bars" key={active}>
        {s.questions.map(([q, pct]) => (
          <div className="ns-bar" key={q}>
            <p>{q}</p>
            <div className="ns-track" role="img" aria-label={`${pct} percent`}>
              <i style={{ width: `${pct}%` }} />
              <b>{pct}%</b>
            </div>
          </div>
        ))}
        <p className="ns-more">+10 more questions</p>
      </div>
      <div className="ns-insights">
        <div className="ns-fill">
          <img src={s.photo} alt={s.photoAlt} loading="lazy" />
        </div>
        <div className="ns-glass ns-panel">
          <img className="ns-bang" src={`${IMG}/exclaim.webp`} alt="" loading="lazy" />
          <h3>Key Insights</h3>
          <List items={s.insights} />
        </div>
      </div>
    </>
  )
}

function Persona() {
  const [active, setActive] = useState(personas[0].id)
  const p = personas.find((x) => x.id === active)
  return (
    <>
      <Tabs
        label="Persona"
        active={active}
        onChange={setActive}
        options={personas.map((x) => ({ id: x.id, label: x.tab }))}
      />
      <p className="ns-tab-intro">{p.intro}</p>
      <div className="ns-persona" key={active}>
        <Portrait person={p} className="ns-persona-photo" />
        <article className="ns-glass ns-panel">
          <Pill>Profile</Pill>
          <h3 className="ns-persona-name">{p.name}</h3>
          <div className="ns-chips">
            {p.profile.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article className="ns-glass ns-panel">
          <Pill>About</Pill>
          <List items={p.about} />
        </article>
        <article className="ns-glass ns-panel ns-warm">
          <Pill tone="amber">Pain Points</Pill>
          <List items={p.pains} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill>Goals</Pill>
          <List items={p.goals} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill>Opportunities for Design</Pill>
          <List items={p.opportunities} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill tone="sky">Behaviour With the App</Pill>
          <List items={p.behaviour} />
        </article>
      </div>

      <h3 className="ns-subhead">{p.name.split(' ')[0] === 'Dr.' ? 'Doctor' : 'Patient'} Empathy Map</h3>
      <p className="ns-tab-intro">{p.empathyIntro}</p>
      <div className="ns-empathy" key={`${active}-map`}>
        <article className="ns-glass ns-panel">
          <Pill>What do they HEAR?</Pill>
          <List items={p.empathy.hear} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill>What do they SEE?</Pill>
          <List items={p.empathy.see} />
        </article>
        <Portrait person={p} className="ns-empathy-face" />
        <article className="ns-glass ns-panel">
          <Pill>What do they THINK &amp; FEEL?</Pill>
          <List items={p.empathy.think} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill>What do they SAY &amp; DO?</Pill>
          <List items={p.empathy.say} />
        </article>
        <article className="ns-glass ns-panel ns-warm">
          <Pill tone="coral">Pains</Pill>
          <List items={p.empathy.pains} />
        </article>
        <article className="ns-glass ns-panel">
          <Pill>Gains</Pill>
          <List items={p.empathy.gains} />
        </article>
      </div>
    </>
  )
}

export default function NestCare({ project, next }) {
  const cs = creativeStrategy
  return (
    <div className="ns">
      <ProgressBar />
      <section className="page-head">
        <div className="container">
          <Link to="/work" className="cs-back">
            ← All projects
          </Link>
          <div className="eyebrow">Case study · Healthcare</div>
          <h1>{project.title}</h1>
          <p className="cs-tagline">Simplifying care for every generation.</p>
          <p className="text-muted">{project.excerpt}</p>
          <div className="cs-meta">
            {['Mobile app', 'Patients & clinics', 'Tier 2 & 3 India', 'UX research', 'Team of two'].map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          <Hero />
        </div>
      </section>

      <div className="container">
        <section className="ns-section ns-team reveal">
          <div>
            <p className="ns-before">Before we dive in,</p>
            <h2 className="section-title">Meet the dream team</h2>
          </div>
          <div className="ns-people">
            {team.map((m) => (
              <figure key={m.name}>
                <img src={m.photo} alt={m.name} loading="lazy" />
                <figcaption>{m.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="ns-section ns-overview reveal">
          <img src={`${IMG}/overview-clinic.webp`} alt="A doctor examining a patient at a rural clinic" loading="lazy" />
          <div className="ns-mint-card">
            <h2 className="section-title">Project Overview</h2>
            <p>
              NestCare is a patient-first healthcare app designed to simplify appointment booking, reminders, and
              updates for users of all ages — including seniors supported by family members. It provides a smooth,
              modern experience that bridges accessibility, clarity, and trusted care.
            </p>
            <img src={`${IMG}/overview-women.webp`} alt="Three women smiling, with the handwritten words: Empowered by Education" loading="lazy" />
          </div>
        </section>

        <section className="ns-section ns-tried reveal">
          <div className="ns-phone">
            <img src={`${IMG}/phone.webp`} alt="The NestCare splash screen on a phone" loading="lazy" />
          </div>
          <div className="ns-tried-copy">
            <CurvedArrow />
            <h2 className="section-title">Ever Tried...</h2>
            {everTried.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <QueueToggle />
          </div>
        </section>

        <section className="ns-section reveal">
          <Head eyebrow="Beyond the metros" title="Target Audience" />
          <div className="ns-audience">
            <div>
              <p>
                Digital healthcare adoption is accelerating across India’s Tier 2 &amp; 3 cities. While most existing
                healthcare apps still focus primarily on Tier 1 metros, the real growth and unmet need lie in smaller
                cities—where families, seniors, and everyday users are now rapidly embracing digital health solutions.
              </p>
              <div className="ns-stats">
                {audienceStats.map((s) => (
                  <div className="ns-glass ns-stat" key={s.value}>
                    <CountUp value={s.value} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="ns-row">
                <Pill>Patients</Pill>
                <Pill>Doctors</Pill>
                <Pill>Clinics</Pill>
              </div>
            </div>
            <div className="ns-fill">
              <img src={`${IMG}/audience.webp`} alt="A family riding together in the back of a shared jeep" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="ns-section reveal">
          <Head eyebrow="The villain is the queue" title="Problem Statement" />
          <div className="ns-problems">
            {problems.map((p, i) => (
              <article className="ns-panel ns-flat-coral" key={p}>
                <span className="ns-num">0{i + 1}</span>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ns-section reveal">
          <Head title="Solution Statement" />
          <div className="ns-solution">
            <img src={`${IMG}/care.webp`} alt="A nurse checking an elderly man’s blood pressure at home" loading="lazy" />
            <p className="ns-solution-card">
              NestCare provides a simple, patient-friendly mobile platform that enables users in Tier 2 &amp; 3 cities
              to easily book appointments, receive real-time updates, and manage care without long queues or confusing
              processes. The app supports family-managed profiles for seniors, offers clear reminders and token
              tracking, and modernizes clinic workflows—bringing accessible, organized, and reliable healthcare to
              communities that are currently underserved by existing apps.
            </p>
          </div>
        </section>

        <section className="ns-section reveal">
          <Head title="Business Strategy">
            Developed by mapping customer pain points to solutions and defining success through measurable outcomes.
          </Head>
          <div className="ns-strategy">
            {businessStrategy.map((b) => (
              <article className={`ns-glass ns-panel${b.wide ? ' ns-wide' : ''}`} key={b.title}>
                <Pill>{b.title}</Pill>
                <List items={b.items} />
              </article>
            ))}
          </div>
        </section>

        <section className="ns-section reveal">
          <Head title="Creative Strategy">
            Focused on translating user needs and values into features that shape a meaningful and intuitive app
            experience.
          </Head>
          <div className="ns-creative">
            <article className="ns-glass ns-panel">
              <Pill>Product</Pill>
              <List items={cs.product} />
            </article>
            <article className="ns-glass ns-panel">
              <Pill>Core Values</Pill>
              <List items={cs.values} />
            </article>
            <article className="ns-glass ns-panel ns-features">
              <Pill>Features</Pill>
              <div>
                <div>
                  <h4>Patients</h4>
                  <List items={cs.patients} />
                </div>
                <div>
                  <h4>Clinic</h4>
                  <List items={cs.clinic} />
                </div>
              </div>
            </article>
            <article className="ns-glass ns-panel ns-half">
              <Pill>Benefits</Pill>
              <List items={cs.benefits} />
            </article>
            <article className="ns-glass ns-panel ns-half">
              <Pill>Target Audience</Pill>
              <List items={cs.audience} />
            </article>
          </div>
        </section>

        <section className="ns-section reveal">
          <Head title="Design Thinking Process">
            Understanding users, challenging assumptions, redefining problems and creating innovative solutions.
          </Head>
          <ol className="ns-process">
            {designThinking.map((d) => (
              <li className="ns-glass ns-panel" key={d.stage}>
                <Pill>{d.stage}</Pill>
                <List items={d.items} />
              </li>
            ))}
          </ol>
        </section>

        <section className="ns-section">
          <Head eyebrow="The competition, respectfully" title="Competitive Analysis">
            We analyzed existing competitors, direct and indirect, local and global, by evaluating their unique
            features and app design strategies, to pave the way for finding the best solution for our users and target
            audience.
          </Head>
          <Competitors />
        </section>

        <section className="ns-section reveal">
          <Head eyebrow="Peer-reviewed by frogs" title="SWOT analysis">
            Planning ahead by identifying our strengths, weaknesses, opportunities and threats.
            <Link to="/contact" className="ns-hire">*hire me pls*</Link>
          </Head>
          <div className="ns-swot">
            {swot.map((s) => (
              <article key={s.title}>
                <img src={s.art} alt="" loading="lazy" />
                <div className={`ns-glass ns-panel${s.tone === 'bad' ? ' ns-warm' : ''}`}>
                  <Pill tone={s.tone === 'bad' ? 'coral' : 'mint'}>{s.title}</Pill>
                  <List items={s.items} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ns-section">
          <Head eyebrow="We asked. They answered." title="Surveys" />
          <Surveys />
        </section>

        <section className="ns-section">
          <Head eyebrow="Real needs, real people" title="Personas &amp; Empathy" />
          <Persona />
        </section>

        <section className="ns-section">
          <Head eyebrow="Now with emotional support memes" title="Patient Journey">
            Using journey mapping to visualize how patients interact with the product at different touchpoints.
          </Head>
          <div className="ns-scenario">
            <article className="ns-glass ns-panel">
              <Pill tone="plain">Scenario</Pill>
              <div className="ns-riya">
                <img src={journey.photo} alt="Riya Sharma" loading="lazy" />
                <div>
                  <h3>{journey.scenarioTitle}</h3>
                  <List items={journey.scenario} />
                </div>
              </div>
            </article>
            <article className="ns-glass ns-panel">
              <Pill tone="plain">Expectations</Pill>
              <List items={journey.expectations} />
            </article>
          </div>

          <h3 className="ns-subhead">Journey Map</h3>
          <JourneyStepper />
        </section>

        <section className="ns-section reveal">
          <div className="ns-mint-card ns-value">
            <img src={`${IMG}/logo.webp`} alt="" width="96" height="110" loading="lazy" />
            <div>
              <h2 className="section-title">Value Proposition</h2>
              <p>
                Showing the main benefits our app offers for doctors &amp; patients: easy access, better communication,
                and smart tools for clinics.
              </p>
            </div>
          </div>
        </section>

        {next && (
          <section className="ns-section ns-next reveal">
            <Link to={`/work/${next.slug}`} className="btn">
              Next: {next.title} <span>→</span>
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}
