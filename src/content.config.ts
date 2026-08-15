import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
// `z` from 'astro:content' is deprecated and slated for removal; astro/zod is
// the supported import in Astro 7.
import { z } from 'astro/zod';

/* ── notes ────────────────────────────────────────────────────────────────
 * Every figure in the running text resolves to an entry here. The refinement
 * below is the rule expressed as code: a measurement without a stated
 * condition fails the build.
 * ------------------------------------------------------------------------ */
const notes = defineCollection({
  loader: file('./src/content/notes.yaml'),
  schema: z
    .object({
      id: z.string(),
      kind: z.enum(['measurement', 'source', 'scope']),
      /** Kept to 1–2 sentences: a long note derails screen-reader narration. */
      body: z.string().max(240),
      /** Required for `measurement`. What was measured, and how. */
      condition: z.string().optional(),
      href: z.url().optional(),
      project: reference('projects').optional(),
    })
    .refine((n) => n.kind !== 'measurement' || !!n.condition, {
      message: 'a `measurement` note requires `condition`',
      path: ['condition'],
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
    /** Drives which section the entry renders in. */
    domain: z.enum(['pipeline', 'research', 'analysis', 'other']),
    tier: z.union([z.literal(1), z.literal(2)]),
    order: z.number(),
    stack: z.array(z.string()),
    links: z
      .array(
        z.object({
          kind: z.enum(['repo', 'deployed', 'org', 'paper', 'doc']),
          href: z.url(),
          label: z.string(),
        }),
      )
      .default([]),
    /** Attribution by surface, never by commit ratio. */
    ownership: z.object({
      owned: z.array(z.string()),
      notOwned: z.array(z.string()),
    }),
    /**
     * The figures the project is measured in. Rendered as a panel, so what the
     * thing moved and how much of it is visible before any prose is read.
     */
    data: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          detail: z.string().optional(),
        }),
      )
      .default([]),
    /**
     * Defects I found and fixed, each stated as symptom → cause → fix. This is
     * the part of the work that is checkable, so it gets the room.
     */
    fixes: z
      .array(
        z.object({
          title: z.string(),
          area: z.string(),
          symptom: z.string(),
          cause: z.string(),
          fix: z.string(),
        }),
      )
      .default([]),
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
    status: z.enum(['accepted', 'under-review', 'revision', 'assisting']),
    date: z.string(),
    /** The specific part of a multi-author work that is his. */
    contribution: z.string().optional(),
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
    href: z.url().optional(),
    notes: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, projects, research, record };
