/**
 * Every string the site says in its own voice, in both languages.
 *
 * Long-form content — the projects, the papers, the record, the margin notes —
 * lives in `src/content/` and is mirrored under `src/content/ko/`. This file is
 * for the frame around it: labels, section titles, figure captions, and the
 * sentences the pages themselves write.
 *
 * A key with only one language is a build failure, not a silent fallback:
 * `scripts/check-i18n.mjs` compares the two sides. Half-translated chrome is
 * worse than none, because the reader cannot tell which half they are missing.
 */

import { vizStrings } from './viz';

export const LANGS = ['en', 'ko'] as const;
export type Lang = (typeof LANGS)[number];

export const HTML_LANG: Record<Lang, string> = { en: 'en', ko: 'ko' };

/** The other language, and what its switch should be labelled. */
export const OTHER: Record<Lang, { lang: Lang; label: string }> = {
  en: { lang: 'ko', label: '한국어' },
  ko: { lang: 'en', label: 'English' },
};

type Dict = Record<string, readonly [string, string]>;

/* [en, ko] */
const strings = {
  /* ── chrome ────────────────────────────────────────────────────────── */
  'nav.sections': ['Sections', '섹션'],
  'nav.contents': ['Contents', '목차'],
  'nav.language': ['Language', '언어'],
  'nav.back': ['Back', '돌아가기'],

  'controls.group': ['Reading controls', '읽기 설정'],
  'controls.theme.light': ['Light', '밝게'],
  'controls.theme.dark': ['Dark', '어둡게'],
  'controls.notes.margin': ['Notes in margin', '주석 여백'],
  'controls.notes.inline': ['Notes inline', '주석 본문'],
  'controls.motion.on': ['Motion on', '모션 켬'],
  'controls.motion.off': ['Motion off', '모션 끔'],

  /* ── hero ──────────────────────────────────────────────────────────── */
  'site.role': ['Data Engineering · Backend', '데이터 엔지니어링 · 백엔드'],
  'site.name': ['Ryu Jemu', '류제무'],
  'site.status': [
    'Graduating February 2027 · Hanyang University ERICA',
    '2027년 2월 졸업 예정 · 한양대학교 ERICA',
  ],
  'site.lede': [
    'Data pipelines for filings and travel, with defects traced from storage to delivery.',
    '공시와 여행 데이터를 연결하고, 저장부터 전달까지의 결함을 추적합니다.',
  ],
  /* The browser tab, and the line under the link when it is shared. */
  'site.title': ['Ryu Jemu — Data · Backend portfolio', '류제무 — 데이터 · 백엔드 포트폴리오'],
  'site.description': [
    'Data engineering and backend work on Dartoo and MAP, with research, statistical analysis and verification conditions.',
    'Dartoo·MAP의 데이터 엔지니어링과 백엔드 개발, 연구·통계 분석을 담당 역할과 검증 조건으로 소개합니다.',
  ],
  'site.what': [
    'Backend development for Dartoo and MAP: data collection, asynchronous processing and result integrity.',
    'Dartoo·MAP 백엔드 개발. 외부 데이터 수집, 비동기 처리, 결과 정합성을 담당했습니다.',
  ],

  'hero.point.1': [
    '**Dartoo** — Traced missing events by comparing persisted and published counts; verified the reconnect fix in one E2E run.',
    '**Dartoo** — 적재·발행 건수 대조로 누락 원인 파악. 재연결 수정 후 E2E 검증.',
  ],
  'hero.point.2': [
    '**MAP** — Separated shared results from personal edits; checked user isolation and terminal states with focused regressions.',
    '**MAP** — 공동 생성 결과·개인 편집본 분리. 사용자 격리와 종료 상태의 집중 회귀 검증.',
  ],
  'hero.point.3': [
    '**Research and analysis** — Controlled policy experiments, public-data joins and statistical tests; conditions beside results.',
    '**연구·분석** — 정책 대조 실험, 공공 데이터 결합·통계 검정. 결과별 측정 조건 명시.',
  ],

  'standing.gpa.label': ['GPA / 4.5', '학점 / 4.5'],
  'standing.gpa.detail': [
    'BSc Computer Science · 143 credits · Convergence Security',
    '컴퓨터학부 · 143학점 · 융합보안 복수전공',
  ],
  'standing.awards.label': ['awards and selections', '수상 및 선정'],
  'standing.awards.detail': ['ASK 2026 Silver · Hanyang Grand Prize', 'ASK 2026 은상 · 한양대 대상'],
  'standing.certs.label': ['certifications', '자격증'],
  'standing.certs.detail': ['Information Processing · AWS · SQLD · Azure AI · ADsP', '정보처리기사 · AWS · SQLD · Azure AI · ADsP'],
  'standing.service.value': ['Completed', '만기 전역'],
  'standing.service.label': ['military service', '병역'],
  'standing.service.detail': ['ROK Air Force · discharged as sergeant', '대한민국 공군 · 병장 만기 전역'],

  /* ── section titles ────────────────────────────────────────────────── */
  'section.pipelines': ['Data pipelines', '데이터 파이프라인'],
  'section.research': ['Research', '연구'],
  'section.analysis': ['Data analysis', '데이터 분석'],
  'section.more': ['More work', '그 밖의 작업'],
  'section.about': ['About', '소개'],
  'section.contact': ['Contact', '연락처'],

  /* ── § 1 pipelines ─────────────────────────────────────────────────── */
  'pipelines.lede': [
    'Two team projects covering data collection, processing, storage and delivery. Each shows my contribution, a concrete failure, the fix and its verification conditions.',
    '데이터 수집·가공·저장·전달을 구현한 두 팀 프로젝트입니다. 담당 작업, 문제의 원인, 수정 결과와 검증 조건을 함께 제시합니다.',
  ],
  'pipelines.aside': [
    'Dartoo exposed a gap between stored and published events. MAP exposed a late write that changed a completed job back to “in progress”.',
    'Dartoo에서는 적재·발행 건수의 불일치를, MAP에서는 완료된 작업을 진행 중으로 되돌리는 쓰기 순서 문제를 확인했습니다.',
  ],
  'pipelines.aside.2': [
    'Dartoo also needed to handle mixed source encodings and missing charset declarations. The project pages explain each cause and fix.',
    'Dartoo의 원문 처리에서는 혼합 인코딩과 charset 누락도 다뤘습니다. 상세 페이지에서 원인과 수정 내용을 확인할 수 있습니다.',
  ],

  /* ── § 2 research ──────────────────────────────────────────────────── */
  'research.lede': [
    'Two papers with my authorship, implementation work and experimental conditions. The manuscripts are available on their detail pages.',
    '논문 두 편의 저자 역할, 구현 내용과 실험 조건입니다. 상세 페이지에서 원고를 함께 볼 수 있습니다.',
  ],
  'research.authorship.sole': ['Sole author', '단독 저자'],
  'research.authorship.first': ['First author of {of}', '{of}인 중 제1저자'],
  'research.authorship.co': ['Co-author — {index} of {of}', '공저자 — {of}인 중 {index}번째'],
  'research.status.accepted': ['Accepted', '게재 확정'],
  'research.status.under-review': ['Under review', '심사 중'],
  'research.status.revision': ['In revision', '수정 중'],
  'research.mypart': ['My part', '담당'],
  'research.read': ['Read the paper', '논문 보기'],
  'research.what': ['My contribution', '담당 작업'],
  'research.how': ['Experiment design', '실험 구성'],
  'research.found': ['Findings', '연구 결과'],
  'research.paper': ['The paper', '논문'],
  'research.paper.lede': [
    'Held on this site, so it can be read without leaving the page.',
    '이 사이트에 직접 올려두어, 페이지를 벗어나지 않고 읽을 수 있습니다.',
  ],
  'research.build': ['The implementation', '구현'],
  'research.build.lede': [
    'Implementation details and the scope of the recorded experiments.',
    '논문 관련 구현과 기록된 실험의 검증 범위입니다.',
  ],
  'research.aside.ask': [
    'Myopic-PPO, trained on immediate rewards only, did not differ significantly from the max-price baseline at any tested setting.',
    '즉시 보상만 학습한 Myopic-PPO와 최대 가격 기준선의 차이는 모든 실험 조건에서 유의하지 않았습니다.',
  ],

  /* ── § 3 analysis ──────────────────────────────────────────────────── */
  'analysis.lede': [
    'Two studies combining public data, statistical analysis and visualisation. Results are shown with their sample and model conditions.',
    '공공 데이터 결합, 통계 분석과 시각화를 수행한 두 프로젝트입니다. 표본과 모형 조건을 결과 옆에 표시했습니다.',
  ],
  'analysis.crime.title': ['Crime across Seoul’s 25 districts', '서울 25개 자치구의 범죄 발생'],
  'analysis.crime.sub': [
    'Public administrative data · ordinary least squares, cross-checked with Lasso and Ridge',
    '공공 행정 데이터 · 최소자승 회귀, Lasso·Ridge로 교차 확인',
  ],
  'analysis.cinema.title': ['Eighteen years of multiplex revenue', '멀티플렉스 매출 18년'],
  'analysis.cinema.sub': [
    'Box-office and regional market data · correlation across 8 regions, with text and geospatial work',
    '박스오피스 및 지역 시장 데이터 · 8개 권역 상관분석, 텍스트·공간 분석 병행',
  ],

  /* ── § 4 more ──────────────────────────────────────────────────────── */
  'more.lede': [
    'Additional services, coursework and prototypes.',
    '그 밖의 서비스 개발, 수업 프로젝트와 프로토타입입니다.',
  ],
  'more.aside': [
    'A selection of individual and team work, including a baseball-rule retrieval project.',
    '개인·팀 프로젝트의 주요 작업입니다. 야구 규칙 검색 프로젝트도 포함했습니다.',
  ],

  /* ── § 5 about ─────────────────────────────────────────────────────── */
  'about.lede': [
    'Education, project experience, awards, certifications and activities.',
    '학력과 프로젝트 경험, 수상·선정, 자격증과 활동입니다.',
  ],
  'about.awards': ['Awards and selections', '수상 및 선정'],
  'about.certs': ['Certifications', '자격증'],
  'about.timeline': ['Education and experience', '학력 및 경험'],
  'about.activities': ['Activities', '활동'],

  /* ── project pages ─────────────────────────────────────────────────── */
  'work.built': ['Project details', '프로젝트 상세'],
  'work.pipeline': ['The pipeline', '파이프라인'],
  'work.collaboration': ['Service contracts and collaboration', '서비스 계약과 협업'],
  'hero.projects': ['Selected pipelines', '대표 파이프라인'],
  'hero.updated': ['Updated · September 2026', '업데이트 · 2026년 9월'],
  'work.scope': ['My scope', '담당 범위'],
  'contribution.area': ['Area', '영역'],
  'contribution.work': ['My implementation and improvements', '본인 구현과 개선'],
  'contribution.context': ['Team contribution and implementation status', '팀 기여와 구현 상태'],
  'work.owned': ['My responsibilities', '본인 담당 영역'],
  'work.notowned': ['Related scope', '관련 작업 범위'],
  'work.how': ['How it works', '동작 방식'],
  'work.safety': ['Reliability mechanisms', '데이터 신뢰성 설계'],
  'work.safety.lede': [
    'Controls for specific failure modes, with their implementation scope.',
    '실패 유형별 방어 장치와 구현 범위입니다.',
  ],
  'work.fixes': ['Defects I found and fixed', '발견하고 고친 결함'],
  'work.fixes.lede': ['Symptom, cause, fix.', '증상, 원인, 수정.'],
  'work.verification': ['Verification', '검증'],
  'work.verification.lede': [
    'Test definitions and executed regressions are distinguished by date and environment.',
    '테스트 정의 수와 실행한 회귀 검증을 날짜·환경별로 구분했습니다.',
  ],
  'work.stack': ['Built with', '사용 기술'],
  'work.hosting.offline': [
    'Previously deployed and demonstrated. The servers are currently offline; links are retained as deployment records.',
    '배포·시연을 마친 뒤 서버를 종료했습니다. 링크는 당시 배포 주소로 남겨두었습니다.',
  ],

  'status.deployed': ['Deployed', '배포함'],
  'status.in-progress': ['In progress', '진행 중'],
  'status.archived': ['Archived', '보관'],
  'status.on-hold': ['On hold', '보류'],
  'status.offline': ['offline', '서버 종료'],

  /* ── device deck ───────────────────────────────────────────────────── */
  'deck.prev': ['Previous screen', '이전 화면'],
  'deck.next': ['Next screen', '다음 화면'],
  'deck.show': ['Show {screen}', '{screen} 화면 보기'],
  'screen.signin': ['Sign in', '로그인'],
  'screen.today': ['Today', '오늘'],
  'screen.filing': ['Filing', '공시'],
  'screen.company': ['Company', '기업'],
  'screen.ask': ['Ask', '질문'],
  'screen.home': ['Home', '홈'],
  'screen.itinerary': ['Itinerary', '일정'],
  'screen.place': ['Place', '장소'],
  'deck.preview': ['Project interface preview', '프로젝트 화면 예시'],
  'figure.scroll': ['Scroll horizontally to read the full figure.', '좌우로 움직여 그림 전체를 볼 수 있습니다.'],
  'screen.dartoo.signin.alt': ['Dartoo sign-in screen', 'Dartoo 로그인 화면'],
  'screen.dartoo.today.alt': ['Dartoo filings and watched companies', 'Dartoo 공시 목록과 구독 기업 화면'],
  'screen.dartoo.filing.alt': ['Dartoo filing and generated summary', 'Dartoo 공시와 생성된 요약 화면'],
  'screen.dartoo.company.alt': ['Dartoo company filing history', 'Dartoo 기업별 공시 이력 화면'],
  'screen.dartoo.ask.alt': ['Dartoo filing question and answer', 'Dartoo 공시 질의응답 화면'],
  'screen.map.signin.alt': ['MAP sign-in interface preview', 'MAP 로그인 화면 예시'],
  'screen.map.home.alt': ['MAP home and weather preview', 'MAP 홈과 날씨 화면 예시'],
  'screen.map.itinerary.alt': ['MAP itinerary and route preview', 'MAP 일정과 경로 화면 예시'],
  'screen.map.place.alt': ['MAP place details preview', 'MAP 장소 상세 화면 예시'],

  /* ── the studies' own output ───────────────────────────────────────── */
  'work.plates': ['Original analysis map', '원본 분석 지도'],
  'work.plates.lede': [
    'The original map used coordinates geocoded through an address API during the analysis. The map is preserved; the generated coordinate table was not saved.',
    '분석 당시 주소 API로 지오코딩한 지도입니다. 지도 결과는 보존했지만 생성된 좌표 테이블은 별도로 저장하지 않았습니다.',
  ],
  'plate.cinema.map': [
    'Every theatre in the country, geocoded from its address and clustered by proximity, coloured by operator.',
    '전국 영화관을 주소로 지오코딩해 근접도로 묶고 운영사별로 색을 준 지도입니다.',
  ],

  /* ── figure captions ───────────────────────────────────────────────── */
  'case.dartoo': ['Publisher delivery reconciliation', '발행 누락의 원인과 건수 대조'],
  'case.dartoo.lede': ['**Cause** — Startup failure left publishing disabled. **Fix** — Reconnect on the next publish and warn when an event cannot be sent.', '**원인** — 시작 연결 실패 후 발행 비활성화 유지. **수정** — 다음 발행 시 재연결하고 전송 불가 이벤트에 경고 기록.'],
  'case.map': ['Shared results and personal edits', '공유 결과와 개인 편집의 격리'],
  'case.map.lede': ['**Reproduction** — Followers read personal edits. **Fix** — Separate immutable shared snapshots from personal drafts.', '**회귀 재현** — 후속 요청에 개인 편집본 혼입. **수정** — 불변 공유 스냅샷과 개인 초안의 읽기 경로 분리.'],
  'fig.reconciliation': ['Each pair uses its own persisted count as the bar baseline. The two runs have different inputs; the chart compares delivery parity within each run.', '각 막대 쌍의 기준은 해당 실행의 적재 건수입니다. 두 실행은 입력이 다르며, 실행 내부의 적재·발행 일치를 비교합니다.'],
  'fig.isolation': ['The reproduced defect and the snapshot fix. The saved 2026-09-09 run contains 93 focused regressions: H2 JPA and in-memory Redis doubles.', '회귀 재현의 결함과 스냅샷 수정 구조입니다. 2026-09-09 저장 실행 기록의 집중 회귀 테스트 93건이며, H2 JPA와 메모리 Redis 대역을 사용했습니다.'],
  'reconcile.before': ['Observed delivery gap', '결함 확인'],
  'reconcile.after': ['Verification after reconnect fix', '재연결 수정 후 검증'],
  'reconcile.before.condition': ['Portfolio measurement record, 2026-08-13: stored rows versus published events.', '2026-08-13 포트폴리오 측정 기록 · 적재·발행 대조'],
  'reconcile.after.condition': ['Same portfolio record: a separate E2E run on the fixture set.', '동일 측정 기록 · 별도 fixture E2E 1회 실행'],
  'reconcile.persisted': ['Persisted', '적재'],
  'reconcile.published': ['Published', '발행'],
  'reconcile.missing': ['missing events in this run', '건 누락 · 해당 집계 조건'],
  'fig.pipeline': ['{title}: data collection through delivery.', '{title}의 데이터 수집부터 전달까지의 흐름입니다.'],
  'fig.pipeline.full': [
    '{title}: processing stages and the services responsible for them.',
    '{title}의 처리 단계와 단계별 담당 서비스입니다.',
  ],
  'fig.architecture': [
    '{title}: system components. Accent outlines mark the areas I implemented or improved.',
    '{title}의 시스템 구성입니다. 강조색 테두리는 제가 구현하거나 개선한 영역입니다.',
  ],
  'fig.silentloss': [
    'Persisted rows and published events in the portfolio measurement record dated 2026-08-13.',
    '2026-08-13 포트폴리오 측정 기록에 남긴 적재 행과 발행 이벤트의 차이입니다.',
  ],
  'fig.race': ['The same write order before and after the state-preservation fix.', '동일한 쓰기 순서에서 종료 상태 보존 규칙의 적용 전후를 비교합니다.'],
  'fig.routestages': [
    'Candidate selection and coordinate-based routing have separate responsibilities.',
    '후보 선택과 좌표 기반 경로 계산의 역할을 분리했습니다.',
  ],
  'fig.pricing': [
    'Revenue over the max-price baseline, by churn sensitivity. The m=1 bar is faint because it is not significant.',
    '이탈 민감도별, 최고가 기준선 대비 매출입니다. m=1 막대가 흐린 이유는 유의하지 않기 때문입니다.',
  ],
  'fig.pricing.alg': [
    'Algorithm comparison at m=1 in the same simulation; PPO and SAC are not significantly different.',
    '동일 시뮬레이션의 m=1 조건 알고리즘 비교입니다. PPO와 SAC의 차이는 유의하지 않았습니다.',
  ],
  'fig.crime.heatmap': [
    'Pairwise correlations across 25 districts. Streetlights and average income have a correlation of 0.71; VIF provides a separate multicollinearity check.',
    '25개 자치구의 변수 간 상관계수입니다. 가로등 수와 평균소득의 상관계수는 0.71이며, VIF로 다중공선성을 별도 확인했습니다.',
  ],
  'fig.crime.model': [
    'Five-variable OLS across 25 districts. CCTV count is included, but its coefficient is not significant.',
    '25개 자치구의 5변수 OLS 모형입니다. CCTV 수는 포함했지만 계수는 유의하지 않았습니다.',
  ],
  'fig.crime.fit': [
    'Explained and unexplained variance in the five-variable OLS model.',
    '5변수 OLS 모형의 설명 분산과 잔여 분산입니다.',
  ],
  'fig.crime.resid': [
    'Actual minus predicted, by district. Red is where the model expects more crime than there is; blue is where it expects less.',
    '자치구별 실측값에서 예측값을 뺀 값입니다. 붉은 쪽은 모델이 실제보다 많이 예측한 곳, 푸른 쪽은 적게 예측한 곳입니다.',
  ],
  'fig.cinema.trend': [
    'Annual box-office revenue and admissions in the study dataset, 2004–2021.',
    '분석에 사용한 2004–2021년 연도별 박스오피스 매출과 관객 수입니다.',
  ],
  'fig.cinema.share': [
    'Screen count and regional market share for each chain. All three correlations are positive, but none is significant at p < 0.05.',
    '체인별 상영관 수와 권역 점유율입니다. 세 상관계수는 모두 양수지만 p < 0.05에서 유의하지 않아 적합선을 파선으로 표시했습니다.',
  ],
  'fig.cinema.cons': [
    'Per-capita private consumption and regional share, 2020–2022. The correlation increases across these years, but none of the three estimates is statistically significant.',
    '2020–2022년 1인당 민간소비지출과 권역 점유율입니다. 연도별 상관계수는 증가했지만 세 해 모두 통계적으로 유의하지 않았습니다.',
  ],
  'fig.cinema.top20': [
    'Among the 20 busiest cinemas in 2023, both screen count and seat count have significant associations with annual admissions.',
    '2023년 관객 수 상위 20개 영화관에서 상영관 수·좌석 수와 연간 관객 수의 관계를 분석했습니다. 두 적합 모두 통계적으로 유의했습니다.',
  ],
  'fig.cinema.dist': [
    'Population and cinema count across 228 districts, with a fitted linear trend.',
    '228개 시군구의 인구와 영화관 수를 산점도와 선형 적합선으로 표시했습니다.',
  ],
  'fig.cinema.words': [
    'Frequent words in blog posts about one cinema chain, after stopword filtering. Word size represents frequency.',
    '한 영화관 체인의 블로그 글에서 불용어를 제거한 뒤 추출한 주요 단어입니다. 글자 크기는 출현 빈도를 나타냅니다.',
  ],
  'fig.cinema.corr': [
    'Across eight regions, all four correlations are positive but none is significant at p < 0.05.',
    '8개 권역 표본에서 네 상관계수는 모두 양수지만 p < 0.05에서 유의하지 않았습니다.',
  ],
  'fig.beam.arch': [
    'Beam-prediction implementation related to Section III.E. Patch embeddings and a prompt prefix feed a GPT-2 backbone with frozen weights.',
    'III.E절 관련 빔 예측 구현입니다. 패치 임베딩과 프롬프트를 결합해 가중치가 고정된 GPT-2에 입력합니다.',
  ],
  'fig.beam.train': [
    'Average training loss per epoch from the run log. No held-out evaluation split was implemented.',
    '실행 로그의 에폭별 평균 학습 손실입니다. 홀드아웃 평가 분할은 구현되지 않았습니다.',
  ],

  /* ── small labels ──────────────────────────────────────────────────── */
  'note.aria': ['Evidence for this claim: {body}', '이 주장의 근거: {body}'],
  'note.measured': ['Measured', '측정 조건'],
  'note.source': ['Source', '출처'],
  'verify.total': [
    'test cases in the scope below',
    '아래 조건에서 확인한 테스트',
  ],
  'label.external': ['External providers', '외부 제공자'],
  'arc.aria': [
    'Architecture: {external} external providers, {services} services with my contributions in {mine}, {clients} clients, and {stores} stores.',
    '아키텍처: 외부 제공자 {external}곳, 서비스 {services}개 중 본인 구현·개선 영역 {mine}개, 클라이언트 {clients}개, 저장소 {stores}개.',
  ],
  'materials.inline': [
    'This browser will not display the file inline.',
    '이 브라우저는 파일을 페이지 안에 표시하지 못합니다.',
  ],
  'materials.newtab': ['Open it in a new tab', '새 탭에서 열기'],
  'materials.open': ['Open the full document', '전문 열기'],
  'label.figure': ['Fig.', '그림'],
  'label.builtby': ['my implementation or improvements', '본인 구현·개선 영역'],
  'label.teammate': ['teammate', '팀원'],
  'label.thirdparty': ['third party', '외부'],
  'label.services': ['Services', '서비스'],
  'label.clients': ['Clients', '클라이언트'],
  'label.stores': ['Stores and brokers', '저장소 및 브로커'],
  'label.symptom': ['Symptom', '증상'],
  'label.cause': ['Cause', '원인'],
  'label.fix': ['Fix', '수정'],
  'label.tests': ['tests', '테스트'],
  'label.notfound': ['Page not found', '페이지를 찾을 수 없습니다'],
  'label.notfound.body': [
    'This page is unavailable. Return to the portfolio to find projects and contact details.',
    '요청한 페이지를 찾을 수 없습니다. 포트폴리오에서 프로젝트와 연락처를 확인해 주세요.',
  ],
  'label.home': ['Back to portfolio', '포트폴리오로 가기'],
} satisfies Dict;

