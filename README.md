# marginalia

**Ryu Jemu's portfolio — an annotated document.** Live at
[ryu-jemu-marginalia.onrender.com](https://ryu-jemu-marginalia.onrender.com),
in [English](https://ryu-jemu-marginalia.onrender.com/) and
[Korean](https://ryu-jemu-marginalia.onrender.com/ko/).

It covers two data pipelines carrying a mobile product each, two papers, and
two statistical studies. Every claim in the running text carries its evidence
in the margin beside it: what was measured, and the condition it was measured
under.

The premise is that a portfolio is read by someone looking for a reason to stop
reading. Asking that reader to take a number on trust — and then go somewhere
else to check it — is the moment that costs you. So the condition sits next to
the figure.

## What is on it

| | |
|---|---|
| §1 Data pipelines | **Dartoo** — a regulatory-filing pipeline, four of six services owned. **MAP** — a travel itinerary pipeline behind one gateway, six services owned. Each opens on its own page with the architecture, the mechanisms that hold it up, and the defects found and fixed, stated as symptom → cause → fix. |
| §2 Research | A first-author paper at KIPS ASK 2026 that took a silver award, and Section III.E of a survey under review at IEEE TAI. Each paper page carries the build behind it and the manuscript itself. |
| §3 Data analysis | Seoul crime across 25 districts, and eighteen years of multiplex revenue. Both figures are recomputed from the studies' own data rather than copied out of a report. |
| §4 More work | Services, coursework and prototypes, listed as they stand. |
| §5 About | The path here as a timeline, the awards and certifications along it, and what else I do. |

## The rule that governs the rest

**A number without its stated condition does not publish.** That is enforced,
not intended. [`src/content.config.ts`](src/content.config.ts) refines the note
schema so a `measurement` without a `condition` or a `source` without a link
fails the build:

```
[InvalidContentEntryDataError] notes → … data does not match collection schema.
  condition: a `measurement` note requires `condition`
```

Three gates run before every build:

- `scripts/check-claims.mjs` — rules in English and Korean, each derived from a
  claim that appeared in an earlier CV and did not survive being checked against
  the repositories. Content files are read line for line; in source files a
  comment explaining why a phrase is banned is not itself a claim.
- `scripts/check-notes.mjs` — refuses a duplicate note id, a reference to a note
  that does not exist, and a note no claim cites.
- `scripts/check-i18n.mjs` — refuses a string that exists in one language only,
  a placeholder that survives on one side and not the other, and a project or
  note that has not been mirrored.

## Two languages, one document

`/` is English and `/ko/` is Korean, mirrored route for route, with a switch in
the bar that works without JavaScript. What the site says in its own voice is in
`src/i18n/`; what the *work* says is in `src/content/` with a Korean mirror
beside it. Both sides load through one set of schemas, so a measurement carries
its condition in either language.

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
│   ├── research.yaml · record.yaml
│   └── ko/                  the same four, in Korean
├── i18n/                    ui.ts (the site's own voice) · viz.ts (words in figures)
├── components/
│   ├── pages/               Home · Work · Paper — one component per route, per language
│   ├── note/                N.astro (marker + note) · NoteLines.astro (overlay)
│   └── viz/                 every figure, drawn in code
├── pages/                   four-line wrappers that pick the language
├── scripts/                 note-lines · viz · deck · nav · controls · observe · motion
└── styles/                  tokens · base · document · print
```

A marker and its note are emitted as **adjacent siblings**, so pairing is
`ref.nextElementSibling` — no ids to collide, and a screen reader meets the note
where the claim is. The numbering is a CSS counter, correct without JavaScript.

Notes float into the margin above 64rem. Below that, with scripting off, or when
the reader moves them, they return to the flow — which is also what print does,
as real footnotes.

### The figures

Sixteen diagrams, drawn in code rather than exported from anywhere — the
pipeline each product runs on, the architecture with the parts I built marked,
the two lanes of the Dartoo defect, the MAP write race before and after the
rule, the paper's uplift by churn sensitivity, the crime regression with the
variable it ruled out, the residual choropleth, and every plate reproducing a
published figure or table from the two papers.

No paper figure is served as an image. Each is rebuilt from the manuscript's own
published values, so the numbers on the page and the numbers in the paper are
the same numbers.

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

`public/og.png` and `public/og-ko.png` are the share cards, rendered by the same
browser that renders the site from the same tokens, so they cannot drift away
from the page they point at. Regenerate them if the one-line introduction
changes.

## Size

The whole JavaScript bundle, anime.js included, is 14.5 KB gzipped.
