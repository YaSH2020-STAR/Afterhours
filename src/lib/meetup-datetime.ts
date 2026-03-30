/** Combine HTML date + time (local) into a Date. */
export function combineLocalDateTime(dateStr: string, timeStr: string): Date | null {
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}
