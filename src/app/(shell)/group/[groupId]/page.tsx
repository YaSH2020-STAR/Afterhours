import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { GroupChat } from "@/components/discover/GroupChat";
import { GroupDetailActions } from "@/components/discover/GroupDetailActions";
import { getGroupDetail } from "@/data/discovery";

type Props = { params: Promise<{ groupId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { groupId } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Group" };
  const data = await getGroupDetail(session.user.id, groupId);
  if (!data) return { title: "Group" };
  return { title: data.group.title };
}

function fmtWhen(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function GroupDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { groupId } = await params;
  const data = await getGroupDetail(session.user.id, groupId);
  if (!data) notFound();

  const { group, join, messages, chatOpen, waitlistPosition } = data;

  const isHost = group.creatorUserId === session.user.id;
  const cancelled = group.groupStatus === "cancelled";
  const allowJoin = group.startsAt >= new Date();

  const canPost = chatOpen && !cancelled;

  let closedHint: string | undefined;
  if (!canPost) {
    if (!group.chatEnabled) closedHint = "Chat is off for this group.";
    else if (!join) closedHint = "Join the group to unlock chat.";
    else if (join.status === "WAITLIST") closedHint = "You're on the waitlist—chat unlocks when a spot opens.";
    else if (group.chatExpiresAt && group.chatExpiresAt <= new Date()) {
      closedHint = "This chat window has ended.";
    }
  }

  return (
    <div className="space-y-8">
      {cancelled && (
        <div className="rounded-2xl border border-ah-warm/30 bg-ah-warm/10 px-4 py-3 text-sm text-ah-ink">
          This plan was cancelled. You can still read the thread below, but new messages are closed.
        </div>
      )}
      <div>
        <Link href="/groups" className="text-sm font-medium text-ah-muted hover:text-ah-accent">
          ← Back to groups
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ah-warm">{group.category}</p>
        <h1 className="font-display text-3xl font-bold text-ah-ink">{group.title}</h1>
        <p className="mt-2 text-sm text-ah-muted">{group.locationLabel}</p>
        {group.address && <p className="mt-1 text-sm text-ah-muted">{group.address}</p>}
        <p className="mt-2 text-sm font-medium text-ah-ink">{fmtWhen(group.startsAt)}</p>
        {group.endsAt && (
          <p className="text-sm text-ah-muted">Ends {fmtWhen(group.endsAt)}</p>
        )}
        {group.description && <p className="mt-4 max-w-2xl text-sm text-ah-muted">{group.description}</p>}
      </div>

      <div className="space-y-4 rounded-2xl border border-ah-border bg-ah-bg-alt/40 p-5 text-sm">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-ah-muted">Limits</p>
            <p className="font-semibold text-ah-ink">
              Min {group.minPeople} · max {group.maxPeople}
            </p>
            {group.joinedCount >= group.minPeople ? (
              <p className="mt-1 text-xs text-ah-accent">Minimum size reached.</p>
            ) : (
              <p className="mt-1 text-xs text-ah-muted">
                {group.joinedCount} going — host wanted at least {group.minPeople}.
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-ah-muted">Going</p>
            <p className="font-semibold text-ah-ink">{group.joinedCount}</p>
          </div>
          <div>
            <p className="text-xs text-ah-muted">Open seats</p>
            <p className="font-semibold text-ah-ink">{Math.max(0, group.maxPeople - group.joinedCount)}</p>
          </div>
          <div>
            <p className="text-xs text-ah-muted">Waitlist</p>
            <p className="font-semibold text-ah-ink">{group.waitlistCount}</p>
          </div>
          <div>
            <p className="text-xs text-ah-muted">Vibe</p>
            <p className="font-semibold capitalize text-ah-ink">{group.intensity}</p>
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-ah-muted">
            <span>Capacity</span>
            <span className="tabular-nums">
              {group.joinedCount} / {group.maxPeople}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/[0.08]">
            <div
              className="h-full rounded-full bg-ah-accent/90"
              style={{
                width: `${group.maxPeople > 0 ? Math.min(100, Math.round((group.joinedCount / group.maxPeople) * 100)) : 0}%`,
              }}
            />
          </div>
        </div>
        {join?.status === "WAITLIST" && waitlistPosition != null && (
          <div className="rounded-xl border border-ah-warm/25 bg-ah-warm/10 px-4 py-3 text-sm text-ah-ink">
            <p className="font-semibold">You are #{waitlistPosition} on the waitlist</p>
            <p className="mt-1 text-xs text-ah-muted leading-relaxed">
              When a spot opens, people are promoted in order of join time (first in, first out). Chat unlocks once you
              are promoted to “going.”
            </p>
          </div>
        )}
      </div>

      <GroupDetailActions
        groupId={group.id}
        userStatus={join?.status ?? null}
        isHost={isHost}
        groupStatus={group.groupStatus}
        allowJoin={allowJoin}
      />

      <GroupChat
        groupId={group.id}
        messages={messages.map((m) => ({
          id: m.id,
          body: m.body,
          createdAt: m.createdAt,
          sender: m.sender,
        }))}
        canPost={canPost}
        closedHint={closedHint}
      />
    </div>
  );
}
