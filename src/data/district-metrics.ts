// Population input only. Source and boundary provenance: docs/district-map-sources.md.
export const districtPopulation = [
  { name: '강남구', population: 563215 },
  { name: '강동구', population: 481474 },
  { name: '강북구', population: 289374 },
  { name: '강서구', population: 562194 },
  { name: '관악구', population: 495620 },
  { name: '광진구', population: 348652 },
  { name: '구로구', population: 411916 },
  { name: '금천구', population: 239070 },
  { name: '노원구', population: 496552 },
  { name: '도봉구', population: 306032 },
  { name: '동대문구', population: 358603 },
  { name: '동작구', population: 387352 },
  { name: '마포구', population: 372745 },
  { name: '서대문구', population: 318622 },
  { name: '서초구', population: 413076 },
  { name: '성동구', population: 281289 },
  { name: '성북구', population: 435037 },
  { name: '송파구', population: 656310 },
  { name: '양천구', population: 434351 },
  { name: '영등포구', population: 397173 },
  { name: '용산구', population: 217194 },
  { name: '은평구', population: 465350 },
  { name: '종로구', population: 149608 },
  { name: '중구', population: 131214 },
  { name: '중랑구', population: 385349 },
] as const;

export interface PopulationBand {
  min: number;
  max: number;
  label: string;
  lower: string;
  upper: string;
  color: string;
}

export const populationBands: readonly PopulationBand[] = [
  { min: 0, max: 250000, label: '25만 미만', lower: '25만 미만', upper: '', color: '#e6effb' },
  { min: 250000, max: 350000, label: '25만 이상 35만 미만', lower: '25만 이상', upper: '35만 미만', color: '#b8d2f0' },
  { min: 350000, max: 450000, label: '35만 이상 45만 미만', lower: '35만 이상', upper: '45만 미만', color: '#7bafde' },
  { min: 450000, max: 550000, label: '45만 이상 55만 미만', lower: '45만 이상', upper: '55만 미만', color: '#4384bc' },
  { min: 550000, max: Infinity, label: '55만 이상', lower: '55만 이상', upper: '', color: '#205580' },
];

export const populationByDistrict: Readonly<Record<string, number>> = Object.fromEntries(
  districtPopulation.map(({ name, population }) => [name, population]),
);

export function populationBandFor(population: number): PopulationBand {
  const band = populationBands.find(({ min, max }) => population >= min && population < max);
  if (!Number.isFinite(population) || !band) throw new Error('Invalid district population');
  return band;
}
