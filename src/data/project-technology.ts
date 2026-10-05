export interface TechnologyChoice {
  id: string;
  label: string;
  need: string;
  reason: string;
  usage: string;
}

// 현재 구현의 요구와 적합성. 당시의 개인 의사결정이나 독점 기여를 뜻하지 않음.
export const technologyChoices: Record<string, TechnologyChoice[]> = {
  map: [
    {
      id: 'langgraph', label: 'LangGraph',
      need: '여러 단계로 나뉜 여행 추천',
      reason: '공유 상태와 조건 분기로 탐색·선정·경로 계산 연결',
      usage: '추천 노드와 실패 분기 구현 · 경로·재추천은 공동 구현',
    },
    {
      id: 'spring-boot', label: 'Spring Boot',
      need: '앱 계정·동의·추천 결과의 일관성',
      reason: '도메인 서비스와 트랜잭션으로 상태 변경의 경계 구성',
      usage: '공동 인증 기반 위 완료 처리·결과 격리·동의 개선',
    },
    {
      id: 'postgis', label: 'PostgreSQL · PostGIS',
      need: '좌표를 기준으로 한 장소 후보 조회',
      reason: '장소 속성과 공간 조건을 같은 저장소에서 조회',
      usage: '정규화한 장소의 반경 검색·거리 계산·공간 규칙 연결',
    },
    {
      id: 'flutter', label: 'Flutter',
      need: '여행 화면과 서버 상태의 연결',
      reason: '화면 상태와 비동기 API 응답을 같은 앱 흐름으로 구성',
      usage: '공동 화면·지도 위 API·인증·동의·오류 처리 통합',
    },
  ],
  dartoo: [
    {
      id: 'celery', label: 'Celery · RabbitMQ',
      need: '수집·저장·요약 작업의 분리',
      reason: '큐를 통한 작업 전달과 워커별 재시도 경로 구성',
      usage: 'Producer·Consumer 구현과 요약 작업 연동',
    },
    {
      id: 'minio', label: 'MinIO',
      need: '수집한 공시 원문의 보존',
      reason: '원문 객체와 작업 메시지를 분리해 후속 단계에서 재사용',
      usage: '원문 저장·조회와 발행 실패 시 잔류 객체 정리',
    },
    {
      id: 'fastapi', label: 'FastAPI',
      need: '공시 저장·조회와 서비스 간 계약',
      reason: '요청·응답 스키마를 API 경계에서 명시',
      usage: '공시 API·요약 갱신·이벤트 발행 경로 구현',
    },
    {
      id: 'redis', label: 'Redis',
      need: '서비스별 임시 상태와 캐시 관리',
      reason: '만료 가능한 키와 원자적 연산을 용도별로 분리',
      usage: '수집 재시도·알림 구독자 캐시 · Summary 카운터 개선',
    },
  ],
  'mini-project-glove': [
    {
      id: 'pgvector', label: 'PostgreSQL · pgvector',
      need: '규칙 원문과 의미 기반 검색의 연결',
      reason: '청크·조항 정보와 임베딩을 함께 저장·조회',
      usage: '문서 청크 적재와 벡터 검색·상위 문맥 연결',
    },
    {
      id: 'bm25', label: 'BM25',
      need: '질문에 등장한 규칙 용어의 검색',
      reason: '키워드 일치를 활용해 의미 검색과 다른 후보 확보',
      usage: '조항 번호·벡터·키워드 후보 결합과 문맥량 제한',
    },
    {
      id: 'fastapi', label: 'FastAPI',
      need: '검색·생성과 화면 표시의 분리',
      reason: 'API 계약과 스트리밍 경로로 답변 처리 단계 연결',
      usage: '구조화 답변·인용 처리와 SSE 전달',
    },
    {
      id: 'streamlit', label: 'Streamlit',
      need: '질문·답변·인용을 확인할 데모 화면',
      reason: 'Python 화면에서 검색 API와 답변 렌더러 연결',
      usage: '대화 UI와 단계별 응답 표시',
    },
  ],
  examiner: [
    {
      id: 'langgraph', label: 'LangGraph',
      need: '검색·토론·판단의 반복 흐름',
      reason: '병렬 단계와 조건부 재검색·종료 경로의 명시',
      usage: '주장 추출부터 판단·합성까지의 에이전트 그래프',
    },
    {
      id: 'chroma', label: 'Chroma',
      need: '저장 문서에서 주장별 근거 탐색',
      reason: '로컬 문서 임베딩의 보존과 유사 문서 조회',
      usage: '로컬 데모 문서 집합의 근거 검색',
    },
    {
      id: 'fastapi', label: 'FastAPI',
      need: '입력 화면과 에이전트 실행의 연결',
      reason: '분석 요청과 구조화 결과를 HTTP 계약으로 연결',
      usage: '텍스트 입력 API와 결과 화면 연동',
    },
  ],
  'crime-analysis': [
    {
      id: 'pandas', label: 'pandas',
      need: '형식이 다른 공공데이터의 결합',
      reason: '열·주소·자치구 기준을 정리한 뒤 표 단위로 결합',
      usage: '인코딩·영업 상태 정리와 자치구별 분석 자료 구성',
    },
    {
      id: 'statsmodels', label: 'statsmodels',
      need: '변수의 관계와 회귀모형 진단',
      reason: '회귀 계수·불확실성·다중공선성을 함께 확인',
      usage: 'OLS 회귀와 VIF 기반 다중공선성 분석',
    },
    {
      id: 'folium', label: 'Folium',
      need: '분석 자료의 지역별 탐색',
      reason: '자치구 경계와 자료를 연결한 HTML 지도 구성',
      usage: 'GeoJSON 기반 자치구 경계·분석 자료 연결',
    },
  ],
  'cinema-dashboard': [
    {
      id: 'pandas', label: 'pandas',
      need: '영화관·상권 자료의 비교',
      reason: '지역 기준의 자료 정리와 집계를 같은 흐름으로 처리',
      usage: '분석 표 구성과 후속 대시보드용 자료 변환',
    },
    {
      id: 'naver-api', label: 'Naver Search API',
      need: '영화관 관련 블로그 문서 수집',
      reason: '검색어와 응답 형식이 정해진 API로 수집 경로 구성',
      usage: '검색 제목·요약 수집과 키워드 분석 연결',
    },
    {
      id: 'konlpy', label: 'KoNLPy · Okt',
      need: '한국어 문서의 핵심 단어 추출',
      reason: '명사 추출 뒤 불용어를 제외해 빈도 집계 단위 구성',
      usage: '리뷰·블로그 문서의 키워드 후보 정리',
    },
    {
      id: 'folium', label: 'Folium',
      need: '영화관 위치와 분석 결과 탐색',
      reason: 'Python 자료를 지도 마커와 HTML 화면으로 연결',
      usage: '위치 지도 생성과 후속 개인 대시보드 통합',
    },
  ],
  'network-pricing': [
    {
      id: 'gymnasium', label: 'Gymnasium',
      need: '가격·고객 이탈을 포함한 순차 의사결정',
      reason: '상태·행동·보상·종료 조건을 환경 인터페이스로 분리',
      usage: '요금 정책을 비교할 수요 시뮬레이션 환경 구현',
    },
    {
      id: 'stable-baselines3', label: 'Stable-Baselines3',
      need: '동일한 환경에서의 학습 정책 비교',
      reason: '공통 환경에 여러 강화학습 알고리즘을 연결',
      usage: 'PPO·SAC·TD3 학습과 시드별 평가 구성',
    },
    {
      id: 'scipy', label: 'NumPy · SciPy',
      need: '반복 실험의 차이와 변동성 해석',
      reason: '배열 집계와 통계적 비교를 실험 조건에 맞춰 적용',
      usage: '정책별 평균·산포·차이 분석 · 시뮬레이션 범위',
    },
  ],
  'bp-llm': [
    {
      id: 'pytorch', label: 'PyTorch',
      need: '수치 입력과 언어 모델 표현의 결합',
      reason: '텐서 차원 변환과 학습 대상 모듈을 명시적으로 구성',
      usage: '패치·어텐션·입출력 투영 모듈과 회귀 학습 구현',
    },
    {
      id: 'transformers', label: 'Transformers',
      need: '사전 학습 언어 모델의 표현 활용',
      reason: 'GPT-2 토크나이저·임베딩·은닉 표현의 연결',
      usage: '동결 GPT-2에 텍스트 지시와 수치 표현 입력',
    },
    {
      id: 'deepmimo', label: 'DeepMIMO',
      need: '무선 채널 자료 기반의 시계열 입력',
      reason: '채널·각도 자료를 입력 구성 실험에 활용',
      usage: '윈도·정규화 전처리 · 라벨 정합성·독립 평가 보완 필요',
    },
  ],
  careerradar: [
    {
      id: 'python', label: 'Python',
      need: '원천별 수집 방식과 공고 정제의 분리',
      reason: '어댑터·정규화·재처리 단계를 모듈로 연결',
      usage: '동시 수집·재시도와 저장 원본 재처리 구현',
    },
    {
      id: 'airflow', label: 'Airflow',
      need: '수집부터 자료 생성까지의 실행 순서',
      reason: '태스크 의존성과 재시도 조건을 DAG로 표현',
      usage: '수집·정규화·자료 생성 태스크의 실행 구성',
    },
    {
      id: 'postgresql', label: 'PostgreSQL · pg_trgm',
      need: '원본·정제 자료·통합 공고의 연결',
      reason: '관계형 이력과 문자열 유사도를 같은 저장소에서 조회',
      usage: '공고 스냅샷·중복 후보 판정과 조건별 통합',
    },
    {
      id: 'javascript', label: 'JavaScript',
      need: '수집 자료를 직접 탐색할 화면',
      reason: '내장 자료를 브라우저에서 검색·필터링',
      usage: '독립 HTML의 검색·저장·CSV 내보내기',
    },
  ],
  starindex: [
    {
      id: 'swiftui', label: 'SwiftUI',
      need: '하늘 화면과 천체 정보의 연결',
      reason: '방향·선택 상태에 따라 화면과 상세 정보를 갱신',
      usage: 'Canvas·Metal 스카이뷰와 천체 상세 UI 연동',
    },
    {
      id: 'core-motion', label: 'CoreMotion',
      need: '기기를 향한 방향에 맞는 하늘 표시',
      reason: '기기 자세를 화면의 관측 방향으로 변환',
      usage: '센서 방향과 수동 탐색 입력의 연결',
    },
    {
      id: 'spring-boot', label: 'Spring Boot · Spring Batch',
      need: '공공데이터 수집과 관측 지수 팩 생성',
      reason: '수집·계산·발행을 작업과 단계로 분리',
      usage: '기상·천문 자료 ETL과 공용 팩 발행 경로 구현',
    },
    {
      id: 'postgresql', label: 'PostgreSQL',
      need: '지역·예보·처리 상태의 연결',
      reason: '자료 간 관계와 조회 조건을 스키마로 구성',
      usage: '예보·천문 자료 저장과 지수 계산 입력 조회',
    },
  ],
};
