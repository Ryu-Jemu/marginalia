#!/usr/bin/env node
/**
 * Astro's template compiler drops the whitespace before an inline element that
 * starts a new source line, so "the late\n<code>in_progress</code>" renders as
 * "latein_progress". It is invisible in the source and obvious on the page.
 *
 * This reads the built HTML rather than the source, because the built HTML is
 * the only place the bug exists.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const INLINE = 'code|em|strong|b|i|abbr|a';
// a word character butted straight against an inline tag, or vice versa
const OPEN = new RegExp(`([A-Za-z0-9,.;:)])<(${INLINE})(?:\\s[^>]*)?>`, 'g');
const CLOSE = new RegExp(`</(${INLINE})>([A-Za-z0-9(])`, 'g');

const files = walk(DIST);
if (files.length === 0) {
  console.log('check-spacing: no built HTML yet, skipping');
  process.exit(0);
}

const hits = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const re of [OPEN, CLOSE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      // A marker deliberately butts against the word it annotates, and so does
      // its note — that adjacency is the whole pairing mechanism.
      const around = html.slice(Math.max(0, m.index - 90), m.index + 90);
      if (around.includes('data-note-ref') || around.includes('data-note')) continue;
      hits.push({ file: relative(ROOT, file), text: m[0] });
    }
  }
}

if (hits.length === 0) {
  console.log(`check-spacing: ${files.length} pages, no swallowed spaces`);
  process.exit(0);
}

console.error(`\ncheck-spacing: ${hits.length} place(s) where a space was swallowed\n`);
for (const h of hits.slice(0, 20)) {
  console.error(`  ${h.file}  …${h.text}…`);
}
console.error(`\n  Fix: put {' '} before the inline element in the source.\n`);
process.exit(1);
