"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { signInWithPasswordClient } from "@/lib/auth-client-signin";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function toAvatarDataUrl(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please choose an image file.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be under 5 MB.");
    }
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
    if (compressed.length > 1_500_000) {
      throw new Error("Profile photo is too large. Try a smaller image.");
    }
    return compressed;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setMessage(null);
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    startTransition(async () => {
      // REST route (Node) for reliable registration + JSON errors in production.
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword: confirm,
            imageDataUrl: avatarDataUrl ?? undefined,
          }),
        });
        let data: { ok?: boolean; error?: string };
        try {
          data = (await res.json()) as { ok?: boolean; error?: string };
        } catch {
          setStatus("error");
          setMessage("Could not read server response. Try again.");
          return;
        }
        if (!res.ok || !data.ok) {
          setStatus("error");
          setMessage(data.error ?? "Could not create your account. Try again.");
          return;
        }
      } catch (err) {
        console.error("[signup] register fetch", err);
        setStatus("error");
        setMessage("Network error. Check your connection and try again.");
        return;
      }

      try {
        const path = callbackUrl.startsWith("/") ? callbackUrl : `/${callbackUrl}`;
        const absoluteCallback =
          callbackUrl.startsWith("http://") || callbackUrl.startsWith("https://")
            ? callbackUrl
            : `${window.location.origin}${path}`;
        const login = await signInWithPasswordClient({
          email: email.trim().toLowerCase(),
          password,
          callbackUrl: absoluteCallback,
        });
        if (!login.ok) {
          setStatus("success");
          setMessage("Account created. Sign in below with the same password.");
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          return;
        }
        window.location.assign(login.url);
      } catch (err) {
        console.error("[signup] login", err);
        setStatus("success");
        setMessage("Account created. Please sign in below.");
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-semibold text-ah-ink" htmlFor="su-name">
        Name
      </label>
      <input
        id="su-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-ah-border px-3 py-2"
        placeholder="Alex"
        required
        autoComplete="name"
        maxLength={120}
      />
      <label className="block text-sm font-semibold text-ah-ink" htmlFor="su-email">
        Email
      </label>
      <input
        id="su-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-ah-border px-3 py-2"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <div>
        <label className="block text-sm font-semibold text-ah-ink" htmlFor="su-avatar">
          Profile photo (optional)
        </label>
        <input
          id="su-avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="mt-1 w-full rounded-lg border border-ah-border px-3 py-2 text-sm"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) {
              setAvatarDataUrl(null);
              return;
            }
            setStatus("idle");
            setMessage(null);
            toAvatarDataUrl(file)
              .then((dataUrl) => setAvatarDataUrl(dataUrl))
              .catch((err: unknown) => {
                setAvatarDataUrl(null);
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Could not process image.");
              });
          }}
        />
        {avatarDataUrl && (
          <img
            src={avatarDataUrl}
            alt="Profile preview"
            className="mt-3 h-14 w-14 rounded-full border border-ah-border object-cover"
          />
        )}
      </div>
      <label className="block text-sm font-semibold text-ah-ink" htmlFor="su-pw">
        Password
      </label>
      <input
        id="su-pw"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-ah-border px-3 py-2"
        placeholder="At least 8 characters"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <label className="block text-sm font-semibold text-ah-ink" htmlFor="su-pw2">
        Confirm password
      </label>
      <input
        id="su-pw2"
        type={showPassword ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full rounded-lg border border-ah-border px-3 py-2"
        placeholder="Repeat password"
        required
        minLength={8}
        autoComplete="new-password"
      />
      <label className="flex items-center gap-2 text-xs text-ah-muted" htmlFor="show-pw-signup">
        <input
          id="show-pw-signup"
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        Show passwords
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2.5 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-ah-muted">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-ah-accent hover:underline">
          Sign in
        </Link>
      </p>
      {message && (
        <p
          role="status"
          className={`text-sm ${status === "error" ? "text-red-700" : status === "success" ? "text-emerald-700" : "text-ah-accent"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
