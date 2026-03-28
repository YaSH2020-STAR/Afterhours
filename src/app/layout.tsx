import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
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
    default: "AfterHours — rhythm, not RSVPs",
    template: "%s · AfterHours",
  },
  description:
    "Small pods and recurring rituals for young working professionals (20–30) who recently moved to a new city—without dating pressure, résumé theater, or endless one-off events.",
  openGraph: {
    title: "AfterHours — rhythm, not RSVPs",
    description:
      "Same people, same weekly cadence, in your new city—real-life co-presence without the performance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfterHours",
    description: "Pods, seasons, and dignity—not another feed.",
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
        {children}
      </body>
    </html>
  );
}
