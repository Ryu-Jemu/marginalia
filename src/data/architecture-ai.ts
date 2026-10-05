import type { ArchitectureModel, ArchitectureNode, ArchitectureEdge } from './architecture-types';
const n=(id:string,label:string,detail:string,icon:ArchitectureNode['icon'],x:number,y:number,role:ArchitectureNode['role']='owned',roleLabel?:string):ArchitectureNode=>({id,label,detail,icon,x,y,width:216,height:96,role,roleLabel});
const e=(from:string,to:string,kind:ArchitectureEdge['kind'],points:[number,number][],label?:string,labelX?:number,labelY?:number):ArchitectureEdge=>({from,to,kind,points,label,labelX,labelY});

export const aiArchitectures:Record<string,ArchitectureModel>={
  'mini-project-glove':{
    id:'glove',title:'GLove 문서 · 검색 · 답변 구성',summary:'규칙 번호 · 의미 · 키워드 검색을 문맥 선택과 연결',width:880,height:650,
    zones:[
      {id:'document',label:'문서 준비',x:8,y:8,width:864,height:190},
      {id:'query',label:'질문 · 검색 · 답변',x:8,y:230,width:864,height:410},
    ],
    nodes:[
      n('rules','규칙 원문','야구 규칙 문서','book',24,76,'external','원문 규칙 자료'),
      n('ingest','문서 수집 · 분할','조항 · 상위 절 구조','layers',332,76),
      n('minio','MinIO','수집 원문 보관','database',640,76,'shared','객체 저장 연동'),
      n('web','Streamlit','질문 · 근거 확인','code',24,290),
      n('api','FastAPI','질문 처리 · 응답 스키마','route',332,290),
      n('retrieval','검색 · 문맥 선택','정확 일치 · 의미 · BM25','search',640,290),
      n('llm','언어 모델','문맥 기반 답변 생성','brain',24,500,'external','외부 모델 활용'),
      n('answer','답변 · 인용 검사','구조화 응답 · 조항 연결','check',332,500),
      n('postgres','PostgreSQL','pgvector · 규칙 조항','database',640,500,'shared','검색 자료 저장'),
    ],
    edges:[
      e('rules','ingest','request',[[240,124],[332,124]]),
      e('ingest','minio','storage',[[548,124],[640,124]]),
      e('ingest','postgres','storage',[[440,172],[440,216],[864,216],[864,548],[856,548]]),
      e('web','api','request',[[240,338],[332,338]]),
      e('api','retrieval','request',[[548,338],[640,338]]),
      e('retrieval','postgres','storage',[[748,386],[748,500]]),
      e('retrieval','answer','request',[[684,386],[684,440],[500,440],[500,500]],'조항 · 상위 절',592,428),
      e('answer','llm','request',[[332,548],[240,548]]),
      e('answer','api','request',[[404,500],[404,386]],'인용 포함 응답',447,466),
    ],
    notes:['정확 일치·벡터·키워드 검색을 함께 사용하고, 선택한 규칙 조항을 답변의 근거로 연결.'],
  },
  examiner:{
    id:'examiner',title:'examiner 에이전트 · 근거 구성',summary:'주장별 근거를 검색하고 찬반 토론과 판정 보호를 연결',width:880,height:670,
    zones:[
      {id:'entry',label:'입력 · 모델',x:8,y:8,width:864,height:190},
      {id:'graph',label:'LangGraph · 본인 구현 흐름',x:8,y:230,width:864,height:422},
    ],
    nodes:[
      n('api','웹 UI · FastAPI','검토할 문장 입력','code',24,76),
      n('extract','주장 추출','문장별 검토 대상','layers',332,76),
      n('llm','언어 모델','역할별 프롬프트 호출','brain',640,76,'external','외부 모델 활용'),
      n('search','근거 검색','주장별 문서 검색','search',24,290),
      n('debate','찬반 에이전트','근거를 연결한 논거','user',332,290),
      n('judge','판사 · 종료 조건','인용 대조 · 판정 보호','check',640,290),
      n('corpus','Chroma','번들 문서 코퍼스','database',24,518,'shared','저장 자료 기반 검색'),
      n('synthesis','결과 합성','판정 · 근거 · 남은 한계','book',332,518),
    ],
    edges:[
      e('api','extract','request',[[240,124],[332,124]]),
      e('extract','llm','request',[[548,124],[640,124]]),
      e('extract','search','request',[[440,172],[440,218],[224,218],[224,290]]),
      e('search','corpus','storage',[[132,386],[132,518]]),
      e('search','debate','request',[[240,338],[332,338]]),
      e('debate','llm','request',[[496,290],[496,206],[748,206],[748,172]]),
      e('debate','judge','request',[[548,338],[640,338]]),
      e('judge','search','request',[[690,386],[690,444],[80,444],[80,386]],'필요 시 추가 검색',468,432),
      e('judge','synthesis','request',[[800,386],[800,566],[548,566]],'종료 · 합성',695,554),
    ],
    notes:['검색 대상은 번들 문서 집합. 판사는 주장별 인용을 대조하고 필요한 경우 근거 부족 판정으로 변경.','찬반 검토 핵심 경로를 표시. 별도 기법 분류는 검색과 병렬 실행 후 결과 합성에 합류.'],
  },
};
