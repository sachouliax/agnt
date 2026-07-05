import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PixelPal } from "@/components/PixelPal";
import { Web3Provider } from "@/components/Web3Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGNT — Autonomous agents, onchain on BNB Chain",
  description:
    "Describe the agent you want in one sentence. AGNT deploys it onchain on BNB Chain — no code, no team, no waiting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono">
        <Web3Provider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <PixelPal />
            <div className="crt-overlay" />
          </LanguageProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
