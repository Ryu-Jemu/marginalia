# Files to add

Drop a file in and it appears; leave it out and the entry is skipped with a
warning at build time. Nothing here breaks the build by being absent.

Filenames are matched exactly — `npm run build` prints every reference it could
not resolve.

## 1 — Papers (`public/papers/`)

| File | What it is |
|---|---|
| `ask-2026.pdf` | The ASK 2026 paper, C2026A0229. Rendered inline on `/research/ask-2026/` |
| `ieee-tai-survey.pdf` | The IEEE TAI manuscript. Rendered inline on `/research/ieee-tai-survey/` |

If the TAI manuscript should not be published while it is under review, say so
and the entry comes out — the page works without it.

## 2 — Paper figures (`src/assets/papers/`)

PNG, JPG or WebP. A screenshot out of the PDF at full width is fine; they are
re-encoded and resized at build time.

| File | What it should show |
|---|---|
| `ask-2026-uplift.png` | The revenue-uplift-by-churn-sensitivity figure |
| `ask-2026-slice.png` | The revenue decomposition by slice |
| `ieee-tai-beam-architecture.png` | The reprogramming architecture from Section III.E |
| `ieee-tai-prompt.png` | The prompt-as-prefix conditioning figure |
| `bp-llm-loss.png` | The training loss curve over ten epochs |

## 3 — App screens (`src/assets/projects/`)

Only three exist. Each one becomes a phone mockup, so a full-screen capture with
no device frame of its own is what works.

| Where | What is missing |
|---|---|
| `dartoo/` | A filing detail view, and a push notification arriving |
| `map/` | The generated itinerary with the route drawn, the map view, and the camera recognition screen |

## 4 — Analysis figures (`src/assets/analysis/`)

The two charts on the page are drawn in code from figures that are in the
content. These would be images.

| File | What it should show |
|---|---|
| `crime-residuals.png` | The residual choropleth by district — the map that names where the model is wrong |
| `crime-correlation.png` | The correlation heatmap, if it exists |
| `cinema-revenue.png` | The multiplex study's headline chart |
| `cinema-region.png` | Its regional breakdown |

The multiplex study currently has no figures of its own on the site, because no
verified numbers from it were available to draw one from. A chart image, or the
numbers behind one, would let it stand next to the Seoul study rather than being
a line in a list.
