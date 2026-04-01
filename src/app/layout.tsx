import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/Providers";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
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
