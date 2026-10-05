import type { ArchitectureModel, ArchitectureNode, ArchitectureEdge } from './architecture-types';

const n = (id:string,label:string,detail:string,icon:ArchitectureNode['icon'],x:number,y:number,role:ArchitectureNode['role']='owned',roleLabel?:string): ArchitectureNode => ({id,label,detail,icon,x,y,width:216,height:96,role,roleLabel});
const e = (from:string,to:string,kind:ArchitectureEdge['kind'],points:[number,number][],label?:string,labelX?:number,labelY?:number): ArchitectureEdge => ({from,to,kind,points,label,labelX,labelY});
const base = (id:string,title:string,summary:string,height=600) => ({id,title,summary,width:880,height});

export const secondaryArchitectures: Record<string,ArchitectureModel> = {
  'crime-analysis':{
    ...base('crime-analysis','공공자료 분석 구성','서로 다른 원천을 자치구 단위의 분석 자료로 연결',590),
    zones:[{id:'input',label:'공공자료',x:8,y:8,width:248,height:562},{id:'analysis',label:'본인 담당 · 정제와 분석',x:300,y:8,width:572,height:562}],
    nodes:[
      n('public','기관별 자료','인구 · 소득 · 범죄','book',24,76,'external','공공기관 자료'),
      n('facilities','시설 자료','주소 · 영업 상태','compass',24,278,'external','가로등 일부 추정값'),
      n('clean','자료 정제','주소 · 인코딩 · 기준 통일','tool',332,76),
      n('join','자치구 결합','공통 지역 키 · 변수 구성','layers',332,278),
      n('model','회귀모형 비교','OLS · Lasso · Ridge','chart',640,76),
      n('diagnostic','변수 관계 확인','상관 · 다중공선성','search',640,278),
      n('map','Folium 지도','자치구 경계와 분석 연결','compass',486,456),
    ],
    edges:[e('public','clean','request',[[240,124],[332,124]]),e('facilities','join','request',[[240,326],[332,326]]),e('clean','join','request',[[440,172],[440,278]]),e('join','model','request',[[548,310],[596,310],[596,124],[640,124]]),e('model','diagnostic','request',[[748,172],[748,278]]),e('join','map','request',[[440,374],[440,424],[540,424],[540,456]]),e('diagnostic','map','request',[[748,374],[748,504],[702,504]])],
    notes:['팀 분석 중 자료 정제·회귀 비교·지도 구성 담당. 변수 관계의 탐색이며 인과효과 입증은 아님.'],
  },
  'cinema-dashboard':{
    ...base('cinema-dashboard','시장 분석 · 대시보드 구성','팀 분석 자료와 개인 후속 웹 산출물의 연결',590),
    zones:[{id:'source',label:'입력 자료',x:8,y:8,width:248,height:562},{id:'pipeline',label:'개인 후속 구현 · 분석 파이프라인',x:300,y:8,width:572,height:562}],
    nodes:[
      n('market','시장 자료','관객 · 매출 · 극장','book',24,76,'external','원천 통계 자료'),
      n('reviews','Naver API','리뷰 검색 · 주변 시설','search',24,278,'external','공식 검색 API'),
      n('clean','자료 정리','시계열 · 권역 · 주소','tool',332,76),
      n('location','입지 · 리뷰 분석','좌표 변환 · 키워드','compass',332,278),
      n('chart','비교 그래프','시장 추세 · 변수 관계','chart',640,76),
      n('map','Folium 지도','극장 · 주변 시설','compass',640,278),
      n('html','HTML 대시보드','지도 · 그래프 · 표 결합','code',486,456),
    ],
    edges:[e('market','clean','request',[[240,124],[332,124]]),e('reviews','location','request',[[240,326],[332,326]]),e('clean','chart','request',[[548,124],[640,124]]),e('clean','location','request',[[440,172],[440,278]]),e('location','map','request',[[548,326],[640,326]]),e('chart','html','request',[[856,124],[866,124],[866,426],[648,426],[648,456]]),e('map','html','request',[[748,374],[748,504],[702,504]])],
    notes:['최초 보고서·발표는 팀 공동 작업. 설정 기반 수집과 HTML 대시보드는 개인 후속 구현.'],
  },
  'network-pricing':{
    ...base('network-pricing','요금 정책 실험 구성','정책과 시뮬레이션 환경을 분리한 반복 의사결정',590),
    zones:[{id:'experiment',label:'본인 구현 · 실험 환경과 비교',x:8,y:8,width:864,height:562}],
    nodes:[
      n('conditions','실험 조건','요금 · 이탈 민감도','tool',24,76),
      n('policy','강화학습 정책','상태 입력 → 요금 선택','brain',332,76),
      n('environment','수요 환경','사용량 · 고객 이탈','layers',640,76),
      n('baseline','기준선 정책','동일 환경의 가격 결정','route',24,278),
      n('reward','상태 · 보상','수익과 고객 상태 갱신','chart',640,278),
      n('compare','정책 비교','장기 보상 · 대조 실험','search',332,456),
    ],
    edges:[e('conditions','policy','request',[[240,124],[332,124]]),e('conditions','baseline','request',[[132,172],[132,278]]),e('policy','environment','request',[[548,124],[640,124]],'요금',594,112),e('baseline','environment','request',[[240,326],[284,326],[284,222],[620,222],[620,148],[640,148]]),e('environment','reward','request',[[748,172],[748,278]]),e('reward','policy','request',[[640,326],[440,326],[440,172]],'다음 상태 · 학습',532,312),e('reward','compare','storage',[[748,374],[748,504],[548,504]]),e('baseline','compare','storage',[[132,374],[132,504],[332,504]])],
    notes:['연구실 지도·교신 아래 환경·실험·논문 작성 담당. 결과는 시뮬레이션 조건 안의 정책 비교.'],
  },
  'bp-llm':{
    ...base('bp-llm','시계열 · 언어 모델 결합','수치 입력과 텍스트 표현을 연결한 노트북 구현',590),
    zones:[{id:'input',label:'입력',x:8,y:8,width:248,height:562},{id:'model',label:'본인 구현 · 입력 투영과 학습 연결',x:300,y:8,width:572,height:562}],
    nodes:[
      n('series','입력 시계열','경로 인덱스 · 출발각','chart',24,76,'external','DeepMIMO 기반 자료'),
      n('prompt','텍스트 프롬프트','입력 특성 · 작업 설명','book',24,278),
      n('patch','패치 · 입력 투영','구간 분할 · 차원 변환','grid',332,76),
      n('attention','어텐션 결합','수치 패치와 텍스트 표현','layers',640,76),
      n('gpt','동결 GPT-2','언어 모델 표현','brain',640,278,'external','사전학습 모델 활용'),
      n('output','출력 투영','미래 시계열 출력','chart',332,278),
      n('training','학습 루프','학습 계층 · 최적화 연결','route',332,456),
    ],
    edges:[e('series','patch','request',[[240,124],[332,124]]),e('patch','attention','request',[[548,124],[640,124]]),e('prompt','attention','request',[[240,326],[286,326],[286,220],[610,220],[610,148],[640,148]]),e('attention','gpt','request',[[748,172],[748,278]]),e('gpt','output','request',[[640,326],[548,326]]),e('output','training','request',[[440,374],[440,456]]),e('training','patch','request',[[332,504],[308,504],[308,124],[332,124]],'계층 갱신',310,410)],
    notes:['입력 구성·모델 결합·학습 루프 구현 범위. 라벨 정합성과 독립 평가 보완 필요.'],
  },
};
