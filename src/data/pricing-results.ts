export interface PricingPolicyResult {
  id: string;
  label: string;
  mean: number;
  /** Population SD of the three training-seed means; not an episode SD or CI. */
  seedStd: number | null;
  seedMeans: readonly number[];
  color: string;
}

/** Preserved conference experiment; the later journal protocol is separate. */
export const pricingResults = {
  title: '낮은 이탈 조건의 정책 비교',
  description: '최고가 기준선과 강화학습 정책의 평균·시드 간 편차 비교.',
  caption: '이탈 민감도 m = 1 · URLLC/eMBB · 외생 QoS · 에피소드 720스텝. 강화학습은 학습 시드 3개별 평가 20회 평균을 집계. 오차선은 시드 평균 간 표준편차이며, 최고가 기준선은 평가 20회의 평균만 표시.',
  unit: '누적 순보상 · 시뮬레이터 단위',
  formula: '누적 순보상: (청구 수익 − QoS 페널티) × 10⁻⁵의 에피소드 합계.',
  finding: '낮은 이탈 민감도에서 PPO와 최고가 기준선의 차이는 통계적으로 유의하지 않음 (p = 0.472, 논문 보고값).',
  trainingSeeds: [42, 123, 456] as const,
  axisMaximum: 8500,
  ticks: [0, 2000, 4000, 6000, 8000] as const,
  policies: [
    { id: 'ppo', label: 'PPO', mean: 7333.992583213748, seedStd: 243.07034624090343, seedMeans: [7677.467259517614, 7174.240648099444, 7150.269842024184], color: 'var(--icon-blue, #2357d9)' },
    { id: 'sac', label: 'SAC', mean: 7369.822912624568, seedStd: 542.257538629781, seedMeans: [6604.561526566516, 7709.487158772058, 7795.420052535131], color: 'var(--icon-teal, #167d79)' },
    { id: 'td3', label: 'TD3', mean: 6862.051039033632, seedStd: 56.036892017045126, seedMeans: [6792.322257560892, 6929.528658315181, 6864.302201224826], color: 'var(--icon-violet, #7051b8)' },
    { id: 'max-price', label: 'Max-Price', mean: 7182.888937446574, seedStd: null, seedMeans: [], color: 'var(--muted, #566171)' },
  ] satisfies readonly PricingPolicyResult[],
};
