/** Single source for identity and links. Nothing here is duplicated in a page. */
export const site = {
  url: import.meta.env.SITE ?? 'https://ryu-jemu-marginalia.onrender.com',
  name: 'Ryu Jemu',
  role: 'Backend · AI',
  /** The one line. Everything else on the page is evidence for it. */
  lede:
    'I look for the failures that do not announce themselves, and I publish what the evidence does not cover.',
  status: 'Graduating February 2027 · Hanyang University ERICA',
  email: 'decemryu77@gmail.com',
  links: {
    github: 'https://github.com/Ryu-Jemu',
    blog: 'https://velog.io/@muqqi_bba',
    dartooOrg: 'https://github.com/team-dartoo',
    mapOrg: 'https://github.com/we-meet-trip',
  },
} as const;

/**
 * Masthead figures. Legible in three seconds — an award, a grade, a count of
 * things that exist. Counts of repositories, tests or papers are deliberately
 * absent: they scale with time spent rather than with anything worth knowing.
 *
 * No margin notes here. A figure grid is not prose, and a floated note in a
 * grid cell cannot see its neighbours to clear them. The scope of the whole
 * row is stated in the line underneath instead, where the margin works.
 */
export const standing = [
  { value: '2', label: 'mobile services deployed', detail: 'Dartoo and MAP' },
  { value: 'Silver', label: 'paper competition, ASK 2026', detail: 'First author' },
  { value: 'Grand Prize', label: 'IT/CSE applied research', detail: 'Hanyang University, 2025' },
  { value: '4.18', label: 'GPA / 4.5', detail: '143 credits · Convergence Security' },
] as const;

export const sections = [
  { id: 'start', n: '1', title: 'Start here' },
  { id: 'how', n: '2', title: 'How I work' },
  { id: 'work', n: '3', title: 'Work' },
  { id: 'also', n: '4', title: 'Also built' },
  { id: 'research', n: '5', title: 'Research' },
  { id: 'about', n: '6', title: 'About me' },
  { id: 'boundaries', n: '7', title: 'Boundaries' },
  { id: 'contact', n: '8', title: 'Contact' },
] as const;

/**
 * The bar at the top. Awards and education sit eight screens down the
 * document; a reader who wants them should not have to scroll for them, so
 * every section is one click away instead.
 */
export const nav = [
  { href: '#work', label: 'Work', watches: 'work' },
  { href: '#research', label: 'Research', watches: 'research' },
  { href: '#about', label: 'About me', watches: 'about' },
  { href: '#boundaries', label: 'Boundaries', watches: 'boundaries' },
  { href: '/evidence/', label: 'Evidence', watches: null },
] as const;
