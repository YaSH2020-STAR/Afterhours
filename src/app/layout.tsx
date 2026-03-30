import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

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
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body className={`${sourceSans.className} min-h-screen bg-ah-bg text-ah-ink antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
