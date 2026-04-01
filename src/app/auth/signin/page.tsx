import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignInPanel } from "@/components/auth/SignInPanel";
import { getAuthFlags } from "@/lib/auth-flags";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  const flags = getAuthFlags();
  const openGoogle = flags.google;
  const openEmail = flags.email;

  return (
    <div
      className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-4 py-12"
      data-auth-ui="credentials-v1"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">AfterHours</p>
      <h1 className="font-display text-3xl font-bold text-ah-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ah-muted">
        <Link href="/" className="text-ah-accent hover:underline">
          Home
        </Link>
        {" · "}
        <Link href="/auth/signup" className="text-ah-accent hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ah-muted">
        Email and password work by default — Google and magic link are optional extras, not required.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ah-muted">
        Sign in with the email and password you used at registration.
        {(openGoogle || openEmail) && (
          <>
            {" "}
            You can also use {openGoogle && openEmail ? "Google or a one-time email link" : openGoogle ? "Google" : "a one-time email link"} if your host has
            those options enabled.
          </>
        )}
      </p>
      <div className="mt-8 rounded-xl border border-ah-border bg-ah-card p-6 shadow-sm">
        <Suspense fallback={<p className="text-sm text-ah-muted">Loading sign-in…</p>}>
          <SignInPanel flags={flags} />
        </Suspense>
      </div>
    </div>
  );
}