/**
 * Bullet lists the pages write themselves.
 *
 * Separate from `strings` so a list stays a list: joining them into one string
 * and splitting on a delimiter is how a stray character silently becomes a
 * fifth bullet.
 */
const lists = {
  'analysis.crime.points': [
    [
      'In the 25-district cross-sectional OLS fit: R² 0.843, adjusted R² 0.801 and F-test p = 4.95e-07.',
      '**Significance** — Population and entertainment venue count have significant coefficients. CCTV count is not significant at p = 0.297.',
      'VIF is 1.10–2.61 in this fit; it shows no strong multicollinearity signal, but does not establish causal effects.',
      '**Residual analysis** — Mapped actual minus predicted values to identify over- and under-predicted districts.',
    ],
    [
      '25개 자치구 횡단면 자료의 OLS 적합 결과입니다. R² 0.843, 조정 R² 0.801, F검정 p = 4.95e-07.',
      '**유의성** — 인구수·유흥주점 수의 계수는 유의했으며, CCTV 수는 p = 0.297로 유의하지 않았습니다.',
      '이 모형의 VIF는 1.10–2.61로 강한 다중공선성 신호는 없었습니다. 인과효과를 입증한 분석은 아닙니다.',
      '**잔차 분석** — 실측값과 예측값의 차이를 지도에 표시해 과대·과소 예측된 자치구를 확인했습니다.',
    ],
  ],
  'analysis.cinema.points': [
    [
      '**Dataset trend** — In the collected series, revenue fell 87.6% and admissions 88.9% from the 2019 peak to 2021. Admissions decreased from 227 million to 25 million.',
      '**Regional comparison** — Screen count and market share were positively correlated for all three chains, but none of the correlations was significant.',
      '**Consumption comparison** — Per-capita private consumption and market share had a positive, non-significant correlation across eight regions.',
      '**Collection** — Replaced the browser-driven crawler with a documented search API and a single collection command.',
    ],
    [
      '**수집 자료의 추이** — 2021년 매출은 2019년 대비 87.6%, 관객 수는 88.9% 감소했습니다. 관객 수는 2억 2,700만 명에서 2,500만 명으로 줄었습니다.',
      '**권역별 비교** — 세 체인 모두 스크린 수와 시장 점유율의 상관계수가 양수였으나 통계적으로 유의하지 않았습니다.',
      '**소비 수준 비교** — 8개 권역에서 1인당 민간소비와 점유율의 상관계수는 양수였으나 유의하지 않았습니다.',
      '**수집 개선** — 브라우저 크롤러를 공식 검색 API 기반 수집기로 교체하고 단일 실행 명령을 구성했습니다.',
    ],
  ],
} satisfies Record<string, readonly [readonly string[], readonly string[]]>;

