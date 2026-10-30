import { useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/bricolage-grotesque'
import Food from '../components/Food'
import './EatMeFirst.css'

const FACTS = [
  ['Project', 'A concept app that cuts grocery waste'],
  ['Made for', 'Day 01 of my daily design challenge'],
  ['Role', 'Idea, naming, UX and UI'],
  ['Platform', 'iPhone, coded here as a working prototype'],
  ['Tool', 'Figma for the first layout, code for this version'],
]

// Everything in the fridge, with the days it has left today.
const ITEMS = [
  { id: 'pepper', name: 'Bell pepper', shelf: 'fresh', days: 1 },
  { id: 'cherries', name: 'Cherries', shelf: 'fresh', days: 1 },
  { id: 'pomegranate', name: 'Pomegranate', shelf: 'fresh', days: 2 },
  { id: 'avocado', name: 'Avocado', shelf: 'fresh', days: 3 },
  { id: 'tomato', name: 'Tomatoes', shelf: 'fresh', days: 4 },
  { id: 'broccoli', name: 'Broccoli', shelf: 'fresh', days: 5 },
  { id: 'carrot', name: 'Carrots', shelf: 'fresh', days: 7 },
  { id: 'cucumber', name: 'Cucumber', shelf: 'fresh', days: 6 },
  { id: 'potato', name: 'Potatoes', shelf: 'fresh', days: 12 },
  { id: 'yogurt', name: 'Yoghurt', shelf: 'moo', days: 4 },
  { id: 'paneer', name: 'Paneer', shelf: 'moo', days: 5 },
  { id: 'milk', name: 'Milk', shelf: 'moo', days: 6 },
  { id: 'eggs', name: 'Eggs', shelf: 'moo', days: 14 },
  { id: 'cheese', name: 'Cheese', shelf: 'moo', days: 20 },
]

const RECIPES = [
  {
    id: 'curry',
    name: 'Paneer pepper curry',
    icon: 'curry',
    time: '25 min',
    uses: ['pepper', 'paneer', 'tomato'],
    steps: ['Soften the pepper with onion and spices.', 'Add chopped tomatoes and simmer until thick.', 'Fold in the paneer and warm through.'],
  },
  {
    id: 'compote',
    name: 'Cherry compote',
    icon: 'cherries',
    time: '10 min',
    uses: ['cherries'],
    steps: ['Stone the cherries and add a little sugar.', 'Simmer until they burst and turn glossy.', 'Cool, then keep it in a jar for the week.'],
  },
  {
    id: 'raita',
    name: 'Pomegranate raita',
    icon: 'pomegranate',
    time: '5 min',
    uses: ['pomegranate', 'yogurt'],
    steps: ['Whisk the yoghurt with salt and cumin.', 'Stir in the pomegranate seeds.', 'Chill for a few minutes and serve.'],
  },
  {
    id: 'toast',
    name: 'Smashed avocado toast',
    icon: 'avocado',
    time: '5 min',
    uses: ['avocado'],
    steps: ['Toast a thick slice of bread.', 'Smash the avocado with lemon and salt.', 'Pile it on and eat it straight away.'],
  },
  {
    id: 'soup',
    name: 'Everything soup',
    icon: 'carrot',
    time: '30 min',
    uses: ['carrot', 'potato', 'tomato', 'broccoli'],
    steps: ['Chop everything into small pieces.', 'Simmer in stock until soft.', 'Blend until smooth and season well.'],
  },
]

const byId = Object.fromEntries(ITEMS.map((item) => [item.id, item]))

const urgency = (left) => (left <= 1 ? 'red' : left === 2 ? 'orange' : 'yellow')
const dayLabel = (left) => (left <= 1 ? '< 1 day' : `< ${left} days`)

const SCREEN_NOTES = {
  home: {
    title: 'Home',
    text: 'There is no menu to dig through. Open the app and the whole fridge is already there as a bento: fresh food, what is about to expire, the packed shelf and what to cook.',
  },
  fresh: {
    title: 'Nature’s Leftovers',
    text: 'The natural, healthy food that should be eaten while it’s fresh. It’s pictures first and sorted by what’s left, so there’s no list to read through.',
  },
  soon: {
    title: 'Eat these first',
    text: 'The food closest to going bad, most urgent at the top. Each one links straight to recipes that use it, so a warning always comes with a way out.',
  },
  moo: {
    title: 'Moo Magic',
    text: 'The packed products: milk, cheese, eggs and the rest. They keep for longer, so this screen is calmer and more about seeing what you already have.',
  },
  recipes: {
    title: 'Leftover Luxe',
    text: 'Recipes made from what’s already in the fridge, sorted so the ones that rescue the most urgent food come first. It’s also a quick answer to “what’s for dinner?”',
  },
  recipe: {
    title: 'A recipe',
    text: 'It shows exactly which items you have and what they’re about to save. Tap “I cooked this” and those items leave the fridge, added to your saved count.',
  },
}

const Arrow = () => (
  <svg className="fr-arrow" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 18 18 6M8 6h10v10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
  </svg>
)

const Corner = ({ left }) => <i className={`fr-corner ${urgency(left)}`} aria-hidden="true" />

function Header({ title, back }) {
  return (
    <header className="fr-head">
      <button type="button" onClick={back} aria-label="Back to home">←</button>
      <h3>{title}</h3>
    </header>
  )
}

function ItemGrid({ items, open }) {
  if (!items.length) return <p className="fr-empty">Nothing here right now.</p>
  return (
    <ul className="fr-grid">
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" className="fr-item" onClick={() => open(item.id)}>
            {item.left <= 3 && <Corner left={item.left} />}
            <Food name={item.id} className="fr-food" />
            <strong>{item.name}</strong>
            <span>{item.left <= 3 ? dayLabel(item.left) : `${item.left} days left`}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

// The app itself. It owns nothing but navigation; the fridge state lives in the page.
function App({ screen, go, fridge, recipe, cook, setFocus, focus }) {
  const { fresh, moo, soon, recipes, toast } = fridge
  const back = () => go('home')
  const openFor = (id) => {
    setFocus(id)
    go('recipes')
  }

  if (screen === 'fresh') {
    return (
      <div className="fr-page" key="fresh">
        <Header title="Nature’s Leftovers" back={back} />
        <ItemGrid items={fresh} open={openFor} />
      </div>
    )
  }
  if (screen === 'moo') {
    return (
      <div className="fr-page moo" key="moo">
        <Header title="Moo Magic" back={back} />
        <ItemGrid items={moo} open={openFor} />
      </div>
    )
  }
  if (screen === 'soon') {
    return (
      <div className="fr-page" key="soon">
        <Header title="Eat these first" back={back} />
        {soon.length ? (
          <ul className="fr-rows">
            {soon.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => openFor(item.id)}>
                  <Corner left={item.left} />
                  <Food name={item.id} className="fr-food" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{dayLabel(item.left)}</small>
                  </span>
                  <b>Use it</b>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fr-empty">Nothing is about to expire. Nice work.</p>
        )}
      </div>
    )
  }
  if (screen === 'recipes') {
    const list = focus ? recipes.filter((r) => r.uses.includes(focus)) : recipes
    return (
      <div className="fr-page" key="recipes">
        <Header title="Leftover Luxe" back={back} />
        {focus && (
          <button type="button" className="fr-filter" onClick={() => setFocus(null)}>
            Using {byId[focus].name.toLowerCase()} <span aria-hidden="true">×</span>
          </button>
        )}
        {list.length ? (
          <ul className="fr-rows">
            {list.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => go('recipe', r.id)}>
                  <Food name={r.icon} className="fr-food" />
                  <span>
                    <strong>{r.name}</strong>
                    <small>{r.time} · saves {r.saves} item{r.saves === 1 ? '' : 's'}</small>
                  </span>
                  <b>→</b>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fr-empty">No recipe for that yet. It might have to be a snack.</p>
        )}
      </div>
    )
  }
  if (screen === 'recipe' && recipe) {
    return (
      <div className="fr-page" key="recipe">
        <Header title={recipe.name} back={() => go('recipes')} />
        <div className="fr-recipe-art">
          <Food name={recipe.icon} className="fr-food" />
        </div>
        <p className="fr-meta">{recipe.time}</p>
        <ul className="fr-chips">
          {recipe.uses.map((id) => (
            <li key={id} className={recipe.have.includes(id) ? '' : 'missing'}>
              <Food name={id} className="fr-food" /> {byId[id].name}
            </li>
          ))}
        </ul>
        <ol className="fr-steps">
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <button type="button" className="fr-cook" onClick={() => cook(recipe)}>I cooked this</button>
      </div>
    )
  }

  // The bento: the whole home screen, and the entire point of the app.
  return (
    <div className="fr-home" key="home">
      <button type="button" className="fr-card fr-fresh" onClick={() => go('fresh')}>
        <span className="fr-card-top">What’s fresh? Click to find out! <Arrow /></span>
        <span className="fr-pile" aria-hidden="true">
          {['tomato', 'broccoli', 'carrot', 'cucumber', 'pepper', 'potato'].map((name) => (
            <Food key={name} name={name} className={`fr-food p-${name}`} />
          ))}
        </span>
        <strong>Nature’s Leftovers</strong>
      </button>

      <button type="button" className="fr-card fr-soon" onClick={() => go('soon')} aria-label={`Eat these first, ${soon.length} items about to expire`}>
        {soon.slice(0, 4).map((item) => (
          <span className="fr-tile" key={item.id}>
            <Corner left={item.left} />
            <Food name={item.id} className="fr-food" />
            <small className={urgency(item.left)}>{dayLabel(item.left)}</small>
          </span>
        ))}
        {soon.length === 0 && <span className="fr-clear">All clear ✦</span>}
      </button>

      <button type="button" className="fr-card fr-moo" onClick={() => go('moo')}>
        <span className="fr-card-top">Moo-re to explore! <Arrow /></span>
        <Food name="milk" className="fr-food fr-bottle" />
        <strong>Moo Magic</strong>
      </button>

      <button type="button" className="fr-card fr-luxe" onClick={() => go('recipes')}>
        <span className="fr-card-top">Click to see more recipes <Arrow /></span>
        <Food name="curry" className="fr-food fr-bowl" />
        <strong>Leftover Luxe</strong>
      </button>

      {toast && <p className="fr-toast" role="status">{toast}</p>}
    </div>
  )
}

function Prototype() {
  const [screen, setScreen] = useState('home')
  const [recipeId, setRecipeId] = useState(null)
  const [focus, setFocus] = useState(null)
  const [time, setTime] = useState(0)
  const [saved, setSaved] = useState([])
  const [toast, setToast] = useState('')

  const live = ITEMS.filter((item) => !saved.includes(item.id))
    .map((item) => ({ ...item, left: item.days - time }))
    .sort((a, b) => a.left - b.left)
  const stocked = live.filter((item) => item.left > 0)
  const wasted = live.filter((item) => item.left <= 0)
  const leftOf = (id) => stocked.find((item) => item.id === id)?.left

  const recipes = RECIPES.map((r) => {
    const have = r.uses.filter((id) => leftOf(id) !== undefined)
    const soonest = Math.min(...have.map(leftOf), 99)
    return { ...r, have, saves: have.length, soonest }
  })
    .filter((r) => r.have.length > 0)
    .sort((a, b) => a.soonest - b.soonest || b.saves - a.saves)

  const go = (next, id = null) => {
    if (next === 'home') setFocus(null)
    setToast('')
    setRecipeId(id)
    setScreen(next)
  }
  const cook = (recipe) => {
    setSaved((list) => [...list, ...recipe.have])
    setFocus(null)
    setRecipeId(null)
    setScreen('home')
    setToast(`${recipe.have.length} item${recipe.have.length === 1 ? '' : 's'} saved from the bin`)
  }
  const reset = () => {
    setTime(0)
    setSaved([])
    setFocus(null)
    setToast('')
    setScreen('home')
  }

  const fridge = {
    fresh: stocked.filter((item) => item.shelf === 'fresh'),
    moo: stocked.filter((item) => item.shelf === 'moo'),
    soon: stocked.filter((item) => item.left <= 3),
    recipes,
    toast,
  }
  const note = SCREEN_NOTES[screen]

  return (
    <div className="em-proto">
      <div className="em-phone">
        <div className="fr-screen">
          <App
            screen={screen}
            go={go}
            fridge={fridge}
            recipe={recipes.find((r) => r.id === recipeId)}
            cook={cook}
            setFocus={setFocus}
            focus={focus}
          />
        </div>
      </div>

      <div className="em-side">
        <div className="em-note ns-glass" key={screen}>
          <small>You’re looking at</small>
          <h3>{note.title}</h3>
          <p>{note.text}</p>
        </div>

        <div className="em-time ns-glass">
          <label htmlFor="em-time">
            <strong>{time === 0 ? 'Today' : `${time} day${time > 1 ? 's' : ''} later`}</strong>
            <span>Move time forward and watch the corners change</span>
          </label>
          <input id="em-time" type="range" min="0" max="3" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} />
          <div className="em-score" aria-live="polite">
            <span><b>{saved.length}</b> saved</span>
            <span className={wasted.length ? 'bad' : ''}><b>{wasted.length}</b> wasted</span>
            <button type="button" onClick={reset}>Start over</button>
          </div>
          {wasted.length > 0 && (
            <p className="em-lost">Gone off: {wasted.map((item) => item.name).join(', ')}.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EatMeFirst({ project, next }) {
  return (
    <div className="em">
      <section className="page-head">
        <div className="container">
          <Link to="/work" className="cs-back">
            ← All projects
          </Link>
          <div className="eyebrow">Case study · Daily design, Day 01</div>
          <h1>{project.title}</h1>
          <p className="cs-tagline">Your whole fridge on one screen, with what to eat next.</p>
          <p className="text-muted">{project.excerpt}</p>
        </div>
      </section>

      <section className="em-section">
        <div className="container">
          <div className="eyebrow">Try it</div>
          <h2 className="section-title">This phone works</h2>
          <p className="em-intro">
            Tap any card to go inside it, cook something, and see how much food you can rescue before it goes off.
          </p>
          <Prototype />
        </div>
      </section>

      <section className="em-section reveal">
        <div className="container em-split">
          <div>
            <div className="eyebrow">The problem</div>
            <h2 className="section-title">Food goes bad because we forget it’s there</h2>
            <p>
              Most groceries aren’t wasted on purpose. They sit at the back of a shelf until the day you find them, and
              by then it’s too late. Grocery apps usually answer with lists and menus, but a list is one more thing to
              read, and nobody opens a spreadsheet to decide what to eat.
            </p>
            <p>
              So the goal was simple: show what’s in the fridge without any menus, make the food that’s about to expire
              impossible to miss, and turn it straight into something to cook.
            </p>
          </div>
          <dl className="em-facts ns-glass">
            {FACTS.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="em-section reveal">
        <div className="container">
          <div className="eyebrow">Design decisions</div>
          <h2 className="section-title">Why it’s built this way</h2>
          <div className="em-decisions">
            <article className="ns-glass">
              <div className="em-mini em-mini-bento" aria-hidden="true">
                <i /><i /><i /><i />
              </div>
              <h3>A bento, not a menu</h3>
              <p>
                Everything you need sits on the first screen. The size of each card shows how much it matters, so the
                layout does the job a menu normally would.
              </p>
            </article>
            <article className="ns-glass">
              <div className="em-mini" aria-hidden="true">
                {[['pepper', 'red'], ['pomegranate', 'orange'], ['avocado', 'yellow']].map(([name, tone]) => (
                  <span className="em-mini-tile" key={name}>
                    <i className={`fr-corner ${tone}`} />
                    <Food name={name} className="fr-food" />
                  </span>
                ))}
              </div>
              <h3>Colour that means hurry</h3>
              <p>
                Yellow, orange and red corners sort the food by urgency before you read a number. The pale pink panel is
                the only tinted area on the screen, so your eye goes there first.
              </p>
            </article>
            <article className="ns-glass">
              <div className="em-mini em-mini-type" aria-hidden="true">Moo-re to explore!</div>
              <h3>A voice with some humour</h3>
              <p>
                “Moo Magic”, “Nature’s Leftovers”, “Leftover Luxe”. Food waste usually comes with guilt. Playful names
                make opening the app feel light, and that’s what brings people back.
              </p>
            </article>
            <article className="ns-glass">
              <div className="em-mini" aria-hidden="true">
                <Food name="pepper" className="fr-food" />
                <span className="em-mini-arrow">→</span>
                <Food name="curry" className="fr-food" />
              </div>
              <h3>A way out of every warning</h3>
              <p>
                “This expires tomorrow” on its own is just stress. Every expiring item leads straight to something you
                can cook with it, using what’s already in the fridge.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="em-section reveal">
        <div className="container em-split">
          <div>
            <div className="eyebrow">Day 01</div>
            <h2 className="section-title">Where it started</h2>
            <p>
              This began as a small challenge I set myself to get going as a UI/UX designer: design something every day.
              It was the first day, and the first day had to be small. One screen, one idea.
            </p>
            <p>
              I started with a single home screen in Figma. For this portfolio I rebuilt it in code, drew the food by hand
              and added the screens behind each card, because an idea about saving food is much easier to feel when you
              can actually try it.
            </p>
          </div>
          <div className="em-next ns-glass">
            <h3>What I’d do next</h3>
            <ul>
              <li>Work out how food gets into the app: receipts, barcodes or a quick photo of the shelf.</li>
              <li>Decide how expiry dates get estimated, and what happens when the app gets one wrong.</li>
              <li>Test it with people who do the weekly shop, to see if the corners really change what they cook.</li>
              <li>Add reminders, carefully, so they feel helpful and not like nagging.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="em-section reveal">
        <div className="container">
          <p className="em-small">
            Eat Me First is a personal concept with no real users or data behind it. The recipes and expiry dates are sample content.
          </p>
          {next && (
            <Link to={`/work/${next.slug}`} className="btn em-next-btn">
              Next: {next.title} <span>→</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
