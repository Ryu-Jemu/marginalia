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
  'site.role': ['Data · Backend', '데이터 · 백엔드'],
  'site.name': ['Ryu Jemu', '류제무'],
  'site.status': [
    'Graduating February 2027 · Hanyang University ERICA',
    '2027년 2월 졸업 예정 · 한양대학교 ERICA',
  ],
  'site.lede': [
    'A developer who thinks flexibly and takes things on, in the age of AI transformation.',
    'AX 시대에서 유연한 사고와 도전 정신을 가진 개발자입니다.',
  ],
  /* The browser tab, and the line under the link when it is shared. */
  'site.title': ['Ryu Jemu — Data · Backend portfolio', '류제무 — 데이터 · 백엔드 포트폴리오'],
  'site.description': [
    'Two data pipelines carrying a mobile product each, two papers, and two statistical studies — with the condition it was measured under beside every figure.',
    '모바일 서비스를 하나씩 떠받치는 데이터 파이프라인 두 개, 논문 두 편, 통계 분석 두 건. 모든 수치 옆에 측정 조건을 함께 적었습니다.',
  ],
  'site.what': [
    'What follows is the work itself: what each system does, what I built in it, the defects I found and fixed, and the figures each claim rests on.',
    '아래는 작업 그 자체입니다. 각 시스템이 무엇을 하는지, 그 안에서 제가 무엇을 만들었는지, 어떤 결함을 발견하고 고쳤는지, 그리고 각 주장이 딛고 있는 수치입니다.',
  ],

  'hero.point.1': [
    'Two data pipelines carrying a mobile product each — ten services owned between them, and 1,300 automated tests behind them.',
    '모바일 서비스를 하나씩 떠받치는 데이터 파이프라인 두 개. 두 프로젝트에서 열 개 서비스를 담당했고, 자동화 테스트 1,300건이 뒤에 있습니다.',
  ],
  'hero.point.2': [
    'First author on a paper that took a silver award; Section III.E of a survey under review at IEEE TAI.',
    '은상을 받은 논문의 제1저자, 그리고 IEEE TAI 심사 중인 서베이 논문의 III.E절 집필.',
  ],
  'hero.point.3': [
    'Two statistical studies where the data contradicted the premise the project started from.',
    '출발할 때 세운 전제를 데이터가 뒤집은 통계 분석 두 건.',
  ],

  'standing.gpa.label': ['GPA / 4.5', '학점 / 4.5'],
  'standing.gpa.detail': [
    'BSc Computer Science · 143 credits · Convergence Security',
    '컴퓨터학부 · 143학점 · 융합보안 복수전공',
  ],
  'standing.awards.label': ['awards and selections', '수상 및 선정'],
  'standing.awards.detail': ['ASK 2026 Silver · Hanyang Grand Prize', 'ASK 2026 은상 · 한양대 대상'],
  'standing.certs.label': ['certifications', '자격증'],
  'standing.certs.detail': ['AWS · SQLD · Azure AI · ADsP', 'AWS · SQLD · Azure AI · ADsP'],
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
    'Two team products. Each is a path data takes from an external source to a phone, and I own most of that path on both. Both were deployed and demonstrated; their servers are powered down now.',
    '팀으로 만든 두 서비스입니다. 각각 외부 소스에서 휴대폰까지 데이터가 지나는 경로이고, 두 곳 모두 그 경로의 대부분을 제가 담당했습니다. 배포하고 시연했으며, 지금은 서버를 내려둔 상태입니다.',
  ],
  'pipelines.aside': [
    'Both pipelines failed quietly rather than loudly. A publisher reported success while delivering nothing; a finished job reverted to “in progress”;',
    '두 파이프라인 모두 요란하지 않고 조용히 실패했습니다. 발행기는 아무것도 전달하지 않으면서 성공을 보고했고, 끝난 작업은 다시 "진행 중"으로 되돌아갔습니다.',
  ],
  'pipelines.aside.2': [
    'and source archives arrived in three encodings, some declaring none at all. Each project page carries what broke, why, and what fixed it.',
    '원본 압축 파일은 세 가지 인코딩으로 도착했고, 그중 일부는 인코딩을 밝히지 않았습니다. 무엇이 깨졌고 왜 그랬으며 무엇으로 고쳤는지는 각 프로젝트 페이지에 있습니다.',
  ],

  /* ── § 2 research ──────────────────────────────────────────────────── */
  'research.lede': [
    'Two papers, each with the work that produced it. Each opens on its own page, with the manuscript on it.',
    '논문 두 편과, 각 논문을 만든 작업입니다. 각 논문은 원고와 함께 자체 페이지에서 열립니다.',
  ],
  'research.authorship.sole': ['Sole author', '단독 저자'],
  'research.authorship.first': ['First author of {of}', '{of}인 중 제1저자'],
  'research.authorship.co': ['Co-author — {index} of {of}', '공저자 — {of}인 중 {index}번째'],
  'research.status.accepted': ['Accepted', '게재 확정'],
  'research.status.under-review': ['Under review', '심사 중'],
  'research.status.revision': ['In revision', '수정 중'],
  'research.mypart': ['My part', '담당'],
  'research.read': ['Read the paper', '논문 보기'],
  'research.what': ['What I did', '수행한 일'],
  'research.how': ['How it was set up', '실험 구성'],
  'research.found': ['What it found', '결과'],
  'research.paper': ['The paper', '논문'],
  'research.paper.lede': [
    'Held on this site, so it can be read without leaving the page.',
    '이 사이트에 직접 올려두어, 페이지를 벗어나지 않고 읽을 수 있습니다.',
  ],
  'research.build': ['The implementation', '구현'],
  'research.build.lede': [
    'The code behind the paper, and what it does and does not establish.',
    '논문 뒤에 있는 코드, 그리고 그 코드가 무엇을 뒷받침하고 무엇을 뒷받침하지 않는지.',
  ],
  'research.aside.ask': [
    'The control: the same policy trained without foresight lands level with the baseline at every setting.',
    '대조군 실험입니다. 같은 정책을 미래 보상 없이 학습시키면 모든 설정에서 기준선과 같은 수준에 머무릅니다.',
  ],

  /* ── § 3 analysis ──────────────────────────────────────────────────── */
  'analysis.lede': [
    'Two studies, each a separate dataset and a separate question. Every figure below is recomputed from the study’s own data.',
    '서로 다른 데이터와 서로 다른 질문을 가진 두 건의 분석입니다. 아래 모든 그림은 해당 분석의 원본 데이터에서 다시 계산했습니다.',
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
    'Services, coursework and prototypes, listed as they stand.',
    '서비스, 수업 과제, 프로토타입을 있는 그대로 정리했습니다.',
  ],
  'more.aside': [
    'Twelve repositories of my own, plus the services owned inside two team organisations.',
    '개인 저장소 열두 개, 그리고 두 팀 조직 안에서 담당한 서비스들입니다.',
  ],

  /* ── § 5 about ─────────────────────────────────────────────────────── */
  'about.lede': [
    'The path here, the recognition along it, and what else I do.',
    '여기까지의 경로, 그 과정에서의 수상과 자격, 그리고 그 밖의 활동.',
  ],
  'about.awards': ['Awards and selections', '수상 및 선정'],
  'about.certs': ['Certifications', '자격증'],
  'about.timeline': ['Education and career', '학력 및 경력'],
  'about.activities': ['Activities', '활동'],

  /* ── project pages ─────────────────────────────────────────────────── */
  'work.built': ['How it was built', '어떻게 만들었는지'],
  'work.pipeline': ['The pipeline', '파이프라인'],
  'work.scope': ['My scope', '담당 범위'],
  'work.owned': ['What I owned', '담당한 것'],
  'work.notowned': ['What I did not own', '담당하지 않은 것'],
  'work.how': ['How it works', '동작 방식'],
  'work.safety': ['What keeps it standing up', '무엇이 이것을 지탱하는가'],
  'work.safety.lede': [
    'Each one makes a specific failure impossible, or makes it visible.',
    '각각은 특정한 실패를 불가능하게 만들거나, 눈에 보이게 만듭니다.',
  ],
  'work.fixes': ['Defects I found and fixed', '발견하고 고친 결함'],
  'work.fixes.lede': ['Symptom, cause, fix.', '증상, 원인, 수정.'],
  'work.verification': ['Verification', '검증'],
  'work.verification.lede': [
    'Test counts by surface, read out of the repositories.',
    '저장소에서 직접 읽어낸 영역별 테스트 수입니다.',
  ],
  'work.stack': ['Built with', '사용 기술'],
  'work.hosting.offline': [
    'Deployed and demonstrated. The servers are powered down, so the addresses below record where it ran rather than somewhere to visit.',
    '배포하고 시연했습니다. 서버는 내려둔 상태이므로, 아래 주소는 방문할 곳이 아니라 어디에서 돌아갔는지에 대한 기록입니다.',
  ],

  'status.deployed': ['Deployed', '배포함'],
  'status.in-progress': ['In progress', '진행 중'],
  'status.archived': ['Archived', '보관'],
  'status.on-hold': ['On hold', '보류'],
  'status.offline': ['servers off', '서버 내림'],

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

  /* ── the studies' own output ───────────────────────────────────────── */
  'work.plates': ['What the analysis produced', '분석이 만든 자료'],
  'work.plates.lede': [
    'The plots as they came out of the scripts. Every other figure on this site is redrawn from the study’s own data; these are the originals, and each names the file that drew it.',
    '스크립트에서 나온 그대로의 그림입니다. 이 사이트의 다른 그림은 모두 원본 데이터에서 다시 그린 것이고, 이 자료는 원본입니다. 각각 어떤 파일이 그렸는지 함께 적었습니다.',
  ],
  'plate.cinema.screens': [
    'CGV screen count against regional share, one panel per year from 2020 to 2024, with every region labelled.',
    'CGV 상영관 수와 지역 점유율을 2020–2024년 연도별로 나눈 산점도입니다. 모든 권역에 이름을 달았습니다.',
  ],
  'plate.cinema.consumption': [
    'Per-capita private consumption against regional share, 2020 to 2022. Pearson’s r is computed for each panel.',
    '1인당 민간소비지출액과 지역 점유율을 2020–2022년으로 나눈 산점도입니다. 패널마다 Pearson 상관계수를 계산했습니다.',
  ],
  'plate.cinema.population': [
    'Theatre count against district population across the country, with a fitted trend. Most districts hold one.',
    '전국 시군구 인구수 대비 영화관 수와 추세선입니다. 대부분의 시군구는 한 곳을 가집니다.',
  ],
  'plate.cinema.3d': [
    'Screens and seats against annual admissions, with a trend line fitted to each axis.',
    '상영관 수와 좌석 수를 연간 관객 수에 대해 그리고, 축마다 추세선을 적합했습니다.',
  ],
  'plate.cinema.wordcloud': [
    'What people write about one chain, after stopword filtering. One of three, one per operator.',
    '불용어를 걸러낸 뒤 한 체인에 대해 사람들이 쓴 말입니다. 운영사별로 세 장 중 하나입니다.',
  ],
  'plate.cinema.map': [
    'Every theatre in the country, geocoded from its address and clustered by proximity, coloured by operator.',
    '전국 영화관을 주소로 지오코딩해 근접도로 묶고 운영사별로 색을 준 지도입니다.',
  ],

  /* ── figure captions ───────────────────────────────────────────────── */
  'fig.pipeline': ['{title} — the pipeline end to end.', '{title} — 처음부터 끝까지의 파이프라인.'],
  'fig.pipeline.full': [
    '{title} — every stage, and the service that runs it.',
    '{title} — 모든 단계와, 각 단계를 실행하는 서비스.',
  ],
  'fig.architecture': [
    '{title} — the system as designed. Everything outlined in the accent is mine.',
    '{title} — 설계한 시스템 전체. 강조색으로 테두리를 두른 것이 제가 만든 영역입니다.',
  ],
  'fig.silentloss': [
    'One service, two lanes. Every request returned 200 and only one lane delivered.',
    '한 서비스, 두 경로. 모든 요청이 200을 반환했지만 실제로 전달한 것은 한쪽뿐이었습니다.',
  ],
  'fig.race': ['The same two writes, before and after the rule.', '같은 두 번의 쓰기를, 규칙 적용 전과 후로.'],
  'fig.routestages': [
    'Three stages. The model only reorders a route the deterministic stages produced.',
    '세 단계. 모델은 결정적 단계가 만들어낸 경로의 순서를 바꾸는 일만 합니다.',
  ],
  'fig.pricing': [
    'Revenue over the max-price baseline, by churn sensitivity. The m=1 bar is faint because it is not significant.',
    '이탈 민감도별, 최고가 기준선 대비 매출입니다. m=1 막대가 흐린 이유는 유의하지 않기 때문입니다.',
  ],
  'fig.pricing.alg': [
    'Figure 2(b), redrawn. At the setting where price sensitivity is lowest, the learned policy has nothing to beat.',
    'Figure 2(b)를 다시 그렸습니다. 가격 민감도가 가장 낮은 설정에서는 학습된 정책이 이길 대상이 없습니다.',
  ],
  'fig.crime.heatmap': [
    'Every pair of variables, before any coefficient was read. Streetlights and average income move together at 0.71 — the reason the collinearity check was run.',
    '계수를 읽기 전에 확인한 변수 쌍 전체입니다. 가로등 수와 평균소득이 0.71로 함께 움직이며, 다중공선성을 점검한 이유가 여기 있습니다.',
  ],
  'fig.crime.model': [
    'Five inputs, one model. The variable the project set out to confirm is the one that failed.',
    '입력 다섯 개, 모델 하나. 이 과제가 확인하려던 변수가 바로 탈락한 변수입니다.',
  ],
  'fig.crime.fit': [
    'What five variables account for, and what they do not.',
    '다섯 변수가 설명하는 부분과, 설명하지 못하는 부분.',
  ],
  'fig.crime.resid': [
    'Actual minus predicted, by district. Red is where the model expects more crime than there is; blue is where it expects less.',
    '자치구별 실측값에서 예측값을 뺀 값입니다. 붉은 쪽은 모델이 실제보다 많이 예측한 곳, 푸른 쪽은 적게 예측한 곳입니다.',
  ],
  'fig.cinema.trend': [
    'Eighteen years of the national box office. The study starts where the line falls.',
    '전국 박스오피스 18년입니다. 분석은 이 선이 꺾이는 지점에서 시작합니다.',
  ],
  'fig.cinema.words': [
    'What people write about one chain, after stopword filtering. Parking and the newest release come up more than the films do.',
    '불용어를 거른 뒤 한 체인에 대해 사람들이 쓴 말입니다. 영화 자체보다 주차와 최신작이 더 자주 나옵니다.',
  ],
  'fig.cinema.corr': [
    'Every coefficient positive, none of them significant. The premise did not survive the sample.',
    '모든 계수가 양수였지만 유의한 것은 하나도 없었습니다. 전제는 이 표본을 견디지 못했습니다.',
  ],
  'fig.beam.arch': [
    'The pipeline Section III.E describes: patched, reprogrammed, prefixed, and passed through a backbone that never moves.',
    'III.E절이 기술하는 파이프라인입니다. 패치, 재프로그래밍, 프리픽스를 거쳐, 끝까지 고정된 백본을 통과합니다.',
  ],
  'fig.beam.gain': [
    'Figure 7, redrawn. Every cell is the published value; BP-LLM and the cascaded LSTM are the two rows I implemented.',
    'Figure 7을 다시 그렸습니다. 모든 값은 게재된 값이며, BP-LLM과 cascaded LSTM 두 행이 제가 구현한 부분입니다.',
  ],
  'fig.beam.overhead': ['Table V, redrawn. What the gain costs at inference.', 'Table V를 다시 그렸습니다. 그 이득이 추론에서 치르는 비용입니다.'],
  'fig.beam.train': [
    'Average loss per epoch, from the run’s own log. A training curve — there was no held-out split to draw anything else from.',
    '실행 로그에서 가져온 에폭별 평균 손실입니다. 학습 곡선일 뿐입니다. 홀드아웃 분할이 없어 다른 것을 그릴 근거가 없습니다.',
  ],

  /* ── small labels ──────────────────────────────────────────────────── */
  'note.aria': ['Evidence for this claim: {body}', '이 주장의 근거: {body}'],
  'note.measured': ['Measured', '측정 조건'],
  'note.source': ['Source', '출처'],
  'verify.total': [
    'automated tests, counted in the repositories',
    '자동화 테스트, 저장소에서 직접 센 수',
  ],
  'label.external': ['External providers', '외부 제공자'],
  'arc.aria': [
    'Architecture: {external} external providers feeding a gateway, {services} services of which {mine} are mine, {clients} clients, and {stores} stores.',
    '아키텍처: 게이트웨이로 들어오는 외부 제공자 {external}곳, 서비스 {services}개 중 {mine}개가 제 담당, 클라이언트 {clients}개, 저장소 {stores}개.',
  ],
  'materials.inline': [
    'This browser will not display the file inline.',
    '이 브라우저는 파일을 페이지 안에 표시하지 못합니다.',
  ],
  'materials.newtab': ['Open it in a new tab', '새 탭에서 열기'],
  'materials.open': ['Open the full document', '전문 열기'],
  'label.figure': ['Fig.', '그림'],
  'label.builtby': ['built by me', '내가 만든 영역'],
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
    'The address is not one this site serves. The document itself is one page — everything is on it.',
    '이 사이트가 제공하는 주소가 아닙니다. 문서 자체는 한 페이지이며, 모든 내용이 그 안에 있습니다.',
  ],
  'label.home': ['Go to the document', '문서로 가기'],
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
      'Five variables explain 84% of the variation between districts — R² 0.843, adjusted 0.801, F-test p = 4.95e-07.',
      'Population and the density of entertainment venues carry it. CCTV count, the variable the study set out to test, is not significant at p = 0.297.',
      'Variance inflation runs 1.10 to 2.61, so collinearity is not distorting the coefficients.',
      'Residuals are mapped by district rather than predictions, which names the places the model gets wrong.',
    ],
    [
      '다섯 변수가 자치구 간 편차의 84%를 설명합니다. R² 0.843, 조정 R² 0.801, F검정 p = 4.95e-07.',
      '인구수와 유흥주점 밀도가 모델을 이끕니다. 이 분석이 검증하려던 변수인 CCTV 대수는 p = 0.297로 유의하지 않습니다.',
      '분산팽창계수는 1.10에서 2.61 사이로, 다중공선성이 계수를 왜곡하지 않습니다.',
      '예측값이 아니라 잔차를 자치구별로 지도에 그렸습니다. 모델이 틀린 지역이 이름으로 드러납니다.',
    ],
  ],
  'analysis.cinema.points': [
    [
      'Revenue fell 87.6% against its 2019 peak by 2021, and admissions 88.9% — from 227 million to 25 million.',
      'The premise was that regional market share follows screen count. It correlates for all three chains and is significant for none of them.',
      'Per-capita private consumption against share behaves the same way: positive, and indistinguishable from noise at eight regions.',
      'Collection was rewritten from a browser-driven crawler onto a documented search API, so the study rebuilds from one command.',
    ],
    [
      '2021년 매출은 2019년 정점 대비 87.6%, 관객 수는 88.9% 감소했습니다. 2억 2,700만 명에서 2,500만 명으로.',
      '전제는 지역 점유율이 스크린 수를 따른다는 것이었습니다. 세 체인 모두 상관은 있었지만 유의한 곳은 없었습니다.',
      '1인당 민간소비와 점유율도 마찬가지였습니다. 양의 상관이지만 8개 권역 표본에서는 잡음과 구분되지 않습니다.',
      '수집은 브라우저 구동 크롤러에서 문서화된 검색 API로 다시 작성했습니다. 명령 하나로 분석 전체가 재구축됩니다.',
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
