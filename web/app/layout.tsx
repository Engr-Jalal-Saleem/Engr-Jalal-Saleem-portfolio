import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--nf-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--nf-mono" });
const serif = Newsreader({ subsets: ["latin"], style: ["italic"], weight: ["400"], variable: "--nf-serif" });

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Jalal Saleem", template: "%s · Jalal Saleem" },
  description: "Electrical engineer and researcher. Satellite collision avoidance, embedded AI and computer vision.",
  openGraph: { type: "website", siteName: "Jalal Saleem", images: ["/images/projects/collision-avoidance.webp"] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
