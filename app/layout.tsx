import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mieszkanko",
  description: "Nasza apka do rachunków",
  manifest: "/manifest.json", // TO JEST KLUCZOWE
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mieszkanko",
  },
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
      {/* DODAJEMY TĘ SEKCJĘ HEAD PONIŻEJ */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333ea" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>

      <body className="min-h-full flex flex-col">{children}</body>
    </html>a
  );
}
