# marginalia

한국어 단일 포트폴리오. AI 활용 방식과 실제 서비스, 데이터 분석, 연구를
짧은 제목과 불릿으로 설명한다. 홈은 빠른 탐색, 상세는 기능·기여·구조·문제 해결에 집중한다.

## Current public policy

- `/`와 `/work/<slug>/`, `/research/<id>/`는 모두 한국어.
- `/ko/*`는 같은 내용의 기본 주소로 이동. JavaScript 이동에서 query와 hash 보존;
  JavaScript 없이도 기본 주소 링크와 자동 이동 제공.
- 영문 공개 페이지와 언어 전환 없음. 기존 섹션 앵커
  `pipelines`, `analysis`, `research`, `more`, `about` 유지.
- 날짜·기간·검증일·검사 통과 건수·커밋·감사 기록·공개 각주 제거.
  실제 앱 스크린샷의 달력과 외부 논문 원문은 예외.
- 조건 설명이 복잡한 성과 수치는 생략. 남는 분석 수치는 단위·비교 조건 유지.
  측정값은 임의 변경하거나 카운트업하지 않음.
- 본문은 명사구와 짧은 불릿 우선. 대표 서비스 홈 설명은 3개 불릿.
  기술 배지는 대표 프로젝트 상단의 공통 목록에 한 번만 표시하며 개별 홈 설명에서 반복하지 않는다.
  상세 아키텍처와 STAR 사례는 프로젝트 안에서 제공.
- STAR: 상황·목표·원인·조치·결과와 전후 흐름. 근거 없는 사례 생성 금지.
  소스 수정·회귀 재현·실제 운영 결과를 구분하고, AI 작업과 본인 판단 명시.
- 소개의 SWOT은 접힌 상태로 시작. 범주형 4분면, 임의 점수·등급 금지.
  보완 과제에는 다음 행동, 위험에는 대응 방법 연결.

## Structure and design

`src/content/projects.json`, `research.json`, `evidence.json`이 단일 컬렉션이다.
프로젝트와 연구는 공개 내용, evidence는 내부 근거다. `src/content.config.ts`가
측정 조건과 근거 참조 형태를 검사한다. 영한 대칭 콘텐츠를 추가하지 않는다.

