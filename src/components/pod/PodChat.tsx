"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { sendPodMessage } from "@/actions/messages";

type Member = {
  id: string;
  name: string | null;
};

type Msg = {
  id: string;
  body: string;
  createdAt: Date | string;
  senderId: string;
  recipientId: string | null;
  sender: { id: string; name: string | null; image: string | null };
  recipient: { id: string; name: string | null } | null;
};

export function PodChat(props: {
  podId: string;
  currentUserId: string;
  members: Member[];
  messages: Msg[];
  dmUnlocked: boolean;
}) {
  const { podId, currentUserId, members, messages, dmUnlocked } = props;
  const [body, setBody] = useState("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!body.trim()) return;
    setPending(true);
    const res = await sendPodMessage({
      podId,
      body: body.trim(),
      recipientId: recipientId || undefined,
    });
    setPending(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setBody("");
    router.refresh();
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="rounded-xl border border-ah-border bg-ah-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-ah-ink">Chat</h2>
        <p className="text-xs text-ah-muted">{dmUnlocked ? "Group + DM" : "Group only"}</p>
      </div>
      <div className="mt-3 max-h-[320px] space-y-3 overflow-y-auto rounded-lg bg-ah-bg-alt/60 p-3 text-sm">
        {messages.length === 0 && <p className="text-xs text-ah-muted">No messages yet.</p>}
        {messages.map((m) => {
          const isSelf = m.senderId === currentUserId;
          const isDm = Boolean(m.recipientId);
          return (
            <div key={m.id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
              <p className="text-xs text-ah-muted">
                {m.sender.name ?? "Member"}
                {isDm && (
                  <span>
                    {" "}
                    → {m.recipient?.name ?? "member"}
                    {!dmUnlocked && isDm ? " (unlocked week 3+)" : ""}
                  </span>
                )}
              </p>
              <p
                className={`mt-0.5 max-w-[85%] rounded-2xl px-3 py-2 ${
                  isSelf ? "bg-ah-accent text-white" : "bg-white text-ah-ink ring-1 ring-ah-border"
                }`}
              >
                {m.body}
              </p>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {dmUnlocked && (
          <div>
            <label className="text-xs font-semibold text-ah-muted" htmlFor="to">
              To
            </label>
            <select
              id="to"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ah-border bg-white px-3 py-2 text-sm"
            >
              <option value="">Everyone (group)</option>
              {members
                .filter((m) => m.id !== currentUserId)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name ?? "Member"}
                  </option>
                ))}
            </select>
          </div>
        )}
        {!dmUnlocked && <p className="text-xs text-ah-muted">DM unlocks week 3+.</p>}
        <label className="sr-only" htmlFor="msg">
          Message
        </label>
        <textarea
          id="msg"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-ah-border px-3 py-2"
          placeholder="Share a short intro or a logistical note…"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={pending || !body.trim()}
          className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 text-sm font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
    </div>
  );
}
