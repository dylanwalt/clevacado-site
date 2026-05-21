import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ClevaCado | Post-harvest diagnostics for avocado supply chains",
  description:
    "ClevaCado helps avocado producers find and reduce bruising-risk hotspots from farm to market with motion sensing and stage-by-stage diagnostics.",
  keywords: [
    "agri-tech",
    "avocado",
    "supply chain",
    "post-harvest",
    "bruising detection",
    "food quality",
    "smart sensor",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
