/** Single source for identity and links. Nothing here is duplicated in a page. */
export const site = {
  url: import.meta.env.SITE ?? 'https://ryu-jemu-marginalia.onrender.com',
  name: 'Ryu Jemu',
  role: 'Data · Backend',
  /** The one line. Everything else on the page is evidence for it. */
  lede:
    'I build the path data takes — collected, decoded, cached, modelled, delivered — and I fix it where it breaks quietly.',
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
 * The strip under the hero: the standing facts a reviewer checks first —
 * degree and grade, recognition, credentials, and national service. What the
 * work amounts to is the rest of the page; this is the part that is simply
 * true regardless of which project someone is interested in.
 *
 * Which project each award is for is stated in About, next to the award.
 */
export const standing = [
  {
    value: '4.18',
    label: 'GPA / 4.5',
    detail: 'BSc Computer Science · 143 credits · Convergence Security',
  },
  { value: '5', label: 'awards and selections', detail: 'ASK 2026 Silver · Hanyang Grand Prize' },
  { value: '4', label: 'certifications', detail: 'AWS · SQLD · Azure AI · ADsP' },
  {
    value: 'Completed',
    label: 'military service',
    detail: 'ROK Air Force · discharged as sergeant',
  },
] as const;

export const sections = [
  { id: 'pipelines', n: '1', title: 'Data pipelines' },
  { id: 'research', n: '2', title: 'Research' },
  { id: 'analysis', n: '3', title: 'Data analysis' },
  { id: 'more', n: '4', title: 'More work' },
  { id: 'about', n: '5', title: 'About' },
] as const;

/**
 * The bar at the top. Awards and education sit several screens down the
 * document; a reader who wants them should not have to scroll for them, so
 * every section is one click away instead.
 */
export const nav = sections.map((s) => ({
  href: `#${s.id}`,
  label: s.title,
  watches: s.id,
}));
