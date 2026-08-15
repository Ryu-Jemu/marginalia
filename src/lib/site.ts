/** Single source for identity and links. Nothing here is duplicated in a page. */
export const site = {
  url: import.meta.env.SITE ?? 'https://ryu-jemu-marginalia.onrender.com',
  name: 'Ryu Jemu',
  role: 'Backend · AI',
  /** The one line. Everything else on the page is evidence for it. */
  lede:
    'Backend services, wireless-optimisation research, and analysis that argues with its own premise.',
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
  { id: 'backend', n: '1', title: 'Backend' },
  { id: 'research', n: '2', title: 'Research' },
  { id: 'analysis', n: '3', title: 'Analysis' },
  { id: 'also', n: '4', title: 'Also built' },
  { id: 'about', n: '5', title: 'About me' },
  { id: 'boundaries', n: '6', title: 'Boundaries' },
] as const;

/**
 * The bar at the top. Awards and education sit eight screens down the
 * document; a reader who wants them should not have to scroll for them, so
 * every section is one click away instead.
 */
export const nav = [
  { href: '#backend', label: 'Backend', watches: 'backend' },
  { href: '#research', label: 'Research', watches: 'research' },
  { href: '#analysis', label: 'Analysis', watches: 'analysis' },
  { href: '#about', label: 'About', watches: 'about' },
  { href: '#boundaries', label: 'Boundaries', watches: 'boundaries' },
  { href: '/evidence/', label: 'Evidence', watches: null },
] as const;
