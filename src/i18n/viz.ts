/**
 * The words drawn inside the figures.
 *
 * Kept apart from `ui.ts` because a plate's labels are written to fit a box:
 * an axis title that runs two characters long in one language pushes a tick
 * off the edge of its viewBox, so these are chosen against the drawing rather
 * than translated in the abstract. Same contract as `ui.ts` — both sides or
 * neither.
 *
 * Two rules follow from the box. A Hangul syllable takes roughly 1.8× the
 * advance width of a Latin character at the same size, so the Korean side is
 * written as the shortest noun phrase that still says the thing — not as a
 * sentence-for-sentence translation. And a term Korean engineers write in
 * English anyway (R², p, OLS, VIF, PPO, MSE, epoch, ms, MB, W, and every model
 * or service name) stays in English on both sides: it is what a Korean reader
 * expects, and it keeps the label inside its plate.
 *
 * Numbers, formulae, code identifiers and enum values (`in_progress`,
 * `enabled = false`, `200 OK`, `Z = [Z prompt ; Z data]`) are left in the
 * components. They are not English — they are the thing itself.
 *
 * `aria-label` is the exception to the width rule: nothing draws it, so it is
 * a full sentence in both languages.
 */
export const vizStrings = {
  /* ── the multiplex scatters ────────────────────────────────────────── */
  'viz.sc.aria': [
    '{n} scatter panel(s) of {points} points each, {x} against {y}, with a least-squares fit on each. {stats}',
    '{x}와 {y}의 산점도 {n}개 패널입니다. 패널당 점 {points}개이며 각각 최소자승 적합선을 그렸습니다. {stats}',
  ],
  'viz.sc.share.x': ['screens in the region', '권역 내 상영관 수'],
  'viz.sc.share.y': ['regional share, %', '권역 점유율 %'],
  'viz.sc.share.foot': [
    '2020 · 8 regions · dashed where p > 0.05 · SEO GG ICN GW CC GS HN JJ',
    '2020년 · 8개 권역 · p > 0.05는 파선 · SEO GG ICN GW CC GS HN JJ',
  ],
  'viz.sc.cons.x': ['per-capita consumption, 만 원', '1인당 민간소비지출 만 원'],
  'viz.sc.cons.y': ['regional share, %', '권역 점유율 %'],
  'viz.sc.cons.foot': [
    '8 regions · every fit dashed: none reaches p < 0.05',
    '8개 권역 · 모든 적합선이 파선: 어느 해도 p < 0.05에 이르지 못함',
  ],
  'viz.sc.top20.screens': ['screens', '상영관 수'],
  'viz.sc.top20.seats': ['seats', '좌석 수'],
  'viz.sc.top20.x': ['screens · seats', '상영관 수 · 좌석 수'],
  'viz.sc.top20.y': ['admissions, 만 명', '연간 관객 만 명'],
  'viz.sc.top20.foot': [
    'the 20 busiest cinemas in 2023 · both fits significant, unlike every regional one',
    '2023년 관객 수 상위 20개 영화관 · 권역 단위와 달리 두 적합 모두 유의',
  ],
  'viz.sc.dist.title': ['228 districts', '228개 시군구'],
  'viz.sc.dist.x': ['district population, thousands', '시군구 인구 천 명'],
  'viz.sc.dist.y': ['cinemas', '영화관 수'],
  'viz.sc.dist.foot': [
    'Domestic_theater.xlsx, 2023 district sheet · one cinema per 102,250 people on the fit',
    'Domestic_theater.xlsx 2023년 시군구 시트 · 적합선 기준 인구 102,250명당 영화관 1곳',
  ],

  /* ── the keyword cloud, multiplex study ────────────────────────────── */
  'viz.words.aria': [
    'A word cloud of the fifty most frequent terms in blog posts about one multiplex chain, after stopword filtering. The six most frequent are {top}.',
    '불용어를 거른 뒤, 한 멀티플렉스 체인에 대한 블로그 글에서 가장 자주 나온 50개 단어입니다. 상위 여섯 개는 {top}입니다.',
  ],
  'viz.words.foot': [
    '{shown} of the top {total} terms placed · size is frequency · 602 distinct terms after stopwords',
    '상위 {total}개 중 {shown}개 배치 · 크기는 빈도 · 불용어 제거 후 서로 다른 단어 602개',
  ],

  /* ── the correlation matrix, crime study ───────────────────────────── */
  'viz.heat.aria': [
    'Correlation matrix over six variables across 25 Seoul districts. Every coefficient is positive; the strongest pair that is not a variable with itself is streetlights and average income at 0.71.',
    '서울 25개 자치구, 여섯 변수의 상관행렬입니다. 모든 계수가 양수이며, 자기 자신을 뺀 가장 강한 쌍은 가로등 수와 평균소득의 0.71입니다.',
  ],
  'viz.heat.cctv': ['CCTV', 'CCTV'],
  'viz.heat.crime': ['crime', '범죄'],
  'viz.heat.population': ['population', '인구'],
  'viz.heat.income': ['income', '소득'],
  'viz.heat.venues': ['venues', '유흥주점'],
  'viz.heat.lights': ['streetlights', '가로등'],
  'viz.heat.foot': [
    "Pearson's r · n = 25 districts · strongest pair {peak}, marked",
    'Pearson r · 자치구 n = 25 · 가장 강한 쌍 {peak}, 표시',
  ],

  /* ── the silent loss, Dartoo ───────────────────────────────────────── */
  'viz.silentloss.aria': [
    'Two output counts from the portfolio measurement record dated 2026-08-13: 959 persisted rows and 805 published events, a difference of 154.',
    '2026-08-13 포트폴리오 측정 기록의 두 출력 건수입니다. 적재 959행과 이벤트 발행 805건의 차이는 154건입니다.',
  ],
  'viz.silentloss.svc.1': ['disclosure', 'disclosure'],
  'viz.silentloss.svc.2': ['service', '서비스'],
  'viz.silentloss.lane.persist': ['persisted → database', '저장 → 데이터베이스'],
  'viz.silentloss.lane.publish': ['published → broker', '발행 → 브로커'],
  'viz.silentloss.nolog': ['startup failure', '시작 연결 실패'],
  'viz.silentloss.missing': ['missing', '누락'],

  /* ── the write race, MAP ───────────────────────────────────────────── */
  'viz.race.aria': [
    'Before the fix, a completion event arriving before its own job record was overwritten by the late in_progress write and the row stayed in progress. After the fix, the same arrival order ends in the completed state.',
    '수정 전에는 자기 작업 레코드보다 먼저 도착한 완료 이벤트를 뒤늦은 in_progress 쓰기가 덮어써서, 행이 진행 중 상태로 남았습니다. 수정 후에는 같은 도착 순서가 완료 상태로 끝납니다.',
  ],
  'viz.race.before': ['before', '수정 전'],
  'viz.race.after': ['after', '수정 후'],
  'viz.race.first': ['arrives first', '먼저 도착'],
  'viz.race.late': ['arrives late', '늦게 도착'],
  'viz.race.guard': ['insert only if absent', '없을 때만 삽입'],
  'viz.race.stuck': ['remains in progress', '진행 중 상태 잔류'],
  'viz.race.terminal': ['terminal state wins', '종료 상태 우선'],

  /* ── shared result isolation, MAP ─────────────────────────────────── */
  'viz.isolation.aria': [
    "Before: shared lookup reads user A's mutable draft, so waiting user B receives A's private edit. After: an immutable worker snapshot is bound to its producer and execution generation using AAD; B receives the original while A's edits stay on a separate path.",
    '수정 전에는 공유 조회가 A의 변경 가능한 초안을 읽어 대기 사용자 B에게 A의 개인 편집본을 전달합니다. 수정 후에는 불변 worker snapshot을 AAD로 생성자·실행 세대에 결합합니다. B는 원본을 받고 A의 편집 경로는 분리됩니다.',
  ],
  'viz.isolation.before': ['BEFORE', '수정 전'],
  'viz.isolation.after': ['AFTER', '수정 후'],
  'viz.isolation.before.title': ['Mutable result sharing', '변경 가능한 결과의 공유'],
  'viz.isolation.after.title': ['Worker snapshot isolation', 'worker 원본과 편집본의 분리'],
  'viz.isolation.worker': ['Worker result', 'worker 생성 결과'],
  'viz.isolation.original': ['Worker original', 'worker 원본'],
  'viz.isolation.edit': ['edit', '편집'],
  'viz.isolation.user.a': ['User A · owner', '사용자 A · 소유자'],
  'viz.isolation.user.b': ['User B · waiting', '사용자 B · 대기'],
  'viz.isolation.private': ['Private edit', '개인 편집본'],
  'viz.isolation.lookup': ['Shared lookup', '공유 완료 조회'],
  'viz.isolation.mutable': ["Reads A's draft", 'A의 초안 읽기'],
  'viz.isolation.wrong': ["A's private edit", 'A의 개인 편집본'],
  'viz.isolation.snapshot': ['Immutable snapshot', '불변 snapshot'],
  'viz.isolation.binding': ['Execution binding', '실행 세대 결합'],
  'viz.isolation.aad': ['Producer + body · AAD', '생성자 + 본문 · AAD'],
  'viz.isolation.copy': ["A's own copy", 'A의 편집 경로'],
  'viz.isolation.before.outcome': ['Private edits reach another user', '개인 편집본의 타 사용자 전달'],
  'viz.isolation.before.detail': ['Shared completion reads a mutable record', '공유 완료 경로가 변경 가능한 레코드를 조회'],
  'viz.isolation.after.outcome': ['B receives the worker original', 'B에게 전달되는 worker 원본'],
  'viz.isolation.after.detail': ['Personal edits are outside the shared read path', '개인 편집본은 공유 조회 경로에서 분리'],

  /* ── the three route stages, MAP ───────────────────────────────────── */
  'viz.route.aria': [
    'Routing for supplied places: Agent calculates distances and optionally optimizes visit order. User then requests road geometry through Hub and OSRM, preserving that order.',
    '지정 장소의 경로 계산입니다. Agent가 장소 간 거리와 요청 시 방문 순서를 계산합니다. 이후 User가 Hub·OSRM으로 도로 구간을 조회하며 선택된 순서를 유지합니다.',
  ],
  'viz.route.stage': ['stage {n}', '{n}단계'],
  'viz.route.s1.title': ['place distances', '장소 간 거리'],
  'viz.route.s1.sub': ['coordinates · haversine', '좌표 · haversine'],
  'viz.route.s2.title': ['optional optimization', '선택적 순서 최적화'],
  'viz.route.s2.sub': ['only when requested', '최적화 요청 시 적용'],
  'viz.route.s3.title': ['road legs', '도로 구간'],
  'viz.route.s3.sub': ['User → Hub → OSRM', 'User → Hub → OSRM'],
  'viz.route.deterministic': ['supplied places · routing schematic', '지정 장소 · 경로 계산 모식도'],
  'viz.route.modelscope': ['route-only path bypasses model calls', '경로 전용 요청은 모델 호출 생략'],

  /* ── revenue uplift, network pricing ───────────────────────────────── */
  'viz.pricing.aria': [
    'Revenue uplift over a max-price baseline by churn sensitivity: 2.1 percent at m=1 and not significant, then 105.8, 195.8 and 363.2 percent at m=3, 5 and 10, each significant at p below 0.001.',
    '이탈 민감도별, 최고가 기준선 대비 매출 증가입니다. m=1에서는 2.1%이고 유의하지 않으며, m=3, 5, 10에서는 각각 105.8%, 195.8%, 363.2%로 모두 p < 0.001에서 유의합니다.',
  ],
  'viz.pricing.attr.1': ['97% of this', '이 중 97%가'],
  'viz.pricing.attr.2': ['is one slice', '슬라이스 하나'],
  'viz.pricing.foot': [
    'revenue vs max-price baseline · churn sensitivity m · simulation',
    '최고가 기준선 대비 매출 · 이탈 민감도 m · 시뮬레이션',
  ],

  /* ── the algorithm comparison, network pricing ─────────────────────── */
  'viz.alg.aria': [
    'Net reward at churn multiplier one: PPO 7,334, SAC 7,370, TD3 6,862, Myopic-PPO 7,169, Max-Price 7,183. PPO and SAC are not statistically distinguishable at p equals 0.938.',
    '이탈 계수 1에서의 순 보상입니다. PPO 7,334, SAC 7,370, TD3 6,862, Myopic-PPO 7,169, Max-Price 7,183. PPO와 SAC은 p = 0.938로 통계적으로 구분되지 않습니다.',
  ],
  'viz.alg.axis': ['net reward', '순 보상'],
  'viz.alg.noforesight': ['immediate reward', '즉시 보상만'],
  'viz.alg.foot': [
    'Churn multiplier m = 1 · three seeds per policy · same environment',
    '이탈 계수 m = 1 · 정책당 시드 3개 · 동일 환경',
  ],

  /* ── the crime regression ──────────────────────────────────────────── */
  'viz.crime.model.aria': [
    'Five variables enter an OLS model with R squared 0.843. Entertainment venue count and population are significant; CCTV count is not.',
    '다섯 변수가 R² 0.843의 OLS 모델에 들어갑니다. 유흥주점 수와 인구는 유의하고, CCTV 수는 유의하지 않습니다.',
  ],
  'viz.crime.model.inputs': ['inputs', '입력'],
  'viz.crime.model.model': ['model', '모델'],
  'viz.crime.model.var.venues': ['entertainment venues', '유흥주점'],
  'viz.crime.model.var.population': ['population', '인구'],
  'viz.crime.model.var.income': ['income', '소득'],
  'viz.crime.model.var.lights': ['streetlights', '가로등'],
  /* The strike-through over this one is a fixed 80px rule, so the Korean has
     to be about as wide as the English rather than as short as possible. */
  'viz.crime.model.var.cctv': ['CCTV count', 'CCTV 설치 수'],
  'viz.crime.model.estimated': ['partly estimated', '일부 추정'],
  'viz.crime.model.cctv.p': ['p = 0.297 — not significant', 'p = 0.297 — 유의하지 않음'],
  'viz.crime.model.adjusted': ['adjusted 0.801', '조정 0.801'],
  'viz.crime.model.outcome': ['crime count', '범죄 건수'],
  'viz.crime.model.n': ['25 districts', '25개 자치구'],
  'viz.crime.model.foot': [
    'VIF 1.10–2.61 · cross-checked with LassoCV and RidgeCV · n = 25',
    'VIF 1.10–2.61 · LassoCV·RidgeCV로 교차 확인 · n = 25',
  ],

  /* ── what the fit accounts for ─────────────────────────────────────── */
  'viz.crime.fit.title': ['Variation in crime across 25 districts', '25개 자치구 범죄 발생 편차'],
  'viz.crime.fit.explained': ['explained — R² 0.843', '설명됨 — R² 0.843'],
  'viz.crime.fit.unexplained': ['unexplained', '미설명'],
  'viz.crime.fit.adjusted': ['adjusted 0.801', '조정 0.801'],
  'viz.crime.fit.foot': [
    'OLS · cross-checked with LassoCV and RidgeCV at 5 folds · VIF < 5 on every variable',
    'OLS · LassoCV·RidgeCV 5-폴드 교차 확인 · 모든 변수 VIF < 5',
  ],

  /* ── residuals by district ─────────────────────────────────────────── */
  'viz.crime.resid.aria': [
    "Choropleth of Seoul's twenty-five districts shaded by regression residual. Seongdong, Seongbuk and Gangdong are the most over-predicted; Mapo, Yongsan and Gwangjin the most under-predicted.",
    '회귀 잔차로 음영을 준 서울 25개 자치구 단계구분도입니다. 성동·성북·강동이 가장 크게 과대 예측되었고, 마포·용산·광진이 가장 크게 과소 예측되었습니다.',
  ],
  'viz.crime.resid.scale': ['Actual minus predicted', '실측 − 예측'],
  'viz.crime.resid.over': ['Model over-predicts', '과대 예측'],
  'viz.crime.resid.under': ['Model under-predicts', '과소 예측'],
  'viz.crime.resid.foot': ['n = 25 · same OLS fit', 'n = 25 · 동일 OLS 적합'],

  /* ── eighteen years of box office ──────────────────────────────────── */
  'viz.cinema.trend.aria': [
    'Box-office revenue and admissions per year from 2004 to 2021. Both peak in 2019 and fall {rev} and {adm} percent respectively by 2021.',
    '2004년부터 2021년까지의 연도별 박스오피스 매출과 관객 수입니다. 둘 다 2019년에 정점을 찍고 2021년까지 각각 {rev}%, {adm}% 하락합니다.',
  ],
  'viz.cinema.trend.peak': ['peak 2019', '2019 정점'],
  'viz.cinema.trend.rev': ['{v}% revenue', '매출 {v}%'],
  'viz.cinema.trend.adm': ['{v}% admissions', '관객 {v}%'],
  'viz.cinema.trend.foot': [
    'Revenue (hundred-million won) and admissions (ten thousand), all releases',
    '매출(억 원) · 관객(만 명) · 전체 개봉작',
  ],

  /* ── the correlation that did not clear its threshold ──────────────── */
  'viz.cinema.corr.aria': [
    'Pearson correlation between regional screen count and market share for three cinema chains, and between per-capita consumption and share. All four coefficients fall between 0.53 and 0.69 and none is significant at n equals 8.',
    '3개 극장 체인의 권역별 스크린 수와 시장 점유율, 그리고 1인당 소비와 점유율 사이의 Pearson 상관입니다. 네 계수 모두 0.53에서 0.69 사이이며, n = 8에서 유의한 것은 하나도 없습니다.',
  ],
  'viz.cinema.corr.title': ['Pearson r across 8 regions', '8개 권역 Pearson r'],
  'viz.cinema.corr.sig': ['significance', '유의성'],
  'viz.cinema.corr.row.cgv': ['CGV screens vs share', 'CGV 스크린 vs 점유율'],
  'viz.cinema.corr.row.lotte': ['Lotte screens vs share', '롯데 스크린 vs 점유율'],
  'viz.cinema.corr.row.megabox': ['Megabox screens vs share', '메가박스 스크린 vs 점유율'],
  'viz.cinema.corr.row.consumption': ['Consumption vs share', '소비 vs 점유율'],
  'viz.cinema.corr.foot': [
    'n = 8 regions · not one coefficient reaches p < 0.05',
    'n = 8개 권역 · p < 0.05에서 유의한 계수 없음',
  ],

  /* ── the beam-prediction pipeline, BP-LLM ──────────────────────────── */
  'viz.beam.arch.aria': [
    'Beam prediction pipeline: patch embedding of beam indices and departure angles, patch reprogramming into prototype tokens, concatenation with a three-part prompt prefix, a frozen GPT-2 backbone, and a linear projection back to beam indices. Only the embedding, reprogramming and projection carry trainable weights.',
    '빔 예측 파이프라인입니다. 빔 인덱스와 출발각의 패치 임베딩, 프로토타입 토큰으로의 패치 리프로그래밍, 3부 프롬프트 프리픽스와의 결합, 고정된 GPT-2 백본, 그리고 빔 인덱스로 되돌리는 선형 투영. 학습되는 가중치는 임베딩·리프로그래밍·투영에만 있습니다.',
  ],
  'viz.beam.arch.in': ['Beam index sequence · angle of departure', '빔 인덱스 시퀀스 · AoD'],
  'viz.beam.arch.out': ['Beam indices, H steps ahead', '빔 인덱스, H 스텝 후'],
  'viz.beam.arch.s1': ['Patch embed', '패치 임베드'],
  'viz.beam.arch.s1.sub': ['beam index · AoD', '빔 인덱스 · AoD'],
  'viz.beam.arch.s2': ['Reprogram', '리프로그램'],
  'viz.beam.arch.s2.sub': ['prototype tokens', '프로토타입 토큰'],
  'viz.beam.arch.s3': ['Prefix', '프리픽스'],
  'viz.beam.arch.s4': ['Frozen LLM', '고정 LLM'],
  'viz.beam.arch.s5': ['Project', '투영'],
  'viz.beam.arch.prefix.1': ['Domain knowledge', '도메인 지식'],
  'viz.beam.arch.prefix.2': ['Statistical trend — drift', '통계적 추세 — 드리프트'],
  'viz.beam.arch.prefix.3': ['Lag structure', '시차 구조'],
  'viz.beam.arch.promptprefix': ['prompt-as-prefix', '프롬프트 프리픽스'],
  'viz.beam.arch.loss': [
    'MSE over the H-step horizon · 339,338 trainable parameters',
    'H 스텝 구간 MSE · 학습 파라미터 339,338',
  ],
  'viz.beam.arch.key.train': ['trainable', '학습 대상'],
  'viz.beam.arch.key.frozen': ['frozen backbone', '고정 백본'],

  /* ── the training run ──────────────────────────────────────────────── */
  'viz.beam.train.aria': [
    'Average training loss per epoch, falling from 2.0826 at epoch one to 0.0009 by epoch eight and flat thereafter. Logarithmic axis. No held-out split was implemented.',
    '에폭별 평균 학습 손실입니다. 1에폭 2.0826에서 8에폭 0.0009까지 떨어진 뒤 평평해집니다. 로그 축이며, 홀드아웃 분할은 구현되지 않았습니다.',
  ],
  'viz.beam.train.title': ['average loss per epoch · log scale', '에폭별 평균 손실 · 로그 축'],
  'viz.beam.train.axis': ['Epoch', 'Epoch'],
  'viz.beam.train.run': ['run', '실행'],
  'viz.beam.train.run.backbone': ['GPT-2, frozen', 'GPT-2, 고정'],
  'viz.beam.train.run.trainable': ['trainable', '학습 대상'],
  'viz.beam.train.run.samples': ['samples used', '사용 샘플'],
  'viz.beam.train.run.window': ['input window', '입력 윈도'],
  'viz.beam.train.run.window.v': ['40 steps', '40 스텝'],
  'viz.beam.train.run.horizon': ['horizon', '예측 구간'],
  'viz.beam.train.run.horizon.v': ['10 steps', '10 스텝'],
  'viz.beam.train.run.device': ['device', '디바이스'],
  'viz.beam.train.run.time': ['run time', '실행 시간'],
  'viz.beam.train.run.time.v': ['34 min', '34분'],
  'viz.beam.train.nosplit': ['no held-out split', '홀드아웃 분할 없음'],
  'viz.beam.train.trainonly': ['training loss only', '학습 손실만'],
} as const;
