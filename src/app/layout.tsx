import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVSA Studio — Photography Booking",
  description:
    "Book a photography session with AVSA Studio. Browse services, check availability, and reserve your date.",
  openGraph: {
    title: "AVSA Studio",
    description: "Professional photography sessions, beautifully delivered.",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
            © {new Date().getFullYear()} AVSA Studio. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
