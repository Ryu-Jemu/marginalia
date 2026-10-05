import type { ArchitectureModel, ArchitectureNode, ArchitectureEdge } from './architecture-types';

const node = (id: string, label: string, detail: string, icon: ArchitectureNode['icon'], x: number, y: number, role: ArchitectureNode['role'], roleLabel: string): ArchitectureNode => ({ id, label, detail, icon, x, y, width: 160, height: 96, role, roleLabel });
const edge = (from: string, to: string, kind: ArchitectureEdge['kind'], points: [number, number][], label?: string, labelX?: number, labelY?: number): ArchitectureEdge => ({ from, to, kind, points, label, labelX, labelY });

export const mapArchitecture: ArchitectureModel = {
  id: 'map',
  title: 'MAP 서비스 아키텍처',
  summary: '추천 요청 · 비전 연결 · 비동기 결과 저장의 분리',
  width: 1040,
  height: 904,
  zones: [
    { id: 'client', label: '사용자', x: 8, y: 8, width: 184, height: 190 },
    { id: 'services', label: '서비스 내부 · 논리 구성', x: 212, y: 8, width: 612, height: 644 },
    { id: 'providers', label: '외부 API · 기반 연동', x: 844, y: 8, width: 188, height: 644 },
    { id: 'storage', label: '데이터 저장소', x: 428, y: 704, width: 396, height: 188 },
  ],
  nodes: [
    node('app', 'Flutter', '모바일 앱', 'smartphone', 20, 76, 'shared', '공동 화면 · API 연동'),
    node('gateway', 'Gateway', 'Caddy · Nginx', 'route', 230, 76, 'owned', '진입점 구성'),
    node('user', 'User BFF', '인증 · 일정 · 추천', 'user', 440, 76, 'shared', '공동 기반 · 후속 개선'),
    node('agent', 'Agent', 'LangGraph 추천', 'brain', 650, 76, 'owned', '추천 · 경로 구현'),
    node('gemini', 'Gemini', '추천 추론 · 설명', 'brain', 860, 76, 'external', '외부 모델'),
    node('vision', 'Vision', 'YOLO · 이미지 추론', 'search', 230, 312, 'shared', '동의 · 자원 제한 개선'),
    node('hub', 'Hub', '장소 · 날씨 · 경로', 'compass', 650, 312, 'owned', '데이터 연동 구현'),
    node('sources', '원천 API', '장소 · 날씨 자료', 'link', 860, 312, 'external', 'Kakao · KMA 등'),
    node('consumer', '완료 컨슈머', 'User 내부 완료 처리', 'check', 440, 532, 'owned', '영구 결과 · 초안 연결'),
    node('streams', 'Streams', 'Redis 완료 이벤트', 'layers', 650, 532, 'external', '작업 결과 전달'),
    node('osrm', 'OSRM', '도보 · 자전거 경로', 'route', 860, 532, 'external', '경로 엔진 연동'),
    node('redis', 'Redis', '캐시 · 개인 편집본', 'database', 440, 772, 'external', '데이터 저장소'),
    node('postgres', 'PostgreSQL', '도메인 · 공간 데이터', 'database', 650, 772, 'external', '영구 결과 · PostGIS'),
  ],
  edges: [
    edge('app', 'gateway', 'request', [[180, 124], [230, 124]], 'API', 205, 112),
    edge('gateway', 'user', 'request', [[390, 124], [440, 124]]),
    edge('user', 'agent', 'request', [[600, 124], [650, 124]]),
    edge('agent', 'gemini', 'request', [[810, 124], [860, 124]]),
    edge('gateway', 'vision', 'request', [[310, 172], [310, 312]], '/ws/vision', 310, 251),
    edge('vision', 'user', 'request', [[390, 350], [410, 350], [410, 220], [480, 220], [480, 172]], '동의 permit', 454, 241),
    edge('agent', 'hub', 'request', [[700, 172], [700, 312]], '자료 조회', 679, 240),
    edge('hub', 'agent', 'request', [[760, 312], [760, 172]], '조회 응답', 781, 273),
    edge('hub', 'sources', 'request', [[810, 350], [860, 350]]),
    edge('hub', 'osrm', 'request', [[810, 384], [845, 384], [845, 580], [860, 580]], '경로', 880, 477),
    edge('agent', 'streams', 'event', [[810, 152], [833, 152], [833, 580], [810, 580]], '완료 · 실패', 775, 477),
    edge('streams', 'consumer', 'event', [[650, 580], [600, 580]]),
    edge('consumer', 'user', 'event', [[520, 532], [520, 172]], '결과 반영', 564, 433),
    edge('consumer', 'postgres', 'storage', [[560, 628], [560, 680], [690, 680], [690, 772]], '영구 결과', 578, 671),
    edge('consumer', 'redis', 'storage', [[480, 628], [480, 696], [544, 696], [544, 772]], '개인 초안', 483, 693),
    edge('user', 'postgres', 'storage', [[580, 172], [580, 196], [620, 196], [620, 750], [740, 750], [740, 772]]),
    edge('hub', 'redis', 'storage', [[650, 380], [630, 380], [630, 718], [560, 718], [560, 772]], '캐시', 588, 706),
    edge('hub', 'postgres', 'storage', [[790, 408], [820, 408], [820, 740], [780, 740], [780, 772]], '공간 자료', 767, 722),
  ],
  notes: [
    'Flutter·User·Vision의 공동 기반 위 API 연결·결과 격리·동의 처리 개선.',
    '완료 컨슈머는 User 내부 구성. 공유 생성 원본을 보존하고 개인 편집본을 분리.',
    'Hub의 원천 자료·OSRM 경로 연동과 Redis 캐시·PostGIS 공간 저장소를 구분.',
  ],
};
