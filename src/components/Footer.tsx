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
    <footer className="mt-auto border-t border-white/10 bg-[#071426]/80 backdrop-blur-xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-[var(--foreground-muted)] max-w-md leading-relaxed">
              Corporate travel logistics and consular visa pre-screening engineered with AI assistance and expert human review.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--brand-teal)]">
              <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>Decisions are reviewed and verified by authorized corporate service representatives.</span>
            </div>
          </div>

          {/* Consular Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Consular Services
            </h3>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/visas" className="hover:text-[var(--brand-teal)] transition-colors">
                  Visa Navigator
                </Link>
              </li>
              <li>
                <Link href="/visas/info" className="hover:text-[var(--brand-teal)] transition-colors">
                  Visa Information
                </Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-[var(--brand-teal)] transition-colors">
                  Passport Validity
                </Link>
              </li>
              <li>
                <Link href="/travel-info" className="hover:text-[var(--brand-teal)] transition-colors">
                  Destination Guides (Munich, New York)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--brand-teal)] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Search Hub */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Partner Search Hub
            </h3>
            <p className="text-xs text-[var(--foreground-subtle)] leading-relaxed">
              TravelDesk provides search redirection without markup or implied partnership:
            </p>
            <div className="space-y-1.5 text-xs">
              <a 
                href="https://www.ixigo.com/flights" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--brand-teal)] transition-colors"
              >
                <span>ixigo Corporate Flights</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <a 
                href="https://www.makemytrip.com/flights/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--brand-teal)] transition-colors"
              >
                <span>MakeMyTrip Business</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <a 
                href="https://www.booking.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--foreground-muted)] hover:text-[var(--brand-teal)] transition-colors"
              >
                <span>Booking.com Accommodations</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Advisory & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground-subtle)]">
          <p>© {currentYear} Harbinger Group. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[var(--foreground-subtle)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
            <span>AI-assisted pre-screening only. Official verification required on government portals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
