// Values transcribed from the shared study exports; provenance stays in evidence.json.
// Crime outcome counts and residuals are intentionally excluded.
export const districtVariables = ['CCTV', '인구', '소득', '유흥주점', '가로등'] as const;
export const districtCorrelations = [
  [1, .54, .34, .18, .34],
  [.54, 1, .06, .01, .35],
  [.34, .06, 1, .18, .71],
  [.18, .01, .18, 1, .23],
  [.34, .35, .71, .23, 1],
] as const;

export const cinemaKeywords = [
  ['관람', 43], ['최신', 41], ['주차장', 40], ['주차', 39], ['대구', 33],
  ['시네마', 33], ['위치', 23], ['할인', 23], ['제공', 21], ['코엑스', 21],
  ['시설', 20], ['스타', 18], ['이번', 18], ['인기', 18], ['필드', 18],
  ['롯데', 17], ['돌비', 16], ['관객', 13], ['부산', 12], ['시아', 11],
] as const;
