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
    <div className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">AfterHours</p>
      <h1 className="font-display text-3xl font-bold text-ah-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ah-muted">
        <Link href="/" className="text-ah-accent hover:underline">
          Home
        </Link>
      </p>
      {(openGoogle || openEmail) && (
        <p className="mt-3 text-sm leading-relaxed text-ah-muted">
          {openGoogle && (
            <>
              <strong className="font-medium text-ah-ink">Google:</strong> anyone with a Google account can sign in
              (first visit creates your profile).
              {openEmail ? " " : ""}
            </>
          )}
          {openEmail && (
            <>
              <strong className="font-medium text-ah-ink">Email link:</strong> use any address—we send a one-time link
              (no password to remember).
            </>
          )}
        </p>
      )}
      {flags.demo && !(openGoogle || openEmail) && (
        <p className="mt-3 text-sm text-ah-muted">
          Demo sign-in uses emails listed in <code className="rounded bg-ah-bg-alt px-1 text-xs">DEMO_LOGIN_EMAILS</code>{" "}
          and the shared demo password from <code className="rounded bg-ah-bg-alt px-1 text-xs">.env</code>. Copy{" "}
          <code className="rounded bg-ah-bg-alt px-1 text-xs">.env.example</code> → <code className="rounded bg-ah-bg-alt px-1 text-xs">.env</code>{" "}
          and run <code className="rounded bg-ah-bg-alt px-1 text-xs">npm run setup</code>.
        </p>
      )}
      <div className="mt-8 rounded-xl border border-ah-border bg-ah-card p-6 shadow-sm">
        <Suspense fallback={<p className="text-sm text-ah-muted">Loading sign-in…</p>}>
          <SignInPanel flags={flags} />
        </Suspense>
      </div>
    </div>
  );
}
