import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { GroupCard } from "@/components/discover/GroupCard";
import type { GroupForUi } from "@/data/discovery";
import { getMyPlansContext } from "@/data/discovery";

export const metadata: Metadata = {
  title: "Plans",
  description: "What you are hosting and where you are going.",
};

function splitJoinedPlans(joined: GroupForUi[], viewerId: string) {
  const going = joined.filter(
    (g) =>
      ["JOINED", "HEADING", "CHECKED_IN"].includes(g.userStatus ?? "") &&
      g.creatorUserId !== viewerId,
  );
  const waitlisted = joined.filter((g) => g.userStatus === "WAITLIST");
  const interested = joined.filter((g) => g.userStatus === "INTERESTED");
  return { going, waitlisted, interested };
}

export default async function MyPlansPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { joined, created, summary } = await getMyPlansContext(session.user.id);
  const viewerId = session.user.id;
  const { going, waitlisted, interested } = splitJoinedPlans(joined, viewerId);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ah-muted">You</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ah-ink">My plans</h1>
          <p className="max-w-lg text-sm text-ah-muted">
            Hosting, RSVPs, waitlists, and saved interest—the same counts and order everyone sees in Discover.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-elevated)] to-ah-bg-alt/50 px-4 py-4 ring-1 ring-black/[0.06]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Hosting</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ah-ink">{summary.hostingCount}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-elevated)] to-ah-bg-alt/50 px-4 py-4 ring-1 ring-black/[0.06]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Going</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ah-ink">{summary.goingCount}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-elevated)] to-ah-bg-alt/50 px-4 py-4 ring-1 ring-black/[0.06]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">On waitlist</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ah-ink">{summary.waitlistCount}</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-[var(--surface-elevated)] to-ah-bg-alt/50 px-4 py-4 ring-1 ring-black/[0.06]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ah-muted">Interested</p>
            <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-ah-ink">{summary.interestedCount}</p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ah-ink">Hosting</h2>
            <p className="text-sm text-ah-muted">Plans you created—edit, cancel, or delete when you are the only person.</p>
          </div>
          <Link href="/create" className="text-sm font-medium text-ah-accent transition hover:underline">
            New plan
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {created.map((g) => (
            <GroupCard key={g.id} group={g} viewerId={viewerId} />
          ))}
        </div>
        {created.length === 0 && (
          <div className="rounded-2xl bg-ah-bg-alt/50 px-5 py-8 text-center ring-1 ring-black/[0.05]">
            <p className="text-sm font-medium text-ah-ink">No hosted plans yet</p>
            <p className="mt-1 text-sm text-ah-muted">Create a meetup and it will show up here.</p>
            <Link
              href="/create"
              className="mt-4 inline-flex rounded-full bg-ah-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-ah-accent-soft"
            >
              Create a plan
            </Link>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ah-ink">Going</h2>
          <p className="text-sm text-ah-muted">Confirmed spots—counts toward participant limits and min group size.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {going.map((g) => (
            <GroupCard key={`go-${g.id}`} group={g} viewerId={viewerId} />
          ))}
        </div>
        {going.length === 0 && (
          <p className="rounded-2xl bg-ah-bg-alt/40 px-4 py-3 text-sm text-ah-muted ring-1 ring-black/[0.05]">
            No other people’s plans yet—join from Discover or Open Tables.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ah-ink">Waitlist</h2>
          <p className="text-sm text-ah-muted">
            When the host’s plan is full, you line up here. If someone leaves, the next person is promoted automatically
            (first-in, first-out). Your place is shown on each card.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {waitlisted.map((g) => (
            <GroupCard key={`wl-${g.id}`} group={g} viewerId={viewerId} />
          ))}
        </div>
        {waitlisted.length === 0 && (
          <p className="rounded-2xl bg-ah-bg-alt/40 px-4 py-3 text-sm text-ah-muted ring-1 ring-black/[0.05]">
            You are not on any waitlists.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ah-ink">Interested</h2>
          <p className="text-sm text-ah-muted">Saved interest—confirm “going” before start time to hold a spot or join the waitlist.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {interested.map((g) => (
            <GroupCard key={`in-${g.id}`} group={g} viewerId={viewerId} />
          ))}
        </div>
        {interested.length === 0 && (
          <p className="rounded-2xl bg-ah-bg-alt/40 px-4 py-3 text-sm text-ah-muted ring-1 ring-black/[0.05]">
            Nothing saved—tap Interested on a card in discovery.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-ah-border bg-ah-bg-alt/30 px-5 py-5">
        <p className="text-sm font-medium text-ah-ink">How limits work</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ah-muted">
          <li>
            <span className="text-ah-ink">Max</span> caps how many can be “going” at once; when full, new joins go to the
            waitlist.
          </li>
          <li>
            <span className="text-ah-ink">Min</span> is the host’s target size—the plan can still run with fewer, but you’ll
            see whether the minimum is met on each card.
          </li>
          <li>
            <span className="text-ah-ink">Waitlist</span> is ordered by when each person joined; leaving opens a seat for
            #1, then #2, and so on.
          </li>
        </ul>
        <Link href="/dashboard" className="mt-4 inline-flex text-sm font-medium text-ah-accent hover:underline">
          Back to Discover →
        </Link>
      </section>
    </div>
  );
}
