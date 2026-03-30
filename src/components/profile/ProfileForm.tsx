"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "@/actions/profile";

export function ProfileForm(props: {
  initialName: string;
  initialBio: string;
  city: string;
  interests: string[];
  energy: string;
  groupStyle: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(props.initialName);
  const [bio, setBio] = useState(props.initialBio);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const res = await updateProfile({ name: name.trim(), bio: bio.trim() || undefined });
    if (!res.ok) {
      setStatus("error");
      setMessage(res.error ?? "Couldn’t save.");
      return;
    }
    setStatus("idle");
    setMessage("Saved.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-ah-border bg-ah-card p-5">
        <h2 className="font-display text-lg font-semibold text-ah-ink">Basics</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold" htmlFor="bio">
              Short bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2"
              placeholder="A line or two—favorite neighborhood, what you’re reading…"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
          >
            {status === "loading" ? "Saving…" : "Save"}
          </button>
          {message && (
            <p className={`text-sm ${status === "error" ? "text-red-700" : "text-ah-accent"}`}>{message}</p>
          )}
        </form>
      </div>

      <p className="text-xs text-ah-muted">
        {props.city || "—"} · {props.interests.join(", ") || "—"} · {props.energy.toLowerCase()} /{" "}
        {props.groupStyle.toLowerCase()}
      </p>
    </div>
  );
}
