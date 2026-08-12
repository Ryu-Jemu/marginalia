#!/usr/bin/env node
/**
 * Keeps the evidence and the prose in step.
 *
 * A claim pointing at a note that does not exist breaks the build loudly, so
 * that case is already covered. This catches the quiet ones: a note nobody
 * cites any more, and a duplicate id that would make two claims share evidence
 * without anyone noticing.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const notesFile = join(ROOT, 'src/content/notes.yaml');
const raw = readFileSync(notesFile, 'utf8');

// Deliberately not a YAML parse: ids are declared one per line, and reading
// them literally keeps this script dependency-free.
const ids = [];
const dupes = [];
const seen = new Set();
raw.split('\n').forEach((line, i) => {
  const m = line.match(/^\s*-?\s*id:\s*["']?([\w-]+)["']?\s*$/);
  if (!m) return;
  const id = m[1];
  if (seen.has(id)) dupes.push({ id, line: i + 1 });
  seen.add(id);
  ids.push(id);
});

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
    else if (['.mdx', '.md', '.astro', '.yaml', '.ts'].includes(extname(name))) out.push(full);
  }
  return out;
}

const sources = [
  ...walk(join(ROOT, 'src/content')),
  ...walk(join(ROOT, 'src/pages')),
  ...walk(join(ROOT, 'src/components')),
  ...walk(join(ROOT, 'src/lib')),
].filter((f) => f !== notesFile);

const count = (map, id) => map.set(id, (map.get(id) ?? 0) + 1);

const used = new Map();
for (const file of sources) {
  const text = readFileSync(file, 'utf8');
  // <N id="…" /> in prose
  for (const m of text.matchAll(/<N\s+id=["']([\w-]+)["']/g)) count(used, m[1]);
  // note: '…' on a data object
  for (const m of text.matchAll(/\bnotes?:\s*["']([\w-]+)["']/g)) count(used, m[1]);
  // a bare list item under `notes:` in frontmatter or YAML
  for (const m of text.matchAll(/^\s*-\s*([\w-]+)\s*$/gm)) {
    if (ids.includes(m[1])) count(used, m[1]);
  }
}

const orphaned = [...used.keys()].filter((id) => !ids.includes(id));
const unused = ids.filter((id) => !used.has(id));

let failed = false;

if (dupes.length) {
  failed = true;
  console.error(`\ncheck-notes: duplicate note id(s)`);
  for (const d of dupes) console.error(`  notes.yaml:${d.line}  "${d.id}" declared more than once`);
}

if (orphaned.length) {
  failed = true;
  console.error(`\ncheck-notes: reference(s) to a note that does not exist`);
  for (const id of orphaned) console.error(`  "${id}" — add it to src/content/notes.yaml`);
}

if (unused.length) {
  failed = true;
  console.error(`\ncheck-notes: note(s) no claim cites`);
  for (const id of unused) console.error(`  "${id}" — cite it or delete it`);
}

if (failed) process.exit(1);
console.log(`check-notes: ${ids.length} notes, all cited, no duplicates`);
