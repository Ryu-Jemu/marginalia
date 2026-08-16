import { t, type Lang } from '../i18n/ui';

/** Single source for identity and links. Nothing here is duplicated in a page. */
export const site = {
  url: import.meta.env.SITE ?? 'https://ryu-jemu-marginalia.onrender.com',
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
export const standing = (lang: Lang) => [
  { value: '4.18', label: t(lang, 'standing.gpa.label'), detail: t(lang, 'standing.gpa.detail') },
  { value: '5', label: t(lang, 'standing.awards.label'), detail: t(lang, 'standing.awards.detail') },
  { value: '4', label: t(lang, 'standing.certs.label'), detail: t(lang, 'standing.certs.detail') },
  {
    value: t(lang, 'standing.service.value'),
    label: t(lang, 'standing.service.label'),
    detail: t(lang, 'standing.service.detail'),
  },
];

export const SECTION_IDS = ['pipelines', 'research', 'analysis', 'more', 'about'] as const;

export const sections = (lang: Lang) =>
  SECTION_IDS.map((id, i) => ({ id, n: String(i + 1), title: t(lang, `section.${id}`) }));

/**
 * The bar at the top. Awards and education sit several screens down the
 * document; a reader who wants them should not have to scroll for them, so
 * every section is one click away instead.
 */
export const nav = (lang: Lang, base = '') =>
  sections(lang).map((s) => ({ href: `${base}#${s.id}`, label: s.title, watches: s.id }));
