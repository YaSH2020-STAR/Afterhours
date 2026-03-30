/** Season weeks are 0–6: intro, five meetups, closing. */
export const SEASON_WEEK_LABELS = [
  "Week 0 · Async intro",
  "Week 1 · First meetup",
  "Week 2 · Meetup",
  "Week 3 · Meetup (1:1 chat unlocks)",
  "Week 4 · Meetup",
  "Week 5 · Meetup",
  "Week 6 · Closing",
] as const;

export function getSeasonWeekIndex(startDate: Date, now: Date = new Date()): number {
  const ms = now.getTime() - startDate.getTime();
  if (ms < 0) return 0;
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const idx = Math.floor(days / 7);
  return Math.min(6, Math.max(0, idx));
}

export function canDirectMessage(weekIndex: number): boolean {
  return weekIndex >= 3;
}

export function weekPhaseDescription(weekIndex: number): string {
  if (weekIndex === 0) return "Async intros in the group thread—no pressure to perform.";
  if (weekIndex >= 1 && weekIndex <= 5) return "Same weekly slot; small ritual + presence.";
  return "Optional closing—same faces, clear ending.";
}
