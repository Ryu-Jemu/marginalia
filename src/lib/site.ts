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
 * Masthead figures. Legible in three seconds — what was moved, what was
 * measured, and what was recognised. Each value animates up from zero, which
 * is the point of putting them here rather than in a sentence.
 */
export const standing = [
  { value: '9', label: 'data services owned', detail: 'across two team products' },
  { value: '319', label: 'automated tests written', detail: 'on the three Dartoo services' },
  { value: '2', label: 'papers', detail: 'first author · IEEE TAI co-author' },
  { value: '5', label: 'awards and selections', detail: 'Silver at ASK 2026 · Grand Prize' },
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
