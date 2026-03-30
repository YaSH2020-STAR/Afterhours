"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { VenueForUi } from "@/data/discovery";
import { checkInVenue, leaveVenueReservation, reserveVenueSeat, setVenueHeading } from "@/actions/discovery";
import Link from "next/link";
import {
  IconArrowRight,
  IconBolt,
  IconBuilding,
  IconCheckIn,
  IconClock,
  IconMapPin,
  IconTable,
  IconTicket,
  IconUsers,
} from "./DiscoveryIcons";

function statusLabel(status: string | null) {
  if (!status) return null;
  if (status === "RESERVED") return "Joined";
  if (status === "HEADING") return "On the way";
  if (status === "CHECKED_IN") return "Checked in";
  return null;
}

export function VenueCard({ venue }: { venue: VenueForUi }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const badge = statusLabel(venue.userStatus);

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.ok && r.error) console.warn(r.error);
      router.refresh();
    });
  }

  return (
    <article className="card-consumer group/card overflow-hidden rounded-3xl">
      <div
        className="h-1.5 w-full origin-left bg-gradient-to-r from-ah-accent/80 via-ah-accent-soft/55 to-ah-warm/55 transition duration-500 group-hover/card:opacity-100"
        aria-hidden
      />

      <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ah-accent/10 text-ah-accent ring-1 ring-ah-accent/15">
              <IconBuilding className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.125rem] font-semibold leading-snug tracking-tight text-ah-ink sm:text-[1.2rem]">
                {venue.name}
              </h3>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-ah-muted">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-ah-muted/80" />
                <span>
                  {venue.neighborhood ?? venue.address ?? venue.city}
                  {venue.distanceLabel ? ` · ${venue.distanceLabel}` : ""}
                </span>
              </p>
            </div>
          </div>
          {venue.hostLabel && (
            <span className="shrink-0 rounded-full bg-ah-accent/[0.09] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ah-accent">
              {venue.hostLabel}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 ring-1 ring-black/[0.04]">
          <IconClock className="h-[18px] w-[18px] shrink-0 text-ah-accent/90" />
          <p className="text-sm font-semibold text-ah-ink">{venue.scheduleLabel}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {venue.vibes.map((v) => (
            <span
              key={v}
              className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-ah-ink/90 ring-1 ring-black/[0.05] transition-colors group-hover/card:bg-black/[0.05]"
            >
              {v}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-black/[0.06] ring-1 ring-black/[0.06]">
          <div className="flex flex-col items-center gap-1 bg-ah-bg-alt/45 px-2 py-4 text-center sm:py-5">
            <IconTable className="h-4 w-4 text-ah-accent/85" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Open</p>
            <p className="font-display text-xl font-semibold tabular-nums text-ah-accent sm:text-2xl">{venue.seatsAvailable}</p>
          </div>
          <div className="flex flex-col items-center gap-1 bg-ah-bg-alt/35 px-2 py-4 text-center sm:py-5">
            <IconTicket className="h-4 w-4 text-ah-muted" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Held</p>
            <p className="text-lg font-semibold tabular-nums text-ah-ink sm:text-xl">{venue.reservedCount}</p>
          </div>
          <div className="flex flex-col items-center gap-1 bg-ah-bg-alt/45 px-2 py-4 text-center sm:py-5">
            <IconUsers className="h-4 w-4 text-ah-muted" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Here</p>
            <p className="text-lg font-semibold tabular-nums text-ah-ink sm:text-xl">{venue.checkedInCount}</p>
          </div>
        </div>

        {badge && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-ah-accent/[0.07] px-3 py-2 text-xs font-medium text-ah-accent ring-1 ring-ah-accent/15">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ah-accent" aria-hidden />
            <span className="text-ah-muted">You</span>
            <span className="text-ah-ink">{badge}</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={
              pending ||
              venue.seatsAvailable === 0 ||
              venue.userStatus === "CHECKED_IN" ||
              venue.userStatus === "RESERVED" ||
              venue.userStatus === "HEADING"
            }
            onClick={() => run(() => reserveVenueSeat(venue.id))}
            className="discovery-btn rounded-full bg-ah-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(45,90,74,0.55)] hover:bg-ah-accent-soft disabled:cursor-not-allowed disabled:opacity-45"
          >
            <IconTicket className="h-4 w-4 opacity-95" />
            Reserve
          </button>
          <button
            type="button"
            disabled={pending || venue.userStatus !== "RESERVED"}
            onClick={() => run(() => setVenueHeading(venue.id))}
            className="discovery-btn rounded-full bg-black/[0.06] px-5 py-2.5 text-sm font-semibold text-ah-ink hover:bg-black/[0.1] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconBolt className="h-4 w-4" />
            On the way
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => checkInVenue(venue.id))}
            className="discovery-btn rounded-full bg-ah-warm/14 px-5 py-2.5 text-sm font-semibold text-ah-ink ring-1 ring-ah-warm/30 hover:bg-ah-warm/22"
          >
            <IconCheckIn className="h-4 w-4 text-ah-warm" />
            Check in
          </button>
          <button
            type="button"
            disabled={pending || !venue.userStatus}
            onClick={() => run(() => leaveVenueReservation(venue.id))}
            className="discovery-btn rounded-full px-5 py-2.5 text-sm font-semibold text-ah-muted ring-1 ring-black/[0.12] hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-35"
          >
            Leave
          </button>
          <Link
            href={`/open-tables#venue-${venue.id}`}
            className="discovery-btn inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ah-muted hover:text-ah-accent"
          >
            Details
            <IconArrowRight className="h-3.5 w-3.5 opacity-70 transition group-hover/card:translate-x-0.5 group-hover/card:opacity-100" />
          </Link>
        </div>
      </div>
    </article>
  );
}
