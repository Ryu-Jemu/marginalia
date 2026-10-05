import type { ArchitectureModel, ArchitectureNode, ArchitectureEdge } from './architecture-types';
import { secondaryArchitectures } from './architecture-secondary';
import { newArchitectures } from './architecture-new';
import { aiArchitectures } from './architecture-ai';
import { mapArchitecture } from './architecture-map';

const node = (id: string, label: string, detail: string, icon: ArchitectureNode['icon'], x: number, y: number, role: ArchitectureNode['role'], roleLabel?: string): ArchitectureNode => ({id,label,detail,icon,x,y,width:160,height:96,role,roleLabel});
const edge = (from: string, to: string, kind: ArchitectureEdge['kind'], points: [number,number][], label?: string, labelX?: number, labelY?: number): ArchitectureEdge => ({from,to,kind,points,label,labelX,labelY});

const dartoo: ArchitectureModel = {
  id:'dartoo', title:'Dartoo 서비스 아키텍처',
  summary:'원문 보관 · 공시 조회 · 비동기 작업의 분리', width:1040,height:840,
  zones:[
    {id:'client',label:'외부 · 사용자',x:8,y:8,width:184,height:618},
    {id:'services',label:'서비스 내부 · 논리 구성',x:212,y:8,width:612,height:618},
    {id:'providers',label:'연동 대상',x:844,y:8,width:188,height:618},
    {id:'storage',label:'저장소',x:212,y:650,width:612,height:180},
  ],
  nodes:[
    node('web','React 웹','서비스 화면','code',20,76,'external','팀 구현'),
    node('gateway','Envoy','API 라우팅','route',230,76,'external','공동 기반'),
    node('user','User','Spring Boot','user',440,76,'shared','내부 API · 알림 스키마'),
    node('notification','Notification','구독자별 알림','mail',650,76,'owned','알림 서비스 구현'),
    node('fcm','FCM','웹 푸시','smartphone',860,76,'external','전달 제공자'),
    node('dart','Open DART','목록 · 공시 원문','book',20,292,'external','외부 공시 자료'),
    node('producer','Producer','목록 수집 · 원문 저장','code',230,292,'owned','수집 · 실패 처리'),
    node('broker','RabbitMQ','작업 큐 · 이벤트','layers',440,292,'shared','Celery · FANOUT 연결'),
    node('summary','Summary','Celery 요약 worker','brain',650,292,'shared','응답 검사 · 카운터 개선'),
    node('llm','LLM endpoint','요약 생성','brain',860,292,'external','모델 제공자'),
    node('consumer','Consumer','파싱 · 정규화','code',230,508,'owned','저장 API · 작업 발행'),
    node('disclosure','Disclosure','공시 · 요약 API','database',440,508,'owned','조회 · 이벤트 구현'),
    node('minio','MinIO','원문 객체','database',230,710,'shared','Producer · Summary 접근'),
    node('postgres','PostgreSQL','공시 · 사용자 · 알림','database',440,710,'shared','서비스별 데이터 저장'),
    node('redis','Redis','요약 카운터 · 캐시','database',650,710,'shared','Summary 카운터 개선'),
  ],
  edges:[
    edge('web','gateway','request',[[180,124],[230,124]],'API',204,112),
    edge('gateway','user','request',[[390,124],[440,124]]),
    edge('gateway','disclosure','request',[[310,172],[310,224],[422,224],[422,540],[440,540]]),
    edge('dart','producer','request',[[180,340],[230,340]],'수집',204,328),
    edge('producer','broker','event',[[390,340],[440,340]]),
    edge('broker','consumer','event',[[490,388],[490,442],[310,442],[310,508]],'수집 작업',360,432),
    edge('consumer','disclosure','request',[[390,556],[440,556]],'저장',415,578),
    edge('consumer','broker','event',[[358,508],[358,464],[548,464],[548,388]],'요약 작업',464,485),
    edge('broker','summary','event',[[600,340],[650,340]]),
    edge('summary','llm','request',[[810,340],[860,340]]),
    edge('summary','disclosure','request',[[700,388],[700,556],[600,556]],'요약 갱신',699,544),
    edge('disclosure','broker','event',[[570,508],[570,388]],'완료 이벤트',622,453),
    edge('broker','notification','event',[[560,292],[560,244],[730,244],[730,172]],'알림 이벤트',667,232),
    edge('notification','user','request',[[650,124],[600,124]]),
    edge('notification','fcm','request',[[810,124],[860,124]],'발송',835,112),
    edge('producer','minio','storage',[[256,388],[206,388],[206,754],[230,754]]),
    edge('summary','minio','storage',[[780,388],[780,668],[334,668],[334,710]],'원문 읽기',692,655),
    edge('disclosure','postgres','storage',[[520,604],[520,710]]),
    edge('user','postgres','storage',[[470,172],[470,206],[836,206],[836,694],[558,694],[558,710]]),
    edge('summary','redis','storage',[[750,388],[750,710]]),
  ],
  notes:[
    'Consumer의 공시 저장 → 요약 작업 → Summary의 요약 갱신 → 알림 이벤트 순서.',
    'Summary 기반·모델 제공자 확장은 공동 구현. 본인 범위는 연동·응답 정규화·카운터 개선.',
    'User는 내부 API·알림 스키마 담당. React·Envoy·FCM 전체 구현을 의미하지 않음.',
  ],
};

export const architectures: Record<string, ArchitectureModel> = { ...secondaryArchitectures, ...newArchitectures, ...aiArchitectures, map:mapArchitecture, dartoo };
