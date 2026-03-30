import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/SignOutButton";

export const metadata: Metadata = {
  title: "Settings",
  description: "Safety, blocks, and account.",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const blocks = await prisma.block.findMany({
    where: { blockerId: session.user.id },
    include: { blocked: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[560px] space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ah-ink">Settings</h1>
        <p className="mt-1 text-xs text-ah-muted">Pod-only DMs · week 3+ 1:1 · <Link href="/safety">Safety</Link></p>
      </div>

      <section className="rounded-xl border border-ah-border bg-ah-card p-5">
        <h2 className="text-sm font-semibold text-ah-ink">Blocked</h2>
        {blocks.length === 0 ? (
          <p className="mt-2 text-sm text-ah-muted">No blocks yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2 text-ah-muted">
                <span>{b.blocked.name ?? b.blocked.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-ah-border bg-ah-bg-alt/40 p-5">
        <p className="text-sm text-ah-muted">{session.user.email}</p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
