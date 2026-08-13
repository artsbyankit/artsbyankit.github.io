const projects = [
  {
    slug: 'distronet',
    title: 'DistroNet',
    category: 'B2B SaaS · Concept',
    year: '2026',
    role: 'Product Designer',
    duration: 'In progress',
    tools: ['Figma', 'Design System', 'Obsidian'],
    emoji: '📦',
    gradient: 'linear-gradient(140deg, #312e81, #4f46e5 55%, #6d28d9)',
    inProgress: true,
    excerpt:
      'B2B hyperlocal inventory & last-mile fleet operations — one platform connecting warehouse managers, store operators, and delivery partners.',
    overview:
      'DistroNet unifies inventory intelligence and last-mile fleet operations on one platform — a desktop command center for managers, a fast offline-capable mobile app for the floor and the road. Designed for kirana networks and quick-commerce dark stores in Tier 1/2 Indian cities.',
    problem:
      'Warehouse managers, store operators, and delivery partners operate on disconnected tools — forecasts are gut-feel based, delivery assignment is manual, and loading/delivery handoffs are paper-based.',
    cs: {
      tagline: 'B2B hyperlocal inventory & last-mile fleet operations',
      intro:
        'DistroNet unifies inventory intelligence and last-mile fleet operations on one platform — a desktop command center for managers, a fast offline-capable mobile app for the floor and the road. Designed for kirana networks and quick-commerce dark stores in Tier 1/2 Indian cities.',
      chips: ['B2B SaaS', 'Web + Mobile', 'Design System', 'Offline-first', 'India market'],
      status: {
        label: 'Project in progress',
        detail: 'Step 5 of 8 — Visual Design',
      },
      problem: {
        statement:
          'Stores hold too much of the wrong stock and too little of the right stock. Riders are routed inefficiently. Every failed or delayed handoff burns money the network can\'t afford.',
        context:
          'Warehouse managers, store operators, and delivery partners in Indian kirana networks and quick-commerce dark stores operate on disconnected tools — forecasts are gut-feel based, delivery assignment is manual, and loading/delivery handoffs are paper-based.',
        stats: [
          {
            value: '$1.7T',
            label: 'lost to inventory distortion yearly',
            source: 'IHL Group 2025',
            url: 'https://www.ihlservices.com/news/analyst-corner/2025/09/retail-inventory-crisis-persists-despite-172-billion-in-improvements/',
          },
          {
            value: '53%',
            label: "last mile's share of total logistics cost",
            source: 'Amazon Shipping 2026',
            url: 'https://shipping.amazon.in/blog/last-mile-delivery-india-smb-guide',
          },
          {
            value: '₹180–400',
            label: 'cost of a single failed delivery',
            source: 'Amazon Shipping 2026',
            url: 'https://shipping.amazon.in/blog/last-mile-delivery-india-smb-guide',
          },
          {
            value: '40–49%',
            label: 'COD failure rate in Tier 2/3 cities',
            source: 'Amazon Shipping 2026',
            url: 'https://shipping.amazon.in/blog/last-mile-delivery-india-smb-guide',
          },
          {
            value: '13M',
            label: 'kirana stores across India — ~11% of GDP',
            source: 'Accenture via Cornell Business 2026',
            url: 'https://business.cornell.edu/article/2026/05/indias-digital-pull-revolution',
          },
          {
            value: '85–95%',
            label: 'forecast accuracy achievable with AI (vs 60–70% manual)',
            source: 'X-Byte Analytics 2026',
            url: 'https://www.xbyteanalytics.com/predictive-demand-forecasting-in-retail-for-out-of-stock',
          },
        ],
      },
      product: {
        desktop: {
          title: 'Desktop Web',
          for: 'Managers & admins',
          features: [
            'Real-time stock dashboard',
            'Low-stock alerts & reorder flags',
            'Analytics & forecast accuracy',
            'Regional demand heatmap',
            'Supplier order management',
            'Fleet & route overview',
          ],
        },
        mobile: {
          title: 'Mobile',
          for: 'Store operator + delivery partner',
          features: [
            'Scan-based truck loading',
            'Digital proof of delivery (offline-cached)',
            'Dynamic route optimization',
            'Offline-first sync',
          ],
        },
        outOfScope: [
          'Consumer ordering app — that is the Blinkit/Zepto layer, not ours',
          'Payments & ledger — Khatabook/OkCredit territory; don\'t compete',
          'Real GPS backend / ML training — design the UI, explain the concept, cite the evidence',
        ],
        quote:
          '"DistroNet is a B2B operations layer. The consumer checkout belongs to Blinkit/Zepto/Udaan — our job is making their backend profitable."',
      },
      process: [
        { step: 'Define', done: true, summary: 'Problem statement, goals, scope IN/OUT, 4 target roles, success metrics mapped to cited benchmarks.' },
        { step: 'Research', done: true, summary: 'Market research, competitor analysis, and honest secondary-research synthesis — no invented interviews.' },
        { step: 'Analyze', done: true, summary: '4 personas, journey maps, task flows, information architecture, and jobs-to-be-done.' },
        { step: 'Wireframe', done: false, summary: 'Content-first specs for 7 web + 12 mobile screens; lo-fi sketches deferred as process evidence.' },
        { step: 'Visual design', done: false, summary: 'Design principles, semantic status colors, typography scale, component system — current step.' },
        { step: 'Prototype', done: false, summary: 'Clickable Figma flows: web reorder, operator scan-load, rider earnings to POD, handoff demo.' },
        { step: 'Test', done: false, summary: 'Usability plan, moderated tests, prioritized iteration.' },
      ],
      personas: [
        {
          name: 'Rohit',
          role: 'Warehouse / Dark-Store Manager',
          platform: 'Desktop Web',
          platformIcon: '🖥️',
          photo: '/images/rohit.webp',
          quote:
            '“System says we have 10. Shelf has 4. Customer gets a call-back saying cancelled. That’s the daily reality.”',
          profile: '32, B.Com graduate, 8 yrs in FMCG supply ops; manages a dark store (3,000–5,000 SKUs).',
          context:
            'Runs one store + 8–15 staff (pickers, loaders, shift incharges); serves a 2–3 km radius; ~1,255 orders/day; 6–10pm = 3× the midday load.',
          device: 'Desktop/laptop at an ops desk + mid-range Android for floor walkthroughs.',
          goals: [
            'Keep shelf-accurate stock so customers never hear “out of stock” after ordering',
            'Staff the 6–10pm peak without chaos (right people, right shifts)',
            'Catch shrinking / expiring / phantom SKUs before they hit margin',
            'Give admins a clean store report without manual reconciliation',
          ],
          pains: [
            'Phantom inventory — system says stock that isn’t there; picked-but-not-scanned; expired stock unflagged',
            'Last-minute cancellations & delays from hunted SKUs (30–90s per pick gone wrong)',
            'Peak-window roster chaos with the same headcount at 3× load',
            'Manual entries into 2–3 systems → guaranteed human error',
          ],
          jtbd: [
            'When I decide what to reorder, I want forecast-based suggestions, so I stop over/under-stocking.',
            'When I staff the evening peak, I want a live order+fleet+staff view, so I can react before queues form.',
          ],
          implications: [
            'Live stock truth dashboard (scan-fed), low-stock + expiry alerts',
            'Reorder suggestions from velocity/seasonality (PO sizing confidence)',
            'Peak-window workload view (orders + riders + staff on one timeline)',
            'One-click store report export for admin',
          ],
        },
        {
          name: 'Sunita',
          role: 'Store Operator / Loader',
          platform: 'Mobile',
          platformIcon: '📱',
          photo: '/images/sunita.webp',
          quote:
            '“I scan, I check, I note it in the register, then someone types it into the computer. Three places to make a mistake.”',
          profile: '26, 12th-pass; inward/outward executive in a small network’s hub; physically demanding 8–9h shifts.',
          context:
            'Loads incoming shipments, restocks shelves, hands packed orders to riders; often wears multiple hats; works with handheld scanners + paper manifests today.',
          device: 'Low-end Android (2–4GB RAM); patchy Wi-Fi in the back of the floor.',
          goals: [
            'Load a truck right the first time — no wrong/missing items',
            'Never lose work when Wi-Fi drops',
            'Onboard new staff fast (kill the “everyone knows it from memory” problem)',
            'Clear, guided handling of exceptions (damaged, missing barcode, expired)',
          ],
          pains: [
            'Manual picking = human error; wrong SKUs → costly returns',
            'No offline support — scans wait or vanish on Wi-Fi drops',
            'Exception handling is guesswork with no guided flow',
            'Physical vs digital stock mismatch after every rush',
          ],
          jtbd: [
            'When I load a truck, I want scan-verified accuracy with instant mismatch feedback, so wrong/missing items never ship.',
            'When the network drops, I want to keep scanning and sync later, so I never redo work.',
          ],
          implications: [
            'Scan-verify-confirm flow with loud visual/audio mismatch alert',
            'Offline-first: scans queue locally, sync on reconnect (banner: “5 scans waiting”)',
            'Guided exception flow: photo capture + reason chips (damaged/expired/missing barcode)',
            'Big touch targets, high contrast, icon-first, Hinglish copy (gloves, dim light, moving)',
          ],
        },
        {
          name: 'Imran',
          role: 'Delivery Partner (Rider)',
          platform: 'Mobile',
          platformIcon: '📱',
          photo: '/images/imran.webp',
          quote:
            '“How much did I earn this trip? The app just shows a number. I can’t check the distance, so I can’t question it.”',
          profile: '24, 12th-pass; gig rider, quick-commerce deliveries within ~3 km of a store; per-packet pay + incentives.',
          context:
            'Works 4/8/10-hour flexible slots; weekly payouts; insurance; runs multiple delivery apps in one shift.',
          device: 'Mid-range Android; patchy 4G between drops; battery is precious on long shifts.',
          goals: [
            'Verify earnings trip-by-trip (distance × rate = payout)',
            'Finish more trips per hour with fewer dead kilometers',
            'Prove delivery instantly (photo/OTP) even offline',
            'Minimize battery drain + glare on night shifts',
          ],
          pains: [
            'No earnings/order/slot history after app updates; no billable distance & payout breakdown → can’t verify or raise tickets',
            'Slow support (20+ min chat waits)',
            'OTP verification friction (app asks OTP, customer has none)',
            'Patchy internet “extremely painful” mid-route',
            'Gig distress / insecurity documented in surveys',
          ],
          jtbd: [
            'When I get a delivery trip, I want an optimized route + one-tap POD, so I deliver faster and prove it offline.',
            'When I finish a shift, I want a clear earnings breakdown, so I trust and keep using the app.',
          ],
          implications: [
            'Earnings-first home screen — one tap to trip-wise payout (distance, rate, incentive)',
            'In-app navigation — no app-switching; offline-tolerant',
            'One-tap POD: photo + optional OTP/signature; queues offline, syncs later',
            'Dark mode by default (battery + night readability)',
            'Big, glove-friendly targets; Hinglish + regional copy',
          ],
        },
        {
          name: 'Priya',
          role: 'Regional Admin / Ops Head',
          platform: 'Desktop Web',
          platformIcon: '🖥️',
          photo: '/images/priya.webp',
          quote:
            '“Each store gives me a different report. I can’t compare stores, suppliers, or riders on the same numbers.”',
          profile: '38, MBA (ops/supply chain); oversees 5–10 stores in a city; owns SLAs, cost/delivery, supplier performance.',
          context:
            'Reports up to leadership; juggles Excel from each store; responsible for last-mile cost (≈53% of logistics cost) and failed-delivery losses.',
          device: 'Desktop + tablet for reviews.',
          goals: [
            'One cross-store dashboard with the same KPIs everywhere',
            'See route health & failed-attempt reasons before costs pile up',
            'Supplier scorecards (delivery time, quality, fill-rate)',
            'Exportable, presentation-ready reports for stakeholders',
          ],
          pains: [
            'Every store reports differently → no single source of truth',
            'Failed deliveries cost ₹180–400 each; 40–49% COD failures in Tier 2/3 — invisible until month-end',
            'No structured view of route efficiency or rider utilization',
            'Supplier performance unmeasured',
          ],
          jtbd: [
            'When I review the network, I want one dashboard, so I can act before problems compound.',
          ],
          implications: [
            'Network dashboard: stock health, demand heatmap, fleet KPIs, supplier scorecards',
            'Drill-down path: city → store → SKU → trip',
            'Failed-attempt analytics (reason tags) → actionable route fixes',
            'Export to PDF/Excel for leadership',
          ],
        },
      ],
      designSystem: {
        status: [
          { name: 'Healthy', color: '#16A34A', meaning: 'On track — stock ok, on-time, synced' },
          { name: 'Warn', color: '#D97706', meaning: 'Attention — low stock, approaching reorder' },
          { name: 'Critical', color: '#DC2626', meaning: 'Act now — out of stock, mismatch, failed delivery' },
          { name: 'Neutral', color: '#6B7280', meaning: 'Default / inactive / offline (muted)' },
          { name: 'Info', color: '#2563EB', meaning: 'System info — sync banner, notifications' },
        ],
        brand: '#4F46E5',
        motionQuote: 'Animate to confirm completion, never to entertain.',
        lightDark:
          'Light is the default for the web and operator app — high contrast in dim warehouses. Dark is the default for the rider app — battery saving and night-shift readability. Both user-toggleable.',
      },
      metrics: {
        note: 'Industry benchmarks are cited; concept targets are design goals.',
        rows: [
          { metric: 'Stockout rate (SKU-days)', target: '↓ 30–50%', type: 'benchmark' },
          { metric: 'Excess inventory days', target: '↓ 20–30%', type: 'benchmark' },
          { metric: 'Forecast accuracy', target: '→ 85–95%', type: 'benchmark' },
          { metric: 'Cost per delivery', target: '↓ ~20%', type: 'benchmark' },
          { metric: 'Truck loading time', target: '↓ 50%+', type: 'goal' },
          { metric: 'Drops per rider-hour', target: '↑', type: 'goal' },
        ],
      },
      prototype: {
        ready: false,
        note: 'Interactive Figma prototype coming with Step 6. The flows are specified: web reorder, operator scan-load, rider earnings to POD.',
        flows: ['Web: reorder stock', 'Operator: scan-load', 'Rider: earnings → POD'],
      },
    },
  },
  {
    slug: 'atlas',
    title: 'Atlas Design System',
    category: 'Design Systems',
    year: '2024',
    role: 'Design Lead',
    duration: '4 months',
    tools: ['Figma', 'Tokens Studio', 'Storybook'],
    emoji: '🧭',
    gradient: 'linear-gradient(140deg, #42275a, #734b6d 55%, #4a2f5a)',
    excerpt: 'A scalable design system uniting 6 product teams on one visual language, built on fully documented tokens.',
    overview:
      'Six product teams at a SaaS company were shipping interfaces that looked like six different products. Atlas was created as a single source of truth: a token-driven design system with 48 components, theming support, and a contribution model anyone could use.',
    problem:
      'Designers and engineers duplicated patterns, brand colors drifted across teams, and onboarding a new hire took weeks of tribal knowledge. Accessibility was an afterthought in most flows.',
    process: [
      'Audited every product surface to find shared patterns and recurring inconsistencies.',
      'Defined a token architecture (primitive, semantic, component) that supports light, dark, and brand themes.',
      'Built components in Figma with variants and autolayout, paired with production-ready code in Storybook.',
      'Created governance docs, a contribution checklist, and office hours to keep quality high.',
    ],
    solution:
      'Atlas delivers 48 documented components, a WCAG 2.1 AA-aligned color system, and a Figma-to-code pipeline that lets engineers ship from the same source of truth. A monthly "design system day" keeps the library evolving.',
    results: [
      'Design-to-dev handoff time reduced by 50%.',
      'Adoption across all 6 teams within two quarters.',
      'Accessibility violations in audits dropped by 90%.',
    ],
  },
  {
    slug: 'growspace',
    title: 'Growspace SaaS Dashboard',
    category: 'Web App · SaaS',
    year: '2025',
    role: 'Product Designer',
    duration: '8 weeks',
    tools: ['Figma', 'Maze', 'Framer'],
    emoji: '🌱',
    gradient: 'linear-gradient(140deg, #0f3d2e, #1a5c43 55%, #1f7a55)',
    excerpt: 'Turning a data-heavy analytics dashboard into a calm, guided experience for non-technical founders.',
    overview:
      'Growspace is an analytics platform for small business owners. The old dashboard was built for analysts: dense charts, jargon, and no guidance. Founders logged in, felt overwhelmed, and left. The redesign prioritized progressive disclosure and a guided "what changed" narrative.',
    problem:
      'Session data showed 71% of new users never visited a second screen. Heatmaps revealed users staring at charts without acting. The core question: how do we make analytics feel like a helpful teammate instead of homework?',
    process: [
      'Shadowed 9 founders as they tried to answer simple questions like "did my ads work this month?".',
      'Prototyped an insights-first dashboard that surfaces changes in plain language with a "show me the data" escape hatch.',
      'Tested three levels of complexity with 18 participants to find the right default depth.',
      'Partnered with engineering on a chart kit so the visual language scaled beyond the dashboard.',
    ],
    solution:
      'The new dashboard opens with a natural-language summary of what changed, backed by scannable metric cards. Charts are progressive — one click reveals the full explorer. Empty states teach, and every number links to a plain-English explanation.',
    results: [
      'New-user activation (visiting 3+ screens in week 1) rose from 22% to 64%.',
      'Weekly active usage among founders doubled.',
      'Feature requests for export shifted to "explain this to me" — the signal we wanted.',
    ],
  },
  {
    slug: 'nomad',
    title: 'Nomad Travel Planner',
    category: 'Mobile App · Concept',
    year: '2024',
    role: 'Solo Designer',
    duration: '3 weeks',
    tools: ['Figma', 'After Effects'],
    emoji: '🧳',
    gradient: 'linear-gradient(140deg, #3a1c2b, #7b2d3e 55%, #a0503a)',
    excerpt: 'A concept app that turns chaotic trip planning into one calm, shareable timeline your friends will love.',
    overview:
      'Nomad is a concept for a collaborative travel planner. The premise: planning a trip with friends is currently a mess of spreadsheets, chat threads, and screenshots. Nomad puts everything on a single timeline that updates live as people vote, book, and adjust.',
    problem:
      'Our user research group described planning as "the worst part of the trip". Key pain points: decisions scattered across apps, no single place to see the itinerary, and zero visibility into what others are booking.',
    process: [
      'Started with a moodboard and journey map of the group planning experience.',
      'Sketched 40+ wireframe variations of the core timeline interaction before committing.',
      'Built a high-fidelity prototype with micro-animations to sell the "one shared surface" idea.',
      'Validated the concept with 10 remote usability tests on the voting and confirm flows.',
    ],
    solution:
      'A single timeline where every plan is a card that can be voted on, commented on, or booked instantly. A "live board" shows what each traveler has confirmed, and a subtle progress meter turns planning into a satisfying, shared game.',
    results: [
      'Concept received a 4.7/5 average rating in testing.',
      'Selected as a design community spotlight feature.',
      'Most-requested follow-up: actually ship it.',
    ],
  },
  {
    slug: 'meridian',
    title: 'Meridian E-commerce Checkout',
    category: 'E-commerce · Conversion',
    year: '2023',
    role: 'UX Designer',
    duration: '5 weeks',
    tools: ['Figma', 'Hotjar', 'Optimizely'],
    emoji: '🛒',
    gradient: 'linear-gradient(140deg, #1b2440, #2b3a67 55%, #33486b)',
    excerpt: 'A checkout redesign that cut friction in half for a fashion retailer shipping to 40 countries.',
    overview:
      'Meridian, a fashion retailer, was losing 78% of customers somewhere between cart and purchase. The checkout had 14 required fields, surprise shipping costs, and zero trust signals. The goal: a checkout that feels almost invisible.',
    problem:
      'Session recordings showed the top abandonment moment was the shipping step — users discovered costs too late and bounced. The form itself asked for redundant data and had no progress feedback.',
    process: [
      'Analyzed 1,000+ checkout sessions and funnel analytics to rank friction points.',
      'Re-architected the flow into three short steps with an early, transparent cost summary.',
      'Ran an A/B test with the redesigned checkout against the existing one over four weeks.',
      'Iterated on error handling and mobile layout after the first test results.',
    ],
    solution:
      'A three-step checkout with a live cost summary visible from the start, smart defaults, guest checkout as the primary path, and reassuring trust markers. Autofill and inline validation make the form feel effortless.',
    results: [
      'Checkout completion increased by 27%.',
      'Shipping-step abandonment dropped by half.',
      'Recovered an estimated $180k/month in lost revenue at scale.',
    ],
  },
  {
    slug: 'aperture',
    title: 'Aperture Photography Tool',
    category: 'Desktop App',
    year: '2023',
    role: 'UX/UI Designer',
    duration: '7 weeks',
    tools: ['Figma', 'Electron', 'Framer'],
    emoji: '📷',
    gradient: 'linear-gradient(140deg, #1a1a1a, #2d2d2d 55%, #3d3d3d)',
    excerpt: 'Designing an editing workspace for photographers that respects their craft and their colorblind clients.',
    overview:
      'Aperture is a desktop photo editing tool built for working photographers. The old interface prioritized feature density over flow — panels everywhere, overwhelming presets, and terrible colorblind support in a visual profession.',
    problem:
      'Photographers reported "analysis paralysis" from the tool, and several colorblind users could not reliably read the color grading interface. Power users wanted speed; beginners wanted a way in.',
    process: [
      'Interviewed 14 professional photographers about their editing rituals and tools.',
      'Designed a modular workspace with dockable panels and a distraction-free focus mode.',
      'Rebuilt the color grading UI with patterns and labels alongside color, so it works without color vision.',
      'Prototyped and tested keyboard-first editing flows with 12 power users.',
    ],
    solution:
      'A workspace that adapts: minimal by default, expandable when needed. The signature feature is a color-grading wheel that communicates via pattern and position, not just hue, making the tool genuinely accessible. A focus mode hides everything but the image.',
    results: [
      'Power users rated workflow speed up 35%.',
      'Shipped with WCAG 2.1 AAA contrast on every control.',
      'Adopted by two photography education programs for their courses.',
    ],
  },
]

export default projects
