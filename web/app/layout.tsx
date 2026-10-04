import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--nf-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--nf-mono" });
const serif = Newsreader({ subsets: ["latin"], style: ["italic"], weight: ["400"], variable: "--nf-serif" });

import { siteUrl } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  alternates: { canonical: "/", types: { "application/rss+xml": "/blog/rss.xml" } },
  authors: [{ name: "Jalal Saleem" }],
  keywords: ["Jalal Saleem", "satellite collision avoidance", "embedded AI", "edge AI", "computer vision", "electrical engineering", "research"],
  title: { default: "Jalal Saleem", template: "%s · Jalal Saleem" },
  description: "Electrical engineer and researcher. Satellite collision avoidance, embedded AI and computer vision.",
  openGraph: { type: "website", siteName: "Jalal Saleem", locale: "en_US", images: [{ url: "/images/projects/collision-avoidance.webp", alt: "Jalal Saleem research" }] },
  twitter: { card: "summary_large_image", images: ["/images/projects/collision-avoidance.webp"] },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
