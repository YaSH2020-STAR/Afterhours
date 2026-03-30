/**
 * Pod assignment heuristic (demo / future work).
 * Prefer same metro, overlapping availability windows, compatible energy + group style.
 */
export function describeMatchingApproach(): string {
  return "We batch users by city, maximize schedule overlap, and keep energy/style within one step—never as a score you see.";
}
