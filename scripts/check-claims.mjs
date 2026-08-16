#!/usr/bin/env node
/**
 * The second gate.
 *
 * The content schema already refuses a measurement with no stated condition.
 * This catches the other failure: phrasing that overstates what was actually
 * done. Every rule below corresponds to a claim that appeared in an earlier
 * CV or portfolio and did not survive checking against the repositories.
 *
 * Each rule carries its reason, so a failure teaches rather than just blocks.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIRS = ['src/content', 'src/pages', 'src/components', 'src/layouts', 'src/i18n'];
const EXTS = new Set(['.md', '.mdx', '.yaml', '.yml', '.astro', '.ts', '.js', '.json']);

const RULES = [
  {
    id: 'recovered-2067',
    // Only fires when 2,067 is tied to a recovery or loss claim — the number
    // itself is fine to discuss as what it is.
    re: /\b2,?067\b(?=[^.]{0,120}\b(recover|restor|salvag|retriev|lost|loss|missing)\w*)|(?<=\b(recover|restor|salvag|retriev)\w{0,4}\b[^.]{0,120})\b2,?067\b/i,
    why: '2,067 is the count of accumulated NOT_READY failure logs, not records recovered.',
    instead:
      'Four disclosures classified as permanent failures returned normal responses a week later; a re-fetch experiment falsified that classification.',
  },
  {
    id: 'unconditioned-zero-loss',
    re: /\b(zero[- ]loss|lossless|no data loss|nothing was lost|zero events? (?:were )?lost)\b/i,
    exempt: /\b(under|during|within|for) (that|this|the) [^.]{0,60}(run|condition|verification|fixture)/i,
    why: 'A loss claim with no stated scope reads as a durability guarantee.',
    instead: 'Under that E2E verification condition, zero events were missing (3,948 = 3,948).',
  },
  {
    id: 'commit-ratio',
    re: /\b\d{1,3}\s?%\s+of\s+(the\s+)?commits?\b|\bcommit (ratio|share|percentage)\b|\b\d+\s*\/\s*\d+\s+commits?\b/i,
    // Saying why the figure is untrustworthy is the opposite of claiming it.
    exempt: /\b(never|not|rather than|instead of|cannot|unstable|swings?|moves between|depending on)\b/i,
    why: 'Commit share swings between 14% and 89% depending on branch and git identity, so it cannot be defended in an interview.',
    instead: 'Attribute by the service or repository owned, under Scope.',
  },
  {
    id: 'unevidenced-speedups',
    re: /\b83\.3\s?%|\b180\s?(seconds|s)\b[^.]{0,40}\b30\s?(seconds|s)\b|\bETL[^.]{0,20}\b94\s?%/i,
    why: 'No code or measurement backs these figures.',
    instead: 'Remove them.',
  },
  {
    id: 'built-ci',
    re: /\b(built|set up|created|implemented|owned|designed)\b[^.]{0,60}\bCI\/?CD?\b|\bCI\/CD\b[^.]{0,40}\b(pipeline)\b[^.]{0,30}\b(built|set up)\b/i,
    exempt: /\b(did not|never|no|without)\b[^.]{0,40}\bCI\/?CD?\b/i,
    why: 'The repository audit records the CI/CD pipeline as not done.',
    instead: 'List it under "what I did not own".',
  },
  {
    id: 'operated-k8s',
    re: /\b(operat|ran|running|manag)\w*\b[^.]{0,50}\b(Kubernetes|K8s|Envoy)\b|\b(Kubernetes|K8s)\s+cluster\b[^.]{0,40}\b(operat|ran|manag)\w*/i,
    exempt: /\b(did not|never|have not|not)\b[^.]{0,60}\b(Kubernetes|K8s|cluster)\b/i,
    why: 'The self-assessment is "wrote deployment manifests and fixed config reference errors".',
    instead: 'State the manifest-level scope explicitly.',
  },
  {
    id: 'second-author',
    re: /\b(second|2nd)\s+author\b/i,
    why: 'The IEEE TAI author list places him 4th of 7.',
    instead: 'Use research.yaml authorPosition {index, of}, which renders the position mechanically.',
  },
  {
    id: 'live-status',
    re: /\bLIVE\b/,
    exempt: /\bLIVE\b(?=[^\n]{0,20}(?:test|fixture))/,
    why: 'Deployed is not operated. "Live" implies something is being kept up.',
    instead: 'Deployed.',
  },
  {
    id: 'operations-metrics',
    re: /\b(uptime|SLOs?|SLAs?)\b|\b99\.\d+\s?%/i,
    why: 'Nothing here is operated, so there are no availability figures to report.',
    instead: 'Remove.',
  },
  {
    id: 'scale-claims',
    re: /\b(high[- ]availability|highly available|large[- ]scale traffic|high[- ]traffic|production[- ]scale|enterprise[- ]grade|domain expert)\b/i,
    why: 'None of these were measured, and student projects do not support them.',
    instead: 'Describe the mechanism instead of the scale.',
  },
  {
    id: 'bp-llm-accuracy',
    re: /\b(beam prediction|BP-LLM)\b[^.]{0,80}\b(accuracy|top-?k|precision|achiev)\w*/i,
    why: 'BP-LLM has no evaluation metrics implemented; there is no accuracy to report.',
    instead: 'Report only the training loss and state that evaluation is not implemented.',
  },
  /* ── the same rules, in Korean ─────────────────────────────────────────
   * A gate that only reads English would let the Korean mirror say anything.
   * These are the claims that mattered enough to be banned in the first place,
   * written the way they would actually appear in Korean copy. */
  {
    id: 'ko-second-author',
    re: /제\s?2\s?저자|공동\s?제\s?1\s?저자/,
    why: 'The IEEE TAI author list places him 4th of 7.',
    instead: 'authorPosition {index, of} renders the position mechanically.',
  },
  {
    id: 'ko-zero-loss',
    re: /무손실|손실\s?없이|유실\s?없이|누락\s?없이/,
    exempt: /(조건|검증|해당|그)\s?(에서|하에서|기준)/,
    why: 'A loss claim with no stated scope reads as a durability guarantee.',
    instead: '해당 E2E 검증 조건에서 누락 이벤트 0건 (3,948 = 3,948).',
  },
  {
    id: 'ko-operations-metrics',
    re: /가동률|무중단|고가용성|대규모\s?트래픽|\bSLAs?\b|\bSLOs?\b/,
    why: 'Nothing here is operated, so there are no availability figures to report.',
    instead: 'Remove.',
  },
  {
    id: 'ko-built-infra',
    re: /(CI\/?CD|파이프라인)[^.]{0,20}구축|쿠버네티스[^.]{0,20}(운영|구축|관리)|모니터링[^.]{0,10}운영/,
    exempt: /(않|없|미수행|아님)/,
    why: 'The repository audit records CI/CD and cluster operation as not done.',
    instead: '배포 매니페스트 작성과 설정 참조 오류 수정까지가 실제 범위.',
  },
  {
    id: 'ko-bp-llm-accuracy',
    re: /(빔\s?예측|BP-LLM)[^.]{0,60}(정확도|성능\s?달성|달성했)/,
    why: 'BP-LLM has no evaluation metrics implemented; there is no accuracy to report.',
    instead: '학습 손실만 보고하고, 평가는 구현되지 않았음을 함께 적는다.',
  },
  {
    id: 'ko-domain-expert',
    re: /금융\s?도메인\s?(전문가|전문성)|데이터\s?전문가/,
    why: 'None of these were measured, and student projects do not support them.',
    instead: 'Describe the mechanism instead.',
  },
  {
    id: 'sensitive-personal-data',
    re: /\b01[016789]-?\d{3,4}-?\d{4}\b|\b(19|20)\d{2}[-.]\d{2}[-.]\d{2}\b(?=[^\n]{0,30}(born|birth|dob))/i,
    why: 'A phone number, date of birth or home address must never appear on the site.',
    instead: 'Remove. Contact is the email address only.',
  },
];

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTS.has(extname(name))) out.push(full);
  }
  return out;
}

