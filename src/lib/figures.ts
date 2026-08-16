/**
 * Which plates a paper's page draws, and in which part of it.
 *
 * The page numbers its figures continuously, so the implementation section has
 * to know how many the findings section already used. Holding the answer here
 * rather than counting it inside the figure component means the number and the
 * plates come from one list and cannot drift apart.
 */
export type Plate =
  | 'pricing'
  | 'pricingAlgorithms'
  | 'beamGain'
  | 'beamOverhead'
  | 'beamArchitecture'
  | 'beamTraining';

export const RESEARCH_PLATES: Record<string, { findings: Plate[]; implementation: Plate[] }> = {
  'ask-2026': {
    findings: ['pricing', 'pricingAlgorithms'],
    implementation: [],
  },
  'ieee-tai-survey': {
    findings: ['beamGain', 'beamOverhead'],
    implementation: ['beamArchitecture', 'beamTraining'],
  },
};

export const platesFor = (id: string, part: 'findings' | 'implementation'): Plate[] =>
  RESEARCH_PLATES[id]?.[part] ?? [];
