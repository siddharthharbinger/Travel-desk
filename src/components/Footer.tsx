"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#071426]/40 backdrop-blur-2xl relative z-10 transition-colors shadow-[0_-8px_32px_rgba(0,0,0,0.25)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-3.5">
        {/* Compact Single-Row Header Strip: Logo + Quick Links + Partner Links */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Brand Wordmark Only (No Harbinger logo) */}
          <div className="flex items-center gap-3">
            <Logo showPartnerIcon={false} />
            <span className="hidden sm:inline text-xs text-[var(--foreground-subtle)] border-l border-white/10 pl-3">
              Corporate Travel & Consular Pre-Screening
            </span>
          </div>

          {/* Horizontal Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-[var(--foreground-muted)]" aria-label="Footer Navigation">
            <Link href="/visas" className="hover:text-[var(--brand-teal)] transition-colors">
              Visas
            </Link>
            <Link href="/visas/info" className="hover:text-[var(--brand-teal)] transition-colors">
              Visa Info
            </Link>
            <Link href="/flights" className="hover:text-[var(--brand-teal)] transition-colors">
              Flights
            </Link>
            <Link href="/hotels" className="hover:text-[var(--brand-teal)] transition-colors">
              Hotels
            </Link>
            <Link href="/passport" className="hover:text-[var(--brand-teal)] transition-colors">
              Passport
            </Link>
            <Link href="/travel-info" className="hover:text-[var(--brand-teal)] transition-colors">
              Destinations
            </Link>
            <Link href="/faq" className="hover:text-[var(--brand-teal)] transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Partner Search Links Inline */}
          <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)]">
            <span className="hidden xl:inline text-[11px] text-[var(--foreground-subtle)]">Search via:</span>
            <a
              href="https://www.ixigo.com/flights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--brand-teal)] transition-colors"
            >
              <span>ixigo</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="opacity-30">•</span>
            <a
              href="https://www.makemytrip.com/flights/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--brand-teal)] transition-colors"
            >
              <span>MakeMyTrip</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <span className="opacity-30">•</span>
            <a
              href="https://www.booking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[var(--brand-teal)] transition-colors"
            >
              <span>Booking.com</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Ultra-Slim Bottom Legal Bar */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--foreground-subtle)]">
          <p>© {currentYear} TravelDesk. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[var(--foreground-subtle)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0" />
            <span>AI-assisted pre-screening only. Official verification required on sovereign consular portals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