/**
 * Content files are checked line for line — everything in them is published.
 * In source files, a comment explaining why a phrase is banned is not a claim,
 * so comment lines are skipped there. YAML is content, so its `#` lines still
 * count.
 */
const CONTENT = new Set(['.md', '.mdx', '.yaml', '.yml']);
const isSourceComment = (file, line) =>
  !CONTENT.has(extname(file)) && /^\s*(\{\s*\/\*|\/\/|\/\*|\*(?!\/)|\*\/|<!--)/.test(line);

const files = DIRS.flatMap((d) => walk(join(ROOT, d)));
const violations = [];

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (isSourceComment(file, line)) return;
    for (const rule of RULES) {
      const m = line.match(rule.re);
      if (!m) continue;
      if (rule.exempt && rule.exempt.test(line)) continue;
      violations.push({
        file: relative(ROOT, file),
        line: i + 1,
        match: m[0].trim(),
        rule,
        text: line.trim().slice(0, 110),
      });
    }
  });
}

if (violations.length === 0) {
  console.log(`check-claims: ${files.length} files, no violations`);
  process.exit(0);
}

console.error(`\ncheck-claims: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule.id}]  matched "${v.match}"`);
  console.error(`    ${v.text}`);
  console.error(`    why:     ${v.rule.why}`);
  console.error(`    instead: ${v.rule.instead}\n`);
}
process.exit(1);