/** The chrome and the plates share one lookup; they are split only by file. */
const all: Dict = { ...strings, ...(vizStrings as Dict) };

const INDEX: Record<Lang, 0 | 1> = { en: 0, ko: 1 };

/**
 * Look a string up, filling `{name}` placeholders from `vars`.
 *
 * An unknown key throws rather than rendering the key itself: a page that ships
 * `work.stack` where a heading should be is a defect that must not reach a
 * build, and the collections are small enough that every key is exercised.
 */
export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const pair = all[key];
  if (!pair) throw new Error(`i18n: no string for "${key}"`);
  let out = pair[INDEX[lang]];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
  }
  return out;
}

/** A bullet list in the language being rendered. */
export function tl(lang: Lang, key: keyof typeof lists): readonly string[] {
  return lists[key][INDEX[lang]];
}

/** The same path under the other language, for the switch in the bar. */
export function altPath(lang: Lang, pathname: string): string {
  return lang === 'ko'
    ? pathname.replace(/^\/ko(\/|$)/, '/')
    : `/ko${pathname === '/' ? '/' : pathname}`;
}

/** Prefix a site-absolute path with the current language's root. */
export function localise(lang: Lang, path: string): string {
  return lang === 'ko' ? `/ko${path}` : path;
}

/** For the gate in scripts/check-i18n.mjs. */
export const allStrings: Dict = all;
