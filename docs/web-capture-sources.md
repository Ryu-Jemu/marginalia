# 실제 웹 실행 화면 출처

포트폴리오 이미지의 재현·검수용 내부 기록. 이 문서의 커밋·실행 주소·검수 내용은 공개 본문이나 이미지 캡션으로 출력하지 않음.

## 캡처 원칙

- 공개 저장소를 `/tmp/marginalia-capture-sources/` 아래에 격리 복제하고 실제 웹 화면 실행.
- CUA 브라우저에서 검색·필터·팀 전환·기술 항목 선택 등 기존 UI 조작 후 해당 화면 영역 캡처.
- 원본 코드·문구·데이터를 바꾸지 않고 UI 영역만 저장. 상단 관측·생성 시각, 실행 요약, 검증 라벨, 개발자 각주는 캡처 범위에서 제외.
- 공고 마감과 팀 정보는 원본 서비스의 기능 데이터로 유지. 포트폴리오 실적 수치나 현재 시점의 최신 정보로 사용하지 않음.
- 원본 프로젝트 저장소 변경 없음. 데이터 재수집·분석 파이프라인 재실행·임의 데이터 삽입 없음.
- LLM 호출·임베딩 인덱스 생성·검증 결과 생성 없음. examiner는 초기 입력 화면만 사용.

## 원천과 실행 범위

| 프로젝트 | 저장소 | 원천 커밋 | 로컬 실행 주소 | 실제 실행 범위 |
|---|---|---|---|---|
| CareerRadar | [job-platform-pipeline](https://github.com/Ryu-Jemu/job-platform-pipeline) | `d5906253ab4d51d30241202d92f729422382dda4` | `http://127.0.0.1:4411/` | 기존 `web/index.html`과 내장 자료를 사용한 검색·필터 |
| 영화관 분석 | [cinema-dashboard](https://github.com/Ryu-Jemu/cinema-dashboard) | `4f4a925708066b15e9470f64423fbfbbbb997838` | `http://127.0.0.1:4413/dashboard.html` | 기존 `outputs/dashboard.html`의 극장·지하철역 지도 |
| examiner | [examiner-agent](https://github.com/Ryu-Jemu/examiner-agent) | `f215c26e7c6b0de457c1beb49c1db06b10ab00eb` | `http://127.0.0.1:4414/` | 실제 FastAPI 서버의 초기 입력 UI |
| F1 Kiosk | [f1-kiosk](https://github.com/Ryu-Jemu/f1-kiosk) | `020f9ac9f0dde8d34e5d9e3212df21a0e3f0cbf3` | `http://127.0.0.1:4412/team.html`, `http://127.0.0.1:4412/tec.html` | 기존 정적 HTML/CSS/JS의 팀·기술 화면 |

CareerRadar는 위 커밋의 [codeload 원본 압축](https://codeload.github.com/Ryu-Jemu/job-platform-pipeline/tar.gz/d5906253ab4d51d30241202d92f729422382dda4)을 풀어 사용했으므로 캡처 복사본에 `.git`이 없음. 나머지 세 프로젝트는 공개 저장소를 복제하고 로컬 HEAD를 확인함.

## 이미지별 기록

| 저장 파일 | 캡처 내용 | 해석 범위 |
|---|---|---|
| `src/assets/projects/careerradar/search.jpg` | CareerRadar에서 Python 검색 | 내장 자료 대상 검색 UI. 신규 수집·현재 채용 시장 전체를 의미하지 않음 |
| `src/assets/projects/careerradar/filters.jpg` | CareerRadar의 DE 직무 필터 | 실제 브라우저 필터 상태. ETL·DB 재실행 없음 |
| `src/assets/projects/cinema-dashboard/map.jpg` | 극장·지하철역 지도 | 기존 분석 산출물의 지도 UI. OpenStreetMap 출처 표기 유지 |
| `src/assets/projects/examiner/input.jpg` | 텍스트·이미지 검증 입력 UI | 입력 화면만 캡처. 검증 결과·근거·토론 출력 미생성 |
| `src/assets/projects/f1-kiosk/team.jpg` | 팀 카드·선수 소개 | 프로젝트에 포함된 당시 팀 정보. 현재 시즌 정보로 소개하지 않음 |
| `src/assets/projects/f1-kiosk/technology.jpg` | 기술 항목·상세 설명 | 원본 키오스크의 기술 정보 탐색 UI |

## 실행 조건

- CareerRadar·영화관 분석·F1: Python 정적 파일 서버. 웹 재빌드 및 데이터 수집 스크립트 실행 없음.
- 영화관 분석: 생성 시각·소요 시간·단계 성공표를 캡처하지 않음. 지도 내 OpenStreetMap 표기는 유지. 예시 쇼핑몰 지도와 전처리 잔여 토큰이 있는 워드클라우드는 이번 캡처 대상에서 제외.
- examiner: 격리 가상환경에 `fastapi`, `uvicorn`, `python-dotenv`만 설치하고 원본 `server.py` 실행. `env -i`로 셸 API 키를 전달하지 않고 `.env`도 복사하지 않음. `/`, `/health`, `/api/config` 응답 확인까지만 수행. 모델·RAG 전체 기능 실행 결과로 제시하지 않음.
- F1: 원본의 고정 1080×1920 키오스크 레이아웃. 기존 팀 이미지·기술 설명 자산 사용. 미구현 Ranking 화면은 제외.
- 범죄 분석의 알려진 부정확한 절대 건수 자료는 이번 실행·캡처에 포함하지 않음.

## 종료 확인

캡처 후 포트 4411·4412·4413·4414의 임시 서버 종료. 4412·4413·4414는 프로세스 명령과 작업 폴더를 대조한 뒤 해당 프로세스만 정상 종료했고, 세 포트에 LISTEN 프로세스가 없음을 확인함. 4411도 담당 에이전트가 종료와 포트 비활성을 확인함. 포트폴리오 미리보기 등 다른 서버에는 영향 없음.
