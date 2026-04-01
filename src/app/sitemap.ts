import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  const root = new URL(base);
  const paths = ["", "/waitlist", "/safety", "/auth/signin"];
  return paths.map((p) => ({
    url: new URL(p, root).toString(),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
}
