import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

/** System font stacks only — avoids next/font Google fetch during Netlify build (no network to fonts.googleapis.com). */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AfterHours — real friends after work",
    template: "%s · AfterHours",
  },
  description: "Small weekly groups. Six weeks. Your city.",
  openGraph: {
    title: "AfterHours — real friends after work",
    description: "Small weekly groups. Six weeks. Your city.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfterHours",
    description: "AfterHours",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ah-bg text-ah-ink antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
