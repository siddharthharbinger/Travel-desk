import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIConciergeLauncher } from "@/components/AIConciergeLauncher";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TravelDesk by Harbinger | Corporate Travel & Visa Pre-Screening",
  description:
    "Enterprise AI-assisted travel and consular visa pre-screening platform engineered for executive mobility and statutory compliance.",
  icons: {
    icon: "/images/harbinger-logo.webp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  let unreadCount = 0;

  if (user) {
    try {
      unreadCount = await prisma.notification.count({
        where: { userId: user.id, isRead: false },
      });
    } catch {
      // Fallback if db is busy
      unreadCount = 0;
    }
  }

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of light/dark theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('traveldesk_theme');
                  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--canvas-bg)] text-[var(--foreground)] selection:bg-[var(--brand-teal)]/30 selection:text-[var(--brand-teal)]">
        <Navbar user={user} unreadNotificationsCount={unreadCount} />
        <main className="flex-1 pb-16">{children}</main>
        <Footer />
        <AIConciergeLauncher />
      </body>
    </html>
  );
}
