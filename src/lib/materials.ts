import { existsSync } from 'node:fs';

/**
 * Resolving the material a paper is shown with.
 *
 * Figures are imported through a glob so Astro optimises them; PDFs are served
 * from /public and checked on disk. Either way a material whose file has not
 * been added yet is dropped rather than failing the build — the record of a
 * paper is written before its file arrives, and a half-finished asset folder
 * must not take the site down.
 *
 * Missing files are reported once at build time so the gap is visible in the
 * log instead of only on the page.
 */

const FIGURES = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/papers/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true },
);

const figureByName = new Map<string, ImageMetadata>(
  Object.entries(FIGURES).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

/* Resolved against the project root rather than this module's own URL: in the
   build the module is a bundled chunk somewhere else entirely, and the check
   silently reported every file missing. */
const PUBLIC = `${process.cwd()}/public`;

export interface Material {
  kind: 'pdf' | 'figure' | 'poster' | 'link';
  src: string;
  label: string;
  caption?: string;
}

export type ResolvedMaterial =
  | { kind: 'figure' | 'poster'; label: string; caption?: string; image: ImageMetadata }
  | { kind: 'pdf' | 'link'; label: string; caption?: string; href: string };

const missing = new Set<string>();

export function resolveMaterials(items: Material[]): ResolvedMaterial[] {
  const out: ResolvedMaterial[] = [];
  for (const m of items) {
    if (m.kind === 'figure' || m.kind === 'poster') {
      const image = figureByName.get(m.src);
      if (!image) {
        missing.add(`src/assets/papers/${m.src}`);
        continue;
      }
      out.push({ kind: m.kind, label: m.label, caption: m.caption, image });
      continue;
    }
    if (m.kind === 'pdf') {
      if (!existsSync(`${PUBLIC}${m.src}`)) {
        missing.add(`public${m.src}`);
        continue;
      }
      out.push({ kind: 'pdf', label: m.label, caption: m.caption, href: m.src });
      continue;
    }
    out.push({ kind: 'link', label: m.label, caption: m.caption, href: m.src });
  }
  return out;
}

export function reportMissingMaterials(): void {
  if (missing.size === 0) return;
  console.warn(
    `\n[materials] ${missing.size} file(s) referenced but not present — the entries were skipped:\n` +
      [...missing].map((f) => `  · ${f}`).join('\n') +
      '\n',
  );
}
