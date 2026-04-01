import type { NextConfig } from "next";

const baseSecurityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  /** Prisma Client must stay external for correct engine binaries on Vercel/serverless. */
  serverExternalPackages: ["@prisma/client", "prisma"],
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const headers =
      process.env.NODE_ENV === "production"
        ? [
            ...baseSecurityHeaders,
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload",
            },
          ]
        : baseSecurityHeaders;
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
