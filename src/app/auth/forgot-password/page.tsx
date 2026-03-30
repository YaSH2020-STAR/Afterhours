import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[520px] flex-col justify-center px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-ah-warm">AfterHours</p>
      <h1 className="font-display text-3xl font-bold text-ah-ink">Reset password</h1>
      <div className="mt-6 rounded-xl border border-ah-border bg-ah-card p-6 text-sm text-ah-muted shadow-sm">
        Password reset is not enabled yet. Contact support/admin for a manual reset.
      </div>
      <p className="mt-4 text-sm text-ah-muted">
        <Link href="/auth/signin" className="text-ah-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
