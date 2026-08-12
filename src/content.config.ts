import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
// `z` from 'astro:content' is deprecated and slated for removal; astro/zod is
// the supported import in Astro 7.
import { z } from 'astro/zod';

/* ── notes ────────────────────────────────────────────────────────────────
 * Every claim on this site carries its evidence here. The refinements below
 * are the site's thesis expressed as code: a measurement without a stated
 * condition fails the build.
 * ------------------------------------------------------------------------ */
const notes = defineCollection({
  loader: file('./src/content/notes.yaml'),
  schema: z
    .object({
      id: z.string(),
      kind: z.enum(['measurement', 'commit', 'source', 'scope', 'limit']),
      /** Kept to 1–2 sentences: a long note derails screen-reader narration. */
      body: z.string().max(240),
      /** Required for `measurement`. What was measured, and under what conditions. */
      condition: z.string().optional(),
      /** Required for `commit`. */
      commit: z
        .string()
        .regex(/^[0-9a-f]{7,40}$/, 'commit must be a 7–40 char hex sha')
        .optional(),
      href: z.string().url().optional(),
      /** What this evidence does NOT establish. */
      limits: z.string().optional(),
      project: reference('projects').optional(),
    })
    .refine((n) => n.kind !== 'measurement' || !!n.condition, {
      message: 'a `measurement` note requires `condition`',
      path: ['condition'],
    })
    .refine((n) => n.kind !== 'commit' || !!n.commit, {
      message: 'a `commit` note requires `commit`',
      path: ['commit'],
    })
    .refine((n) => n.kind !== 'source' || !!n.href, {
      message: 'a `source` note requires `href`',
      path: ['href'],
    }),
});

/* ── projects ─────────────────────────────────────────────────────────────
 * `status` has no `live` member on purpose. Deployed is not operated.
 * ------------------------------------------------------------------------ */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    period: z.string(),
    team: z.string(),
    role: z.string(),
    status: z.enum(['deployed', 'in-progress', 'archived', 'on-hold']),
    tier: z.union([z.literal(1), z.literal(2)]),
    order: z.number(),
    stack: z.array(z.string()),
    links: z
      .array(
        z.object({
          kind: z.enum(['repo', 'deployed', 'org', 'paper', 'doc']),
          href: z.string().url(),
          label: z.string(),
          caveat: z.string().optional(),
        }),
      )
      .default([]),
    /** Attribution by surface, never by commit ratio. */
    ownership: z.object({
      owned: z.array(z.string()),
      notOwned: z.array(z.string()),
    }),
    decisions: z
      .array(
        z.object({
          decision: z.string(),
          why: z.string(),
          rejected: z.array(z.string()).default([]),
          notDone: z.array(z.string()).default([]),
          notes: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    boundaries: z.array(z.string()).default([]),
  }),
});

const research = defineCollection({
  loader: file('./src/content/research.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    venue: z.string(),
    /** Numeric so "second author" can never be written by hand. */
    authorPosition: z.object({ index: z.number().int().min(1), of: z.number().int().min(1) }),
    status: z.enum([
      'accepted',
      'under-review',
      'revision',
      'submission-in-progress',
      'assisting',
    ]),
    date: z.string(),
    manuscriptId: z.string().optional(),
    grant: z.string().optional(),
    award: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    notes: z.array(z.string()).default([]),
  }),
});

const record = defineCollection({
  loader: file('./src/content/record.yaml'),
  schema: z.object({
    id: z.string(),
    kind: z.enum(['award', 'certification', 'education', 'service', 'teaching', 'lab', 'writing']),
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    detail: z.string().optional(),
    score: z.string().optional(),
    href: z.string().url().optional(),
    notes: z.array(z.string()).default([]),
  }),
});

const boundaries = defineCollection({
  loader: file('./src/content/boundaries.yaml'),
  schema: z.object({
    id: z.string(),
    claim: z.string(),
    detail: z.string(),
    scope: z.string(),
  }),
});

export const collections = { notes, projects, research, record, boundaries };
