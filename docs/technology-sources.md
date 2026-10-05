# 기술 스택·선택 근거 내부 출처

공개 데이터는 `src/data/project-technology.ts`의 `technologyChoices`. 프로젝트별 요구, 현재 기술의 적합성, 실제 적용 범위만 출력. 이 문서의 원본 경로·커밋·대조 기록은 공개 UI에 출력하지 않음.

## 표현 기준

- 선택 이유는 **현재 구현을 읽고 정리한 기술적 적합성**. 당시 개인이 대안을 비교해 독자적으로 결정했다는 주장이 아님.
- `src/content/projects.json`의 실제 12개 프로젝트 및 기여 내용과 대조. 개인 기여 비율·독점 소유·미측정 성능 우위 없음.
- 구현 상태는 `src/content/evidence.json`의 최신 정리와 원본 코드 우선. README의 목표·오래된 소개를 완료 기능으로 옮기지 않음.
- 측정 수치를 추가하지 않음. 연구 수치와 조건은 기존 도표 및 `docs/research-visual-sources.md`에서 관리.
- 원본 저장소·PDF 읽기만 수행. 모델 호출·학습·수집·배포·외부 쓰기 없음.
- 데이터 자체 검사: 12개 프로젝트 키 일치, 42개 선택 항목, 프로젝트별 3~4개, 필드·ID·한국어·공개 메타데이터 검사 통과. esbuild TypeScript 변환 진단 없음. 전체 사이트 타입·빌드·브라우저 확인은 통합 단계에서 별도 수행.

## 홈 핵심 배지 제안

12개: **Python · FastAPI · LangGraph · Spring Boot · PostgreSQL/PostGIS · Redis · Flutter · Docker · Google Cloud · PyTorch · pandas · RabbitMQ**.

| 배지 | 확인된 적용 범위 |
|---|---|
| Python | AI 서비스, 데이터 수집·분석, 연구 실험 |
| FastAPI | MAP Agent/Hub, Dartoo Disclosure, GLove, examiner의 API |
| LangGraph | MAP 추천 그래프, examiner 검색·토론·판단 |
| Spring Boot | MAP 앱 BFF·도메인, StarIndex ETL |
| PostgreSQL/PostGIS | MAP 도메인 저장·공간 조회. pgvector는 GLove의 별도 확장 |
| Redis | MAP 캐시·Streams, Dartoo 캐시·재시도·Summary 카운터 |
| Flutter | MAP 공동 화면 위 API·인증·동의·오류 처리 통합 |
| Docker | MAP 서비스 Compose 구성·컨테이너 실행 경로 |
| Google Cloud | MAP 운영·시험 환경과 관측 구성. **환경 구성 중** 문맥 유지 |
| PyTorch | BP-LLM 입력 결합·학습 모듈, 강화학습 라이브러리 기반 실험 |
| pandas | 범죄·영화관 분석 자료 정리·결합 |
| RabbitMQ | Dartoo Celery 작업 큐·공시 이벤트 전달 |

‘사용 기술’ 또는 ‘핵심 기술’로 표시. 숙련도 점수·전문가 등급 없음. Google Cloud 배지 자체를 운영 완료 증거로 사용하지 않음. Airflow·SwiftUI·MinIO·Chroma·MediaPipe 등은 해당 상세에서 표시.

## 프로필 README·첨부 PDF

