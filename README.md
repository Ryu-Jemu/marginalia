# marginalia

류제무의 한국어 개발 포트폴리오. 소개 → 대표 서비스 → 분야별 작업 목록 순서로 탐색합니다.
전체 이력·AI 활용 방식·SWOT은 첫 소개 영역에서 펼쳐볼 수 있습니다.
프로젝트 상세는 목차와 본문으로 구성하며 기능·기여·구조·STAR 문제 해결을 연결합니다.

## 실행

Node 22.12 이상 필요. `.node-version`의 버전을 권장합니다.

```sh
npm install
npm run dev
# 또는 npm run dev -- --background
npm run verify
npm run check
npm run build
npm run preview
```

백그라운드 서버: `npx astro dev status`, `npx astro dev logs`, `npx astro dev stop`.

## 콘텐츠와 라우팅

- `src/content/projects.json`: 프로젝트 소개, 기능, 기여, 구조, STAR 사례.
- `src/content/research.json`: 연구 질문, 접근 방법, 역할, 결과, 저자 순서.
- `src/content/evidence.json`: 내부 근거. 공개 각주나 브라우저 데이터로 출력하지 않음.
- `src/content.config.ts`: 단일 컬렉션의 스키마와 측정 조건 검사.
- `src/components/pages/`: 홈, 프로젝트 상세, 연구 상세.
- `src/data/architecture*.ts`: 프로젝트별 경계·구성 요소·방향 연결·기여 범위.
- `src/components/viz/ArchitectureDiagram.astro`: 아이콘·연결선·모션·텍스트 대안을 공유하는 아키텍처 도식.
- `src/styles/`: 공통 디자인 토큰, 레이아웃, 인쇄 화면.

`/`가 기본 한국어 주소입니다. 프로젝트는 `/work/<slug>/`, 연구는 `/research/<id>/`.
기존 `/ko/*` 주소는 기본 주소로 이동하며 JavaScript 사용 시 query와 hash를 보존합니다.
JavaScript 없이도 자동 이동과 기본 주소 링크를 제공합니다.
기존 홈 앵커 `pipelines`, `analysis`, `research`, `more`, `about`를 유지합니다.
그 밖의 작업은 CareerRadar·StarIndex로 구성합니다.
사용자 요청으로 Wealthy·Invader·F1 키오스크·공간 드로잉의 공개 항목과 상세 주소는 제거했습니다.
홈 기술 배지는 대표 프로젝트 상단에서 한 번만 표시하며, 선택 이유는 각 프로젝트 상세에서 제공합니다.

## 검수

`npm run verify`는 공개 주장, 내부 근거 참조, 한국어 문구·placeholder·링크,
검사 규칙의 실패 사례를 확인합니다. `npm run check`는 Astro·TypeScript 검사입니다.
`npm run build`는 verify를 먼저 실행하고, 생성 후 HTML의 간격·공개 메타데이터·
한국어 선언·내부 링크·앵커·이전 주소를 확인합니다.

외부 원본 프로젝트까지 있는 환경에서는 `node scripts/check-notes.mjs --local`로
근거 파일의 존재를 추가 확인할 수 있습니다. 일반 빌드는 다른 컴퓨터의 절대경로에 의존하지 않습니다.

수동 화면 검수는 1440·1024·768·390px에서 진행합니다. 전체 가로 넘침, 목업과 차트 잘림,
키보드 탐색, 화면 전환, SWOT 펼침, 모션 끔, reduced-motion을 확인합니다.
모션 없이도 내용과 완성된 도식이 표시되어야 합니다.

원본 앱 화면과 외부 논문을 제외한 공개 화면에는 날짜·기간·검증일·검사 건수·커밋·감사 기록을 넣지 않습니다.
공동 구현과 본인 개선, 수상과 선정, 연구 저자 순서는 근거대로 유지합니다.

## 배포

배포 설정은 `render.yaml`에 있으며 `main`의 commit을 기준으로 Render 자동 배포를 요청합니다.
push 전 콘텐츠·타입·빌드·생성 HTML·반응형 검수를 완료합니다.
원본 PDF와 프로젝트 저장소는 조사 자료로 유지합니다.
