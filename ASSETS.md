# Files the site serves

Drop a file in and it appears; leave it out and the entry is skipped with a
warning at build time. Nothing here breaks the build by being absent —
`npm run build` prints every reference it could not resolve.

## In place

| Path | Source |
|---|---|
| `public/papers/ask-2026.pdf` | `KIPS_C2026A0229F.pdf`. Verified as the ASK 2026 paper: first of two authors, C2026A0229, and every figure in the site's text matches its abstract. Embedded on `/research/ask-2026/` |
| `src/assets/projects/dartoo/screen-{start,home,disclosure,company,chat}.png` | five product captures |
| `src/assets/projects/map/screen-{home,itinerary,place}.png` | three product captures |

The crime residual map and the multiplex figures are **not** images. They are
generated from the studies' own data — `CrimeResiduals.astro` from
`seoul.geojson` plus a refit of the original OLS, `CinemaTrend.astro` and
`CinemaCorrelation.astro` from the box-office series and the regional tables —
so the plate and the sentence beside it cannot drift apart.

## Withheld on purpose

`85631451-….pdf`, the IEEE TAI submission, is **not** in this repository and
should not go into it. It is the review-portal build: it carries the response
letter to the reviewers and the editor's comments in the same file, and the
repository is public. It now sits outside the project as
`Portfolio/IEEE_TAI_survey_리뷰제출본_비공개.pdf`.

If the manuscript should be readable on the site, a clean author version — the
manuscript body only, no portal header, no response letter — can be dropped at
`public/papers/ieee-tai-survey.pdf` and the entry re-added to
`src/content/research.yaml`.

## Still open

Figures, into `src/assets/papers/`. PNG, JPG or WebP; a screenshot out of the
PDF at full width is fine, they are re-encoded and resized at build time.

| File | What it should show |
|---|---|
| `ask-2026-uplift.png` | Figure 2(a) — net reward by churn multiplier |
| `ask-2026-slice.png` | Figure 2(b) — the algorithm comparison at m = 1 |
| `ieee-tai-beam-architecture.png` | The reprogramming architecture from Section III.E |
| `ieee-tai-prompt.png` | The prompt-as-prefix conditioning figure |
| `bp-llm-loss.png` | The training loss curve over ten epochs |

Product captures, into `src/assets/projects/map/`: the camera recognition
screen. The vision service is listed among the six owned and is the one surface
with no picture of it.
