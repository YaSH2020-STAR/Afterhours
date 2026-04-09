import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

/**
 * Use the left-most proto from proxies (`https, http` is common).
 * Returns null when the header is absent or unrecognized.
 */
function forwardedProtoIsHttps(req: NextRequest): boolean | null {
  const raw = req.headers.get("x-forwarded-proto");
  if (!raw) return null;
  const first = raw.split(",")[0]?.trim().toLowerCase();
  if (first === "https") return true;
  if (first === "http") return false;
  return null;
}

/**
 * Auth.js prefixes the session cookie with `__Secure-` when it considers the
 * connection HTTPS. Middleware `getToken` must use the same choice, or the
 * token is always null (infinite redirect to sign-in after “successful” login).
 */
export function secureSessionCookieForRequest(req: NextRequest): boolean {
  const fromForwarded = forwardedProtoIsHttps(req);
  if (fromForwarded !== null) return fromForwarded;
  if (process.env.VERCEL === "1") return true;
  return req.nextUrl.protocol === "https:";
}

/**
 * Decode the JWT session from the request cookie. Tries both secure and
 * non-secure cookie names so proxy / internal URL mismatches still work.
 */
export async function getMiddlewareSessionToken(req: NextRequest) {
  const secret = getAuthSecret();
  const primarySecure = secureSessionCookieForRequest(req);
  const primary = await getToken({ req, secret, secureCookie: primarySecure });
  if (primary) return primary;
  return getToken({ req, secret, secureCookie: !primarySecure });
}
