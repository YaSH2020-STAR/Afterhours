/**
 * Canonical public URL for metadata, sitemap, and robots.
 * - Prefer NEXT_PUBLIC_SITE_URL in production (custom domain + stable URLs).
 * - When deployed on Vercel, VERCEL_URL is set automatically if this is unset.
 * - Invalid explicit values (typos, accidental "y") are ignored so `new URL()` in layout metadata never throws.
 */
function tryAbsoluteHttpUrl(raw: string | undefined): string | null {
  const s = raw?.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return s.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getPublicSiteUrl(): string {
  const fromEnv = tryAbsoluteHttpUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}
