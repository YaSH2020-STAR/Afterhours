"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { registerWithEmail } from "@/actions/register";

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    startTransition(async () => {
      try {
        const reg = await registerWithEmail({ name, email, password });
        if (!reg.ok) {
          setMessage(reg.error);
          return;
        }
        const res = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
          callbackUrl,
        });
        if (!res?.ok || res.error) {
          setMessage("Account created. Sign in with your email and password.");
          router.push("/auth/signin");
          return;
        }
        window.location.assign(callbackUrl);
      } catch (err) {
        console.error(err);
        setMessage(
          "Request failed. If this persists, confirm DATABASE_URL and AUTH_SECRET are set on the server and the database has the latest migrations.",
        );
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
      {message && <p className="text-sm text-ah-accent">{message}</p>}
    </form>
  );
}
