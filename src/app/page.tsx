"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Plane, 
  FileCheck2,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [promptText, setPromptText] = useState("");

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promptText.trim();
    if (!query) {
      window.location.href = "/visas";
      return;
    }
    window.location.href = `/visas?prompt=${encodeURIComponent(query)}`;
  };

  const suggestionChips = [
    { label: "Schengen Business Visa (Germany)", query: "Attending business client meetings in Munich Germany" },
    { label: "US B-1 Conference Visa", query: "Attending annual developer tech conference in New York" },
    { label: "Mumbai to Frankfurt Corridor", query: "Corporate travel from Mumbai to Frankfurt for executive meetings" },
    { label: "Munich Business Accommodations", query: "Hotel near German consulate in Munich" },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 max-w-5xl mx-auto text-center pt-8 sm:pt-16">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--brand-teal)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Assisted Pre-Screening · Human Review</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[var(--foreground)] leading-[1.15] max-w-3xl mx-auto mb-6">
          Cross-Border Corporate Travel & Visa Logistics, Simplified.
        </h1>

        <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
          Streamline statutory visa pre-screening, consular readiness checks, and business itinerary search with intelligent workflows verified by trained corporate specialists.
        </p>

        {/* Central Stitch-Style Prompt Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <form 
            onSubmit={handlePromptSubmit}
            className="glass-panel p-2 pl-4 flex items-center gap-2 shadow-2xl border border-[var(--glass-border)] focus-within:border-[var(--brand-teal)] transition-all"
          >
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Where are you travelling, and why? (e.g., Attending Tech Summit in Munich...)"
              className="flex-1 bg-transparent border-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
              aria-label="Submit travel query to Visa Navigator"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <span className="text-[11px] text-[var(--foreground-subtle)] font-medium">Quick suggestions:</span>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptText(chip.query);
                  router.push(`/visas?prompt=${encodeURIComponent(chip.query)}`);
                }}
                className="px-2.5 py-1 rounded-full text-xs border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground-muted)] hover:text-[var(--brand-teal)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Business Corridors */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--foreground)] mb-1">
              Key Corporate Corridors
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              Factual entry requirements and consular dossiers for high-frequency business hubs.
            </p>
          </div>
          <Link
            href="/travel-info"
            className="text-xs font-semibold text-[var(--brand-teal)] hover:underline inline-flex items-center gap-1"
          >
            <span>Explore all destination dossiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Munich Card */}
          <div className="glass-card overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/images/dest_munich.png"
                alt="Munich Marienplatz"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                  Schengen · Germany
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-[var(--foreground)]">
                Munich Executive Corridor
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Short-stay Schengen Business (C) processing. Covers client consultations, industrial fairs, and corporate meetings up to 90 days.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[var(--glass-border)]">
                <span className="text-xs text-[var(--foreground-subtle)]">Rule: 3-mo passport validity beyond stay</span>
                <Link
                  href="/visas?prompt=Munich%20Germany%20client%20meetings"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Start Pre-Screening</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* New York Card */}
          <div className="glass-card overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/images/dest_newyork.png"
                alt="Lower Manhattan Skyline"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                  United States · B-1 / H-1B
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-serif text-xl font-semibold text-[var(--foreground)]">
                New York Financial Corridor
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                U.S. B-1 business visitor consultations and specialty occupation immigration pre-checks with statutory document guidance.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[var(--glass-border)]">
                <span className="text-xs text-[var(--foreground-subtle)]">Rule: India Six-Month Club exempt</span>
                <Link
                  href="/visas?prompt=New%20York%20City%20corporate%20tech%20conference"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Start Pre-Screening</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--foreground)] mb-2">
            Engineered for Compliance & Trust
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            A deterministic, audit-logged workflow designed for corporate travellers and enterprise reviewers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">1. Visa Navigator</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Answer rule-driven questions to determine statutory requirements, consular timelines, and verified official government links.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">2. Document Validation</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Upload required checklists with server-side magic byte inspection, 10 MB limits, and isolated secure volume storage.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">3. Trained CSR Review</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Every filing is audited by trained human specialists before submission to official consular portals. AI assists; humans decide.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Search & Hub Strip */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-panel p-8 text-center space-y-6 border border-[var(--glass-border)]">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl font-medium text-[var(--foreground)]">
              Search and Book on Trusted Partner Portals
            </h2>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              TravelDesk provides search redirection with prefilled business routes. All ticket purchases and bookings are completed directly on partner platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm"
            >
              <Plane className="w-4 h-4" />
              <span>Search Flights (BOM / PNQ)</span>
            </Link>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground)] transition-colors"
            >
              <Building2 className="w-4 h-4 text-[var(--brand-amber)]" />
              <span>Search Accommodations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