- [Ryu-Jemu/Ryu-Jemu README](https://github.com/Ryu-Jemu/Ryu-Jemu/blob/main/README.md), [원문](https://raw.githubusercontent.com/Ryu-Jemu/Ryu-Jemu/main/README.md)의 기술 배지를 후보 목록으로 참고.
- 프로필에 남은 MAP의 과거 심사 상태, IEEE 논문의 공동저자 설명, BP-LLM의 비교 표현, 예전 웹사이트 프레임워크는 현재 원장의 대체 근거로 사용하지 않음.
- `/Users/ryujemu/Desktop/CJ올리브네트웍스_DataEngineer_포트폴리오.pdf`: PDF 3~4쪽 Dartoo Celery·RabbitMQ·MinIO와 발행 실패 정리, 6쪽 MAP 앱·저장소, 8쪽 GCP 시험 범위.
- `/Users/ryujemu/Desktop/ERAI_PreSKALA.pdf`: PDF 9~11쪽 Dartoo 수집·AI 리뷰, 12쪽 MAP Flutter·Spring Boot 통합, 14쪽 Docker 로그·실행 환경.
- `/Users/ryujemu/Desktop/SK하이닉스_AI해커톤_포트폴리오.pdf`: PDF 13·15쪽 MAP 구성, 18·20쪽 Dartoo 경로, 23쪽 GLove·examiner, 26쪽 Unity·MediaPipe.
- 쪽수는 PDF 파일 순서 기준. 인쇄된 푸터의 번호와 다를 수 있음. PDF의 NCP/GCP 분리는 당시 설명이며 현재 GCP 이전 준비 자료를 우선.

### 협업·AI 개발 도구

| 도구 | 직접 확인한 자료 | 표현할 수 있는 역할 |
|---|---|---|
| Claude Code | ERAI PDF 5·7쪽, SK PDF 6쪽 | 맥락·작업 분리, 개발·구현 보조 |
| Codex | ERAI PDF 5·7·12~14쪽, SK PDF 6·10·17쪽 | 재현 코드·구현·수정·회귀 보조, 본인의 결과 판단 |
| Gemini Code Assist | ERAI PDF 12쪽, SK PDF 10쪽 | MAP 코드 리뷰와 문제 발견 |
| Git | ERAI PDF 7쪽의 Git worktree 변경 분리 | 작업 단위의 변경 분리 |
| GitHub | SK PDF 표지·소개·프로젝트 소스 링크, 실제 공개 저장소 | 소스 저장·공유 |
| CodeRabbit | ERAI PDF 9~11쪽, SK PDF 10쪽 | Dartoo 코드 리뷰·수정 검토 |

Git/GitHub는 협업·개발 도구, Claude Code/Codex/Gemini Code Assist는 AI 개발 도구. Gemini Code Assist의 개발 리뷰 역할과 서비스 추론 모델 Gemini를 구분. AI 사용을 무인 운영·개인 기여의 대체로 서술하지 않음. 공개 페이지에 검사 건수·실행 일자를 추가하지 않음.

## 프로젝트별 원본

### MAP

기본 경로: `/Users/ryujemu/Desktop/MAP/`.

| 기술 | 원본과 역할 |
|---|---|
| LangGraph | `map-service-agent/app/graph/agent_graph.py`: 상태·노드·조건 분기. `map-service-agent/app/main.py`: FastAPI·Hub·완료 이벤트 경로 |
| Spring Boot | `map-service-user/build.gradle`; `map-service-user/src/main/java/map/service/user/recommend/RecommendJobsConsumer.java`; 같은 디렉터리의 `RecommendJobStore.java`: 완료 결과 저장·개인 결과 처리 |
| PostgreSQL/PostGIS | `map-service-infra/db/init/00-create-schemas.sql:14`; `map-service-hub/app/db/places_repo.py:134`: 미터 반경 조회·`ST_DWithin`·`ST_Distance`; `map-service-hub/app/db/rules_repo.py`: 경로·금지구역 관계 |
| Flutter | `src/content/evidence.json`의 `map-scope`·`map-consent` 및 첨부 PDF. 초기 화면·지도 공동 기반, 본인 API·인증·동의·오류 계약 연결 |

경로·재추천에는 공동 구현 포함. 초기 User 인증·재사용 캐시, Vision, Flutter 화면을 단독 신규 구현으로 표현하지 않음. PostGIS 반경·거리·공간 규칙 경로는 확인했으나 미측정 조회 성능 우위는 주장하지 않음.

Docker: `map-service-infra/README.md:11`, `docker-compose.yml`. GCP는 `src/content/evidence.json`의 `map-cloud`와 아래 자료:

- `/Users/ryujemu/Desktop/MAP/CLAUDE.md:10`
- `/Users/ryujemu/map-work/a-platform/map-service-infra/gcp/terraform/README.md:3`
- `/Users/ryujemu/map-work/a-platform/map-service-infra/.github/workflows/deploy.yml:69`
- `/Users/ryujemu/map-work/a-platform/map-service-infra/gcp/terraform/envs/test/iam.tf:11`
- `/Users/ryujemu/map-work/a-platform/map-service-infra/gcp/terraform/envs/prod/monitoring.tf:69`

OIDC·WIF는 GCP 인증, SSH는 별도 키 경로. OpenTofu 설정·시험 배포·VM 자원 관측 구성과 운영 환경 전체 이전 완료를 구분. 상시 운영·모든 경보 활성화·NCP 폐기 완료로 확대하지 않음.

### Dartoo

기본 경로: `/Users/ryujemu/Desktop/Dartoo/`.

- Celery/RabbitMQ: `dt-service-ingestion/consumer/worker.py`, `consumer/tasks.py`, `dt-service-summary/worker.py`의 작업 큐·소비·요약 연결.
- MinIO: `dt-service-ingestion/producer/services/storage_client.py:54`, `producer/main.py:243`·`:327`의 원문 저장·발행 실패 시 객체 정리.
- FastAPI: `dt-disclosure-service/app/main.py`, `app/api/disclosures.py`, `app/schemas/disclosure.py`, `app/services/event_publisher.py:72`의 API 계약·저장·이벤트.
- Redis: `dt-service-summary` 분산 카운터, `dt-service-ingestion` 재시도, `dt-service-notification/app/services/subscription_client.py` 구독자 캐시.
- 기여 원장: `/Users/ryujemu/Desktop/Ryu/Portfolio/00_공통/03_프로젝트원장/공통_원장_Dartoo_저장소_심층검증_최종_20260909.md`.
- Summary 공동 기반의 연동·형식·카운터 개선 범위. Lua 카운터는 Summary, 이벤트 식별·전달 재시도는 Notification에 한정. 큐 사용만으로 exactly-once·무손실 전달을 주장하지 않음.

### GLove

[공개 저장소](https://github.com/Ryu-Jemu/mini-project-glove), 브랜치 `master`, 읽기 사본 `/tmp/marginalia-glove-architecture/`.

- `src/baseball/db.py:75`·`:97`: 청크 스키마·pgvector 인덱스.
- `src/baseball/retriever.py:1`·`:109`·`:141`·`:174`·`:207`: 조항 번호·벡터·BM25, RRF 결합, 상위 문맥 확장·문맥량 제한.
- `src/baseball/ingest.py:38`·`:55`·`:71`·`:101`: 문서·청크·임베딩 적재.
- `src/baseball/api.py:102`·`:117`, `ui/api_client.py:75`, `src/baseball/chain.py:317`: FastAPI·SSE·Streamlit UI·구조화 응답.
- BM25는 프로세스 내 키워드 검색. 검색 결합을 정확도 향상 측정으로 표현하지 않음.

### examiner

[공개 저장소](https://github.com/Ryu-Jemu/examiner-agent), 원본 `/Users/ryujemu/Desktop/Ryu/Development/examiner-agent/`. 고정 소스 `f215c26e7c6b0de457c1beb49c1db06b10ab00eb`, 읽기 사본 `/tmp/marginalia-capture-sources/examiner/`.

- `factchecker/graph.py:19`: LangGraph 노드·병렬 단계·조건부 검색·종료.
- `factchecker/rag/vectorstore.py`, `factchecker/rag/evidence_retriever.py:41`: 저장 문서의 Chroma 인덱스·근거 검색.
- `server.py:80`·`:120`: FastAPI 요청·실행·구조화 결과.
- `factchecker/llm.py`: 설정 가능한 채팅 모델·Google 임베딩. Gemini의 모델 비교 우위 주장 없음.
- 저장된 데모 문서 집합 범위. 실시간 웹 검색·판정 정확도 평가 구현으로 확대하지 않음.

### 서울 범죄·시설 분석

[공개 저장소](https://github.com/Ryu-Jemu/crime-analysis), 소스 `103f8d7972dd81670bcc5fe7d08257f416b5bb71`.

- `Version02/preprocessing.py`, `mergedata.py`: pandas 정리·결합.
- `Version02/multi_regression.py`, `analysis_VIF.py`: statsmodels 회귀·VIF.
- `visualization.py`: Folium·GeoJSON 지도. `Lasso&Ridge.py`는 별도 비교 모형.
- `src/content/evidence.json`의 `crime-scope`·공통 분석 원장과 대조. 가로등 추정 자료·표본 범위 유지. 합계 산출 오류가 있는 범죄 절대건수·잔차를 새 성과로 공개하지 않음. 기술 적합성은 인과효과·정책 효과의 증명이 아님.

### 영화관 시장 분석

[공개 저장소](https://github.com/Ryu-Jemu/cinema-dashboard), 소스 `4f4a925708066b15e9470f64423fbfbbbb997838`, 읽기 사본 `/tmp/marginalia-capture-sources/cinema-dashboard/`.

- `Visualization.py:6`, `requirements.txt`: pandas 자료 처리.
- `text_analysis.py:53`·`:55`: Okt 명사 추출. `:99`·`:101`·`:110`: Naver 블로그 검색 API. `:135`·`:145`: 불용어·단어 필터.
- `Spot.py:15`·`:122`·`:130`: Folium 지도·마커. `pipeline.py`: 후속 개인 구현의 HTML 결합.
- Naver 검색 응답의 제목·요약을 활용하며 전체 블로그 본문 수집으로 확대하지 않음. 최초 공동 분석·발표와 후속 개인 대시보드를 분리. 단어 빈도를 만족도·긍정 비율로 해석하지 않음.

### 강화학습 요금 정책

기본 경로: `/Users/ryujemu/Desktop/Hanyang/학부연구생/Networking-Price/network-pricing/`.

- `src/env/network_slicing_env.py`: Gymnasium 상태·행동·보상·종료.
- `src/train/train_ppo.py`, `src/train/run_multi_seed.py`: Stable-Baselines3 연결·시드별 학습·평가.
- `src/train/stats_utils.py`, `src/train/run_multi_seed.py`: NumPy 집계·SciPy 비교.
- 환경·학습·평가의 분리가 현재 기술 적합성의 근거. 라이브러리 알고리즘을 독자 구현한 것으로 서술하지 않음. 실제 통신망 성과·전 조건 PPO 우위 주장 없음.
- 측정 조건·원고·결과 JSON은 `docs/research-visual-sources.md` 참고.

### BP-LLM

원본 `/Users/ryujemu/Desktop/Hanyang/학부연구생/Beam_Prediction/.ipynb_checkpoints/preprocess-checkpoint.ipynb`.

- cell 0: DeepMIMO 채널·각도 자료, 윈도 구성·전처리.
- cell 1: PyTorch 패치·어텐션·투영, Transformers `GPT2Model`·토크나이저, GPT-2 동결·결합 모듈 학습.
- 라벨 정합성 문제·독립 평가 부재 유지. 정확도·LSTM 대비 우위·추론 자원 절감·공동 서베이의 다른 사례 수치를 이 노트북 성과로 사용하지 않음.
- 계층·집필 범위·원장: `docs/research-visual-sources.md`.

### F1 Kiosk

[공개 저장소](https://github.com/Ryu-Jemu/f1-kiosk), 소스 `020f9ac9f0dde8d34e5d9e3212df21a0e3f0cbf3`, 읽기 사본 `/tmp/marginalia-capture-sources/f1-kiosk/`.

- `team.html`, `tec.html`, `rule.html`, `style.css`: 정적 화면·세로형 레이아웃·상태 스타일.
- `scripts/웹애플리케이션개발_Sketch_Team.js:235`: DOM 이벤트·탐색·타이머.
- `scripts/웹애플리케이션개발_Sketch_Tec.js`: 카드·오버레이.
- `scripts/웹애플리케이션개발_Resettimer.js`: 무입력 복귀.
- p5.js CDN 로딩은 있지만 확인한 핵심 동작은 DOM JavaScript. 선택 근거는 HTML/CSS/JavaScript로 작성. 실시간 F1 API·현재 시즌 정보 제공으로 설명하지 않음.

### 손 입력 AR

기본 경로: `/Users/ryujemu/Desktop/Ryu/Development/mobile-ar/`.

- `ARFingerDrawPoc/Packages/manifest.json`, `HandSpike/Packages/manifest.json`: Unity·AR Foundation·MediaPipe 의존성.
- `ARFingerDrawPoc/Assets/Scripts/AR/StrokeAnchorBinder.cs`: 공간 입력·앵커 연결.
- `HandSpike/Assets/Scripts/HandFingerDraw.cs`, `HandSpike/Assets/Scripts/StrokeBuffer.cs`: 손 입력·핀치·스트로크 버퍼.
- README·`src/content/evidence.json`의 `ar-scope` 대조. XR 시뮬레이션의 공간 연결과 Mac 웹캠의 고정 깊이 입력을 분리. Android 실기기 통합 완료로 표현하지 않음.

### CareerRadar

[공개 저장소](https://github.com/Ryu-Jemu/job-platform-pipeline), 소스 `d5906253ab4d51d30241202d92f729422382dda4`, 읽기 사본 `/tmp/marginalia-capture-sources/careerradar/`.

- `src/jobtrend/collect.py`, `src/jobtrend/transform.py`: 원천 수집·정제·원본 재처리.
- `src/jobtrend_dag.py:46`·`:52`·`:57`·`:72`: Airflow 재시도·태스크 의존성·실패 분기. 시작·종료 범위가 제한된 DAG이며 상시 운영 성과 주장 없음.
- `src/jobtrend/schema.sql:7`·`:32`·`:76`·`:122`·`:156`, `src/jobtrend/dedup.py`: 원본·정제·관측·통합 자료, `pg_trgm` 후보와 지역·마감·직무 조건. 완전한 중복 제거 보장 없음.
- `web/app.js`, `scripts/build_web.py`: 내장 자료 검색·필터·저장·CSV 및 정적 HTML 생성.
- 저장소 연결·기능 역할을 ‘전부 독자 구현’으로 확대하지 않음.

### StarIndex

[공개 저장소](https://github.com/Ryu-Jemu/starindex), 소스 `f84ec19ab80f9aa3b4635e91d357e62baabaa862`.

- `ios/App/Features/Sky/SkyScreen.swift`: SwiftUI Canvas·Metal 스카이뷰·상세 상태.
- `ios/Packages/SkySensors/Sources/SkySensors/CoreMotionAttitudeProvider.swift`: `CMMotionManager` 기기 자세·쿼터니언. 같은 디렉터리 `ManualAttitudeProvider.swift`: 수동 입력.
- `backend/src/main/java/dev/starindex/etl/EtlJobsConfig.java:97`·`:122`·`:234`: Spring Batch 수집·지수 계산·팩 발행. `backend/build.gradle.kts`: Spring Boot.
- `backend/src/main/resources/db/migration/V3__etl.sql`, `V5__forecast_hour.sql`, `backend/src/main/java/dev/starindex/etl/EtlRepository.java`: PostgreSQL 예보·천문·지수·팩 기록·조회.
- 천문 계산은 외부 Astronomy Engine·카탈로그 활용. Unity AR·VIIRS는 완료 기술로 사용하지 않음. 관측 성공 보장·App Store 출시·상시 운영 효과 주장 없음.
