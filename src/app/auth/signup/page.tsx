import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

/** Prisma + bcrypt need Node (not Edge) */
export const runtime = "nodejs";

export default function SignUpPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">AfterHours</p>
      <h1 className="font-display text-3xl font-bold text-ah-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ah-muted">
        <Link href="/" className="text-ah-accent hover:underline">
          Home
        </Link>
        {" · "}
        <Link href="/auth/signin" className="text-ah-accent hover:underline">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ah-muted">
        Use your email and a password. After you sign up you can finish onboarding and join groups.
      </p>
      <div className="mt-8 rounded-xl border border-ah-border bg-ah-card p-6 shadow-sm">
        <Suspense fallback={<p className="text-sm text-ah-muted">Loading…</p>}>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
