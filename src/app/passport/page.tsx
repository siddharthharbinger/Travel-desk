import Link from "next/link";
import { 
  FileCheck2, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Compass,
  ArrowRight
} from "lucide-react";

export default function PassportPage() {
  const lastVerified = "October 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Statutory Travel Documentation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--foreground)] tracking-tight">
          Passport Services & Consular Validity Standards
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
          Passport validity requirements differ by sovereign jurisdiction. Verify your passport expiration date against the destination country&apos;s specific legal mandate before scheduling consular appointments.
        </p>
        <div className="text-xs text-[var(--foreground-subtle)]">
          Policy Last Verified: {lastVerified}
        </div>
      </div>

      {/* Two Jurisdiction Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Schengen Area (Germany) */}
        <div className="glass-panel p-6 space-y-5 border border-[var(--glass-border)]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-teal)]">
              Germany & Schengen Area
            </span>
            <span className="text-[11px] font-mono text-[var(--foreground-subtle)]">
              Article 12 Visa Code
            </span>
          </div>

          <h2 className="text-xl font-serif font-semibold text-[var(--foreground)]">
            3-Month Post-Departure Rule
          </h2>

          <div className="p-3.5 rounded-lg bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20 text-xs text-[var(--foreground)] space-y-1">
            <span className="font-semibold block text-[var(--brand-teal)]">Legal Mandate:</span>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Your travel document must be valid for at least <strong>3 months after</strong> the intended date of departure from the Schengen area.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[var(--foreground-muted)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
              <span><strong>10-Year Issuance Limit:</strong> Must have been issued within the previous 10 years. An extended passport is not accepted.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
              <span><strong>Blank Foils:</strong> Must contain at least two completely blank visa pages for entry/exit stamps.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--brand-amber)] shrink-0 mt-0.5" />
              <span><strong>Strict Rejection:</strong> Consulates will reject applications outright at intake if validity is under 90 days from exit date.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-[var(--glass-border)]">
            <a
              href="https://india.diplo.de/in-en/service/business-visa/1987516"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--brand-teal)] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>German Consular Passport Directives</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: United States */}
        <div className="glass-panel p-6 space-y-5 border border-[var(--glass-border)]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-indigo)]">
              United States of America
            </span>
            <span className="text-[11px] font-mono text-[var(--foreground-subtle)]">
              Six-Month Club
            </span>
          </div>

          <h2 className="text-xl font-serif font-semibold text-[var(--foreground)]">
            Six-Month Club Agreement (India)
          </h2>

          <div className="p-3.5 rounded-lg bg-[var(--brand-indigo)]/10 border border-[var(--brand-indigo)]/20 text-xs text-[var(--foreground)] space-y-1">
            <span className="font-semibold block text-[var(--brand-indigo)]">Statutory Exemption:</span>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              While the U.S. normally requires 6 months validity past intended stay, <strong>India is a signatory to the Six-Month Club Agreement</strong>.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[var(--foreground-muted)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
              <span><strong>Duration of Stay:</strong> Indian passports must be valid only for the duration of intended stay in the U.S.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-teal)] shrink-0 mt-0.5" />
              <span><strong>Form I-94 Expiry:</strong> Customs & Border Protection (CBP) will limit your authorized stay to passport expiry.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--brand-amber)] shrink-0 mt-0.5" />
              <span><strong>Corporate Recommendation:</strong> Harbinger Travel strongly advises renewing if less than 6 months remains to avoid airline transit delays.</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-[var(--glass-border)]">
            <a
              href="https://www.cbp.gov/document/bulletins/six-month-club-update"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--brand-teal)] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>U.S. CBP Six-Month Club Official Notice</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Passport Renewal Protocol (India) */}
      <section className="glass-panel p-6 sm:p-7 space-y-4 border border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[var(--brand-teal)]" />
          <h3 className="text-lg font-serif font-semibold text-[var(--foreground)]">
            Passport Renewal Protocol for Harbinger Employees (Passport Seva India)
          </h3>
        </div>

        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          If your passport validity does not satisfy the above statutory rules, initiate renewal via the official Passport Seva portal before requesting company invitation letters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-[var(--canvas-bg-alt)]/60 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)]">
              <span>Standard (Normal) Scheme</span>
              <span className="text-[var(--brand-teal)] font-mono">₹1,500 INR</span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Standard processing timeframe: 30 to 45 calendar days. Requires police verification at residence.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--canvas-bg-alt)]/60 border border-[var(--glass-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)]">
              <span>Tatkaal (Expedited) Scheme</span>
              <span className="text-[var(--brand-teal)] font-mono">₹3,500 INR</span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Expedited dispatch: 3 to 7 working days. For urgent corporate travel, Harbinger HR provides an Annexure F verification certificate.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <a
            href="https://www.passportindia.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--brand-teal)] hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Official Portal: Passport Seva (Ministry of External Affairs)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span className="text-[11px] text-[var(--foreground-subtle)]">
            Only use the official .gov.in portal. Avoid third-party intermediaries.
          </span>
        </div>
      </section>

      {/* CTA to Navigator */}
      <div className="flex items-center justify-between p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)]">
        <div>
          <h4 className="text-sm font-semibold text-[var(--foreground)]">Have your passport details ready?</h4>
          <p className="text-xs text-[var(--foreground-muted)]">Check full visa eligibility on the Visa Navigator.</p>
        </div>
        <Link
          href="/visas"
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-[#071426] hover:bg-[var(--brand-teal-hover)] transition-all inline-flex items-center gap-1.5 shadow-md"
        >
          <span>Evaluate Route</span>
          <Compass className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
