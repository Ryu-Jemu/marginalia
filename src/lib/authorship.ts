import { t, type Lang } from '../i18n/ui';

/**
 * Author position, rendered from {index, of}.
 *
 * The position is never written as prose anywhere in the content, so it cannot
 * be mistyped into a stronger claim — which is the whole reason it is a pair of
 * numbers in the schema rather than a sentence.
 */
const ORDINAL = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];

export function authorship(lang: Lang, position: { index: number; of: number }): string {
  if (position.of === 1) return t(lang, 'research.authorship.sole');
  if (position.index === 1) return t(lang, 'research.authorship.first', { of: position.of });
  return t(lang, 'research.authorship.co', {
    // English names the position; Korean counts it, so the ordinal word is
    // only substituted on the side that uses one.
    index: lang === 'en' ? (ORDINAL[position.index] ?? position.index) : position.index,
    of: position.of,
  });
}
