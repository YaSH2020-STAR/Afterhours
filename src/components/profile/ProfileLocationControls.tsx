"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { clearUserLocation } from "@/actions/location";

export function ProfileLocationControls({ hasSavedLocation }: { hasSavedLocation: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!hasSavedLocation) return null;

  return (
    <div className="rounded-xl border border-ah-border bg-ah-card p-5">
      <h2 className="font-display text-lg font-semibold text-ah-ink">Map location</h2>
      <p className="mt-1 text-sm text-ah-muted">
        Used only to compute distances to partner tables. You can clear it anytime.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await clearUserLocation();
            router.refresh();
          })
        }
        className="mt-3 text-sm font-semibold text-ah-accent hover:underline disabled:opacity-50"
      >
        {pending ? "Clearing…" : "Clear saved location"}
      </button>
    </div>
  );
}
