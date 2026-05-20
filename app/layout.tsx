import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClevaCado — The Smart Avocado",
  description:
    "ClevaCado travels through the avocado supply chain, measuring impact, vibration, rotation, and handling stress so producers can reduce damage and improve marketable yield.",
  keywords: [
    "agri-tech",
    "avocado",
    "supply chain",
    "post-harvest",
    "bruising detection",
    "food quality",
    "smart sensor",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
