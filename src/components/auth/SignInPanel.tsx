"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Flags = { google: boolean; email: boolean };

export function SignInPanel({ flags }: { flags: Flags }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [magicEmail, setMagicEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  async function passwordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setPending("credentials");
    setMessage(null);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(null);
    if (!res?.ok || res.error) {
      setMessage("Wrong email or password, or this account uses Google / magic link only.");
      return;
    }
    window.location.assign(callbackUrl);
  }

  const { google: hasGoogle, email: hasEmail } = flags;

  return (
    <div className="space-y-6">
      <form onSubmit={passwordSignIn} className="space-y-3">
        <p className="text-sm font-medium text-ah-ink">Email &amp; password</p>
        <label className="text-sm font-semibold text-ah-ink" htmlFor="email-signin">
          Email
        </label>
        <input
          id="email-signin"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ah-border px-3 py-2"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <label className="text-sm font-semibold text-ah-ink" htmlFor="pw-signin">
          Password
        </label>
        <input
          id="pw-signin"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ah-border px-3 py-2"
          placeholder="Your password"
          required
          autoComplete="current-password"
        />
        <label className="flex items-center gap-2 text-xs text-ah-muted" htmlFor="show-pw-signin">
          <input
            id="show-pw-signin"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          Show password
        </label>
        <button
          type="submit"
          disabled={pending !== null}
          className="w-full rounded-lg border-2 border-ah-accent bg-ah-accent px-4 py-2 font-semibold text-white hover:bg-ah-accent-soft disabled:opacity-50"
        >
          {pending === "credentials" ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-ah-muted">
          No account?{" "}
          <Link href="/auth/signup" className="font-medium text-ah-accent hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-ah-muted">
          <Link href="/auth/forgot-password" className="text-ah-accent hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>

      {(hasGoogle || hasEmail) && (
        <div className="space-y-4 border-t border-ah-border pt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ah-muted">Or continue with</p>
          {hasGoogle && (
            <button
              type="button"
              onClick={google}
              disabled={pending !== null}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-ah-border bg-white px-4 py-2.5 font-semibold text-ah-ink hover:border-ah-accent disabled:opacity-50"
            >
              {pending === "google" ? "Continuing…" : "Google"}
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
                className="w-full rounded-lg border-2 border-ah-border bg-ah-bg-alt px-4 py-2 font-semibold text-ah-ink hover:border-ah-accent disabled:opacity-50"
              >
                {pending === "email" ? "Sending…" : "Email me a link"}
              </button>
            </form>
          )}
        </div>
      )}

      {message && <p className="text-sm text-ah-accent">{message}</p>}
    </div>
  );
}