`src/components/pages/`의 Home·Work·Paper가 공통 화면을 구성한다.
흰 배경·그라파이트 본문·회색 구획·블루 강조, 기본 콘텐츠 폭 1,120px(최대 1,200px).
홈은 소개를 맨 먼저 배치한다. 이름·개발 분야·핵심 이력 뒤에 대표 서비스 2개,
AI·분석·연구·기타 작업의 간결한 링크 목록을 제공한다.
메뉴·섹션 이름은 학력·경험·역량·기술·기여·구조처럼 한 단어의 명사로 표시한다.
학력과 연구실·조교 경험은 구분한다. 차트·사례 제목은 내용을 구별할 수 있는 구체적 표현을 유지한다.
전체 이력·AI 활용 방식·SWOT은 소개의 펼침 영역에 보존한다.
홈에 대형 슬로건·단계 도식·분류별 장표형 카드를 반복하지 않는다.
상세는 읽기용 본문과 목차. 아키텍처가 있는 프로젝트는 상단 가로 목차와 넓은 도식 영역,
연구는 작은 옆 목차를 사용한다. STAR는 첫 사례만 기본 펼침, 나머지는 선택해 탐색.
접힌 영역을 향한 hash 링크는 조상 details를 열고 해당 위치로 연결한다.
펼침 영역은 native `details`·`summary`를 유지하고 summary 높이는 최소 64px로 한다.
`DisclosureIndicator`는 40px 색상 표시 안의 +/−와 `펼치기`·`접기` 문구로 상태를 함께 전달한다.
브랜드 기술 배지는 클릭·선택 기능이 없는 정적 정보다. 홈에서는 기술·도구를 그룹으로,
상세에서는 요구사항·선택 이유·적용 내용을 연결해 표시한다. 출처·검증 메타데이터는 내부에만 유지한다.
Pretendard, 본문 데스크톱 17px·모바일 16px, 보조 설명 최소 14px.
폰 화면은 실제 원본 비율을 유지하며 하단 버튼·탭이 잘리지 않게 한다.
목업 배경은 투명. 기기 프레임·그림자만 유지하며, 경계선은 프로젝트와 설명 섹션 사이에 사용한다.
주요 구획은 2px 그라파이트+블루 강조, 항목 내부는 1px 회색.
아이콘은 같은 선 굵기의 SVG를 사용하고 기능 이름을 텍스트로 함께 제공한다.
아이콘의 선 색상은 블루·틸·바이올렛·앰버를 기능별로 제한 사용. 강조 버튼 안에서는 본문 색상 상속.
클라우드 활용은 MAP의 별도 환경 섹션에 표시하고, 코드 구성·현재 구성 중 작업과 실제 운영 성과를 구분한다.
아키텍처는 `src/data/architecture*.ts`의 경계·노드·방향 연결을 공통 SVG로 렌더링한다.
본인 구현·구성, 연동·개선, 외부·공동 기반을 구분하고 실제 배포와 논리 구성을 혼동하지 않는다.
모바일에서는 도식 내부만 가로 스크롤. `연결 상세`에 구성과 방향별 연결을 텍스트로 제공한다.
그 밖의 작업은 CareerRadar·StarIndex로 구성한다.
사용자 요청으로 Wealthy·Invader·F1 키오스크·공간 드로잉의 공개 항목과 상세 주소는 제거. 원본 저장소는 유지.
소개의 자격은 항목별 테두리와 여백으로 구분하며 클릭 요소처럼 표시하지 않는다.
화면 탐색은 버튼·키보드·스와이프, 자동 슬라이드 없음.
웹 프로젝트는 원본 앱을 실행해 캡처한 이미지와 `WebScreens`를 사용한다.
`src/data/web-screens.ts`에 이미지·설명 연결, 출처와 실행 범위는 내부 문서에 기록.
실제 UI의 선택 영역을 캡처하며 결과를 합성하거나 입력 화면을 결과 화면으로 소개하지 않는다.
원본 이미지 비율 유지, 프레임 모서리 18px·모바일 12px. 별도 배경 패널 없음.
분석 상세의 `StudyFigure`는 원본 값·단위·비교 조건, 접이식 수치 표를 함께 제공한다.
`PreparationFlow`는 입력 정제와 산출물을 연결한다. 공통 산출물은 원장·원본 데이터와
대조한 뒤 웹용으로 재구성하며 내부 출처는 `docs/*-sources.md`, `docs/analysis-source-audit.md`와 evidence에 유지한다.
서울 지도는 분석 입력 자료의 인구를 25개 자치구에 5구간 파란색으로 표시한다.
인구(명)·구간 범례·전체 수치 표·키보드 선택을 함께 제공하며 현재 인구나 인구밀도로 설명하지 않는다.
단일색 지리 범위 지도로 되돌리거나 범죄 타깃·잔차 값을 색상에 사용하지 않는다.
영화관 권역 상관은 원본 집계표 정합성 문제로 공개 제외. 워드클라우드는 비즈니스애널리틱스개론의
메가박스 원본 CSV를 사용하며 동명 하이브·코인 CSV와 혼동하지 않는다.
연구 차트는 학습 시드 간 편차와 평가 에피소드 간 편차를 구분하며 순보상을 실제 매출로 표시하지 않는다.

모션은 첫 등장·서비스 연결 그래픽·분야별 시각 기호·흐름·수동 화면 전환·목업 hover에 사용한다.
반복 그래픽은 IntersectionObserver와 탭 가시성으로 제어하고 화면 밖에서는 정지.
모션 끔·reduced-motion·JavaScript 없음에도 모든 내용과 완성된 도식이 보여야 한다.
스크롤 고정, 스크롤 강제 이동, 숫자 카운트업은 사용하지 않는다.

## Development and completion

```sh
npm run dev -- --background
npm run verify
npm run check
npm run build
```

