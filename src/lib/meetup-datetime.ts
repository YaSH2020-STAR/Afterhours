/**
 * HTML date + time inputs are "local wall clock" for the app's discovery region (Phoenix metro).
 * Node on Vercel uses UTC; parsing `YYYY-MM-DDTHH:mm` without a zone would interpret as UTC, not local.
 * We pin an offset for America/Phoenix (no DST), matching `DISCOVERY_CITY`.
 */
const DISCOVERY_WALL_OFFSET = "-07:00";

/** Combine HTML date + time into an absolute `Date` (UTC instant). */
export function combineLocalDateTime(dateStr: string, timeStr: string): Date | null {
  const d = new Date(`${dateStr}T${timeStr}:00${DISCOVERY_WALL_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d;
}
