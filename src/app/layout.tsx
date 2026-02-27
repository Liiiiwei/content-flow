import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Keep Geist, it's premium.
import Link from "next/link";
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
  title: "ContentFlow AI | Article to Carousel",
  description: "Turn your blog posts into viral social media carousels in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="glass-header">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ width: 24, height: 24, background: 'var(--accent-gradient)', borderRadius: 6 }}></div>
              ContentFlow AI
            </Link>
            {/* Nav removed as requested */}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
