"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  cancelInterestGroup,
  checkInGroup,
  joinInterestGroup,
  leaveInterestGroup,
  setGroupHeading,
  setGroupInterested,
} from "@/actions/discovery";

export function GroupDetailActions({
  groupId,
  userStatus,
  isHost,
  groupStatus,
  allowJoin,
}: {
  groupId: string;
  userStatus: string | null;
  isHost: boolean;
  groupStatus: string;
  /** False after start time — join / interest are closed. */
  allowJoin: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const r = await fn();
      if (!r.ok && r.error) console.warn(r.error);
      router.refresh();
    });
  }

  const participating = ["JOINED", "HEADING", "CHECKED_IN"].includes(userStatus ?? "");
  const waitlisted = userStatus === "WAITLIST";
  const interestedOnly = userStatus === "INTERESTED";
  const closed = groupStatus === "cancelled" || groupStatus === "completed";
  const showInterested = allowJoin && !closed && !userStatus && groupStatus !== "full";
  const showLeave =
    !closed &&
    !isHost &&
    Boolean(userStatus) &&
    ["JOINED", "HEADING", "CHECKED_IN", "WAITLIST", "INTERESTED"].includes(userStatus!);

  if (closed) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!allowJoin && (
        <p className="w-full rounded-xl border border-ah-border bg-ah-bg-alt px-4 py-2 text-sm text-ah-muted">
          This plan has already started—join and interest are closed.
        </p>
      )}
      {isHost && (
        <>
          <Link
            href={`/group/${groupId}/edit`}
            className="rounded-xl border-2 border-ah-border px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-bg-alt"
          >
            Edit plan
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Cancel this plan for everyone?")) return;
              run(() => cancelInterestGroup(groupId));
            }}
            className="rounded-xl border-2 border-ah-warm/40 bg-ah-warm/10 px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-warm/15 disabled:opacity-50"
          >
            Cancel plan
          </button>
        </>
      )}
      {waitlisted ? (
        <span className="rounded-xl border border-ah-border bg-ah-bg-alt px-4 py-2 text-sm font-semibold text-ah-muted">
          On waitlist
        </span>
      ) : (
        <button
          type="button"
          disabled={pending || participating || !allowJoin}
          onClick={() => run(() => joinInterestGroup(groupId))}
          className="rounded-xl border-2 border-ah-accent bg-ah-accent px-4 py-2 text-sm font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
        >
          {interestedOnly ? "Confirm going" : "Join"}
        </button>
      )}
      {showInterested && (
        <button
          type="button"
          disabled={pending || !allowJoin}
          onClick={() => run(() => setGroupInterested(groupId))}
          className="rounded-xl border-2 border-ah-border px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-bg-alt"
        >
          Interested
        </button>
      )}
      {showLeave && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => leaveInterestGroup(groupId))}
          className="rounded-xl border-2 border-ah-border px-4 py-2 text-sm font-semibold text-ah-muted hover:bg-ah-bg-alt"
        >
          Leave
        </button>
      )}
      <button
        type="button"
        disabled={pending || !userStatus || userStatus === "WAITLIST" || interestedOnly}
        onClick={() => run(() => setGroupHeading(groupId))}
        className="rounded-xl border-2 border-ah-border px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-bg-alt disabled:opacity-40"
      >
        On the way
      </button>
      <button
        type="button"
        disabled={pending || !userStatus || userStatus === "WAITLIST" || interestedOnly}
        onClick={() => run(() => checkInGroup(groupId))}
        className="rounded-xl border-2 border-ah-warm/50 bg-ah-warm/10 px-4 py-2 text-sm font-semibold text-ah-ink hover:bg-ah-warm/15 disabled:opacity-40"
      >
        Check in
      </button>
    </div>
  );
}
