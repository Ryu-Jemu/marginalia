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
    /**
     * Where the deployment stands right now. `offline` is its own state: the
     * service was deployed and demonstrated and its servers are powered down,
     * which is not the same claim as "running".
     */
    hosting: z.enum(['offline', 'reachable', 'none']).default('none'),
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
     * The pipeline drawn as it is: a row of stages, each naming the service
     * that runs it and the store it writes to, with the feeds that supply it.
     */
    pipeline: z
      .object({
        from: z.string(),
        to: z.string(),
        feeds: z.array(z.string()).default([]),
        stages: z.array(
          z.object({
            name: z.string(),
            service: z.string(),
            store: z.string().optional(),
            /** Stages where a model is called are drawn in the accent. */
            model: z.boolean().default(false),
          }),
        ),
      })
      .optional(),
    /**
     * The system as designed: who supplies it, what runs, who consumes it,
     * and which of those I built. Separate from `pipeline`, which is about a
     * record's journey rather than about ownership.
     */
    architecture: z
      .object({
        externalLabel: z.string().optional(),
        external: z.array(z.object({ name: z.string() })),
        services: z.array(
          z.object({ name: z.string(), detail: z.string().optional(), mine: z.boolean().default(false) }),
        ),
        clients: z.array(z.object({ name: z.string(), mine: z.boolean().default(false) })),
        stores: z.array(z.string()).default([]),
      })
      .optional(),
    /** Bullets — what the thing is, in four lines or fewer. */
    summary: z.array(z.string()).default([]),
    /** What keeps the pipeline standing up: the mechanisms, not the intentions. */
    safety: z
      .array(z.object({ title: z.string(), detail: z.string() }))
      .default([]),
    /** Automated test counts by surface. */
    verification: z
      .array(z.object({ surface: z.string(), count: z.number(), detail: z.string().optional() }))
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
    /** What I did on it, as bullets. Separate from what the paper says. */
    role: z.array(z.string()).default([]),
    /** What the paper found, as bullets. */
    findings: z.array(z.string()).default([]),
    method: z.array(z.string()).default([]),
    /**
     * Readable material held on the site itself.
     *
     * `pdf` resolves against /public (put the file at public/papers/<name>);
     * `figure` resolves against src/assets/papers via a glob, so it is
     * optimised at build time. A material whose file is missing is skipped
     * rather than failing the build — the page has to survive the gap between
     * writing the entry and adding the file.
     */
    materials: z
      .array(
        z.object({
          kind: z.enum(['pdf', 'figure', 'poster', 'link']),
          src: z.string(),
          label: z.string(),
          caption: z.string().optional(),
        }),
      )
      .default([]),
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
