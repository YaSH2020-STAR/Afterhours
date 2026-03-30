/** Lightweight demo signal: 0–100 from pod.healthScore + attendance ratio. */
export function podHealthPercent(baseScore: number, attendingRatio: number): number {
  const blended = baseScore * 0.6 + attendingRatio * 0.4;
  return Math.round(Math.min(1, Math.max(0, blended)) * 100);
}
