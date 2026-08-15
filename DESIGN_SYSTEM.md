# Design System — Ankit Patel Portfolio

Single source of truth for the site's visual language. Every value here is pulled from `src/index.css` (CSS custom properties) and the components. When you change a style, update both this file and the code so they never drift.

> Dark-mode only. Scheme: `color-scheme: dark`.

---

## 1. Color Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | Page background |
| `--surface` | `#1c1c1e` | Solid surfaces (buttons base) |
| `--surface-2` | `#2c2c2e` | Elevated surfaces |
| `--border` | `rgba(255,255,255,0.14)` | Hairline borders |
| `--line` | `rgba(255,255,255,0.22)` | Dividers (hero-meta, footer, tools strip) |
| `--text` | `#ffffff` | Primary text |
| `--muted` | `rgba(235,235,245,0.78)` | Secondary text |
| `--accent` | `#F5C45D` | Brand amber/gold — primary CTAs, eyebrows, links, "Let's talk" |
| `--green` | `#00ff88` | Status/live — "Available for freelance" dot, "In progress", benchmark labels |

**Rule of thumb:** accent = interactive highlight, green = live/status. Never mix them.

---

## 2. Typography

**Font:** Inter (Google Fonts). `--font-body` and `--font-display` both resolve to Inter + system stack.

**Base:** 21px / line-height 1.6. Text renders at `18px`-`21px` across body copy.

### Type scale (fixed)
| Size | Where |
|---|---|
| 12px | Smallest micro-labels |
| 13px | Chips |
| 14px | Tags, eyebrow (uppercase) |
| 15px | Buttons, hero meta, labels |
| 16px | Tags, tools strip, card-more |
| 17px | Card body text |
| 18px | Sub-labels |
| 19px | Intro paragraphs |
| 20px | Page-head intro |
| 21px | — |
| 23px | Card h3 |
| 29px | Persona h3, "next case study" emoji |
| 34px | Stat numbers |

### Display scale (fluid `clamp`)
| Context | Value |
|---|---|
| Hero h1 | `clamp(44px, 8vw, 84px)` |
| Contact h1 | `clamp(40px, 8vw, 84px)` |
| Page head h1 | `clamp(40px, 6vw, 64px)` |
| CTA h2 | `clamp(34px, 6vw, 64px)` |
| Section title | `clamp(30px, 4.5vw, 44px)` |
| About h2 | `clamp(30px, 4.5vw, 42px)` |
| Card cover title | `clamp(26px, 4vw, 44px)` |
| Case-study cover title | `clamp(40px, 10vw, 96px)` |

**Details:** headings weight 600, `letter-spacing: -0.02em`, line-height 1.15. Buttons weight 600 uppercase `0.08em`. Eyebrows uppercase `0.12em`. Logo weight 700.

---

## 3. Layout & Spacing

| Token | Value | Use |
|---|---|---|
| `--maxw` | `1120px` (base) | Max content width |
| — wide screens | `min(1680px, calc(100vw - 96px))` | Applies at `≥1280px` viewport |
| Container padding | `0 24px` | `.container` |
| Section padding | `96px 0` | `.section` (`64px` on tablet) |
| Hero padding | `120px 0 20px` | |
| Page head padding | `110px 0 40px` | |
| CTA padding | `110px 0` | |

### Grids & gaps
| Pattern | Columns | Gap |
|---|---|---|
| Work grid | 2 (`1fr` ≤900px) | 32px |
| Skill list | 3 (`1fr` ≤900px) | 24px |
| Case-study gallery | 2 (`1fr` ≤900px) | 24px |
| About split | `1fr 1.2fr` (`1fr` ≤900px) | 56px |
| Tools row | wrap | `12px 28px` |
| Section head | `space-between` | 16px, margin-bottom 48px |

