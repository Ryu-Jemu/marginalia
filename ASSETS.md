# Files the site serves

Drop a file in and it appears; leave it out and the entry is skipped with a
warning at build time. Nothing here breaks the build by being absent —
`npm run build` prints every reference it could not resolve.

## In place

| Path | Source |
|---|---|
| `public/papers/ask-2026.pdf` | `KIPS_C2026A0229F.pdf`. Verified as the ASK 2026 paper: first of two authors, C2026A0229, and every figure in the site's text matches its abstract. Embedded on `/research/ask-2026/` |
| `src/assets/projects/dartoo/screen-{start,home,disclosure,company,chat}.png` | five product captures |
| `src/assets/analysis/crime/residual-map.png` | `[쿠킹]_분석 자료/result.png`, the browser window cropped away and the frame closed on Seoul. The folium output of `visualization.py` |
| `src/assets/analysis/crime/correlation-heatmap.png` | produced by running the study's own `value_heatmap.py` against its own `merged.csv`. The script ends in `plt.show()`, so nothing was ever written to disk — this is that plate, saved rather than shown |
| `src/assets/analysis/cinema/*.png` | seven outputs copied unchanged from `비즈니스애널리틱스개론/`: `Comparison of Revenue by Year`, `Number&Share_03` (CGV), `Consumtion&Share_Analysis`, `CGV 지역별 인구대비 영화관 수`, `Scatter&Trendline`, `RE_CGV` (the later of the two word-cloud runs), and a screenshot of `(map_with_clustered_markers).html` |
| `src/assets/projects/map/screen-{signin,home,itinerary,place}.png` | four product captures. `screen-signin.png` is `iPhone 17 Pro.png` with the supplied device frame and cut-out cropped away — the deck draws its own, and two frames read as a screenshot of a screenshot. `screen-home.png` is `홈화면.png`, trimmed at the last row that carries anything |

Those analysis plates are the studies' **own** output, shown as they came out
of matplotlib and folium. They are separate from the site's redrawn figures
below, which exist so the plate and the sentence beside it cannot drift apart.

The crime residual map and the multiplex figures rendered in the running text
are **not** images. They are
generated from the studies' own data — `CrimeResiduals.astro` from
`seoul.geojson` plus a refit of the original OLS, `CinemaTrend.astro` and
`CinemaCorrelation.astro` from the box-office series and the regional tables —
so the plate and the sentence beside it cannot drift apart.

## Withheld on purpose

The two coursework folders carry **live API credentials in plaintext** — a Naver
Search client id and secret in `(text_analysis).py`, and a Kakao REST key in
`Array_adress.py` and `(spot).py`. None of it is in this repository and none of
it may enter it. The keys should be rotated at the provider.


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
