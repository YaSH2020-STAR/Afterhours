import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export const metadata: Metadata = {
  title: "Safety & trust",
  description:
    "How AfterHours handles verification, ethnicity in matching, boundaries, reporting, and moderation—structural trust, not slogans.",
};

export default function SafetyPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-[720px] px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">Safety &amp; trust</p>
        <h1 className="font-display text-3xl font-bold text-ah-ink">Structural trust for small pods</h1>
        <p className="mt-3 text-lg text-ah-muted">
          AfterHours is designed for <strong className="text-ah-ink">dignity</strong>,{" "}
          <strong className="text-ah-ink">reciprocity</strong>, and{" "}
          <strong className="text-ah-ink">continuity</strong>. Safety is not an afterthought—it shapes what we
          build.
        </p>

        <section className="mt-10 space-y-6 text-ah-muted">
          <div>
            <h2 className="font-display text-xl text-ah-ink">Boundaries on contact</h2>
            <p className="mt-2">
              Direct messages do not open freely. We gate messaging behind{" "}
              <strong className="text-ah-ink">mutual opt-in</strong> after a clear season milestone—reducing
              harassment vectors common in open-chat apps.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ah-ink">Verification (optional)</h2>
            <p className="mt-2">
              Light verification may be offered where it meaningfully improves safety. We never rank you on
              popularity or “influence”—there are no public leaderboards.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ah-ink">Reporting &amp; moderation</h2>
            <p className="mt-2">
              In-app reporting routes to <strong className="text-ah-ink">human review</strong>. Pods agree to a
              short charter up front; serious violations can lead to removal—protecting members, not optics.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ah-ink">Session boundaries</h2>
            <p className="mt-2">
              Rituals have start and end times. Host rotation spreads emotional labor so it doesn’t fall on one
              gender or culture by default.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl text-ah-ink">Data minimization</h2>
            <p className="mt-2">
              We only ask what matching needs. Intake notes stay private to the matching team; we don’t sell
              personal data.
            </p>
          </div>

          <div
            id="ethnicity-matching"
            className="scroll-mt-24 rounded-xl border border-ah-border bg-ah-bg-alt p-5 sm:p-6"
          >
            <h2 className="font-display text-xl text-ah-ink">Ethnicity, culture &amp; matching</h2>
            <p className="mt-3">
              <strong className="text-ah-ink">Ethnicity is never required</strong> to join or stay in AfterHours.
              Baseline matching uses your <strong className="text-ah-ink">city or metro</strong>,{" "}
              <strong className="text-ah-ink">availability</strong>, and <strong className="text-ah-ink">situation</strong>{" "}
              (e.g. recently moved). That keeps the product usable for everyone without turning background into a
              gate.
            </p>
            <p className="mt-3">
              <strong className="text-ah-ink">Optional affinity checkboxes</strong> let you signal preferences—such
              as openness to a mixed pod or comfort with shared cultural context—so we can reduce misfits. Skipping
              them is normal. We don’t use affinity to label you publicly, for ads, or to create a separate “ethnic
              only” product tier.
            </p>
            <p className="mt-3">
              <strong className="text-ah-ink">Dignity in rituals:</strong> facilitated prompts are written to avoid
              exoticizing, quizzing people about their background, or asking anyone to “represent” a group. Bias,
              fetishizing, or stereotyping is treated like other serious misconduct—reportable and reviewed by
              humans.
            </p>
            <p className="mt-3">
              <strong className="text-ah-ink">No default segregation:</strong> optional signals are weighted
              alongside schedule and fit—not used to silo people by default. We aim for pods where people can be
              present without performing identity for strangers.
            </p>
          </div>
        </section>

        <p className="mt-10 text-sm text-ah-muted">
          <Link href="/waitlist" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
            Join the waitlist
          </Link>{" "}
          ·{" "}
          <Link href="/#ethnicity-inclusion" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
            Ethnicity &amp; inclusion (home)
          </Link>{" "}
          ·{" "}
          <Link href="/" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
            Home
          </Link>
        </p>
      </div>
    </MarketingLayout>
  );
}
