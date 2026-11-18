// Card-level data for every project: everything Home, Work and the route
// metadata need. Case-study detail lives in caseStudies.js so it isn't in the
// entry bundle.
const projects = [
  {
    slug: 'nestcare',
    title: 'NestCare',
    custom: true,
    category: 'Mobile App · Healthcare',
    emoji: '🪺',
    gradient: 'linear-gradient(140deg, #0a6e66, #0e8f82 55%, #3fb8a6)',
    excerpt:
      'A patient-first healthcare app that makes booking, reminders and family-managed care simple for India’s Tier 2 & 3 cities.',
  },
  {
    slug: 'distronet',
    title: 'DistroNet',
    category: 'B2B SaaS · Concept',
    year: '2026',
    emoji: '📦',
    gradient: 'linear-gradient(140deg, #312e81, #4f46e5 55%, #6d28d9)',
    inProgress: true,
    excerpt:
      'B2B hyperlocal inventory & last-mile fleet operations — one platform connecting warehouse managers, store operators, and delivery partners.',
    // Card summary. The full case study lives in caseStudies.js, loaded only on its page.
    tagline: 'B2B hyperlocal inventory & last-mile fleet operations',
    chips: ['B2B SaaS', 'Web + Mobile', 'Design System'],
  },
  {
    slug: 'silk-serenity',
    preload: {
      href: '/images/silk-serenity/cover-1920.webp',
      srcset: '/images/silk-serenity/cover-960.webp 960w, /images/silk-serenity/cover-1920.webp 1920w',
      sizes: '100vw',
    },
    title: 'Silk Serenity',
    category: 'Branding & UI/UX',
    year: '2024',
    emoji: '✦',
    gradient: 'linear-gradient(140deg, #000, #1a1a1a 55%, #3a3a3a)',
    excerpt:
      'My best design work so far: a complete identity and website for a concept skincare brand, built from black, white and one star.',
  },
  {
    slug: 'eat-me-first',
    title: 'Eat Me First',
    category: 'Mobile App · Daily Design',
    year: 'Day 01',
    emoji: '🍅',
    gradient: 'linear-gradient(140deg, #0d2c1c, #1d5c3a 55%, #d94a2b)',
    excerpt:
      'A small grocery app that shows your whole fridge as a bento home screen, warns you what is about to expire, and turns it into something to cook.',
  },
]

export default projects
