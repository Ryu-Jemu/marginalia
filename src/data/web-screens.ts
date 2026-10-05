import type { ImageMetadata } from 'astro';
import careerSearch from '../assets/projects/careerradar/search.jpg';
import careerFilters from '../assets/projects/careerradar/filters.jpg';
import cinemaMap from '../assets/projects/cinema-dashboard/map.jpg';
import examinerInput from '../assets/projects/examiner/input.jpg';

interface WebScreenSet {
  name: string;
  shots: { image: ImageMetadata; label: string; alt: string }[];
}

// Browser captures from the original applications. Provenance stays in docs/web-capture-sources.md.
export const webScreens: Record<string, WebScreenSet> = {
  careerradar: {
    name: 'CareerRadar',
    shots: [
      { image: careerSearch, label: '기술 키워드 검색', alt: 'CareerRadar에서 Python을 검색한 실제 화면. 회사별 공고와 직무·기술, 플랫폼별 원천 링크를 한 목록에서 확인.' },
      { image: careerFilters, label: '직무·상세 조건 필터', alt: 'CareerRadar의 데이터 엔지니어링 직무 선택 화면. 지역·경력·마감·기술 필터와 조건에 맞는 공고 목록.' },
    ],
  },
  'cinema-dashboard': {
    name: '영화관 시장 분석',
    shots: [
      { image: cinemaMap, label: '영화관·지하철역 분포', alt: '영화관 분석 대시보드의 실제 지도. 수도권 영화관 군집과 지하철역 위치를 같은 지도에 표시.' },
    ],
  },
  examiner: {
    name: 'examiner',
    shots: [
      { image: examinerInput, label: '주장 입력·이미지 첨부', alt: 'examiner의 실제 입력 화면. 재활용 관련 주장을 입력한 상태와 이미지 첨부·실행 버튼. 판정 실행 전 화면.' },
    ],
  },
};
