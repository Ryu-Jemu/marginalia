#!/usr/bin/env node
/**
 * The third gate: the two languages have to say the same things.
 *
 * A site that is half translated is worse than one that is not, because the
 * reader cannot tell which half they are missing. This refuses a build where
 * a string exists on one side only, or where the Korean content mirror has
 * drifted from the English one — a project file that was added and not
 * mirrored, a note id that exists in one language and not the other.
 *
 * Deliberately not a TypeScript or YAML parse: keys and ids are declared one
 * per line in both, and reading them literally keeps this dependency-free,
 * like the other two gates.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const problems = [];

/* ── 1. every UI string carries both languages ─────────────────────────── */

for (const file of ['src/i18n/ui.ts', 'src/i18n/viz.ts']) {
  const path = join(ROOT, file);
  const text = readFileSync(path, 'utf8');

  // `'key': [` opens an entry; the pair closes at the matching `],`. Entries
  // are written either on one line or across four, so the body is collected
  // until the bracket closes rather than matched in one go.
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^\s*'([\w.-]+)':\s*\[/);
    if (!open) continue;
    // Collected by bracket depth rather than by looking for a closing line: a
    // bullet list nests, and stopping at the first `]` reads half of one.
    const depth = (s) => [...s].reduce((d, c) => d + (c === '[' ? 1 : c === ']' ? -1 : 0), 0);
    let body = lines[i].slice(lines[i].indexOf('['));
    let j = i;
    while (depth(body) > 0 && j < lines.length - 1) body += ' ' + lines[++j];

    // A bullet list is a pair of arrays rather than a pair of strings; the
    // two sides have to hold the same number of bullets or one language
    // quietly makes a claim the other does not.
    if (/^\[\s*\[/.test(body.trim())) {
      const sides = [...body.matchAll(/\[((?:[^[\]]|\\.)*)\]/g)].map(
        (m) => (m[1].match(/(['"])(?:\\.|(?!\1)[\s\S])*?\1/g) ?? []).length,
      );
      if (sides.length !== 2 || sides[0] !== sides[1]) {
        problems.push(
          `${file}:${i + 1}  "${open[1]}" is a list of ${sides.join(' and ')} — the two sides must match`,
        );
      }
      i = j;
      continue;
    }

    // Count top-level string literals in the pair.
    const parts = body.match(/(['"])(?:\\.|(?!\1)[\s\S])*?\1/g) ?? [];
    if (parts.length !== 2) {
      problems.push(`${file}:${i + 1}  "${open[1]}" has ${parts.length} entries, expected 2`);
      continue;
    }
    for (const [k, part] of parts.entries()) {
      if (part.slice(1, -1).trim() === '') {
        problems.push(`${file}:${i + 1}  "${open[1]}" is empty in ${k === 0 ? 'English' : 'Korean'}`);
      }
    }
    // Placeholders have to survive translation or the sentence renders with a
    // literal `{of}` in it.
    const holders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
    if (holders(parts[0]) !== holders(parts[1])) {
      problems.push(
        `${file}:${i + 1}  "${open[1]}" placeholders differ: [${holders(parts[0])}] vs [${holders(parts[1])}]`,
      );
    }
    i = j;
  }
}

/* ── 2. the content mirror declares the same ids ───────────────────────── */

const idsIn = (file) => {
  const path = join(ROOT, file);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((l) => l.match(/^\s*-?\s*id:\s*["']?([\w.-]+)["']?\s*$/))
    .filter(Boolean)
    .map((m) => m[1]);
};

for (const name of ['notes.yaml', 'research.yaml', 'record.yaml']) {
  const en = idsIn(`src/content/${name}`);
  const ko = idsIn(`src/content/ko/${name}`);
  if (ko === null) {
    problems.push(`src/content/ko/${name} is missing`);
    continue;
  }
  for (const id of en) if (!ko.includes(id)) problems.push(`ko/${name}: "${id}" is not translated`);
  for (const id of ko) if (!en.includes(id)) problems.push(`ko/${name}: "${id}" has no English entry`);
}

/* ── 3. the project files mirror one another ───────────────────────────── */

function walk(dir, base = dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, base));
    else if (name.endsWith('.mdx')) out.push(relative(base, full));
  }
  return out;
}

const enProjects = walk(join(ROOT, 'src/content/projects')).sort();
const koProjects = walk(join(ROOT, 'src/content/ko/projects')).sort();

for (const f of enProjects) if (!koProjects.includes(f)) problems.push(`ko/projects/${f} is missing`);
for (const f of koProjects) if (!enProjects.includes(f)) problems.push(`ko/projects/${f} has no English original`);

/* ── report ────────────────────────────────────────────────────────────── */

if (problems.length) {
  console.error('\ncheck-i18n: the two languages have drifted apart\n');
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-i18n: ${enProjects.length} projects and 3 data files mirrored, every string in both languages`,
);
