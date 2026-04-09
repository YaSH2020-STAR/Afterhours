"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProfile } from "@/actions/profile";

export function ProfileForm(props: {
  initialName: string;
  initialBio: string;
  initialImage: string;
  city: string;
  interests: string[];
  energy: string;
  groupStyle: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(props.initialName);
  const [bio, setBio] = useState(props.initialBio);
  const [imageDataUrl, setImageDataUrl] = useState(props.initialImage || "");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function toAvatarDataUrl(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");
    const raw = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read image."));
      reader.readAsDataURL(file);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not load image."));
      el.src = raw;
    });
    const longest = Math.max(img.width, img.height);
    const scale = longest > 640 ? 640 / longest : 1;
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not process image.");
    ctx.drawImage(img, 0, 0, w, h);
    const compressed = canvas.toDataURL("image/jpeg", 0.82);
    if (compressed.length > 1_500_000) throw new Error("Profile photo is too large.");
    return compressed;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const res = await updateProfile({
      name: name.trim(),
      bio: bio.trim() || undefined,
      imageDataUrl: imageDataUrl || undefined,
    });
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
            <label className="text-sm font-semibold" htmlFor="profile-photo">
              Profile photo
            </label>
            <div className="mt-2 flex items-center gap-3">
              {imageDataUrl ? (
                <img src={imageDataUrl} alt="Profile" className="h-14 w-14 rounded-full border border-ah-border object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ah-border bg-ah-bg-alt text-xs text-ah-muted">
                  No photo
                </div>
              )}
              <input
                id="profile-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="text-sm"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  if (!file) return;
                  setStatus("idle");
                  setMessage(null);
                  toAvatarDataUrl(file)
                    .then((dataUrl) => setImageDataUrl(dataUrl))
                    .catch((err: unknown) => {
                      setStatus("error");
                      setMessage(err instanceof Error ? err.message : "Could not process image.");
                    });
                }}
              />
            </div>
          </div>
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
