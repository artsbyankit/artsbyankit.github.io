import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/bodoni-moda'
import './SilkSerenity.css'

const IMG = '/images/silk-serenity'
const OpenFrame = createContext(() => {})

const FACTS = [
  ['Project', 'Silk Serenity, a concept skincare brand'],
  ['Role', 'Everything: brand identity, art direction, UX and UI'],
  ['Date', 'August 2024'],
  ['Deliverables', 'Wordmark, business cards, stationery, packaging, image direction, type and colour, wireframes, website design'],
  ['Tool', 'Figma'],
]

const SECTIONS = [
  { id: 'hero', label: 'Hero', top: 0, height: 1100, shift: 0, note: 'The wireframe already split the hero in half. Colour photography then does what the grey box was holding space for.' },
  { id: 'summer', label: 'Summer Collection', top: 2240, height: 1200, shift: 744, note: 'A big image and a small one, offset on purpose, so the page feels placed by hand and not poured into a grid.' },
  { id: 'journal', label: 'Journal', top: 3500, height: 1800, shift: 744, note: 'Two articles side by side, then one at full width. The change of pace keeps a long list from feeling long.' },
  { id: 'social', label: 'Instagram', top: 5300, height: 1000, shift: 744, note: 'A quiet line of type next to four product shots, which closes the page on the same still-life mood it opened with.' },
]

// A circle that follows the mouse and shows the frame at three times the size.
function useLoupe(layers) {
  const [on, setOn] = useState(false)
  const lens = useRef(null)
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const style = lens.current?.style
    if (style) {
      style.transform = `translate(${x}px, ${y}px)`
      style.backgroundSize = `${r.width * 3}px ${r.height * 3}px`
      style.backgroundPosition = `${90 - x * 3}px ${90 - y * 3}px`
    }
    if (!on) setOn(true)
  }
  const element = on ? (
    <span
      className="ss-lens"
      ref={lens}
      aria-hidden="true"
      style={{ backgroundImage: layers.map((l) => `url(${l})`).join(', ') }}
    />
  ) : null
  return { element, move, leave: () => setOn(false) }
}

// Type-heavy frames are SVG, so they stay razor sharp at any zoom. Photographs come in three widths.
function Frame({ name, alt, height = 1080, vector, tone }) {
  const open = useContext(OpenFrame)
  const hi = vector ? `${IMG}/${name}.svg` : `${IMG}/${name}-3840.webp`
  const loupe = useLoupe([hi])
  return (
    <button
      type="button"
      className="ss-zoom"
      data-tone={tone}
      aria-label={`Enlarge: ${alt}`}
      onClick={open}
      onPointerMove={loupe.move}
      onPointerLeave={loupe.leave}
    >
      <img
        className="ss-frame"
        src={vector ? hi : `${IMG}/${name}-1920.webp`}
        srcSet={vector ? undefined : `${IMG}/${name}-960.webp 960w, ${IMG}/${name}-1920.webp 1920w, ${hi} 3840w`}
        sizes={vector ? undefined : '100vw'}
        data-hi={hi}
        width="1920"
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      {loupe.element}
    </button>
  )
}

function Chapter({ number, title, dark, children }) {
  return (
    <section className={`ss-chapter${dark ? ' dark' : ''}`}>
      <div className="ss-inner reveal">
        <span className="ss-number">{number}</span>
        <h2>{title}</h2>
        <div className="ss-copy">{children}</div>
      </div>
    </section>
  )
}