### Breakpoints
| Width | Behavior |
|---|---|
| `≥1280px` | Container grows fluidly, capped 1680px |
| `≤900px` | Tablet: single columns, dock auto-sizes, hero `80px 0 56px` |
| `≤640px` | Phone: hamburger menu, logo centered, mobile "All projects" button |

---

## 4. Shape & Radius

| Token | Value | Use |
|---|---|---|
| `--radius` | `20px` | Cards, covers, panels, page-head frames |
| `--radius-sm` | `12px` | Frames, skill boxes |
| Pill | `999px` | Buttons, tags, chips, nav, social pills |
| Circle | `50%` | Dots (pulse, in-progress), mobile nav toggle |

### Aspect ratios
| Element | Ratio |
|---|---|
| Card cover | `16 / 10` |
| Case-study cover | `16 / 9` |
| Portrait (about) | `4 / 5` |
| Persona photo | `3 / 4` (mobile: `4 / 3`) |
| Gallery frames | `16 / 10` |

---

## 5. Glass / Blur System

**Every glass element uses the same recipe:**

```css
backdrop-filter: blur(10px) saturate(130%);   /* + -webkit- prefix */
```

| Token | Value |
|---|---|
| `--glass-bg` | `linear-gradient(150deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015) 48%, rgba(255,255,255,0.035))` |
| `--glass-border` | `rgba(255,255,255,0.18)` |
| `--glass-highlight` | `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.03)` |
| `--glass-shadow` | `0 8px 30px rgba(0,0,0,0.45)` |
| `--glass-sheen` | `linear-gradient(115deg, rgba(255,255,255,0.34), rgba(255,255,255,0.08) 32%, transparent 62%)` — opacity `0.5` |

### Where glass is applied
Buttons (`.btn`, `.btn-primary`), `.dock-glass`, `.card`, `.skill-box`, `.hero-tag`, `.social-big a`, `.nav-toggle`, `.nav-links a`, `.cs-gallery .frame`, `.cs-next-card`, `.proto-embed`, `.metrics-table`, `.status-item`, `.tool-list li`.

### Card panels (denser glass)
| Token | Value |
|---|---|
| `--panel-bg` | `linear-gradient(150deg, rgba(245,245,238,0.07), rgba(214,221,208,0.03) 48%, rgba(235,237,228,0.05))` |
| `--panel-border` | `rgba(236,240,231,0.16)` |
| `--panel-highlight` | `inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(255,255,255,0.04)` |

---

## 6. Components

### Button `.btn`
```
min-height 44px · padding 12px 24px · radius 999px
font 15px/600 · uppercase · letter-spacing 0.08em
border 1px var(--border) · background var(--glass-bg) · blur(10px)
```
- **Hover:** `translateY(-2px)`, border `accent 60%`, shadow `0 12px 36px rgba(0,0,0,0.5)`
- **Active:** `translateY(0) scale(0.96)`, `brightness(0.9)`

### Primary button `.btn-primary`
```
padding 9px 18px · weight 500
background accent 8% (transparent mix) · border + text = accent
blur(10px) · no box-shadow at rest
```
- **Hover:** background accent 16%, `translateY(-2px)`, same rise shadow as `.btn`
- **Active:** `scale(0.96)`, `brightness(0.88)`

### Card `.card`
```
radius 20px · panel-bg · border 1px panel-border
box-shadow panel-highlight + glass-shadow · blur(10px) · overflow hidden
```
- **Cover:** `16/10`, title `clamp(26px,4vw,44px)` white 700, emoji badge top-right
- **Body:** padding 24px; h3 `23px`; p `17px` muted; tags `14px` uppercase pills
- **Hover:** `translateY(-5px)`, border `rgba(238,240,228,0.32)`, shadow `0 18px 48px`, cover image `scale(1.06)`
- **Active:** `scale(0.98)`

