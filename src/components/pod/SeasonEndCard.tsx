"use client";

import { useState } from "react";
import { submitSeasonEndChoice } from "@/actions/season-end";

const OPTIONS = [
  { value: "CONTINUE_SAME_POD" as const, label: "Same pod again" },
  { value: "NEW_POD" as const, label: "New pod" },
  { value: "BREAK" as const, label: "Take a break" },
];

export function SeasonEndCard(props: { seasonId: string; existing?: string | null }) {
  const [choice, setChoice] = useState<(typeof OPTIONS)[number]["value"] | null>(
    (props.existing as (typeof OPTIONS)[number]["value"]) ?? null,
  );
  const [pending, setPending] = useState(false);

  async function save(c: (typeof OPTIONS)[number]["value"]) {
    setPending(true);
    const res = await submitSeasonEndChoice({ seasonId: props.seasonId, choice: c });
    if (res.ok) setChoice(c);
    setPending(false);
  }

  return (
    <div className="rounded-xl border border-ah-border bg-ah-bg-alt/50 p-4">
      <p className="text-xs text-ah-muted">Season end</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={pending}
            onClick={() => save(opt.value)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              choice === opt.value ? "border-ah-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" : "border-ah-border"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
