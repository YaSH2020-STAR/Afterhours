"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Flags = { google: boolean; email: boolean; demo: boolean };

export function SignInPanel({ flags }: { flags: Flags }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [magicEmail, setMagicEmail] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function google() {
    setPending("google");
    setMessage(null);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setPending(null);
    }
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setPending("email");
    setMessage(null);
    const res = await signIn("nodemailer", {
      email: magicEmail.trim(),
      redirect: false,
      callbackUrl,
    });
    setPending(null);
    if (!res?.ok || res.error) {
      setMessage(
        res?.error
          ? "Could not send the link. Check EMAIL_SERVER / EMAIL_FROM in .env."
          : "Could not send the link. Try again or check server logs.",
      );
      return;
    }
    setMessage("Check your email for a sign-in link.");
  }

  async function demo(e: React.FormEvent) {
    e.preventDefault();
    setPending("demo");
    setMessage(null);
    const res = await signIn("demo", {
      email: demoEmail.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(null);
    if (!res?.ok || res.error) {
      setMessage(
        "Wrong email or password. Use a listed demo email and DEMO_LOGIN_PASSWORD (see .env.example), or run npm run setup.",
      );
      return;
    }
    window.location.assign(callbackUrl);
  }

  const { google: hasGoogle, email: hasEmail, demo: hasDemo } = flags;

  return (
    <div className="space-y-6">
      {hasGoogle && (
        <button
          type="button"
          onClick={google}
          disabled={pending !== null}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ah-border bg-white px-4 py-2.5 font-semibold text-ah-ink hover:border-ah-accent disabled:opacity-50"
        >
          {pending === "google" ? "Continuing…" : "Continue with Google"}
        </button>
      )}

      {hasEmail && (
        <form onSubmit={magicLink} className="space-y-3">
          <label className="text-sm font-semibold text-ah-ink" htmlFor="email-magic">
            Email (magic link)
          </label>
          <input
            id="email-magic"
            type="email"
            value={magicEmail}
            onChange={(e) => setMagicEmail(e.target.value)}
            className="w-full rounded-lg border border-ah-border px-3 py-2"
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
          <button
            type="submit"
            disabled={pending !== null}
            className="w-full rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
          >
            {pending === "email" ? "Sending…" : "Email me a link"}
          </button>
        </form>
      )}

      {hasDemo && (
        <form onSubmit={demo} className="space-y-3 border-t border-ah-border pt-6">
          <p className="text-xs font-medium text-ah-muted">Development / demo (restricted emails)</p>
          <label className="text-sm font-semibold text-ah-ink" htmlFor="email-demo">
            Email
          </label>
          <input
            id="email-demo"
            type="email"
            value={demoEmail}
            onChange={(e) => setDemoEmail(e.target.value)}
            className="w-full rounded-lg border border-ah-border px-3 py-2"
            placeholder="alex@demo.afterhours.local"
            autoComplete="username"
          />
          <label className="text-sm font-semibold text-ah-ink" htmlFor="pw">
            Password
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ah-border px-3 py-2"
            placeholder="Matches DEMO_LOGIN_PASSWORD"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={pending !== null}
            className="w-full rounded-lg border-2 border-ah-border bg-ah-bg-alt px-4 py-2 font-semibold text-ah-ink hover:border-ah-accent disabled:opacity-50"
          >
            {pending === "demo" ? "Signing in…" : "Demo sign-in"}
          </button>
        </form>
      )}

      {!hasGoogle && !hasEmail && !hasDemo && (
        <p className="text-sm text-ah-muted">Add OAuth, email, or demo vars to .env.</p>
      )}

      {message && <p className="text-sm text-ah-accent">{message}</p>}
    </div>
  );
}