`npx astro dev status`, `npx astro dev logs`, `npx astro dev stop`으로 서버 관리.
검사: claim 규칙, 내부 근거 연결, 한국어 문구·placeholder·참조,
검사 자체의 실패 사례, 타입, 생성 HTML의 메타데이터·링크·앵커.
`node scripts/check-notes.mjs --local`은 원본 저장소가 있는 환경의 추가 확인용이다.
CI에서는 외부 로컬 자료 경로의 존재를 요구하지 않는다.

화면 폭 1440·1024·768·390px에서 글자·차트·목업과 전체 가로 넘침 확인.
키보드, 화면 전환, SWOT, 모션 끔, reduced-motion, 기존 `/ko/` 링크 검수.
대표 구획을 먼저 렌더링하고 조정한 뒤 확장한다.
사용자의 최종 요청으로 공개 준비 평가·검수 후 Git commit과 origin/main push를 승인받았다.
Render는 commit 기반 자동 배포 설정을 사용한다. push 전 공개 문구·라우트·개인정보·빌드 검사를 완료한다.
기존 사용자 수정분과 원본 PDF·프로젝트 저장소를 보존한다.

## Internal source records (not public copy)

Dartoo and research measurements were checked on 2026-08-13. MAP source and
saved verification records were re-audited on 2026-09-20. Dates and audit scope belong only in internal evidence. Do not render them
as captions, notes, accessibility text or public metadata.

- Historical Dartoo count **319** = ingestion 110 · notification 156 · disclosure 53
  is withdrawn from publication. The later project ledger identifies helper
  definitions within the count. Do not replace it with another test total.
- Historical EventPublisher record: **959** rows persisted vs **805** events published = **154** missing.
  These figures and the following after-run figure are no longer public claims;
  the latest ledger did not recover raw execution evidence. Describe the
  source-supported cleanup and re-collection path instead.
  After the fix, one fixture-based E2E run produced 3,948 = 3,948.
  Compare the two counts within each run; the before and after inputs differ.
  These figures come from the user-confirmed 2026-08-13 portfolio measurement
  record. The September audit confirmed the publisher change but did not recover
  the raw execution logs. Do not add a claim that all requests returned 200,
  publishing stopped after exactly 805 events, or no logs existed.
- crime-analysis: the latest personal-repository ledger identifies duplicate
  summation of crime subtotals. Absolute crime counts and residual magnitudes
  must not be published. Show data integration, model comparison, input-variable
  correlations and the source population across 25 districts in five color bands.
  Include units, a legend, a data table and keyboard selection. A constant scaling of the target alone does not invalidate
  all regression statistics; avoid that overstatement too.
- network-pricing: PPO vs Max-Price — m=1 **+2.1% (p=0.472, n.s.)** / m=3 +105.8% /
  m=5 +195.8% / m=10 +363.2%. eMBB retention 88.8% vs 3.3%.
  **97% of the m=3 revenue gap comes from eMBB alone.** Myopic-PPO (γ=0) is
  indistinguishable from Max-Price at every m. TD3 −6.5%. PPO ≈ SAC (p=0.938)
- MAP: **93** focused regressions in the saved 2026-09-09 run (16 isolation,
  51 service, 9 consumer, 7 JobStore, 7 withdrawal, 3 Admin DLQ). Actual service,
  H2 JPA and encryption; Redis primitives use in-memory doubles. Not a current
  whole-repository total or a real-Redis end-to-end result.
- MAP source on 2026-09-20: **14** registered recommendation nodes; RS256 JWT BFF
  authentication. Historical `AuthPlaceholder` and zero-test PoC statements are
  not descriptions of the current source. Learning capture/export remain HOLD.
- MAP GCP test deployment: saved 2026-09-15 record of **1,962** read-only probes
  over 25 minutes, zero failures. Not a load test or availability guarantee.
  The 2026-09-17 NCP deployment is separate; newer develop code is not all deployed.
- Deep audit snapshot: Git/file collection at 2026-09-20 03:24 KST, with the
  saved GCP deployment record at 03:27 KST included. Latest saved NCP observation
  remains 2026-09-19. GCP and NCP revisions must be identified separately.
