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
  title: "ClevaCado | Post-Harvest Diagnostics",
  description:
    "ClevaCado is a diagnostic device that travels the avocado supply chain to detect invisible handling damage and pinpoint bruising hotspots — from harvest to market.",
  keywords: [
    "agri-tech",
    "avocado",
    "supply chain",
    "post-harvest",
    "bruising detection",
    "food quality",
    "smart sensor",
    "hotspot detection",
    "handling diagnostics",
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
