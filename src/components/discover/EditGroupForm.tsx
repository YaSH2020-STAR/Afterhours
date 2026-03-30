"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { GroupForUi } from "@/data/discovery";
import { deleteInterestGroup, updateInterestGroup } from "@/actions/discovery";

const CATEGORIES = ["hiking", "coffee", "movies", "books", "sports", "coworking", "food", "walking", "gaming", "other"] as const;
const INTENSITY = ["low-key", "casual", "social", "active", "high-energy"] as const;

const fieldClass =
  "w-full rounded-2xl border-0 bg-white/92 py-3 px-4 text-sm text-ah-ink shadow-[0_4px_20px_-12px_rgba(20,24,22,0.1)] ring-1 ring-black/[0.06] backdrop-blur-sm placeholder:text-ah-muted/80 focus:outline-none focus:ring-2 focus:ring-ah-accent/25";

function localDateParts(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function localTimeOnly(d: Date | null) {
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditGroupForm({ group, canDelete }: { group: GroupForUi; canDelete: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingDelete, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const defaults = useMemo(() => localDateParts(new Date(group.startsAt)), [group.startsAt]);
  const endTimeDefault = useMemo(() => localTimeOnly(group.endsAt), [group.endsAt]);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ah-muted">Host</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ah-ink">Edit plan</h1>
        <p className="text-sm leading-relaxed text-ah-muted">Update details—people who joined will see changes on the group page.</p>
      </div>

      {error && (
        <div className="rounded-2xl bg-ah-warm/12 px-4 py-3 text-sm text-ah-ink ring-1 ring-ah-warm/25" role="alert">
          {error}
        </div>
      )}

      <form
        className="card-consumer space-y-5 rounded-[2rem] p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const fd = new FormData(e.currentTarget);
          startTransition(async () => {
            const r = await updateInterestGroup({
              groupId: group.id,
              title: String(fd.get("title") ?? ""),
              category: String(fd.get("category") ?? ""),
              date: String(fd.get("date") ?? ""),
              time: String(fd.get("time") ?? ""),
              endTime: String(fd.get("endTime") ?? "") || undefined,
              locationLabel: String(fd.get("locationLabel") ?? ""),
              address: String(fd.get("address") ?? "") || null,
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
              router.push(`/group/${group.id}`);
              router.refresh();
            } else {
              setError(r.error ?? "Something went wrong.");
            }
          });
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Title</span>
          <input name="title" required maxLength={80} defaultValue={group.title} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Activity</span>
          <select name="category" required defaultValue={group.category} className={fieldClass}>
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
            <input name="date" type="date" required defaultValue={defaults.date} className={fieldClass} />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-ah-ink">Start time</span>
            <input name="time" type="time" required defaultValue={defaults.time} className={fieldClass} />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">End time (optional)</span>
          <input name="endTime" type="time" defaultValue={endTimeDefault} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Location</span>
          <input name="locationLabel" required defaultValue={group.locationLabel} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Street address (optional)</span>
          <input name="address" maxLength={200} defaultValue={group.address ?? ""} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Neighborhood (optional)</span>
          <input name="neighborhood" maxLength={80} defaultValue={group.neighborhood ?? ""} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Vibe label</span>
          <input name="vibe" required defaultValue={group.vibe} className={fieldClass} />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-ah-ink">Intensity</span>
          <select name="intensity" required defaultValue={group.intensity} className={fieldClass}>
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
              required
              defaultValue={group.minPeople}
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
              required
              defaultValue={group.maxPeople}
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
            defaultValue={group.description ?? ""}
            className={`${fieldClass} min-h-[5.5rem]`}
          />
        </label>

        <div className="flex flex-col gap-3 rounded-2xl bg-black/[0.03] p-4 ring-1 ring-black/[0.05]">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ah-ink">
            <input
              name="isPublic"
              type="checkbox"
              defaultChecked={group.isPublic}
              className="h-4 w-4 rounded border-ah-border text-ah-accent focus:ring-ah-accent/30"
            />
            <span>List publicly in discovery</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-ah-ink">
            <input
              name="chatEnabled"
              type="checkbox"
              defaultChecked={group.chatEnabled}
              className="h-4 w-4 rounded border-ah-border text-ah-accent focus:ring-ah-accent/30"
            />
            <span>Temporary group chat around the event</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ah-accent py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgba(45,90,74,0.45)] transition hover:bg-ah-accent-soft disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>

      {canDelete && (
        <div className="rounded-[2rem] border border-black/[0.08] bg-ah-bg-alt/40 p-6">
          <p className="text-sm font-medium text-ah-ink">Delete this plan</p>
          <p className="mt-1 text-sm text-ah-muted">
            Only available when you are the only person on the plan (no guests, waitlist, or interest).
          </p>
          <button
            type="button"
            disabled={pendingDelete}
            onClick={() => {
              if (!confirm("Permanently delete this plan? This cannot be undone.")) return;
              startDelete(async () => {
                const r = await deleteInterestGroup(group.id);
                if (r.ok) {
                  router.push("/plans");
                  router.refresh();
                } else {
                  setError(r.error ?? "Could not delete.");
                }
              });
            }}
            className="mt-4 rounded-full border-2 border-ah-warm/40 bg-ah-warm/10 px-5 py-2.5 text-sm font-semibold text-ah-ink hover:bg-ah-warm/15 disabled:opacity-50"
          >
            {pendingDelete ? "Deleting…" : "Delete plan"}
          </button>
        </div>
      )}
    </div>
  );
}
