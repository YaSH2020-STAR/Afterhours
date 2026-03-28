import Link from "next/link";

/**
 * Single source of truth for how AfterHours handles ethnicity & culture in product copy.
 * Use this for landing + judge Q&A alignment.
 */
export function EthnicityInclusionPrinciples() {
  return (
    <div
      id="ethnicity-inclusion"
      className="scroll-mt-24 rounded-xl border-2 border-ah-accent/25 bg-ah-card p-6 shadow-sm sm:p-8"
    >
      <h3 className="font-display text-xl font-bold text-ah-ink sm:text-2xl">
        Ethnicity & cultural inclusion
      </h3>
      <p className="mt-3 text-ah-muted">
        New cities are diverse. We never use ethnicity or culture as a <strong className="text-ah-ink">gate</strong>{" "}
        to join AfterHours—your match starts with <strong className="text-ah-ink">metro, schedule, and situation</strong>
        . If you want extra comfort, you can opt into optional <strong className="text-ah-ink">affinity signals</strong>{" "}
        in intake (things like cultural-comfort pods or openness to mixed backgrounds). Leaving them blank is normal.
      </p>
      <ul className="mt-4 list-none space-y-3 text-sm text-ah-muted">
        <li className="flex gap-2">
          <span className="font-semibold text-ah-accent" aria-hidden="true">
            ·
          </span>
          <span>
            <strong className="text-ah-ink">Dignity:</strong> we don’t ask anyone to “represent” a group, explain their
            identity to strangers, or perform culture for others. Prompts are designed to be respectful—not tourism.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-ah-accent" aria-hidden="true">
            ·
          </span>
          <span>
            <strong className="text-ah-ink">No default segregation:</strong> optional affinity is one signal among
            many. People who want a mixed pod can say so; people who want shared cultural context can opt in—without
            either group being treated as the “norm” or the “other.”
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-ah-accent" aria-hidden="true">
            ·
          </span>
          <span>
            <strong className="text-ah-ink">Safety & accountability:</strong> harassment, fetishizing, or
            stereotyping in pods is a reportable violation—same bar as other misconduct. Host rotation helps spread
            emotional labor so it doesn’t fall on one gender or culture by default.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-semibold text-ah-accent" aria-hidden="true">
            ·
          </span>
          <span>
            <strong className="text-ah-ink">Data:</strong> affinity choices are used for matching and support—not sold,
            not used for ads, and not shown as a public label on you.
          </span>
        </li>
      </ul>
      <p className="mt-5 text-sm text-ah-muted">
        More detail on how matching and moderation treat this:{" "}
        <Link href="/safety#ethnicity-matching" className="font-semibold text-ah-accent underline-offset-2 hover:underline">
          Safety & trust — Ethnicity & matching
        </Link>
        .
      </p>
    </div>
  );
}
