const projects = [
  {
    slug: 'payflow',
    title: 'PayFlow Banking App',
    category: 'Mobile App Design',
    year: '2025',
    role: 'Product Designer',
    duration: '6 weeks',
    tools: ['Figma', 'Principle', 'Maze'],
    emoji: '🪙',
    gradient: 'linear-gradient(140deg, #0f2027, #203a43 55%, #2c5364)',
    excerpt: 'Redesigning a mobile banking experience to make everyday money moves feel effortless and trustworthy.',
    overview:
      'PayFlow is a digital-first banking app used by 200k customers. The existing app worked, but users found it stressful: critical actions buried in menus, dense tables, and a generic interface that made every transaction feel the same. I led a full redesign focused on clarity, confidence, and a human tone.',
    problem:
      'In-app surveys showed 68% of users hesitated before sending money because they could not clearly see fees, limits, and delivery time. Support tickets about "where do I find X" were the number one contact reason.',
    process: [
      'Interviewed 12 customers and analyzed 400+ support tickets to map the biggest friction points.',
      'Ran a card-sorting exercise with 8 participants to rebuild the information architecture.',
      'Built a mid-fidelity prototype and tested flows with 15 users over two rounds of usability testing.',
      'Iterated on visual design: larger touch targets, clearer hierarchy, and a calmer color system.',
    ],
    solution:
      'The new flow puts the primary action — Send — front and center with an inline fee and delivery estimator before you confirm. Transaction history was redesigned as scannable cards with semantic color and icons, and a new "Needs attention" tray surfaces anything that requires action.',
    results: [
      'Task completion time for sending money dropped 41%.',
      'Support tickets about navigation fell by 33%.',
      'App Store rating rose from 3.8 to 4.5 in three months.',
    ],
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
