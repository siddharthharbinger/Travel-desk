"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, X, Search, ArrowRight, FileCheck, Compass, HelpCircle } from "lucide-react";

export function AIConciergeLauncher() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const conciergeSuggestions = [
    { title: "Schengen 90/180 Rule Check", category: "Visa Rules", href: "/visas" },
    { title: "Munich Consulate Proximity & Transport", category: "Destination", href: "/travel-info" },
    { title: "Passport Validity (3-Month vs 6-Month)", category: "Compliance", href: "/passport" },
    { title: "Employer Invitation Letter Checklist", category: "Documentation", href: "/faq" },
  ];

  const filtered = searchQuery
    ? conciergeSuggestions.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conciergeSuggestions;

  return (
    <>
      {/* Floating Pill Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--brand-teal)]/40 bg-[var(--canvas-bg)]/90 backdrop-blur-xl shadow-2xl hover:border-[var(--brand-teal)] hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.3)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
        aria-label="Open AI Travel & Visa Concierge"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-teal)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-teal)]" />
        </span>
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)] group-hover:text-[var(--brand-teal)] transition-colors">
          AI Concierge
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
      </button>

      {/* Concierge Modal Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-panel w-full max-w-lg p-6 shadow-2xl relative border border-[var(--glass-border)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">TravelDesk Concierge</h2>
                  <p className="text-xs text-[var(--foreground-muted)]">Verified consular & business travel search</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill-hover)]"
                aria-label="Close concierge"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-4 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about visas, passport rules, or Munich travel..."
                className="w-full pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-[var(--foreground-subtle)]"
                autoFocus
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <p className="text-[11px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider mb-2">
                {searchQuery ? "Search Results" : "Common Guidance Queries"}
              </p>
              {filtered.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-xs text-[var(--foreground)] group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                    <div>
                      <span className="font-medium group-hover:text-[var(--brand-teal)] transition-colors">
                        {item.title}
                      </span>
                      <span className="ml-2 text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-muted)] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="mt-6 pt-4 border-t border-[var(--glass-border)] grid grid-cols-2 gap-3">
              <Link
                href="/visas"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5" />
                Start Visa Wizard
              </Link>
              <Link
                href="/interview"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--foreground)] hover:bg-[var(--glass-fill-hover)] transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
                Pre-Interview
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
