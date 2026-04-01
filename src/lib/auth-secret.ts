/**
 * Single source for JWT signing/verification (Auth.js + middleware `getToken`).
 * Set AUTH_SECRET or NEXTAUTH_SECRET in production deployment env.
 *
 * During `next build`, NODE_ENV is production but Next sets NEXT_PHASE to
 * `phase-production-build`. We must not throw there if env is only injected at
 * runtime on the host (always set AUTH_SECRET on Vercel Production anyway).
 */
export function getAuthSecret(): string {
  const s = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "development") {
    return "development-only-auth-secret-not-for-production";
  }
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder-auth-secret-not-used-at-runtime";
  }
  throw new Error(
    "AUTH_SECRET (or NEXTAUTH_SECRET) must be set when NODE_ENV is production. Configure it in your deployment environment variables.",
  );
}