- Information Processing Engineer acquired 2026-09-11: user-confirmed date.
  The profile has five credentials. Awards and selections must remain distinct.

Latest content precedence:
- Source files and the recent project ledger override older portfolio prose.
- Dartoo award: **최우수상**, not 대상. AI TOP 100: **개인 본선 진출**;
  distinguish this from AI ROOKIE 100 team selection.
- The App Store listing confirms MAP release. Do not infer operating results,
  availability or rollout of every local source change from that listing.
- ERAI partner-owned commerce work is not the candidate's contribution.
- `src/content/evidence.json` retains source references and scope internally.
  Never render or serialize its absolute paths, audit text or retired metrics.

## Never write these

| Forbidden | Why, and what to write instead |
|---|---|
| "recovered 2,067 records" | 2,067 is the count of accumulated NOT_READY failure *logs*, not a recovery. Write: four disclosures classified as permanent failures returned normal responses a week later; a re-fetch experiment falsified the classification |
| "zero-loss" / "lossless" with no condition | Describe the bounded implementation result; retired E2E counts remain unpublished |
| commit ratios per repository | They swing 14%–89% depending on branch and git identity — indefensible in an interview. Attribute by **service or repository owned** instead |
| "180s → 30s (83.3%)", "ETL 94%" | No code evidence exists. Delete |
| "built the CI/CD pipeline", "operated a Kubernetes cluster / Envoy gateway", "ran monitoring" | Own audit records these as *not done*. Kubernetes scope: "wrote deployment manifests and fixed config reference errors" |
| "second author" (IEEE TAI) | The author list puts him **4th of 7**. Encoded as `authorPosition: {index, of}` so it cannot be mistyped |
| `LIVE` | `Deployed`. Deployed is not operated — no uptime, SLO, availability or traffic claims |
| "high availability", "large-scale traffic", "finance domain expert" | Delete |

**Attribution precision.** sha256 idempotency keys, the 10-step notification
orchestration and the 7-day TTL DLQ belong to the **notification** service only.
The Redis Lua atomic counter belongs to **summary** only. MAP's cache is **two**
tiers (L1 Redis + prefetch), not three. MAP's shared-result defect is supported
by a regression reproduction; do not present it as a confirmed production leak.
Notification deduplication uses recorded event IDs and content hashes; do not
claim exactly-once delivery to a device. BP-LLM has **no evaluation
metrics implemented**, so no accuracy claim of any kind.

**Shared implementation.** Dartoo Summary includes teammate foundations and
provider extensions; describe the candidate's integration, normalisation and
counter improvements. Dartoo User contribution is internal APIs and notification
schema. Ingestion multi-target fan-out remains a separate feature branch.
MAP's initial User authentication/reuse cache and initial Vision implementation
were teammates' work. Describe subsequent isolation, consent and resource-limit
changes precisely. Flutter's initial screens/maps are shared team work; the
candidate connected APIs and improved data/auth/consent/error contracts.

`contributions[]` records feature-level work in project detail pages. Its context column records shared foundations or implementation status.
Architecture accent outlines mean implementation **or improvement**, not exclusive
service ownership. System diagrams identify connected components without implying exclusive ownership.

**Never publish** a phone number, date of birth, or home address.

## Conventions

- Site copy is authored directly in Korean. `scripts/check-i18n.mjs` checks
  Korean copy, placeholders, author order and project references.
- Korean copy is written as Korean, not as a translation: `word-break: keep-all`
  is set for it, technical terms Korean engineers write in English stay in
  English, and a figure label must not grow past the box it is drawn in.
- Preserve the desktop document layout. Small screens stack comparisons and
  scroll wide figures locally; never restrict the entire site to mobile width.
- Keep measured numbers fixed. Animate packet flow and explanatory stages;
  motion-off and reduced-motion states must show the completed diagram.
- Prefer short bullets and clear role/cause/result labels. Avoid manual line
  breaks; retain essential comparison conditions when compressing text.
- Conventional Commits, in English. No AI co-author trailers.
- Build one thing, render it, look at it, adjust, then continue. Commit or deploy
  only within the user-authorized scope.
