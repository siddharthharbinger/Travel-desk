import Link from "next/link";
import { 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Clock, 
  Compass, 
  ArrowRight,
  Mail
} from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "Who pays for corporate visa application fees and travel insurance?",
      category: "EXPENSES & REIMBURSEMENT",
      answer: "Harbinger Group covers all statutory consular fees (€90 for Schengen, $185 for US B-1), VFS service charges, biometric fees, and required travel health insurance. After submission, employees submit the official consular receipt via Concur under the 'Corporate Visa & Travel Logistics' expense category."
    },
    {
      question: "What corporate documentation will Harbinger provide for my visa filing?",
      category: "REQUIRED DOCUMENTATION",
      answer: "Upon CSR verification of your pre-screening application, Corporate Travel Operations issues: (1) Official Employer Deputation/Dispatch Letter on company letterhead, (2) Salary Guarantee Certificate confirming continued Indian payroll, (3) Group Travel Medical Insurance Certificate meeting consular thresholds (€30,000 for Schengen), and (4) Coordinated foreign client invitation letters."
    },
    {
      question: "Can I perform productive coding or client-billable work on a Schengen C or US B-1 visa?",
      category: "COMPLIANCE & LEGAL RESTRICTIONS",
      isWarning: true,
      answer: "STRICTLY NO. Under sovereign immigration law (Article 12 Schengen Visa Code and US INA §101(a)(15)(B)), business visitor visas allow ONLY commercial negotiations, client consultations, conference attendance, and technical seminars. Productive labor, local contracting, or receiving US/German local compensation is illegal and carries penalties including deportation, visa cancellation, and 5-to-10-year entry bans."
    },
    {
      question: "What passport validity rules must I comply with?",
      category: "PASSPORT STANDARDS",
      answer: "For Germany / Schengen: Your passport must be issued within the last 10 years and be valid for at least 3 months AFTER your intended departure date from the Schengen territory, with at least 2 blank pages. For the United States: Indian passports are exempt from the standard 6-month rule under the Six-Month Club Agreement, but Harbinger travel policy strongly recommends at least 6 months remaining validity."
    },
    {
      question: "How does the AI Visa Pre-Screening interview work?",
      category: "PORTAL WORKFLOW",
      answer: "The AI interview asks standardized questions based on the Harbinger Question Bank. It validates travel purpose, detects regulatory flags (e.g., passport expiration, inadmissibility, or labor mismatch), calculates a readiness score, and generates a pre-screened summary dossier for final review and approval by a human CSR."
    },
    {
      question: "What should I do if consular appointment dates are not available before my planned travel?",
      category: "SCHEDULING & EXPEDITING",
      answer: "Notify the Travel Desk immediately. For urgent, business-critical client meetings, our CSR team can request consular emergency appointment expediting with German consulates or the U.S. Embassy, supported by a formal executive justification letter."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Corporate Travel Support</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--foreground)] tracking-tight">
          Frequently Asked Questions & Consular Rules
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
          Comprehensive compliance guidelines for Harbinger employees undertaking business travel to Germany and the United States.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`glass-panel p-6 space-y-3 border transition-all ${
              faq.isWarning 
                ? "border-[var(--brand-ruby)]/30 bg-[var(--brand-ruby)]/[0.02]" 
                : "border-[var(--glass-border)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                faq.isWarning ? "text-[var(--brand-ruby)]" : "text-[var(--brand-teal)]"
              }`}>
                {faq.category}
              </span>
              {faq.isWarning && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-ruby)] px-2 py-0.5 rounded bg-[var(--brand-ruby)]/10 border border-[var(--brand-ruby)]/30">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Mandatory Compliance Rule</span>
                </span>
              )}
            </div>

            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {faq.question}
            </h2>

            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Corporate Travel Desk */}
      <div className="glass-panel p-8 space-y-4 border border-[var(--glass-border)] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2 justify-center sm:justify-start">
            <Mail className="w-4 h-4 text-[var(--brand-teal)]" />
            <span>Still have questions regarding your travel?</span>
          </h3>
          <p className="text-xs text-[var(--foreground-muted)]">
            Our corporate travel operations team is available Monday through Friday (09:00 - 18:00 IST).
          </p>
          <p className="text-xs font-mono text-[var(--brand-teal)]">
            travel-desk@harbingergroup.com
          </p>
        </div>

        <Link
          href="/visas"
          className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-[#071426] hover:bg-[var(--brand-teal-hover)] transition-all shrink-0 inline-flex items-center gap-1.5 shadow-md"
        >
          <span>Launch Visa Navigator</span>
          <Compass className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
