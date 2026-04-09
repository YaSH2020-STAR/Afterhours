import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      bio: true,
      city: true,
      image: true,
      preferences: { select: { interestsJson: true } },
    },
  });
  if (!user) notFound();

  let interests: string[] = [];
  try {
    interests = JSON.parse(user.preferences?.interestsJson ?? "[]") as string[];
  } catch {
    interests = [];
  }

  const [hosted, joined] = await Promise.all([
    prisma.interestGroup.findMany({
      where: { creatorUserId: user.id },
      orderBy: { startsAt: "asc" },
      take: 24,
      select: { id: true, title: true, city: true, startsAt: true, locationLabel: true },
    }),
    prisma.groupJoin.findMany({
      where: { userId: user.id, status: { in: ["JOINED", "HEADING", "CHECKED_IN"] } },
      orderBy: { joinedAt: "desc" },
      take: 24,
      select: { group: { select: { id: true, title: true, city: true, startsAt: true, locationLabel: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-ah-border bg-ah-card p-5">
        <div className="flex items-start gap-4">
          {user.image ? (
            <img src={user.image} alt={user.name ?? "Profile"} className="h-16 w-16 rounded-full border border-ah-border object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-ah-border bg-ah-bg-alt text-xs text-ah-muted">
              No photo
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-ah-ink">{user.name ?? "AfterHours member"}</h1>
            <p className="mt-1 text-sm text-ah-muted">{user.city ?? "City not set"}</p>
            {user.bio && <p className="mt-2 text-sm text-ah-ink">{user.bio}</p>}
            {interests.length > 0 && (
              <p className="mt-2 text-xs text-ah-muted">Interests: {interests.slice(0, 8).join(", ")}</p>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-ah-border bg-ah-card p-5">
        <h2 className="font-display text-lg font-semibold text-ah-ink">Hosted meetups</h2>
        <div className="mt-3 space-y-2">
          {hosted.length === 0 && <p className="text-sm text-ah-muted">No hosted meetups yet.</p>}
          {hosted.map((m) => (
            <Link key={m.id} href={`/group/${m.id}`} className="block rounded-lg border border-ah-border px-3 py-2 hover:bg-ah-bg-alt">
              <p className="font-medium text-ah-ink">{m.title}</p>
              <p className="text-xs text-ah-muted">
                {m.city} · {m.locationLabel} · {m.startsAt.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ah-border bg-ah-card p-5">
        <h2 className="font-display text-lg font-semibold text-ah-ink">Joined meetups</h2>
        <div className="mt-3 space-y-2">
          {joined.length === 0 && <p className="text-sm text-ah-muted">No joined meetups yet.</p>}
          {joined.map((j) => (
            <Link
              key={j.group.id}
              href={`/group/${j.group.id}`}
              className="block rounded-lg border border-ah-border px-3 py-2 hover:bg-ah-bg-alt"
            >
              <p className="font-medium text-ah-ink">{j.group.title}</p>
              <p className="text-xs text-ah-muted">
                {j.group.city} · {j.group.locationLabel} · {j.group.startsAt.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