### Tag `.tag` / Chip `.chip` / Live `.tag-live`
| Token | Tag | Chip | Tag-live |
|---|---|---|---|
| Font | 14px uppercase 600 | 13px 600 | same as tag |
| Radius | 999px | 999px | 999px |
| Padding | `4px 10px` | `3px 10px` | — |
| Color | muted | muted | **green** `#00ff88` |
| Border | 1px `--border` | 1px `--border` | green 40% |

### Nav dock `.dock-glass`
```
fixed top 18px centered · height 62px (82px hover) · radius 999px
glass-bg · blur(10px) · inset top/bottom highlights · glass-shadow
```
- **Spacing:** nav pill is 44px tall; vertical gap to dock edge is `(dockH − 44px)/2` = **9px rest / 19px hover**.
- **Right padding must equal the vertical gap** → `calc(9px + var(--dock-grow) * 0.5)`; left padding is a fixed design value (15px rest, +`0.15×grow`) and is intentionally **not** equalized (keeps the green-dot logo balanced).
- **Note (Aug 2026):** the earlier right-padding of `12px + 0.15×grow` caused "Let's talk" to sit ~3px off (9 vs 12) at rest and ~4px on hover (19 vs 15). Fixed by using `9px + 0.5×grow`. The font bump (nav links 14→15px) widened the pill but was *not* the cause — the padding values were.
- **Hover on "Let's talk" (Aug 2026):** scaling the last pill to 1.45× shrinks its top/bottom gap to ~9px while the trailing margin leaves 19px on the right. Fixed in `Layout.jsx grow()` — the last item gets `translateX(half of extra height) scale(1.45)` so right/top/bottom gaps all stay equal.
- **Hover swell:** grows to 82px, logo + links scale ×1.45, green "railway" animation travels between links. Disabled when `prefers-reduced-motion`.

### Hero tag `.hero-tag`
```
pill · 15px muted · border 1px --border · glass-bg · blur(10px)
```
- **Pulse dot:** 8px circle, `var(--green)` — "Available for freelance"

### Social pill `.social-big a`
```
pill · min-height 48px · padding 12px 26px · font 14px/600 uppercase 0.08em
glass-bg · blur(10px) · glass shadow · 16px→18px icons
```
- **Hover:** `translateY(-2px)`, border accent 60%

### Section head / eyebrow
```
eyebrow: 14px uppercase · accent · letter-spacing 0.12em · 18px accent dash before
section-title: clamp(30px, 4.5vw, 44px)
```

---

## 7. Motion

| Pattern | Spec |
|---|---|
| Page load (hero) | `rise-in` 0.7s `cubic-bezier(0.2,0.6,0.2,1)`, staggered 0.05–0.45s |
| Scroll reveal | `.reveal`: fade + 26px, 0.7s, same easing; triggered by IntersectionObserver |
| Hover states | 0.15s–0.2s ease (buttons, cards) |
| Dock swell | 0.3s `cubic-bezier(0.87,0,0.13,1)` |
| Live dot | `dot-live` pulse 1.6s infinite ease-out |
| Reduced motion | `prefers-reduced-motion: reduce` disables load/reveal/dock animations |

**Easing curve:** `cubic-bezier(0.2, 0.6, 0.2, 1)` is the site-wide standard for reveals/entrances.

---

## 8. Background

- **Base:** `--bg` black, `color-scheme: dark`
- **Effect:** AIDesigner `fluted-glass` WebGL background (`src/components/Background.jsx`), colors `#0c1319, #28487b, #4569a7, #6d94cf, #baceef`
- **Vignette:** radial gradient, center follows the cursor (desktop only)
- **Noise:** subtle SVG grain overlay at 10% opacity

---

## 9. File Map

| File | Contents |
|---|---|
| `src/index.css` | All tokens + component styles (this doc's source of truth) |
| `src/components/Background.jsx` | Background effect config |
| `src/components/Layout.jsx` | Dock/nav, footer, reveal observer |
| `src/components/ProjectCard.jsx` | Card component |
| `src/pages/*.jsx` | Page layouts |
