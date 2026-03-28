"use client";

import { useState } from "react";

type Props = {
  idPrefix?: string;
  className?: string;
};

export function WaitlistForm({ idPrefix = "wl", className = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      timezone: String(fd.get("timezone") ?? ""),
      situations: [] as string[],
      availability: [] as string[],
      affinity: [] as string[],
      comfortNotes: String(fd.get("notes") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
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
        setMessage(
          typeof data.message === "string" ? data.message : "Something went wrong. Try again.",
        );
        return;
      }
      setStatus("success");
      setMessage(
        typeof data.message === "string"
          ? data.message
          : "You’re on the list. We’ll be in touch when your city opens.",
      );
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  return (
    <form
      className={`relative flex flex-col gap-2 text-left ${className}`}
      onSubmit={onSubmit}
      noValidate
    >
      <label htmlFor={`${idPrefix}-email`} className="text-sm font-semibold text-ah-ink">
        Email <span className="text-ah-warm">*</span>
      </label>
      <input
        id={`${idPrefix}-email`}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        className="rounded-lg border border-ah-border bg-ah-card px-3 py-2 text-ah-ink"
      />

      <label htmlFor={`${idPrefix}-city`} className="mt-2 text-sm font-semibold">
        City / metro you moved to
      </label>
      <input
        id={`${idPrefix}-city`}
        name="city"
        type="text"
        autoComplete="address-level2"
        placeholder="e.g., Columbus, OH"
        className="rounded-lg border border-ah-border bg-ah-card px-3 py-2"
      />

      <label htmlFor={`${idPrefix}-tz`} className="mt-2 text-sm font-semibold">
        Timezone (optional, helps scheduling)
      </label>
      <input
        id={`${idPrefix}-tz`}
        name="timezone"
        type="text"
        placeholder="e.g., America/New_York"
        className="rounded-lg border border-ah-border bg-ah-card px-3 py-2"
      />

      <label htmlFor={`${idPrefix}-notes`} className="mt-2 text-sm font-semibold">
        Optional: accessibility or comfort notes (private)
      </label>
      <textarea
        id={`${idPrefix}-notes`}
        name="notes"
        rows={3}
        placeholder="e.g., ASL-friendly, sober space, introvert-paced — or anything that helps us match you with dignity"
        className="rounded-lg border border-ah-border bg-ah-card px-3 py-2 text-ah-ink"
      />

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-ah-muted">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-ah-border" />
        <span>
          I agree to be contacted about AfterHours in my area and understand I can unsubscribe
          anytime. <span className="text-ah-warm">*</span>
        </span>
      </label>

      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-3 rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2.5 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Join waitlist"}
      </button>

      <p className="text-sm text-ah-muted">No spam. One update per milestone. Unsubscribe anytime.</p>

      {message && (
        <p
          role="status"
          className={`mt-2 text-sm font-medium ${status === "error" ? "text-red-700" : "text-ah-accent"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
