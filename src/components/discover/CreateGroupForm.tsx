"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createInterestGroup } from "@/actions/discovery";
import { DISCOVERY_CITY } from "@/lib/discovery-constants";

const CATEGORIES = ["hiking", "coffee", "movies", "books", "sports", "coworking", "food", "walking", "gaming", "other"] as const;
const INTENSITY = ["low-key", "casual", "social", "active", "high-energy"] as const;

const fieldClass =
  "w-full rounded-2xl border-0 bg-white/92 py-3 px-4 text-sm text-ah-ink shadow-[0_4px_20px_-12px_rgba(20,24,22,0.1)] ring-1 ring-black/[0.06] backdrop-blur-sm placeholder:text-ah-muted/80 focus:outline-none focus:ring-2 focus:ring-ah-accent/25";

export function CreateGroupForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaultDate = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().slice(0, 10);
  }, []);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ah-muted">Host</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ah-ink">Host a meetup</h1>
        <p className="text-sm leading-relaxed text-ah-muted">
          Keep it intimate—coffee 4–6, games 4–8, sports 8–12, hikes 4–10.
        </p>
      </div>

    <form
      className="card-consumer space-y-5 rounded-[2rem] p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            const r = await createInterestGroup({
              title: String(fd.get("title") ?? ""),
              category: String(fd.get("category") ?? ""),
              city: String(fd.get("city") ?? ""),
              date: String(fd.get("date") ?? ""),
              time: String(fd.get("time") ?? ""),
              endTime: String(fd.get("endTime") ?? "") || undefined,
              locationLabel: String(fd.get("locationLabel") ?? ""),
              address: String(fd.get("address") ?? "") || undefined,
              neighborhood: String(fd.get("neighborhood") ?? "") || undefined,
              vibe: String(fd.get("vibe") ?? ""),
              intensity: String(fd.get("intensity") ?? "") as (typeof INTENSITY)[number],
              minPeople: Number(fd.get("minPeople")),
              maxPeople: Number(fd.get("maxPeople")),
              description: String(fd.get("description") ?? "") || undefined,
              isPublic: fd.get("isPublic") === "on",
              chatEnabled: fd.get("chatEnabled") === "on",
            });
            if (r.ok) {
              router.push(`/group/${r.groupId}`);
              router.refresh();
            } else {
              setError(r.error ?? "Something went wrong.");
            }
          } catch (e) {
            console.error("[create meetup]", e);
            setError("Could not post meetup. Stay signed in and try again.");
          }
        });
      }}
    >
      {error && (
        <div className="rounded-2xl bg-ah-warm/12 px-4 py-3 text-sm text-ah-ink ring-1 ring-ah-warm/25" role="alert">
          {error}
        </div>
      )}

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Title</span>
        <input
          name="title"
          required
          maxLength={80}
          placeholder="e.g. Camelback sunrise hike"
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Activity</span>
        <select name="category" required className={fieldClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium text-ah-ink">Date</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={defaultDate}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-ah-ink">Start time</span>
            <input
              name="time"
              type="time"
              required
              defaultValue="19:00"
              className={fieldClass}
            />
          </label>
        </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">End time (optional)</span>
        <input name="endTime" type="time" className={fieldClass} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">City</span>
        <input
          name="city"
          required
          defaultValue={DISCOVERY_CITY}
          maxLength={120}
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Location</span>
        <input
          name="locationLabel"
          required
          placeholder="Venue or meetup point"
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Street address (optional)</span>
        <input name="address" maxLength={200} placeholder="For maps" className={fieldClass} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Neighborhood (optional)</span>
        <input name="neighborhood" maxLength={80} className={fieldClass} />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Vibe label</span>
        <input
          name="vibe"
          required
          placeholder="e.g. networking-lite, low-key"
          className={fieldClass}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Intensity</span>
        <select name="intensity" required className={fieldClass}>
          {INTENSITY.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Minimum people</span>
          <input
            name="minPeople"
            type="number"
            min={2}
            max={20}
            defaultValue={3}
            required
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Maximum people</span>
          <input
            name="maxPeople"
            type="number"
            min={2}
            max={30}
            defaultValue={6}
            required
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-ah-ink">Description</span>
        <textarea
          name="description"
          rows={3}
          maxLength={500}
          className={`${fieldClass} min-h-[5.5rem]`}
        />
      </label>

      <div className="flex flex-col gap-3 rounded-2xl bg-black/[0.03] p-4 ring-1 ring-black/[0.05]">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ah-ink">
          <input name="isPublic" type="checkbox" defaultChecked className="h-4 w-4 rounded border-ah-border text-ah-accent focus:ring-ah-accent/30" />
          <span>Show in Discover ({DISCOVERY_CITY})</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm text-ah-ink">
          <input name="chatEnabled" type="checkbox" defaultChecked className="h-4 w-4 rounded border-ah-border text-ah-accent focus:ring-ah-accent/30" />
          <span>Temporary group chat until a few hours after start</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ah-accent py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(45,90,74,0.45)] transition hover:bg-ah-accent-soft disabled:opacity-60"
      >
        {pending ? "Posting…" : "Post meetup"}
      </button>
    </form>
    </div>
  );
}
