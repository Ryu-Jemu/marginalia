# marginalia

An annotated-document portfolio. Every claim in the running text carries its
evidence in the margin: the commit that shows it, the condition it was measured
under, and what it does not establish.

## The rule that governs everything else

**A number without its condition is not publishable here.** This is enforced, not
just intended — `src/content.config.ts` refines the `notes` schema so a
`measurement` without `condition`, a `commit` without `commit`, or a `source`
without `href` fails the build. Verified: adding an unconditioned metric produces
`InvalidContentEntryDataError`.

`scripts/check-claims.mjs` is the second gate, for phrasing the schema cannot see.

## Development

Dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.

Before every commit: `npm run verify` (astro check + claim gate + note gate).

## Source of truth for content

Measured 2026-08-13 against the local repositories. These figures win over any
older résumé, cover letter, or the previous portfolio site.

- Dartoo automated tests: **319** = ingestion 110 · notification 156 · disclosure 53
- EventPublisher defect: **959** rows persisted vs **805** events published = **154** missing.
  After the fix, the same E2E run produced 3,948 = 3,948
- crime-analysis: OLS **R² 0.843** (adj. 0.801), VIF < 5 for every variable,
  population p=0.001 · entertainment venues p<0.001
- network-pricing: PPO vs Max-Price — m=1 **+2.1% (p=0.472, n.s.)** / m=3 +105.8% /
  m=5 +195.8% / m=10 +363.2%. eMBB retention 88.8% vs 3.3%.
  **97% of the m=3 revenue gap comes from eMBB alone.** Myopic-PPO (γ=0) is
  indistinguishable from Max-Price at every m. TD3 −6.5%. PPO ≈ SAC (p=0.938)
- MAP Flutter client: 39/195 on the shared `origin/develop` branch

## Never write these

| Forbidden | Why, and what to write instead |
|---|---|
| "recovered 2,067 records" | 2,067 is the count of accumulated NOT_READY failure *logs*, not a recovery. Write: four disclosures classified as permanent failures returned normal responses a week later; a re-fetch experiment falsified the classification |
| "zero-loss" / "lossless" with no condition | "Under that E2E verification condition, zero events were missing (3,948 = 3,948)" |
| commit ratios per repository | They swing 14%–89% depending on branch and git identity — indefensible in an interview. Attribute by **service or repository owned** instead |
| "180s → 30s (83.3%)", "ETL 94%" | No code evidence exists. Delete |
| "built the CI/CD pipeline", "operated a Kubernetes cluster / Envoy gateway", "ran monitoring" | Own audit records these as *not done*. Kubernetes scope: "wrote deployment manifests and fixed config reference errors" |
| "second author" (IEEE TAI) | The author list puts him **4th of 7**. Encoded as `authorPosition: {index, of}` so it cannot be mistyped |
| `LIVE` | `Deployed`. Deployed is not operated — no uptime, SLO, availability or traffic claims |
| "high availability", "large-scale traffic", "finance domain expert" | Delete |

**Attribution precision.** sha256 idempotency keys, the 10-step notification
orchestration and the 7-day TTL DLQ belong to the **notification** service only.
The Redis Lua atomic counter belongs to **summary** only. MAP's cache is **two**
tiers (L1 Redis + prefetch), not three. MAP's agent has **0 tests** at v0.0.1-poc.
MAP's BFF auth is an `AuthPlaceholder` and incomplete. BP-LLM has **no evaluation
metrics implemented**, so no accuracy claim of any kind.

**Never publish** a phone number, date of birth, or home address.

## Conventions

- All site copy is in English.
- Conventional Commits, in English. No AI co-author trailers.
- Build one thing, render it, look at it, adjust, then commit. Not all at once.
