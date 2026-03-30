"use client";

import { useState } from "react";
import { submitReport } from "@/actions/safety";

export function ReportMemberButton(props: { userId: string; podId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function send() {
    setStatus("loading");
    const res = await submitReport({
      reportedUserId: props.userId,
      podId: props.podId,
      reason,
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setOpen(false);
    setReason("");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs font-medium text-ah-muted underline-offset-2 hover:text-ah-warm hover:underline"
      >
        Report
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-[min(100vw-2rem,320px)] rounded-lg border border-ah-border bg-ah-card p-3 shadow-lg">
          <p className="text-xs text-ah-muted">
            Reports go to our team. For emergencies, contact local authorities.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded border border-ah-border px-2 py-1 text-sm"
            placeholder="What happened?"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={send}
              disabled={status === "loading" || reason.trim().length < 8}
              className="rounded bg-ah-accent px-3 py-1 text-xs font-semibold text-white"
            >
              Submit
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs text-ah-muted">
              Cancel
            </button>
          </div>
          {status === "done" && <p className="mt-2 text-xs text-ah-accent">Thanks — we’ll review.</p>}
          {status === "error" && <p className="mt-2 text-xs text-red-700">Couldn’t send. Try again.</p>}
        </div>
      )}
    </div>
  );
}
