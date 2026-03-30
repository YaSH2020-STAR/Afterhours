import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const root = new URL(base);
  const paths = ["", "/waitlist", "/safety", "/auth/signin"];
  return paths.map((p) => ({
    url: new URL(p, root).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
