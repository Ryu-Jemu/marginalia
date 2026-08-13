# marginalia

An annotated-document portfolio. Every claim in the running text carries its
evidence in the margin beside it: the commit that shows it, the condition it was
measured under, and what it does not establish.

The premise is that a portfolio is read by someone looking for a reason to stop
reading. Asking that reader to take a number on trust — and then go somewhere
else to check it — is the moment that costs you. So the condition sits next to
the figure, and [`/evidence`](src/pages/evidence.astro) indexes every claim on
the site in one table.

## The rule that governs the rest

**A number without its stated condition does not publish.** That is enforced,
not intended. [`src/content.config.ts`](src/content.config.ts) refines the note
schema so a `measurement` without a `condition`, a `commit` without a sha, or a
`source` without a link fails the build:

```
[InvalidContentEntryDataError] notes → … data does not match collection schema.
  condition: a `measurement` note requires `condition`
```

Two scripts run before every build:

- `scripts/check-claims.mjs` — twelve rules, each derived from a claim that
  appeared in an earlier CV and did not survive being checked against the
  repositories. Content files are read line for line; in source files a comment
  explaining why a phrase is banned is not itself a claim.
- `scripts/check-notes.mjs` — refuses a duplicate note id, a reference to a note
  that does not exist, and a note no claim cites.

## Running it

```bash
npm install
npm run dev        # astro dev  (add --background to detach)
npm run verify     # both gates
npm run build      # verify runs first, via prebuild
npm run preview    # serve the built output
```

Requires Node ≥ 22.12 (Astro 7). `.node-version` pins 24.14.1 to match Render.

## How it is put together

```
src/
├── content.config.ts        the schema that refuses an unconditioned number
├── content/
│   ├── notes.yaml           every piece of evidence on the site
│   ├── projects/            MDX; the body calls <N id="…" /> inline
│   └── research · record · boundaries .yaml
├── components/note/         N.astro (marker + note) · NoteLines.astro (overlay)
├── scripts/                 note-lines · boundaries · controls · observe · motion
└── styles/                  tokens · base · document · print
```

A marker and its note are emitted as **adjacent siblings**, so pairing is
`ref.nextElementSibling` — no ids to collide, and a screen reader meets the note
where the claim is. The numbering is a CSS counter, correct without JavaScript.

Notes float into the margin above 64rem. Below that, with scripting off, or when
the reader moves them, they return to the flow — which is also what print does,
as real footnotes.

### The figures

Five diagrams, drawn in code rather than exported from anywhere: the two lanes
of the Dartoo defect, the MAP write race before and after the rule, the paper's
uplift by churn sensitivity, the three route stages, and the crime regression
with the variable it ruled out.

Every one of them animates something the surrounding prose already states —
packets travel because the diagram is about packets not arriving, a bar grows
from the baseline it is measured against, a strike-through is drawn because the
variable failed. They take their colours from the same tokens as the text, and
they carry `role="img"` with a description rather than being hidden, because a
diagram that states a result is not decoration.

A wide figure uses the note column, so it has to clear any note already
floating there. Each `.column` is a block formatting context for that reason:
without it a note escaping one section made the next section's figure clear
notes it had nothing to do with, opening a 550px gap between the prose and its
own plate.

### The leader lines

A tall note under a short paragraph gets pushed down by `clear: right`, up to
about 104px away from its own marker on this content. A number alone does not
carry that distance, so a line is drawn from the marker to the note and the
note's own number is hidden while it is there.

The line leaves the marker, drops to the bottom of its own line box, runs along
the boundary between two lines, and turns down only after the column's right
edge — it is never inside the measure. Sampling every path at 1.5px intervals
against all rendered text lines: zero points fall inside one, at 1024, 1280,
1440 and 1600.

### Notes on anime.js 4.5.0

Two things cost time and are worth knowing:

- A drawable proxy **does not tween through `createTimeline().add()`** — it
  jumps to the target value. Measured on one path over 800ms: 96 distinct `draw`
  values via `animate()`, exactly 1 via the timeline. Sequencing uses `delay`.
- `createDrawable` only writes the initial `draw` when the element's
  `pathLength` is not already its normalised 1000, so calling it twice on one
  element silently skips initialisation. One proxy per path, built once.

Separately: `ResizeObserver` fires the moment you observe, and again for every
layout change the reveal itself causes. Rebuilding on those restarted the
geometry mid-draw and snapped every line to its finished state.

### Nothing hides content it cannot restore

Anything that hides content in order to animate it in has to answer for the case
where the reveal never fires. Every observation carries a 2500ms deadline, the
initial hidden state is set in JavaScript rather than CSS, and with scripting
disabled the page renders in full.

Verified clean across seven failure modes — normal scroll, a slam to the bottom
and back, `prefers-reduced-motion`, the motion control off, the control switched
off mid-reveal, a resize afterwards, and 6× CPU throttling — each reporting zero
hidden notes and zero half-drawn lines.

## Deployment

Render static site; see [`render.yaml`](render.yaml). `autoDeployTrigger: commit`
is set explicitly because its absence is what left the previous portfolio on
manual deploys.

## Size

The whole JavaScript bundle, anime.js included, is 14.5 KB gzipped.
