"use client";

import React from "react";
import { ExternalLink, ShieldCheck, AlertCircle, X } from "lucide-react";

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  partnerUrl: string;
  category: "flight" | "hotel";
  searchSummary: {
    origin?: string;
    destination: string;
    dates: string;
    classOrGuests: string;
  };
}

export function RedirectModal({
  isOpen,
  onClose,
  partnerName,
  partnerUrl,
  category,
  searchSummary,
}: RedirectModalProps) {
  if (!isOpen) return null;

  const handleContinue = () => {
    window.open(partnerUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="redirect-modal-title"
    >
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-2xl border border-[var(--border)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-teal)]">
                Corporate Redirection Dispatch
              </span>
              <h2 id="redirect-modal-title" className="font-serif text-xl font-medium text-[var(--foreground)]">
                Redirecting to {partnerName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill)] transition-colors"
            aria-label="Close redirect modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Parameter Summary Card */}
        <div className="p-4 rounded-xl bg-[var(--glass-fill-nested)] border border-[var(--glass-border)] space-y-2 text-xs">
          <div className="flex justify-between items-center text-[var(--foreground-muted)]">
            <span>Routing</span>
            <span className="font-semibold text-[var(--foreground)]">
              {searchSummary.origin ? `${searchSummary.origin} → ` : ""}{searchSummary.destination}
            </span>
          </div>
          <div className="flex justify-between items-center text-[var(--foreground-muted)]">
            <span>Schedule</span>
            <span className="font-semibold text-[var(--foreground)]">{searchSummary.dates}</span>
          </div>
          <div className="flex justify-between items-center text-[var(--foreground-muted)]">
            <span>{category === "flight" ? "Permitted Class" : "Accommodations"}</span>
            <span className="font-semibold text-[var(--foreground)]">{searchSummary.classOrGuests}</span>
          </div>
        </div>

        {/* Corporate Transparency & Statutory Policy Notice */}
        <div className="p-3.5 rounded-xl bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 space-y-1.5 text-xs text-[var(--foreground-muted)]">
          <div className="flex items-center gap-2 font-medium text-[var(--brand-teal)]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Zero Markup & Direct Corporate Compliance</span>
          </div>
          <p className="leading-relaxed">
            TravelDesk does not add commissions, markups, or artificial booking fees. You will be redirected directly to {partnerName}&apos;s verified portal. Final inventory availability, flight schedules, baggage policies, and fare terms are governed directly by the provider.
          </p>
        </div>

        {/* Corporate Expense Reminder */}
        <div className="flex items-start gap-2.5 text-xs text-[var(--foreground-muted)]">
          <AlertCircle className="w-4 h-4 text-[var(--brand-amber)] shrink-0 mt-0.5" />
          <span>
            Remember to request a corporate tax invoice in the name of <strong>Harbinger Group Holdings Ltd</strong> for expense reporting and corporate reimbursement.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--glass-border)] text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill)] transition-colors text-center"
          >
            Cancel & Return
          </button>
          <button
            type="button"
            id="confirm-partner-redirect-btn"
            onClick={handleContinue}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[var(--brand-teal)] text-[#071426] text-sm font-semibold hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to {partnerName}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
