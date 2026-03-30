import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AttendanceButtons } from "@/components/pod/AttendanceButtons";
import { BlockMemberButton } from "@/components/pod/BlockMemberButton";
import { PodChat } from "@/components/pod/PodChat";
import { ReportMemberButton } from "@/components/pod/ReportMemberButton";
import { SeasonEndCard } from "@/components/pod/SeasonEndCard";
import { getPodPageData } from "@/data/pod-detail";

export async function generateMetadata(props: { params: Promise<{ podId: string }> }): Promise<Metadata> {
  const { podId } = await props.params;
  return { title: `Pod ${podId.slice(0, 6)}…` };
}

export default async function PodPage(props: { params: Promise<{ podId: string }> }) {
  const { podId } = await props.params;
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await getPodPageData(session.user.id, podId);
  if (!data) notFound();

  const {
    pod,
    season,
    weekIndex,
    weekLabel,
    phaseCopy,
    dmUnlocked,
    ritual,
    starters,
    members,
    messages,
    attendance,
    health,
    seasonEndChoice,
  } = data;

  const interestsFor = (json: string | undefined) => {
    try {
      const v = JSON.parse(json ?? "[]") as string[];
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-ah-accent hover:underline">
          ← Back
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold text-ah-ink">{pod.name}</h1>
        <p className="text-sm text-ah-muted">
          {pod.city} · {pod.weeklySlotLabel} · {weekLabel} · health {health}%
        </p>
        <p className="mt-1 text-xs text-ah-muted">{phaseCopy}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          {ritual && (
            <div className="rounded-xl border border-ah-border bg-ah-bg-alt/50 p-4">
              <p className="text-xs text-ah-muted">Ritual</p>
              <p className="font-medium text-ah-ink">{ritual.title}</p>
              <p className="mt-1 text-sm text-ah-muted">{ritual.detail}</p>
            </div>
          )}

          <p className="text-xs text-ah-muted">Starters: {starters.slice(0, 2).join(" · ")}</p>

          <PodChat
            podId={pod.id}
            currentUserId={session.user.id}
            members={members.map((m) => ({ id: m.id, name: m.name }))}
            messages={messages}
            dmUnlocked={dmUnlocked}
          />

          {season && weekIndex >= 4 && <SeasonEndCard seasonId={season.id} existing={seasonEndChoice} />}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-ah-border bg-ah-card p-4">
            <h2 className="text-sm font-semibold text-ah-ink">Members</h2>
            <ul className="mt-3 space-y-4">
              {members.map((m) => (
                <li key={m.id} className="text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-ah-ink">
                        {m.name ?? "Member"}
                        {m.verified && (
                          <span className="ml-1 rounded bg-ah-bg-alt px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ah-muted">
                            Verified
                          </span>
                        )}
                      </p>
                      {m.preferences?.energyLevel && (
                        <p className="text-xs text-ah-muted">
                          {String(m.preferences.energyLevel).toLowerCase()} · {String(m.preferences.groupStyle).toLowerCase()}
                        </p>
                      )}
                      {m.bio && <p className="mt-1 text-ah-muted">{m.bio}</p>}
                      <p className="mt-1 text-xs text-ah-muted">
                        {interestsFor(m.preferences?.interestsJson).slice(0, 6).join(" · ")}
                      </p>
                    </div>
                    {m.id !== session.user.id && (
                      <ReportMemberButton userId={m.id} podId={pod.id} />
                    )}
                  </div>
                  {m.id !== session.user.id && (
                    <div className="mt-2">
                      <BlockMemberButton userId={m.id} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-ah-border bg-ah-bg-alt/40 p-4">
            <h2 className="text-sm font-semibold text-ah-ink">Attendance</h2>
            <p className="mt-1 text-xs text-ah-muted">Week {weekIndex}</p>
            <div className="mt-3">
              <AttendanceButtons
                podId={pod.id}
                weekIndex={attendance.weekIndex}
                current={attendance.mine?.status ?? null}
              />
            </div>
            <p className="mt-2 text-xs text-ah-muted">
              {attendance.attending}/{attendance.total} attending
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
