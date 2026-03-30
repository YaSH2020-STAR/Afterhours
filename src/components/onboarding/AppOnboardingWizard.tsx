"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { saveOnboarding } from "@/actions/onboarding";
import { AVAILABILITY_OPTIONS } from "@/lib/validation";

const INTEREST_SUGGESTIONS = [
  "hiking",
  "reading",
  "running",
  "cooking",
  "film",
  "music",
  "board games",
  "art museums",
  "volunteering",
] as const;

const LIFE_STAGES = [
  { id: "NEW_TO_CITY", label: "New to my city" },
  { id: "REMOTE_WORKER", label: "Remote / hybrid worker" },
  { id: "EARLY_CAREER", label: "Early career" },
] as const;

const STEPS = [
  "Arrival",
  "Place & time",
  "Interests",
  "Social fit",
  "Life stage",
  "Optional",
] as const;

export function AppOnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
  const [availability, setAvailability] = useState<string[]>(["weekday_evenings"]);
  const [interests, setInterests] = useState<string[]>(["reading", "hiking"]);
  const [interestInput, setInterestInput] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [groupStyle, setGroupStyle] = useState<"QUIET" | "ACTIVITY" | "MIXED">("MIXED");
  const [lifeStages, setLifeStages] = useState<("NEW_TO_CITY" | "REMOTE_WORKER" | "EARLY_CAREER")[]>([
    "NEW_TO_CITY",
  ]);
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  const [languagePreference, setLanguagePreference] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function addInterestTag(tag: string) {
    const t = tag.trim().toLowerCase();
    if (!t || interests.includes(t) || interests.length >= 24) return;
    setInterests((prev) => [...prev, t]);
    setInterestInput("");
  }

  async function submit() {
    setStatus("loading");
    setMessage(null);
    const res = await saveOnboarding({
      city: city.trim(),
      timezone: timezone.trim() || undefined,
      availability,
      interests,
      energyLevel,
      groupStyle,
      lifeStages,
      accessibilityNotes: accessibilityNotes.trim() || undefined,
      languagePreference: languagePreference.trim() || undefined,
    });
    if (!res.ok) {
      setStatus("error");
      setMessage(res.error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-ah-ink">Onboarding</h1>
      <p className="mt-1 text-sm text-ah-muted">
        <Link href="/" className="text-ah-accent hover:underline">
          Home
        </Link>
      </p>

      <div
        className="mt-6 h-2 w-full overflow-hidden rounded-full bg-ah-border"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-ah-accent transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ah-muted">
        Step {step + 1} of {STEPS.length}: {STEPS[step]}
      </p>

      <div className="relative mt-8 rounded-xl border border-ah-border bg-ah-card p-6 shadow-sm">
        {step === 0 && <p className="text-sm text-ah-muted">Same weekly slot, small group — continue when ready.</p>}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="city">
                City / area <span className="text-ah-warm">*</span>
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., Austin, TX"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="tz">
                Timezone
              </label>
              <input
                id="tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., America/Chicago"
              />
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-ah-ink">Typical availability</legend>
              <p className="mt-1 text-sm text-ah-muted">Select all that work.</p>
              <div className="mt-3 space-y-2">
                {AVAILABILITY_OPTIONS.map((a) => (
                  <label key={a.id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                    <input
                      type="checkbox"
                      checked={availability.includes(a.id)}
                      onChange={() => toggle(availability, a.id, setAvailability)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <span>{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-ah-muted">Pick a few tags—used for grouping, not ranking.</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggle(interests, t, setInterests)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    interests.includes(t)
                      ? "border-ah-accent bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-ah-ink"
                      : "border-ah-border text-ah-muted hover:border-ah-accent"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="custom">
                Add your own (comma or Enter)
              </label>
              <input
                id="custom"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addInterestTag(interestInput.replace(",", ""));
                  }
                }}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., climbing"
              />
            </div>
            {interests.length > 0 && (
              <p className="text-sm text-ah-muted">
                Selected: <span className="text-ah-ink">{interests.join(", ")}</span>
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold text-ah-ink">Energy level</legend>
              <div className="mt-2 space-y-2">
                {(
                  [
                    ["LOW", "Low — quiet parallel time matters"],
                    ["MEDIUM", "Medium — some conversation, no spotlight"],
                    ["HIGH", "High — I like lively discussion"],
                  ] as const
                ).map(([id, label]) => (
                  <label key={id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                    <input
                      type="radio"
                      name="energy"
                      checked={energyLevel === id}
                      onChange={() => setEnergyLevel(id)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold text-ah-ink">Group style</legend>
              <div className="mt-2 space-y-2">
                {(
                  [
                    ["QUIET", "Quiet-first — parallel work, light prompts"],
                    ["ACTIVITY", "Light activity — walks, low-stakes outings"],
                    ["MIXED", "Mixed — week-to-week flexibility"],
                  ] as const
                ).map(([id, label]) => (
                  <label key={id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                    <input
                      type="radio"
                      name="style"
                      checked={groupStyle === id}
                      onChange={() => setGroupStyle(id)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-sm font-semibold text-ah-ink">Life stage</legend>
            <p className="mt-1 text-sm text-ah-muted">Select any that fit.</p>
            <div className="mt-3 space-y-2">
              {LIFE_STAGES.map((s) => (
                <label key={s.id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                  <input
                    type="checkbox"
                    checked={lifeStages.includes(s.id)}
                    onChange={() =>
                      setLifeStages((prev) =>
                        prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id],
                      )
                    }
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="a11y">
                Accessibility or comfort notes
              </label>
              <textarea
                id="a11y"
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="Optional — helps hosts plan inclusive rituals."
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="lang">
                Language preference
              </label>
              <input
                id="lang"
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., English, bilingual OK"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-lg border-2 border-ah-border px-4 py-2 font-semibold text-ah-ink hover:bg-ah-bg-alt"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === 1 && !city.trim()}
              className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button
              type="button"
              onClick={submit}
              disabled={status === "loading" || !city.trim() || availability.length === 0 || interests.length === 0 || lifeStages.length === 0}
              className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
            >
              {status === "loading" ? "Saving…" : "Finish & go to dashboard"}
            </button>
          )}
        </div>

        {message && (
          <p className={`mt-4 text-sm font-medium ${status === "error" ? "text-red-700" : "text-ah-accent"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
