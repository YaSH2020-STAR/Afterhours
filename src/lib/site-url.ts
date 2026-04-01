/**
 * Canonical public URL for metadata, sitemap, and robots.
 * - Prefer NEXT_PUBLIC_SITE_URL in production (custom domain + stable URLs).
 * - When deployed on Vercel, VERCEL_URL is set automatically if this is unset.
 */
export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return "http://localhost:3000";
}
