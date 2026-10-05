"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X, Minus, Search, ArrowRight, Compass, FileCheck, HelpCircle, Bot } from "lucide-react";

export function AIConciergeLauncher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Hidden on the sign-in page
  if (pathname === "/login") {
    return null;
  }

  const conciergeSuggestions = [
    { title: "Schengen 90/180 Rule Check", category: "Visa Rules", href: "/visas" },
    { title: "Munich Consulate Proximity & Transport", category: "Destination", href: "/travel-info" },
    { title: "Passport Validity (3-Month vs 6-Month)", category: "Compliance", href: "/passport" },
    { title: "Employer Invitation Letter Checklist", category: "Documentation", href: "/faq" },
    { title: "Six-Month Club Indian Passport Rules", category: "US Travel", href: "/passport" },
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
      {/* Floating Launcher Pill Bottom-Right */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--brand-teal)]/40 bg-[#071426]/90 backdrop-blur-xl shadow-2xl hover:border-[var(--brand-teal)] hover:shadow-[0_0_25px_-5px_rgba(20,184,166,0.35)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
          aria-label="Open AI Travel & Visa Concierge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-teal)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-teal)]" />
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-white group-hover:text-[var(--brand-teal)] transition-colors">
            AI Concierge
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
        </button>
      )}

      {/* Docked Non-Modal Chat Panel Bottom-Right (380px wide, max 560px high, frosted glass, NO dimmed backdrop) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          className={`fixed bottom-6 right-6 z-40 w-[380px] rounded-2xl glass-floating border border-white/15 shadow-2xl transition-all duration-200 flex flex-col ${
            isMinimized ? "h-14" : "h-[540px] max-h-[560px]"
          }`}
          aria-label="AI Travel Concierge Assistant"
        >
          {/* Header with Minimize & Close */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--brand-teal)]/15 border border-[var(--brand-teal)]/30 flex items-center justify-center text-[var(--brand-teal)]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-white tracking-wide">TravelDesk Concierge</h3>
                {!isMinimized && (
                  <p className="text-[10px] text-[var(--foreground-subtle)]">AI assistance • Official sources verified</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
                aria-label={isMinimized ? "Expand concierge" : "Minimize concierge"}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[var(--foreground-muted)] hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
                aria-label="Close concierge"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content (only visible when not minimized) */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* Search / Ask Field */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, passport checks, destinations..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg glass-input text-white placeholder:text-[var(--foreground-subtle)]"
                  autoFocus
                />
              </div>

              {/* Suggestions / Results List */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                <p className="text-[10px] font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
                  {searchQuery ? "Matching Topics" : "Recommended Guidance"}
                </p>

                {filtered.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs text-[var(--foreground)] group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-white group-hover:text-[var(--brand-teal)] transition-colors leading-tight">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wide">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[var(--foreground-subtle)] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}

                {filtered.length === 0 && (
                  <div className="p-4 text-center text-xs text-[var(--foreground-subtle)]">
                    No matching guidance found. Try searching for &quot;Schengen&quot;, &quot;Passport&quot;, or &quot;Munich&quot;.
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-3 mt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                <Link
                  href="/visas"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-[#071426] hover:bg-[var(--brand-teal-hover)] transition-all shadow-sm text-center"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Visa Navigator</span>
                </Link>
                <Link
                  href="/interview"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-all text-center"
                >
                  <FileCheck className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
                  <span>Pre-Screening</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
