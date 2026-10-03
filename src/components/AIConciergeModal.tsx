"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Plane, 
  Building2,
  ExternalLink 
} from "lucide-react";

interface FAQItem {
  question: string;
  category: "Schengen" | "US B-1" | "Passports" | "Corporate Policy";
  answer: string;
  officialRef: string;
}

const VERIFIED_KNOWLEDGE_BASE: FAQItem[] = [
  {
    category: "Schengen",
    question: "Can I perform productive software work on a Germany Schengen C Business Visa?",
    answer: "No. German Residence Act §18 and the EU Visa Code strictly forbid local productive labor, system implementation, or employee integration on a Schengen C visa. It is strictly limited to commercial meetings, negotiations, seminars, and business consultations.",
    officialRef: "German Federal Foreign Office (Auswärtiges Amt)",
  },
  {
    category: "Schengen",
    question: "How does the 90/180-day Schengen rolling stay limit work?",
    answer: "You may stay in the Schengen territory for a maximum of 90 days within any rolling 180-day period. Every single day of stay looks backwards at the preceding 180 days to count cumulative presence across all 29 Schengen member states.",
    officialRef: "Regulation (EU) 2016/399 Schengen Borders Code",
  },
  {
    category: "US B-1",
    question: "Is productive engineering work permitted on a US B-1 Visitor Visa?",
    answer: "Strictly prohibited. Under US INA §101(a)(15)(B) and 9 FAM 402.2, a B-1 visitor cannot engage in productive employment, hands-on software development, or receive US-source remuneration. Permitted activities are commercial negotiations, litigation consultation, and scientific conventions.",
    officialRef: "US Department of State 9 FAM 402.2",
  },
  {
    category: "Passports",
    question: "What is the passport validity rule for Indian passport holders traveling to the US vs Germany?",
    answer: "Germany/Schengen requires your passport to remain valid for at least 3 months beyond your planned departure date from Schengen, with issue date within the last 10 years. For the US, India is a member of the Six-Month Club: Indian passports are exempt from the 6-month post-stay rule and are valid for entry up to their actual expiration date.",
    officialRef: "US CBP Six-Month Club Agreement & EU Visa Code Article 12",
  },
  {
    category: "Corporate Policy",
    question: "What are Harbinger's nightly hotel allowance limits?",
    answer: "Corporate expense policy caps reimbursement at €180/night in Munich (inclusive of city tax), €175/night in Frankfurt, $250/night in New York City, and ₹6,000/night in Pune. Room mini-bar, pay-per-view movies, and personal services are strictly non-reimbursable.",
    officialRef: "Harbinger Group Corporate Travel Policy §18",
  },
  {
    category: "Corporate Policy",
    question: "When is Premium Economy flight authorized?",
    answer: "Economy is mandatory for continuous flight durations under 8 hours. Premium Economy is permissible on non-stop intercontinental long-haul corridors exceeding 8 hours (e.g. BOM-MUC or BOM-FRA). Business Class requires VP of Mobility authorization.",
    officialRef: "Harbinger Group Corporate Travel Policy §14",
  },
];

export function AIConciergeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!isOpen) return null;

  const filteredItems = VERIFIED_KNOWLEDGE_BASE.filter((item) => {
    const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-concierge-title"
    >
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 flex flex-col space-y-5 animate-in fade-in zoom-in-95 duration-200 border border-[var(--brand-teal)]/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-teal)]">
                Corporate Mobility Assistant
              </span>
              <h2 id="ai-concierge-title" className="font-serif text-xl sm:text-2xl font-medium text-[var(--foreground)]">
                TravelDesk AI Concierge
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)]"
            aria-label="Close AI Concierge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--foreground-muted)]" />
          <input
            type="text"
            id="ai-concierge-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visa rules, passport validity, hotel expense caps, transit..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--brand-teal)]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {["ALL", "Schengen", "US B-1", "Passports", "Corporate Policy"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[var(--brand-teal)] text-white"
                  : "bg-[var(--background-muted)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat === "ALL" ? "All Topics" : cat}
            </button>
          ))}
        </div>

        {/* Scrollable Results list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--foreground-muted)] space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto opacity-40 text-[var(--brand-teal)]" />
              <p>No verified guidance matches your search term.</p>
              <p className="text-[11px]">
                Please consult Corporate Travel Operations or start a formal pre-screening interview.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--background-muted)]/50 border border-[var(--border)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[var(--foreground)]">{item.question}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-[var(--foreground-muted)] leading-relaxed">{item.answer}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--foreground-muted)] pt-1 border-t border-[var(--border)]/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Authority: <strong>{item.officialRef}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Quick Action to Pre-Screening Interview */}
        <div className="p-4 rounded-xl bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-[var(--foreground)] block">Ready to file for a business visa?</span>
            <span className="text-[var(--foreground-muted)]">
              Complete the structured statutory questionnaire to calculate your readiness score.
            </span>
          </div>

          <Link
            href="/dashboard"
            onClick={onClose}
            id="ai-concierge-interview-link"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-semibold hover:bg-[var(--brand-teal-light)] transition-colors shrink-0 shadow-sm"
          >
            <span>Launch Pre-Screening</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
