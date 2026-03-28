"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AFFINITY_OPTIONS,
  AVAILABILITY_OPTIONS,
  SITUATION_OPTIONS,
} from "@/lib/validation";

const POD_VIBES = [
  { id: "quiet_parallel", label: "Quiet parallel hour first (low chatter)" },
  { id: "socially_light", label: "Light conversation, still low pressure" },
  { id: "no_preference", label: "No preference—match me thoughtfully" },
] as const;

const STEPS = [
  "Your new city",
  "Your situation",
  "Availability",
  "Comfort & affinity",
  "Pod vibe",
  "Notes & email",
] as const;

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [situations, setSituations] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [affinity, setAffinity] = useState<string[]>([]);
  const [podVibe, setPodVibe] = useState<(typeof POD_VIBES)[number]["id"]>("no_preference");
  const [comfortNotes, setComfortNotes] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  async function submit() {
    setStatus("loading");
    setMessage(null);
    const payload = {
      email,
      city,
      timezone,
      situations,
      availability,
      affinity,
      comfortNotes,
      podVibe: podVibe === "no_preference" ? undefined : podVibe,
      consent,
      website,
    };
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.message ?? "Check the form for errors and try again.");
        return;
      }
      setStatus("success");
      setMessage(
        data.message ??
          "You’re on the list. We’ll reach out when your city opens with small pods.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Try again in a moment.");
    }
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">Full intake</p>
      <h1 className="font-display text-3xl font-bold text-ah-ink">Tell us how to match you</h1>
      <p className="mt-2 text-ah-muted">
        Built for <strong className="text-ah-ink">young working professionals</strong> (roughly 20–30) who{" "}
        <strong className="text-ah-ink">recently moved to a new city</strong>. Nothing here is a performance
        score—just what we need to place you in a humane pod.{" "}
        <Link href="/" className="font-medium text-ah-accent underline-offset-2 hover:underline">
          Back to overview
        </Link>
      </p>

      <div
        className="mt-6 h-2 w-full overflow-hidden rounded-full bg-ah-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Form progress"
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
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="city">
                City / metro you moved to <span className="text-ah-warm">*</span>
              </label>
              <input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., Austin, TX"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="tz">
                Timezone (optional)
              </label>
              <input
                id="tz"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
                placeholder="e.g., America/Chicago — helps us propose a weekly slot"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-sm font-semibold text-ah-ink">What sounds like you lately?</legend>
            <p className="mt-1 text-sm text-ah-muted">Select any that apply.</p>
            <div className="mt-3 space-y-2">
              {SITUATION_OPTIONS.map((s) => (
                <label key={s.id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                  <input
                    type="checkbox"
                    checked={situations.includes(s.id)}
                    onChange={() => toggle(situations, s.id, setSituations)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-sm font-semibold text-ah-ink">When could you usually show up?</legend>
            <p className="mt-1 text-sm text-ah-muted">We’ll propose one weekly slot that fits the pod.</p>
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
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-sm font-semibold text-ah-ink">Optional affinities</legend>
            <p className="mt-1 text-sm text-ah-muted">
              Nothing here is required. Ethnicity and culture are{" "}
              <strong className="text-ah-ink">never gates</strong>—these checkboxes only help us place you in a pod
              that fits. Skip all of them if you want matchmaking based on schedule and city alone. For how we handle
              ethnicity in matching and moderation, see{" "}
              <Link
                href="/safety#ethnicity-matching"
                className="font-medium text-ah-accent underline-offset-2 hover:underline"
              >
                Safety — Ethnicity & matching
              </Link>
              .
            </p>
            <div className="mt-4 space-y-2">
              {AFFINITY_OPTIONS.map((a) => (
                <label key={a.id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                  <input
                    type="checkbox"
                    checked={affinity.includes(a.id)}
                    onChange={() => toggle(affinity, a.id, setAffinity)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>{a.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="text-sm font-semibold text-ah-ink">Pod vibe (non-binding)</legend>
            <div className="mt-3 space-y-2">
              {POD_VIBES.map((v) => (
                <label key={v.id} className="flex cursor-pointer gap-2 text-sm text-ah-muted">
                  <input
                    type="radio"
                    name="podVibe"
                    checked={podVibe === v.id}
                    onChange={() => setPodVibe(v.id)}
                    className="mt-0.5 h-4 w-4"
                  />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold" htmlFor="notes">
                Anything else we should know?
              </label>
              <textarea
                id="notes"
                value={comfortNotes}
                onChange={(e) => setComfortNotes(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2 text-ah-ink"
                placeholder="Accessibility, dietary boundaries for shared meals, neighborhood…"
              />
            </div>
            <div>
              <label className="text-sm font-semibold" htmlFor="email">
                Email <span className="text-ah-warm">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
              />
            </div>
            <label className="flex cursor-pointer gap-2 text-sm text-ah-muted">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4"
              />
              <span>
                I agree to be contacted about AfterHours in my area and can unsubscribe anytime.{" "}
                <span className="text-ah-warm">*</span>
              </span>
            </label>
            <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="rounded-lg border-2 border-ah-border px-4 py-2 font-semibold text-ah-ink hover:bg-ah-bg-alt"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={next}
              disabled={step === 0 && !city.trim()}
              className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button
              type="button"
              onClick={submit}
              disabled={status === "loading" || !email.trim() || !consent}
              className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
            >
              {status === "loading" ? "Submitting…" : "Submit intake"}
            </button>
          )}
        </div>

        {message && (
          <p
            role="status"
            className={`mt-4 text-sm font-medium ${status === "error" ? "text-red-700" : "text-ah-accent"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
