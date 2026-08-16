import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

/**
 * The content, in the language being rendered.
 *
 * The two sides are separate collections rather than one collection with
 * translated fields, because a project's body is prose: an MDX file per
 * language is the only shape where the Korean text can read like Korean
 * rather than like a translated sentence. The schemas are shared, so the rules
 * — a measurement carries its condition, an author position is a number — hold
 * identically on both sides.
 */

export type Project = CollectionEntry<'projects'>;
export type Research = CollectionEntry<'research'>;
export type Record_ = CollectionEntry<'record'>;

export const projectsOf = (lang: Lang) =>
  getCollection(lang === 'ko' ? 'projectsKo' : 'projects') as Promise<Project[]>;

export const researchOf = (lang: Lang) =>
  getCollection(lang === 'ko' ? 'researchKo' : 'research') as Promise<Research[]>;

export const recordOf = (lang: Lang) =>
  getCollection(lang === 'ko' ? 'recordKo' : 'record') as Promise<Record_[]>;

export const noteOf = (lang: Lang, id: string) =>
  getEntry(lang === 'ko' ? 'notesKo' : 'notes', id);

/** tier-2 entries live in a subdirectory; the URL does not need to say so. */
export const slugOf = (entry: { id: string }) => entry.id.replace(/^tier2\//, '');

export const byOrder = (a: Project, b: Project) => a.data.order - b.data.order;

/** Peer-reviewed first, then under review — not the loader's order. */
const STATUS_RANK = { accepted: 0, revision: 1, 'under-review': 2, assisting: 3 } as const;
export const byStanding = (a: Research, b: Research) =>
  STATUS_RANK[a.data.status] - STATUS_RANK[b.data.status] || b.data.date.localeCompare(a.data.date);

/** `YYYY.MM` strings sort lexically, so most recent first is a string compare. */
export const newestFirst = (a: { data: { date: string } }, b: { data: { date: string } }) =>
  b.data.date.localeCompare(a.data.date);
