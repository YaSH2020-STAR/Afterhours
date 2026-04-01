/**
 * Single source for JWT signing/verification (Auth.js + middleware `getToken`).
 * Set AUTH_SECRET or NEXTAUTH_SECRET in production deployment env.
 */
export function getAuthSecret(): string {
  const s = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV === "development") {
    return "development-only-auth-secret-not-for-production";
  }
  throw new Error(
    "AUTH_SECRET (or NEXTAUTH_SECRET) must be set when NODE_ENV is production. Configure it in your deployment environment variables.",
  );
}