// Drag across a section to wipe from its wireframe to the finished design.
function Compare() {
  const [active, setActive] = useState(SECTIONS[0])
  const [split, setSplit] = useState(50)
  return (
    <div className="ss-compare">
      <div className="ss-tabs" role="group" aria-label="Choose a home page section">
        {SECTIONS.map((s) => (
          <button type="button" key={s.id} aria-pressed={s.id === active.id} onClick={() => setActive(s)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="ss-wipe" style={{ aspectRatio: `1920 / ${active.height}`, '--split': `${split}%` }}>
        <img
          src={`${IMG}/wf-home.svg`}
          style={{ top: `${(-active.top / active.height) * 100}%` }}
          alt={`${active.label} section as a low-fidelity wireframe`}
        />
        <div className="ss-wipe-final">
          <img
            src={`${IMG}/final-photos.webp`}
            style={{ top: `${(-(active.top - active.shift) / active.height) * 100}%` }}
            alt={`${active.label} section as the finished design`}
          />
          <img src={`${IMG}/final-text.svg`} style={{ top: `${(-(active.top - active.shift) / active.height) * 100}%` }} alt="" />
        </div>
        <span className="ss-wipe-tag left">Final</span>
        <span className="ss-wipe-tag right">Wireframe</span>
        <span className="ss-wipe-handle" aria-hidden="true">
          <i className="lg-lens">✦</i>
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={split}
          aria-label="Share of the section showing the finished design"
          onChange={(e) => setSplit(Number(e.target.value))}
        />
      </div>
      <p className="ss-note" key={active.id}>{active.note}</p>
    </div>
  )
}

const PINS = [
  { x: 72, y: 7, title: 'Split hero', text: 'Headline and call to action on white, image on black, so the first screen shows both halves of the brand.' },
  { x: 50, y: 17, title: 'A quiet headline', text: 'The only centred moment on the page, so it reads as a pause before the photography starts.' },
  { x: 30, y: 31, title: 'Offset images', text: 'A large and a small image sit at different heights, which gives the page an editorial rhythm.' },
  { x: 25, y: 49, title: 'Journal', text: 'Skincare advice sits beside the products, so the shop also has a reason to come back to.' },
  { x: 60, y: 63, title: 'A change of pace', text: 'After two side-by-side articles, one runs full width to break the pattern.' },
  { x: 70, y: 76, title: 'Instagram', text: 'Four still lifes that carry the brand into social without a feed widget.' },
  { x: 50, y: 88, title: 'Oversized footer', text: 'The wordmark returns at full size, above the newsletter sign-up.' },
]

// A sheet of card, not a picture of one: tilts with the pointer, turns over on click.
function FlipCard() {
  const [back, setBack] = useState(false)
  const ref = useRef(null)
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`)
    ref.current.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`)
  }
  const reset = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }
  return (
    <section className="ss-play">
      <button
        type="button"
        ref={ref}
        className={`ss-card${back ? ' back' : ''}`}
        aria-label={`Turn the business card over. Showing the ${back ? 'back' : 'front'}.`}
        onPointerMove={tilt}
        onPointerLeave={reset}
        onClick={() => setBack(!back)}
      >
        <span className="ss-card-inner">
          <img src={`${IMG}/card-front.svg`} width="600" height="333" loading="lazy" alt="" />
          <img src={`${IMG}/card-back.svg`} width="600" height="333" loading="lazy" alt="" />
        </span>
      </button>
      <p className="ss-hint">Tap the card to turn it over</p>
    </section>
  )
}

function TypeTester() {
  const [text, setText] = useState('Silk Serenity')
  const [size, setSize] = useState(88)
  const [inverted, setInverted] = useState(true)
  const [copied, setCopied] = useState('')
  const copy = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      setTimeout(() => setCopied(''), 1400)
    } catch {
      setCopied('')
    }
  }
  return (
    <section className={`ss-tester${inverted ? ' dark' : ''}`}>
      <div className="ss-inner wide">
        <p className="ss-specimen" style={{ fontSize: `min(${size}px, 14vw)` }}>{text || 'Silk Serenity'}</p>
        <div className="ss-controls">
          <label>
            <span>Try your own words</span>
            <input type="text" value={text} maxLength={28} onChange={(e) => setText(e.target.value)} />
          </label>
          <label>
            <span>Size</span>
            <input type="range" min="32" max="160" value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </label>
          <button type="button" aria-pressed={inverted} onClick={() => setInverted(!inverted)}>
            {inverted ? 'White on black' : 'Black on white'}
          </button>
          {['#000000', '#FFFFFF'].map((hex) => (
            <button type="button" key={hex} onClick={() => copy(hex)}>
              <i style={{ background: hex }} /> {copied === hex ? 'Copied' : hex}
            </button>
          ))}
        </div>
        <p className="ss-hint">Shown in Bodoni Moda, the closest free web font to Adorage.</p>
      </div>
    </section>
  )
}

const SHOTS = [
  ['shop-2', 'Bottle standing on folded brown linen'],
  ['shop-1', 'Open jar of cream on a sunlit table'],
  ['shop-3', 'Bar of soap on a wooden dish'],
]
const TABS = {
  Description: 'A refreshing daily cleanser made with green tea extract, formulated to leave skin clean and calm.',
  Ingredients: 'Green tea extract, with a short list of ingredients chosen to be natural and non-toxic.',
  Highlights: 'High-quality ingredients. Non-toxic. Natural.',
  Shipping: 'Packed in the Silk Serenity mailer box, with the star waiting on the end flap.',
}

