import Link from "next/link";
import { IconArrowRight } from "./DiscoveryIcons";

export function PodRhythmCard({
  podId,
  name,
  slotLabel,
}: {
  podId: string;
  name: string;
  slotLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ah-border/60 bg-gradient-to-br from-white/90 to-ah-bg-alt/40 px-4 py-3.5 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Your weekly circle</p>
        <p className="font-display text-base font-semibold text-ah-ink">{name}</p>
        <p className="text-xs text-ah-muted">{slotLabel}</p>
      </div>
      <Link
        href={`/pod/${podId}`}
        className="discovery-btn inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-ah-accent/10 px-4 py-2 text-sm font-semibold text-ah-accent ring-1 ring-ah-accent/20 transition hover:bg-ah-accent/15"
      >
        View
        <IconArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
