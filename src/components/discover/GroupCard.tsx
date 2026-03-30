"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import type { GroupForUi } from "@/data/discovery";
import {
  checkInGroup,
  joinInterestGroup,
  leaveInterestGroup,
  setGroupHeading,
  setGroupInterested,
} from "@/actions/discovery";
import {
  IconArrowRight,
  IconBolt,
  IconCalendar,
  IconChatBubble,
  IconCheckIn,
  IconList,
  IconMapPin,
  IconSparkle,
  IconTicket,
  IconUsers,
} from "./DiscoveryIcons";

function fmtWhen(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusLabel(status: string | null) {
  if (!status) return null;
  if (status === "INTERESTED") return "Interested";
  if (status === "JOINED") return "Going";
  if (status === "WAITLIST") return "Waitlist";
  if (status === "HEADING") return "On the way";
  if (status === "CHECKED_IN") return "Checked in";
  return null;
}

function groupLifecycleLabel(status: string) {
  if (status === "cancelled") return "Cancelled";
  if (status === "completed") return "Completed";
  if (status === "full") return "Full";
  return null;
}

export function GroupCard({ group, viewerId }: { group: GroupForUi; viewerId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const badge = statusLabel(group.userStatus);

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await action();
      if (!r.ok && r.error) console.warn(r.error);
      router.refresh();
    });
  }

  const isHost = group.creatorUserId === viewerId;
  const participating = ["JOINED", "HEADING", "CHECKED_IN"].includes(group.userStatus ?? "");
  const waitlisted = group.userStatus === "WAITLIST";
  const interestedOnly = group.userStatus === "INTERESTED";
  const joinLabel =
    group.spotsLeft === 0 && !participating && !waitlisted && !interestedOnly
      ? "Join waitlist"
      : interestedOnly
        ? "Confirm going"
        : "Join";
  const lifecycle = groupLifecycleLabel(group.groupStatus);
  const closed = group.groupStatus === "cancelled" || group.groupStatus === "completed";
  const pastStart = group.startsAt < new Date();
  const canInteract = !closed && !pastStart;
  const showInterested =
    canInteract && !group.userStatus && group.groupStatus !== "full";
  const showLeave =
    !closed &&
    !isHost &&
    group.userStatus &&
    ["JOINED", "HEADING", "CHECKED_IN", "WAITLIST", "INTERESTED"].includes(group.userStatus);

  return (
    <article className="card-consumer-gradient group/card overflow-hidden rounded-3xl bg-gradient-to-b from-[var(--surface-elevated)] to-ah-bg-alt/45">
      <div
        className="h-1.5 w-full bg-gradient-to-r from-ah-warm/75 via-ah-accent/45 to-ah-accent-soft/65 transition duration-500"
        aria-hidden
      />

      <div className="px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ah-warm/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-warm ring-1 ring-ah-warm/20">
                <IconSparkle className="h-3 w-3" />
                {group.category}
              </span>
              {lifecycle && (
                <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ah-muted ring-1 ring-black/[0.08]">
                  {lifecycle}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-[1.125rem] font-semibold leading-snug tracking-tight text-ah-ink sm:text-[1.2rem]">
              {group.title}
            </h3>
            <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-ah-muted">
              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-ah-muted/85" />
              <span>{group.locationLabel}</span>
            </p>
            {group.neighborhood && (
              <p className="mt-1 pl-6 text-xs text-ah-muted/90">{group.neighborhood}</p>
            )}
            {group.address && (
              <p className="mt-1 pl-6 text-xs text-ah-muted/80">{group.address}</p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs font-medium capitalize leading-none text-ah-ink ring-1 ring-black/[0.07]">
            {group.intensity}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 ring-1 ring-black/[0.05]">
          <IconCalendar className="h-[18px] w-[18px] shrink-0 text-ah-accent/90" />
          <p className="text-sm font-semibold text-ah-ink">{fmtWhen(group.startsAt)}</p>
        </div>

        {group.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ah-muted">{group.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-ah-ink ring-1 ring-black/[0.06] backdrop-blur-sm">
            <IconSparkle className="h-3.5 w-3.5 text-ah-warm/90" />
            {group.vibe}
          </span>
          <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-ah-muted ring-1 ring-black/[0.05]">
            Min {group.minPeople} · max {group.maxPeople}
          </span>
          {group.joinedCount >= group.minPeople ? (
            <span className="rounded-full bg-ah-accent/12 px-3 py-1.5 text-xs font-semibold text-ah-accent ring-1 ring-ah-accent/20">
              Min met
            </span>
          ) : (
            <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-xs font-medium text-ah-muted ring-1 ring-black/[0.05]">
              Under min ({group.joinedCount}/{group.minPeople})
            </span>
          )}
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ah-muted">
            <span className="font-medium text-ah-ink/90">Participants</span>
            <span className="tabular-nums">
              {group.joinedCount} going · {group.spotsLeft} open · cap {group.maxPeople}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/[0.07]" aria-hidden>
            <div
              className="h-full rounded-full bg-gradient-to-r from-ah-accent/90 to-ah-accent-soft/90 transition-all"
              style={{
                width: `${group.maxPeople > 0 ? Math.min(100, Math.round((group.joinedCount / group.maxPeople) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-black/[0.05] pt-5 text-sm">
          <div className="flex items-baseline gap-2">
            <IconUsers className="h-4 w-4 text-ah-accent/80" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Going</p>
              <p className="font-display text-2xl font-semibold tabular-nums leading-none text-ah-accent">{group.joinedCount}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <IconTicket className="h-4 w-4 text-ah-muted/90" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Open seats</p>
              <p className="text-xl font-semibold tabular-nums leading-none text-ah-ink">{group.spotsLeft}</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <IconList className="h-4 w-4 text-ah-muted/85" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Waitlist</p>
              <p className="text-xl font-semibold tabular-nums leading-none text-ah-ink">{group.waitlistCount}</p>
            </div>
          </div>
        </div>

        {waitlisted && group.yourWaitlistPosition != null && (
          <p className="mt-3 rounded-xl bg-ah-warm/10 px-3 py-2 text-xs leading-snug text-ah-ink ring-1 ring-ah-warm/20">
            <span className="font-semibold">Waitlist #{group.yourWaitlistPosition}</span>
            <span className="text-ah-muted"> — first out when someone leaves (FIFO).</span>
          </p>
        )}

        {badge && (
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-ah-accent/[0.07] px-3 py-2 text-xs font-medium text-ah-accent ring-1 ring-ah-accent/15">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ah-accent" aria-hidden />
            <span className="text-ah-muted">You</span>
            <span className="text-ah-ink">{badge}</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          {closed ? (
            <span className="inline-flex items-center rounded-full bg-black/[0.05] px-5 py-2.5 text-sm font-semibold text-ah-muted ring-1 ring-black/[0.07]">
              {group.groupStatus === "cancelled" ? "Cancelled" : "Ended"}
            </span>
          ) : waitlisted ? (
            <span className="inline-flex items-center rounded-full bg-black/[0.05] px-5 py-2.5 text-sm font-semibold text-ah-muted ring-1 ring-black/[0.07]">
              On waitlist
            </span>
          ) : pastStart ? (
            <span className="inline-flex items-center rounded-full bg-black/[0.05] px-5 py-2.5 text-sm font-semibold text-ah-muted ring-1 ring-black/[0.07]">
              Started
            </span>
          ) : (
            <button
              type="button"
              disabled={pending || participating}
              onClick={() => run(() => joinInterestGroup(group.id))}
              className="discovery-btn rounded-full bg-ah-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(45,90,74,0.55)] hover:bg-ah-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconSparkle className="h-4 w-4 opacity-95" />
              {joinLabel}
            </button>
          )}
          {showInterested && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => setGroupInterested(group.id))}
              className="discovery-btn rounded-full bg-black/[0.06] px-5 py-2.5 text-sm font-semibold text-ah-ink hover:bg-black/[0.1]"
            >
              Interested
            </button>
          )}
          {showLeave && (
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => leaveInterestGroup(group.id))}
              className="discovery-btn rounded-full px-5 py-2.5 text-sm font-semibold text-ah-muted ring-1 ring-black/[0.12] hover:bg-black/[0.04]"
            >
              Leave
            </button>
          )}
          <button
            type="button"
            disabled={
              pending ||
              closed ||
              pastStart ||
              !group.userStatus ||
              group.userStatus === "WAITLIST" ||
              interestedOnly
            }
            onClick={() => run(() => setGroupHeading(group.id))}
            className="discovery-btn rounded-full bg-black/[0.06] px-5 py-2.5 text-sm font-semibold text-ah-ink hover:bg-black/[0.1] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconBolt className="h-4 w-4" />
            On the way
          </button>
          <button
            type="button"
            disabled={
              pending ||
              closed ||
              pastStart ||
              group.userStatus === "WAITLIST" ||
              !group.userStatus ||
              interestedOnly
            }
            onClick={() => run(() => checkInGroup(group.id))}
            className="discovery-btn rounded-full bg-ah-warm/14 px-5 py-2.5 text-sm font-semibold text-ah-ink ring-1 ring-ah-warm/30 hover:bg-ah-warm/22 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <IconCheckIn className="h-4 w-4 text-ah-warm" />
            Check in
          </button>
          <Link
            href={`/group/${group.id}`}
            className="discovery-btn inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ah-muted hover:text-ah-accent"
          >
            <IconChatBubble className="h-4 w-4" />
            Chat
            <IconArrowRight className="h-3.5 w-3.5 opacity-70 transition group-hover/card:translate-x-0.5 group-hover/card:opacity-100" />
          </Link>
        </div>
      </div>
    </article>
  );
}
