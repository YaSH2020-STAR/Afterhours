"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setAttendance } from "@/actions/attendance";

export function AttendanceButtons(props: {
  podId: string;
  weekIndex: number;
  current?: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function go(status: "ATTENDING" | "NOT_ATTENDING") {
    start(async () => {
      await setAttendance({ podId: props.podId, weekIndex: props.weekIndex, status });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => go("ATTENDING")}
        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
          props.current === "ATTENDING"
            ? "border-ah-accent bg-ah-accent text-white"
            : "border-ah-border text-ah-ink hover:border-ah-accent"
        }`}
      >
        Attending
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => go("NOT_ATTENDING")}
        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${
          props.current === "NOT_ATTENDING"
            ? "border-ah-warm bg-[color-mix(in_srgb,var(--accent-warm)_15%,transparent)] text-ah-ink"
            : "border-ah-border text-ah-ink hover:border-ah-warm"
        }`}
      >
        Not attending
      </button>
    </div>
  );
}
