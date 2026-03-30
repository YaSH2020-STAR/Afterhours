"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sendDiscoveryGroupMessage } from "@/actions/discovery";

type Msg = {
  id: string;
  body: string;
  createdAt: Date | string;
  sender: { id: string; name: string | null; image: string | null };
};

export function GroupChat({
  groupId,
  messages,
  canPost,
  closedHint,
}: {
  groupId: string;
  messages: Msg[];
  canPost: boolean;
  closedHint?: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-ah-border bg-ah-card p-4">
      <h2 className="font-display text-lg font-semibold text-ah-ink">Tonight&apos;s chat</h2>
      <p className="text-xs text-ah-muted">Lightweight thread · fades after the window closes</p>

      {!canPost && (
        <p className="mt-3 rounded-xl bg-ah-bg-alt/60 px-3 py-2 text-sm text-ah-muted">
          {closedHint ?? "Join the group to chat."}
        </p>
      )}

      <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1 text-sm">
        {messages.map((m) => (
          <li key={m.id} className="rounded-xl bg-ah-bg-alt/50 px-3 py-2">
            <p className="text-xs font-semibold text-ah-muted">{m.sender.name ?? "Member"}</p>
            <p className="text-ah-ink">{m.body}</p>
            <p className="mt-1 text-[10px] text-ah-muted">
              {new Date(m.createdAt as string).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </p>
          </li>
        ))}
        {messages.length === 0 && canPost && (
          <li className="text-sm text-ah-muted">Say hi—who&apos;s bringing snacks?</li>
        )}
      </ul>

      {canPost && (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const t = body.trim();
            if (!t) return;
            startTransition(async () => {
              await sendDiscoveryGroupMessage(groupId, t);
              setBody("");
              router.refresh();
            });
          }}
        >
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            placeholder="Quick note to the group…"
            className="min-w-0 flex-1 rounded-xl border border-ah-border bg-ah-bg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={pending || !body.trim()}
            className="rounded-xl border-2 border-ah-accent bg-ah-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
