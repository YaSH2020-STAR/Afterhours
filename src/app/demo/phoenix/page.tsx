import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import {
  PHOENIX_DEMO_SAMPLES,
  PHOENIX_METRO_NOTE,
  type PhoenixDemoSample,
} from "@/data/phoenix-demo-samples";

export const metadata: Metadata = {
  title: "Demo data — Phoenix, AZ",
  description:
    "Illustrative waitlist samples for Greater Phoenix — for hackathon and judge demos only.",
  robots: { index: false, follow: false },
};

function formatList(arr: string[]) {
  if (arr.length === 0) return "—";
  return arr.map((x) => x.replace(/_/g, " ")).join(", ");
}

function SampleCard({ s }: { s: PhoenixDemoSample }) {
  return (
    <article className="rounded-xl border border-ah-border bg-ah-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ah-ink">{s.displayName}</h2>
        <span className="text-xs text-ah-muted">{s.city}</span>
      </div>
      <p className="mt-1 text-sm text-ah-accent">{s.roleNote}</p>
      <dl className="mt-4 grid gap-2 text-sm text-ah-muted sm:grid-cols-2">
        <div>
          <dt className="font-medium text-ah-ink">Email (demo domain)</dt>
          <dd className="break-all font-mono text-xs">{s.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-ah-ink">Timezone</dt>
          <dd>{s.timezone}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-ah-ink">Situation tags</dt>
          <dd>{formatList(s.situations)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-ah-ink">Availability</dt>
          <dd>{formatList(s.availability)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-ah-ink">Affinity (optional)</dt>
          <dd>{formatList(s.affinity)}</dd>
        </div>
        <div>
          <dt className="font-medium text-ah-ink">Pod vibe</dt>
          <dd>{s.podVibe?.replace(/_/g, " ") ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-medium text-ah-ink">Consent timestamp (sample)</dt>
          <dd className="font-mono text-xs">{s.consentAtIso}</dd>
        </div>
        {s.comfortNotes && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-ah-ink">Notes</dt>
            <dd>{s.comfortNotes}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

export default function PhoenixDemoPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">Judge demo</p>
        <h1 className="font-display text-3xl font-bold text-ah-ink">Sample dataset — Phoenix, AZ metro</h1>
        <p className="mt-3 text-lg text-ah-muted">
          <strong className="text-ah-ink">Fictional</strong> waitlist-style rows showing how intake fields look for{" "}
          <strong className="text-ah-ink">young professionals who recently moved</strong> in Greater Phoenix. Emails
          use <code className="rounded bg-ah-bg-alt px-1 text-sm">@demo.afterhours.example</code> so they stay
          separate from real users.
        </p>
        <p className="mt-2 text-sm text-ah-muted">{PHOENIX_METRO_NOTE}</p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/"
            className="font-semibold text-ah-accent underline-offset-2 hover:underline"
          >
            ← Home
          </Link>
          <span className="text-ah-border">|</span>
          <span className="text-ah-muted">
            Load into SQLite: <code className="rounded bg-ah-bg-alt px-1">npm run db:seed</code>
          </span>
        </div>

        <div className="mt-10 space-y-6">
          {PHOENIX_DEMO_SAMPLES.map((s) => (
            <SampleCard key={s.email} s={s} />
          ))}
        </div>

        <p className="mt-12 rounded-lg border border-ah-border bg-ah-bg-alt p-4 text-sm text-ah-muted">
          <strong className="text-ah-ink">For judges:</strong> This page reads from{" "}
          <code className="text-xs">src/data/phoenix-demo-samples.ts</code>. Running{" "}
          <code className="text-xs">npm run db:seed</code> inserts the same rows into the local database (Prisma) for
          live API or Studio demos.
        </p>
      </div>
    </MarketingLayout>
  );
}
