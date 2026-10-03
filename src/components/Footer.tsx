import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--glass-border)] bg-[var(--canvas-bg-alt)]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[var(--foreground-muted)] max-w-md leading-relaxed">
              Executive corporate travel logistics and regulatory cross-border compliance 
              engineered with AI-assisted pre-screening and human review.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--brand-teal)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>Statutory decisions made solely by trained corporate service representatives.</span>
            </div>
          </div>

          {/* Quick Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Consular Services
            </h3>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/visas" className="hover:text-[var(--brand-teal)] transition-colors">
                  Visa Navigator Wizard
                </Link>
              </li>
              <li>
                <Link href="/visas/info" className="hover:text-[var(--brand-teal)] transition-colors">
                  Visa Policy Directory
                </Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-[var(--brand-teal)] transition-colors">
                  Passport Services & Validity
                </Link>
              </li>
              <li>
                <Link href="/travel-info" className="hover:text-[var(--brand-teal)] transition-colors">
                  Destination Dossiers (Munich, NYC)
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--brand-teal)] transition-colors">
                  Help & Consular FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner Search Hub */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              Search and Book on
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

        {/* Regulatory Disclosure & Copyright Bar */}
        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--foreground-subtle)]">
          <p>© {currentYear} Harbinger Group Holdings Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[var(--foreground-subtle)]">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
            <span>AI-assisted pre-screening only. Official verification required on consular portals.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
