# Files the site serves

Drop a file in and it appears; leave it out and the entry is skipped with a
warning at build time. Nothing here breaks the build by being absent —
`npm run build` prints every reference it could not resolve.

## In place

| Path | Source |
|---|---|
| `public/papers/ask-2026.pdf` | `KIPS_C2026A0229F.pdf`. Verified as the ASK 2026 paper: first of two authors, C2026A0229, and every figure in the site's text matches its abstract. Embedded on `/research/ask-2026/` |
| `src/assets/projects/dartoo/screen-{start,home,disclosure,company,chat}.png` | five product captures |
| `src/assets/projects/map/screen-{signin,home,itinerary,place}.png` | four product captures. `screen-signin.png` is `iPhone 17 Pro.png` with the supplied device frame and cut-out cropped away — the deck draws its own, and two frames read as a screenshot of a screenshot. `screen-home.png` is `홈화면.png`, trimmed at the last row that carries anything |

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

## Redrawn instead of imported

No paper figure is served as an image. Each one is rebuilt as an SVG from the
manuscript's published values, so the numbers on the page and the numbers in
the paper are the same numbers and the plate takes the site's own ink.

| Component | Reproduces |
|---|---|
| `PricingChart.astro` | ASK Figure 2(a) — uplift by churn multiplier |
| `PricingAlgorithms.astro` | ASK Figure 2(b) — PPO 7,334 · SAC 7,370 · TD3 6,862 · Myopic-PPO 7,169 · Max-Price 7,183 |
| `BeamArchitecture.astro` | Section III.E — patch embed, reprogram, prefix, frozen backbone, projection |
| `BeamGain.astro` | TAI Figure 7 — all thirty published gain values |
| `BeamOverhead.astro` | TAI Table V — latency, memory, power, energy |
| `CrimeResiduals.astro` | Residual choropleth, from `seoul.geojson` and a refit of the OLS |
| `CinemaTrend.astro` · `CinemaCorrelation.astro` | Box-office series and the regional correlations |

The paper's error bars are deliberately not reproduced: their extents are not
printed, and reading them off a raster would be inventing precision. The one
interval the paper states, p = 0.938 between PPO and SAC, is drawn.

## Still open

Product captures, into `src/assets/projects/map/`: the camera recognition
screen — held for now at your request. The vision service is one of the six
owned and the only surface with no picture of it.

A clean author version of the IEEE TAI manuscript, if it should be readable
here — see **Withheld on purpose** above.
