import Link from "next/link";
import { EthnicityInclusionPrinciples } from "@/components/landing/EthnicityInclusionPrinciples";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { PodDiagram } from "@/components/landing/PodDiagram";

export function HomeSections() {
  return (
    <>
      <section className="bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%)] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight text-ah-ink sm:text-4xl">
              AfterHours — same pod, same week, one season at a time.
            </h1>
            <p className="mt-3 text-ah-muted">Not a feed · not events-as-performance · small groups, weekly.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signin"
                className="rounded-lg border-2 border-ah-accent bg-ah-accent px-5 py-2.5 font-semibold text-white hover:bg-ah-accent-soft"
              >
                Sign in
              </Link>
              <Link
                href="/waitlist"
                className="rounded-lg border-2 border-ah-border px-5 py-2.5 font-semibold text-ah-ink hover:border-ah-accent"
              >
                Waitlist
              </Link>
            </div>
          </div>
          <aside className="rounded-xl border border-ah-border bg-ah-card p-5 text-sm text-ah-muted">
            One weekly slot · same ~6 people · 6 weeks — intro → meetups → close.
          </aside>
        </div>
      </section>

      <section id="why-when-how" className="px-4 py-14 sm:px-6" aria-labelledby="wwh-title">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="wwh-title" className="font-display text-center text-xl font-bold text-ah-ink sm:text-2xl">
            Why / when / how
          </h2>
          <p className="mx-auto mt-2 max-w-[52ch] text-center text-sm text-ah-muted">Repeat contact, no feed.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-ah-border bg-ah-card p-5">
              <h3 className="font-display text-lg text-ah-accent">Why</h3>
              <p className="mt-1 font-semibold text-ah-ink">College gave you accidental proximity; work rarely does.</p>
              <p className="mt-2 text-sm text-ah-muted">
                You use AfterHours when you want <strong>repeat contact</strong> with a small group—so
                “strangers” can become <strong>familiar faces</strong> without dating pressure, résumé
                theater, or a new crowd every Tuesday.
              </p>
            </article>
            <article className="rounded-xl border border-ah-border bg-ah-card p-5">
              <h3 className="font-display text-lg text-ah-accent">When</h3>
              <p className="mt-1 font-semibold text-ah-ink">
                Typical moments—not “when you’re broken,” when you’re <em>ready for a rhythm</em>.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ah-muted">
                <li>First ~3–18 months after moving to a new city for work (or a fresh start)</li>
                <li>Work is stable but evenings feel empty or samey</li>
                <li>Your local circle is thin—refill, not a fling</li>
                <li>Remote or hybrid—almost no casual collisions</li>
              </ul>
            </article>
            <article className="rounded-xl border border-ah-border bg-ah-card p-5">
              <h3 className="font-display text-lg text-ah-accent">How</h3>
              <p className="mt-1 font-semibold text-ah-ink">A season, not an endless scroll.</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ah-muted">
                <li>Tell us constraints—city, availability, comfort.</li>
                <li>Get matched into a pod (~six people) for one six-week season.</li>
                <li>Same slot weekly—parallel hour + light ritual; micro-host rotates.</li>
                <li>Season ends—renew, pause, or switch. No guilt.</li>
              </ol>
            </article>
          </div>
          <article className="mt-5 rounded-xl border border-ah-border bg-ah-card p-6">
            <h3 className="font-display text-lg text-ah-accent">What you get out of it</h3>
            <p className="mt-1 font-semibold text-ah-ink">Benefits are practical and emotional—usually both.</p>
            <ul className="mt-3 grid gap-2 text-sm text-ah-muted sm:grid-cols-2">
              <li>
                <strong className="text-ah-ink">Familiarity without performance</strong>—names stick because
                you see the same people.
              </li>
              <li>
                <strong className="text-ah-ink">Local knowledge</strong>—neighborhoods, transit, where to eat—
                the stuff you usually learn by accident, faster.
              </li>
              <li>
                <strong className="text-ah-ink">Easier plans</strong>—one recurring anchor beats “we should
                hang sometime.”
              </li>
              <li>
                <strong className="text-ah-ink">Belonging that compounds</strong>—continuity beats one-off
                events.
              </li>
              <li className="sm:col-span-2">
                <strong className="text-ah-ink">Clear boundaries</strong>—seasons end; DMs stay gated early.
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section id="rhythm" className="bg-ah-bg-alt px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-2xl font-bold text-ah-ink sm:text-3xl">
            Why “loneliness products” fail—and what we do instead
          </h2>
          <p className="mt-4 text-lg text-ah-muted">
            Most tools treat social life like <em>inventory</em>: browse people, book events, optimize your
            profile. AfterHours is built around <strong className="text-ah-ink">rhythm</strong>,{" "}
            <strong className="text-ah-ink">reciprocity</strong>, and{" "}
            <strong className="text-ah-ink">continuity</strong>—you are not a lead in someone else’s funnel.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "Continuity",
                d: "Six-week seasons, same pod, predictable schedule. Trust comes from repetition—not one-off RSVPs.",
              },
              {
                t: "Reciprocity",
                d: "Everyone brings something small each week. No spectators; no “cooler than thou” energy.",
              },
              {
                t: "Dignity in language",
                d: "We don’t label you “lonely.” You’re settling a life, building a local circle, finding your footing.",
              },
            ].map((x) => (
              <article key={x.t} className="rounded-xl border border-ah-border bg-ah-card p-4">
                <h3 className="font-display text-base text-ah-accent">{x.t}</h3>
                <p className="mt-1 text-sm text-ah-muted">{x.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pods" className="px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-ah-ink sm:text-3xl">Pods, not crowds</h2>
            <p className="mt-4 text-lg text-ah-muted">
              A pod is 6–8 people in <strong className="text-ah-ink">your metro</strong>, matched with care.
              Optional <strong className="text-ah-ink">affinity layers</strong> (culture-informed comfort,
              introvert-friendly pacing, sober-by-default)—nothing mandatory.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-ah-muted">
              <li>
                <strong className="text-ah-ink">Bounded commitment:</strong> seasons end—pods don’t become traps.
              </li>
              <li>
                <strong className="text-ah-ink">Same city, same faces:</strong> we optimize for repeat contact
                where you actually live—not a calendar of one-off events across a huge radius.
              </li>
              <li>
                <strong className="text-ah-ink">No leaderboards:</strong> we don’t gamify your social life.
              </li>
            </ul>
          </div>
          <PodDiagram />
        </div>
      </section>

      <section id="inclusion" className="bg-ah-bg-alt px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center font-display text-2xl font-bold text-ah-ink sm:text-3xl">
            Built for people like you—not a generic crowd
          </h2>
          <p className="mx-auto mt-3 max-w-[65ch] text-center text-lg text-ah-muted">
            We focus on <strong className="text-ah-ink">young working professionals (about 20–30)</strong> who{" "}
            <strong className="text-ah-ink">recently moved to a new city</strong>. Within that, life still
            varies—so we design for overlap without reducing anyone to a checkbox.
          </p>

          <div className="mt-10">
            <EthnicityInclusionPrinciples />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                h: "New city logistics",
                p: "First seasons stay light: practical warmth woven into rituals—transit, neighborhoods, norms—because moving is exhausting even when the job is fine.",
              },
              {
                h: "Accessibility",
                p: "WCAG-minded UI, captions on async video, reduced-motion respect, plain-language modes, text-first check-in options.",
              },
              {
                h: "Safety",
                p: "Optional verification tiers, reporting, session boundaries, no DMs until mutual opt-in after a milestone.",
              },
            ].map((c) => (
              <article key={c.h} className="rounded-xl border border-ah-border bg-ah-card p-5">
                <h3 className="font-display text-lg text-ah-ink">{c.h}</h3>
                <p className="mt-2 text-sm text-ah-muted">{c.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[720px]">
          <h2 className="font-display text-2xl font-bold text-ah-ink sm:text-3xl">Trust is structural—not a slogan</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                dt: "Identity & boundaries",
                dd: "Light verification where it helps; never a popularity score. Pod bios are intent-based, not résumé dumps.",
              },
              {
                dt: "Reciprocity by design",
                dd: "Rotating micro-host duties prevent one-sided emotional labor—often gendered or racialized in “community” spaces.",
              },
              {
                dt: "Continuity with exits",
                dd: "Seasons create checkpoints. Stepping back is normalized—no guilt-tripping notifications.",
              },
              {
                dt: "Moderation & accountability",
                dd: "Human review for reports; pod charters up front; consequences that protect members.",
              },
            ].map((x) => (
              <div key={x.dt} className="rounded-xl border border-ah-border bg-ah-card p-4">
                <dt className="font-display font-semibold text-ah-accent">{x.dt}</dt>
                <dd className="mt-1 text-sm text-ah-muted">{x.dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="difference" className="bg-ah-bg-alt px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-display text-2xl font-bold text-ah-ink sm:text-3xl">
            How this differs from what you’ve already tried
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-ah-border bg-ah-card">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[color-mix(in_srgb,var(--accent)_14%,var(--bg))]">
                  <th scope="col" className="p-4 font-display">
                    Typical tool
                  </th>
                  <th scope="col" className="p-4 font-display">
                    What it optimizes
                  </th>
                  <th scope="col" className="p-4 font-display">
                    AfterHours
                  </th>
                </tr>
              </thead>
              <tbody className="text-ah-muted">
                {[
                  ["Meetup-style apps", "Event throughput, new faces, organizer burnout", "Same faces, low-stakes rituals, pod-level care—not infinite calendar filling"],
                  ["Dating apps", "Romantic matching, photo-first sorting", "Non-romantic default; connection without “spark” pressure"],
                  ["Professional networks", "Status, employability signaling", "Personhood outside work; no headline optimization"],
                  ["Large chat / forums", "Scale, anonymity, endless scroll", "Small trusted circles, season boundaries, human moderation"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-ah-border">
                    <th scope="row" className="p-4 font-semibold text-ah-ink">
                      {row[0]}
                    </th>
                    <td className="p-4">{row[1]}</td>
                    <td className="p-4 text-ah-ink">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-[70ch] text-center text-lg text-ah-muted">
            <strong className="text-ah-ink">The differentiator:</strong> belonging as a{" "}
            <em>practice you return to</em>—not content you consume, people you rank, or events you hoard.
          </p>
        </div>
      </section>

      <section id="voices" className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-center font-display text-2xl font-bold text-ah-ink sm:text-3xl">
            Voices from people building life in a new city
          </h2>
          <p className="mx-auto mt-3 max-w-[65ch] text-center text-ah-muted">
            Composite experiences—respecting privacy while reflecting real patterns from research.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              {
                q: "I didn’t want another app to ‘find friends.’ I wanted the same Tuesday with people who weren’t from my office. Parallel hour felt silly until it wasn’t.",
                f: "— Priya, 27, moved for a finance rotation",
              },
              {
                q: "I knew zero people outside work. Happy hours felt like networking, not rest. A pod meant I could show up tired and not perform—I just had to show up.",
                f: "— Alex, 26, engineer, new metro last year",
              },
              {
                q: "Meetups felt like speed-dating for hobbies. Here, nobody cared if I was awkward the first two weeks. The season ended—that alone made it feel humane.",
                f: "— Jin, 29, remote worker in a new state",
              },
            ].map((t) => (
              <blockquote
                key={t.f}
                className="flex flex-col rounded-xl border border-ah-border bg-ah-card p-5"
              >
                <p className="flex-1 text-sm text-ah-muted">&ldquo;{t.q}&rdquo;</p>
                <footer className="mt-3 text-sm font-semibold text-ah-ink">{t.f}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="bg-[linear-gradient(160deg,color-mix(in_srgb,var(--accent)_20%,var(--bg))_0%,var(--bg)_45%)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-display text-xl font-bold text-ah-ink sm:text-2xl">Waitlist</h2>
          <p className="mx-auto mt-2 text-sm text-ah-muted">
            Or <Link href="/waitlist" className="text-ah-accent hover:underline">full intake</Link>.
          </p>
          <div className="mx-auto mt-8 max-w-[420px] rounded-xl border border-ah-border bg-ah-card p-6 text-left shadow-sm">
            <WaitlistForm idPrefix="home" />
          </div>
        </div>
      </section>
    </>
  );
}