// The product wireframe, working: gallery, quantity, tabs and bag all respond.
function ProductDemo() {
  const [shot, setShot] = useState(0)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('Description')
  const [bag, setBag] = useState(0)
  return (
    <div className="ss-shop">
      <div className="ss-shop-bar">
        <span>Silk Serenity</span>
        <span aria-live="polite">Bag ({bag})</span>
      </div>
      <div className="ss-shop-main">
        <div>
          <img className="ss-shop-photo" key={shot} src={`${IMG}/${SHOTS[shot][0]}.webp`} width="547" height="402" alt={SHOTS[shot][1]} />
          <div className="ss-thumbs">
            {SHOTS.map(([name, alt], i) => (
              <button type="button" key={name} aria-pressed={i === shot} aria-label={`Show photo: ${alt}`} onClick={() => setShot(i)}>
                <img src={`${IMG}/${name}.webp`} width="547" height="402" alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <small>Cleanser</small>
          <h4>Green Tea Cleanser</h4>
          <p className="ss-price">$40</p>
          <div className="ss-buy">
            <div className="ss-qty">
              <button type="button" aria-label="One fewer" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="One more" onClick={() => setQty(Math.min(9, qty + 1))}>+</button>
            </div>
            <button type="button" className="ss-add" onClick={() => setBag(bag + qty)}>Add to bag</button>
          </div>
          <div className="ss-shop-tabs" role="group" aria-label="Product details">
            {Object.keys(TABS).map((t) => (
              <button type="button" key={t} aria-pressed={t === tab} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <p className="ss-tab-copy" key={tab}>{TABS[tab]}</p>
        </div>
      </div>
    </div>
  )
}

function FinalHome() {
  const [pin, setPin] = useState(null)
  const loupe = useLoupe([`${IMG}/final-text.svg`, `${IMG}/final-photos.webp`])
  return (
    <div className="ss-final" onPointerMove={loupe.move} onPointerLeave={loupe.leave}>
      <img className="ss-final-type" src={`${IMG}/final-text.svg`} width="1920" height="6637" loading="lazy" alt="" />
      {loupe.element}
      <img
        className="ss-frame"
        src={`${IMG}/final-photos.webp`}
        width="1920"
        height="6637"
        loading="lazy"
        decoding="async"
        alt="Full Silk Serenity home page: split hero, Summer Collection, Journal, Instagram grid, oversized footer wordmark, and a closing Thank You band"
      />
      {PINS.map((p, i) => (
        <div className={`ss-pin${pin === i ? ' open' : ''}${p.x > 55 ? ' flip' : ''}`} key={p.title} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <button type="button" className="lg-lens" aria-expanded={pin === i} aria-label={`Design note: ${p.title}`} onClick={() => setPin(pin === i ? null : i)}>✦</button>
          {pin === i && (
            <div className="ss-pin-note">
              <strong>{p.title}</strong>
              <p>{p.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Every frame on the page at full resolution. Click to zoom, move to look around.
function Lightbox({ frames, index, setIndex }) {
  const ref = useRef(null)
  const [zoom, setZoom] = useState(false)
  const open = index !== null
  useEffect(() => {
    const d = ref.current
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  const step = (by) => {
    setZoom(false)
    setIndex((index + by + frames.length) % frames.length)
  }
  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }
  const pan = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`
  }
  const close = () => {
    setZoom(false)
    setIndex(null)
  }
  const frame = open ? frames[index] : null
  return (
    <dialog ref={ref} className="ss-box" aria-label="Enlarged frame" onClose={close} onKeyDown={onKey} onClick={(e) => e.target === ref.current && close()}>
      {frame && (
        <>
          <div className="ss-box-view">
            <img
              className={zoom ? 'zoomed' : ''}
              src={frame.src}
              alt={frame.alt}
              onPointerMove={pan}
              onPointerDown={pan}
              onClick={() => setZoom(!zoom)}
            />
          </div>
          <div className="ss-box-bar">
            <button type="button" aria-label="Previous frame" onClick={() => step(-1)}>←</button>
            <span>{index + 1} / {frames.length}</span>
            <button type="button" aria-label="Next frame" onClick={() => step(1)}>→</button>
            <button type="button" aria-label="Close" onClick={close}>×</button>
          </div>
        </>
      )}
    </dialog>
  )
}

export default function SilkSerenity({ project, next }) {
  const [frames, setFrames] = useState([])
  const [index, setIndex] = useState(null)
  const root = useRef(null)
  useEffect(() => {
    let raf = null
    const check = () => {
      raf = null
      const under = document.elementsFromPoint(window.innerWidth / 2, 32).find((el) => el.closest('.ss'))
      const dark = under?.closest('[data-tone="dark"], .dark, .ss-play')
      document.documentElement.toggleAttribute('data-ss-dark', Boolean(dark))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.documentElement.removeAttribute('data-ss-dark')
    }
  }, [])
  const openFrame = (e) => {
    const list = [...root.current.querySelectorAll('.ss-zoom img')]
    setFrames(list.map((img) => ({ src: img.dataset.hi, alt: img.alt })))
    setIndex(list.indexOf(e.currentTarget.querySelector('img')))
  }
  return (
    <OpenFrame.Provider value={openFrame}>
    <div className="ss" ref={root}>
      <span className="ss-progress" aria-hidden="true" />
      <button type="button" className="ss-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>✦</button>
      <Frame name="cover" tone="dark" height={1311} alt="Silk Serenity wordmark in white over a close-up of blueberries" />

      <section className="ss-intro">
        <div className="ss-inner reveal">
          <Link to="/work" className="ss-back">
            ← All projects
          </Link>
          <h1>{project.title}</h1>
          <p className="ss-lead">
            This is my best design work so far. One concept skincare brand, taken from a single word to a full identity,
            printed pieces, packaging and a website.
          </p>
          <div className="ss-intro-grid">
            <div className="ss-copy">
              <p>
                Most skincare brands reach for soft pastels and rounded type to say gentle. I wanted to see how far the
                opposite could go: only black and white, a high-contrast serif, and photography trusted to bring all the
                warmth and colour.
              </p>
              <p>
                Everything here comes from one rule. If a piece of the brand can be removed and it still reads as Silk
                Serenity, it gets removed. What was left is a wordmark, a small four-point star and a lot of empty space.
              </p>
            </div>
            <dl className="ss-facts">
              {FACTS.map(([term, value]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="ss-cat">
            <strong>A note on the client.</strong> You will spot “JMstudio” in the corners of these layouts. It is not a
            real studio. JM stands for Jiru Masala, my cat, and the studio is imaginary, as is the Silk Serenity brand.
            No cats were invoiced.
          </aside>
          <p className="ss-hint">Hover over any image to look closer, or click it to open it full size and zoom right in.</p>
        </div>
      </section>

      <Frame name="silk" height={1078} alt="Silk Serenity wordmark in white over folds of pale grey silk" />

      <Chapter number="01" title="A name that sets the material">
        <p>
          The name did the first round of art direction for me. Silk is a surface: smooth, bright where it catches light
          and deep where it folds. Serenity is a pace. So the opening frames do very little, with a single fabric and a
          single word, and they give you time to look.
        </p>
        <p>
          The portrait that follows sets the wordmark on its side, big enough to act as a column of the layout instead of a
          label on top of it. Petals on skin bring in the only saturated colour, and they point at what the brand is about:
          the person, not the bottle.
        </p>
      </Chapter>

      <Frame name="portrait" height={1078} alt="Wordmark running vertically in black beside a portrait of a woman with flower petals on her cheeks" />

      <Chapter number="02" title="A wordmark and one star" dark>
        <p>
          The wordmark is set in Adorage, a display serif whose thick and hairline strokes behave a lot like light on
          fabric. It stacks over two lines when it has room and runs on one line when it doesn’t.
        </p>
        <p>
          The ✦ is the only other mark in the system. It always sits in a corner, always small, working like a jeweller’s
          stamp. On the business card it gives the white space something to measure itself against, and the tagline runs
          beside it: “Your reflection is a one-of-a-kind expression of who you are.”
        </p>
      </Chapter>

      <Frame name="cards" vector tone="dark" alt="Front and back of a white Silk Serenity business card on black" />
      <FlipCard />
      <Frame name="bag" alt="Kraft paper shopping bag with the stacked wordmark at the bottom left and the star at the top right" />

      <Chapter number="03" title="Stationery that holds back">
        <p>
          Three sheets show the range of the system: an empty letterhead, a letter in use and a back page that is nothing
          but wordmark. All three share the same edge margins, with the star fixed to the same bottom corner, so they read
          as a set even when spread across a desk.
        </p>
        <p>
          The body copy stays small on purpose. A confident brand doesn’t need to raise its voice, and the size contrast
          against the wordmark is what makes both feel deliberate.
        </p>
      </Chapter>

      <Frame name="stationery" vector tone="dark" alt="Three white A4 sheets on black: a letterhead, a typed letter, and a back page with a large wordmark" />

      <Chapter number="04" title="Photography without colour" dark>
        <p>
          The print side of the brand is black and white, so the textures are too. Cream, a dropper and bare skin are shot
          close enough that they stop being products and become surfaces, which ties them right back to the silk that
          opens the project.
        </p>
        <p>
          The close-up of the eye keeps its film grain instead of being retouched smooth. For a skincare brand that talks
          about individuality, showing real texture felt more honest than showing perfect skin.
        </p>
      </Chapter>

      <Frame name="textures" alt="Black and white pair of images: a smear of cream, and a dropper over a hand" />
      <Frame name="eye" alt="Grainy black and white close-up of a closed eye and brow with glowing skin" />

      <Chapter number="05" title="Packaging you’d keep">
        <p>
          The mailer box treats the wordmark the way the portrait did, big enough to run off the edge of the lid, so you
          only ever see part of it at once. The tagline wraps down the side, and the star moves to the end flap as a small
          reward for turning the box around.
        </p>
        <p>
          One ink on raw grey board keeps it inexpensive to produce, and it means the box holds up alongside the rest of
          the identity without needing a single extra colour.
        </p>
      </Chapter>

      <Frame name="box" alt="Grey cardboard mailer box printed with an oversized Silk Serenity wordmark and tagline" />

      <Chapter number="06" title="Two typefaces, two colours" dark>
        <p>
          The whole system fits in one frame. Adorage speaks, in headlines and the wordmark. LT Superior explains, in
          everything you actually need to read. Black is #000000 and white is #FFFFFF, with no tints in between.
        </p>
        <p>
          A palette this strict is what let me move to a website without redesigning anything. Colour on screen comes only
          from photography, so it never competes with the interface.
        </p>
      </Chapter>

      <Frame name="type" vector tone="dark" alt="Style sheet showing the Adorage and LT Superior typefaces with black and white colour swatches" />
      <TypeTester />

      <Chapter number="07" title="From wireframe to website">
        <p>
          Before any photography went in, I mapped the shop in low fidelity: a home page, a collection page and a product
          page. Working in grey forced the hierarchy to hold up on type and spacing alone.
        </p>
        <p>
          The wireframes already use the real wordmark and headline type, because in this brand the type is the layout.
          Drag across the sections below to see how little the structure moved once the images arrived.
        </p>
      </Chapter>

      <section className="ss-web">
        <div className="ss-inner wide">
          <Compare />
          <h3>The rest of the shop</h3>
          <p className="ss-note">
            A collection grid that gives every product equal space, and a product page with a gallery, price, key benefits and
            detail tabs. These two pages exist as wireframes, ready for the same visual treatment as the home page.
          </p>
          <ProductDemo />
          <p className="ss-hint">Try it. This is the product wireframe made clickable, with sample copy and photos from the home page.</p>
          <div className="ss-pages">
            <figure>
              <img src={`${IMG}/wf-collection.svg`} width="1920" height="3662" loading="lazy" alt="Wireframe of the collection page with a four-column product grid" />
              <figcaption>Collection</figcaption>
            </figure>
            <figure>
              <img src={`${IMG}/wf-product.svg`} width="1920" height="3054" loading="lazy" alt="Wireframe of the Green Tea Cleanser product page" />
              <figcaption>Product</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Chapter number="08" title="The finished home page" dark>
        <p>
          One change from the wireframes is worth pointing out. The row of four products under “Discover our exclusive new
          beauty collection” is gone, so the page moves straight into large photography. It sells a mood first and a
          product second, which is what a brand this quiet should do.
        </p>
        <p>Tap the stars on the page below for notes on each section.</p>
      </Chapter>

      <FinalHome />

      <section className="ss-intro">
        <div className="ss-inner reveal">
          <h2 className="ss-closing">What holds it together</h2>
          <div className="ss-reasons">
            <div>
              <h3>It’s one system</h3>
              <p>A kraft bag, a letter and a web page all look like the same brand, and none of them needed a special exception.</p>
            </div>
            <div>
              <h3>It’s restrained</h3>
              <p>Two colours, two typefaces, one star. Every limit I set made the next decision easier.</p>
            </div>
            <div>
              <h3>It’s complete</h3>
              <p>I took this from a name to packaging to a website myself, so the thinking carries all the way through.</p>
            </div>
          </div>
          <p className="ss-credit">
            Silk Serenity and JMstudio are fictional, and this is a self-initiated concept. Photography and mockups are stock
            images, used for presentation.
          </p>
          {next && (
            <Link to={`/work/${next.slug}`} className="btn">
              Next: {next.title} <span>→</span>
            </Link>
          )}
        </div>
      </section>
      <Lightbox frames={frames} index={index} setIndex={setIndex} />
    </div>
    </OpenFrame.Provider>
  )
}
