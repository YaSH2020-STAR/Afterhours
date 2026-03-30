"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateUserLocation } from "@/actions/location";

export function DiscoverLocationBanner({ hasSavedLocation }: { hasSavedLocation: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  if (hasSavedLocation) return null;

  return (
    <div className="rounded-2xl border border-ah-border/50 bg-white/70 px-4 py-3 text-sm text-ah-ink shadow-[0_4px_24px_-16px_rgba(20,24,22,0.1)]">
      <p className="text-ah-muted">
        Save an approximate location to sort partner tables by distance and show miles (stored on your account).
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setErr(null);
          if (typeof navigator === "undefined" || !navigator.geolocation) {
            setErr("Location isn’t available in this browser.");
            return;
          }
          startTransition(() => {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const r = await updateUserLocation(pos.coords.latitude, pos.coords.longitude);
                if (!r.ok) setErr(r.error ?? "Could not save.");
                else router.refresh();
              },
              () => setErr("Location permission denied—you can try again from browser settings."),
              { maximumAge: 600_000, timeout: 12_000, enableHighAccuracy: false },
            );
          });
        }}
        className="mt-2 rounded-full bg-ah-accent/12 px-4 py-2 text-sm font-semibold text-ah-accent ring-1 ring-ah-accent/25 transition hover:bg-ah-accent/18 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Use my location"}
      </button>
      {err && <p className="mt-2 text-xs text-red-700">{err}</p>}
    </div>
  );
}
