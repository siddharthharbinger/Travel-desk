"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Download, 
  User as UserIcon, 
  ArrowRight, 
  RefreshCw,
  Send,
  Eye,
  Building2,
  Calendar
} from "lucide-react";

interface Decision {
  id: string;
  decision: string;
  notes: string;
  createdAt: string;
  csr: { name: string; email: string };
}

interface ApplicationCase {
  id: string;
  caseNumber: string;
  visaType: string;
  destinationCountry: string;
  travelPurpose: string;
  departureDate: string | null;
  returnDate: string | null;
  status: string;
  readinessScore: number;
  readinessDetails: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string };
  assignedCsr: { id: string; name: string; email: string } | null;
  documents: { id: string; documentType: string; fileName: string; isVerified: boolean; fileSize: number }[];
  flags: { id: string; code: string; severity: string; message: string; isResolved: boolean }[];
  decisions: Decision[];
  interviewSessions: {
    answers: { id: string; question: { questionText: string }; answerValue: string; hasFlag: boolean; flagDetails: string | null }[];
  }[];
}

function ReviewCockpitContent() {
  const searchParams = useSearchParams();
  const caseIdQuery = searchParams.get("caseId");

  const [cases, setCases] = useState<ApplicationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<ApplicationCase | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "VERIFIED" | "FLAGS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCases = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (res.ok) {
        const apps = data.applications || [];
        setCases(apps);

        if (caseIdQuery) {
          const matched = apps.find((c: ApplicationCase) => c.id === caseIdQuery);
          if (matched) setSelectedCase(matched);
        } else if (apps.length > 0 && !selectedCase) {
          setSelectedCase(apps[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [caseIdQuery]);

  // Handle case selection
  const handleSelectCase = async (caseId: string) => {
    try {
      const res = await fetch(`/api/applications/${caseId}`);
      const data = await res.json();
      if (res.ok && data.application) {
        setSelectedCase(data.application);
      }
    } catch {
      console.error("Failed to load case details");
    }
  };

  const handleDecision = async (decisionType: "VERIFIED" | "MORE_INFO_REQUESTED" | "ESCALATED") => {
    if (!selectedCase || !decisionNotes.trim()) {
      setStatusMessage({ type: "error", text: "Please enter internal CSR notes before submitting decision." });
      return;
    }

    setSubmittingDecision(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/applications/${selectedCase.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionType,
          notes: decisionNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage({ type: "error", text: data.error || "Decision recording failed" });
        return;
      }

      setStatusMessage({ type: "success", text: `Case successfully marked as ${decisionType}.` });
      setDecisionNotes("");

      // Refresh cases
      await fetchCases();
      await handleSelectCase(selectedCase.id);
    } catch {
      setStatusMessage({ type: "error", text: "Network error submitting decision." });
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Metrics computed from real DB
  const totalCases = cases.length;
  const pendingCases = cases.filter((c) => c.status === "SUBMITTED" || c.status === "IN_REVIEW").length;
  const verifiedCases = cases.filter((c) => c.status === "VERIFIED").length;
  const flaggedCases = cases.filter((c) => c.flags.some((f) => !f.isResolved)).length;

  const filteredCases = cases.filter((c) => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destinationCountry.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "PENDING") return c.status === "SUBMITTED" || c.status === "IN_REVIEW";
    if (activeTab === "VERIFIED") return c.status === "VERIFIED";
    if (activeTab === "FLAGS") return c.flags.some((f) => !f.isResolved);
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Corporate Service Representative Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[var(--foreground)] tracking-tight">
            CSR Review Portal & Consular Dispatch
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-xl">
            Audit pre-screened visa dossiers, inspect uploaded documentation, resolve regulatory flags, and approve filings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCases}
          className="p-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:text-[var(--brand-teal)] text-xs inline-flex items-center gap-1.5 transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards (Computed from Real DB Records Only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 border border-[var(--glass-border)] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block">
            Total Active Cases
          </span>
          <span className="text-2xl font-serif font-bold text-[var(--foreground)] font-mono">
            {totalCases}
          </span>
          <p className="text-[11px] text-[var(--foreground-subtle)]">Recorded in database</p>
        </div>

        <div className="glass-panel p-5 border border-[var(--glass-border)] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block">
            Pending CSR Review
          </span>
          <span className="text-2xl font-serif font-bold text-blue-400 font-mono">
            {pendingCases}
          </span>
          <p className="text-[11px] text-[var(--foreground-subtle)]">Submitted by employees</p>
        </div>

        <div className="glass-panel p-5 border border-[var(--glass-border)] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block">
            Regulatory Flags Raised
          </span>
          <span className="text-2xl font-serif font-bold text-[var(--brand-ruby)] font-mono">
            {flaggedCases}
          </span>
          <p className="text-[11px] text-[var(--foreground-subtle)]">Compliance checks flagged</p>
        </div>

        <div className="glass-panel p-5 border border-[var(--glass-border)] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block">
            Verified Cases
          </span>
          <span className="text-2xl font-serif font-bold text-emerald-400 font-mono">
            {verifiedCases}
          </span>
          <p className="text-[11px] text-[var(--foreground-subtle)]">Ready for consular filing</p>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-3.5 rounded-lg border text-xs flex items-center gap-2 ${
          statusMessage.type === "success"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)]"
        }`}>
          {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Review Cockpit Grid: Case Table (Left) & Case Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Filterable Case Queue */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4 border border-[var(--glass-border)]">
          {/* Search & Filter Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case #, applicant, country..."
                className="w-full pl-9 pr-3 py-2 text-xs glass-input"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {(["ALL", "PENDING", "FLAGS", "VERIFIED"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[var(--brand-teal)] text-white shadow-sm"
                      : "text-[var(--foreground-muted)] hover:bg-[var(--glass-fill)]"
                  }`}
                >
                  {tab === "ALL" && `All (${totalCases})`}
                  {tab === "PENDING" && `Pending (${pendingCases})`}
                  {tab === "FLAGS" && `Flags (${flaggedCases})`}
                  {tab === "VERIFIED" && `Verified (${verifiedCases})`}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-[var(--foreground-muted)]">Loading case queue...</div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--foreground-muted)] space-y-1">
                <FileText className="w-5 h-5 mx-auto text-[var(--foreground-subtle)]" />
                <p>No cases match current filter.</p>
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const activeFlags = c.flags.filter((f) => !f.isResolved);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCase(c.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/10 ring-1 ring-[var(--brand-teal)]"
                        : "border-[var(--glass-border)] bg-[var(--canvas-bg-alt)]/40 hover:bg-[var(--glass-fill)]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[var(--brand-teal)]">{c.caseNumber}</span>
                      <span className="text-[10px] uppercase font-semibold text-[var(--foreground-subtle)]">
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-[var(--foreground)] truncate">
                      {c.user.name} · {c.destinationCountry}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--foreground-subtle)]">
                      <span>{c.visaType.replace(/_/g, " ")}</span>
                      <span className="font-mono">{c.readinessScore}% Readiness</span>
                    </div>

                    {activeFlags.length > 0 && (
                      <div className="text-[10px] text-[var(--brand-ruby)] flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{activeFlags.length} Flag(s) Pending Resolution</span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Dossier Detail View */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="glass-panel p-6 sm:p-7 space-y-6 border border-[var(--glass-border)]">
              {/* Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--glass-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[var(--brand-teal)] bg-[var(--brand-teal)]/10 px-2.5 py-1 rounded border border-[var(--brand-teal)]/20">
                      {selectedCase.caseNumber}
                    </span>
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {selectedCase.visaType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    Applicant: <strong>{selectedCase.user.name}</strong> ({selectedCase.user.email})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-[var(--foreground-subtle)] block">
                    Statutory Readiness
                  </span>
                  <span className="font-mono font-bold text-base text-[var(--brand-teal)]">
                    {selectedCase.readinessScore}%
                  </span>
                </div>
              </div>

              {/* Regulatory Flags Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[var(--brand-ruby)]" />
                  <span>Compliance & Regulatory Flags</span>
                </h3>
                {selectedCase.flags.length === 0 ? (
                  <div className="p-3 rounded-lg bg-[var(--canvas-bg-alt)]/50 border border-[var(--glass-border)] text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No regulatory red flags identified in pre-screening interview.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCase.flags.map((f) => (
                      <div 
                        key={f.id}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          f.severity === "CRITICAL"
                            ? "border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)]"
                            : "border-[var(--brand-amber)]/40 bg-[var(--brand-amber)]/10 text-[var(--brand-amber)]"
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>[{f.code}] {f.severity}</span>
                          <span>{f.isResolved ? "Resolved" : "Active Flag"}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{f.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Uploaded Documents Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>Uploaded Consular Documents ({selectedCase.documents.length})</span>
                </h3>
                {selectedCase.documents.length === 0 ? (
                  <div className="p-3 rounded-lg bg-[var(--canvas-bg-alt)]/50 border border-[var(--glass-border)] text-xs text-[var(--foreground-muted)]">
                    No documents uploaded yet by applicant.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCase.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--canvas-bg-alt)]/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-[var(--foreground)] block text-xs">
                            {doc.documentType.replace(/_/g, " ")}
                          </span>
                          <span className="text-[11px] text-[var(--foreground-subtle)] truncate max-w-xs block">
                            {doc.fileName} ({(doc.fileSize / 1024).toFixed(0)} KB)
                          </span>
                        </div>

                        <a
                          href={`/api/documents/${doc.id}/download`}
                          className="px-3 py-1.5 rounded-lg border border-[var(--brand-teal)]/30 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/10 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interview Transcript */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>Interview Q&A Transcript</span>
                </h3>
                {selectedCase.interviewSessions?.[0]?.answers?.length === 0 ? (
                  <div className="p-3 rounded-lg bg-[var(--canvas-bg-alt)]/50 border border-[var(--glass-border)] text-xs text-[var(--foreground-muted)]">
                    Interview has not yet been started by applicant.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedCase.interviewSessions?.[0]?.answers?.map((ans) => (
                      <div key={ans.id} className="p-2.5 rounded-lg bg-[var(--canvas-bg-alt)]/40 border border-[var(--glass-border)] text-xs space-y-1">
                        <span className="text-[11px] text-[var(--foreground-subtle)] block">
                          {ans.question?.questionText}
                        </span>
                        <p className="font-semibold text-[var(--foreground)] font-mono">
                          {ans.answerValue}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CSR Internal Notes & Decision Panel */}
              <div className="pt-4 border-t border-[var(--glass-border)] space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  CSR Adjudication & Notes
                </h3>

                <textarea
                  id="csr-decision-notes"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter required internal justification, verification notes, or specific items requested from applicant..."
                  className="w-full p-3 rounded-xl text-xs glass-input resize-none"
                />

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    id="csr-action-request-info-btn"
                    disabled={submittingDecision || !decisionNotes.trim()}
                    onClick={() => handleDecision("MORE_INFO_REQUESTED")}
                    className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--brand-amber)]/40 bg-[var(--brand-amber)]/10 text-[var(--brand-amber)] hover:bg-[var(--brand-amber)]/20 transition-all disabled:opacity-40"
                  >
                    Request More Info
                  </button>

                  <button
                    type="button"
                    id="csr-action-escalate-btn"
                    disabled={submittingDecision || !decisionNotes.trim()}
                    onClick={() => handleDecision("ESCALATED")}
                    className="px-4 py-2 rounded-lg text-xs font-semibold border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] hover:bg-[var(--brand-ruby)]/20 transition-all disabled:opacity-40"
                  >
                    Escalate to Legal
                  </button>

                  <button
                    type="button"
                    id="csr-action-verify-btn"
                    disabled={submittingDecision || !decisionNotes.trim()}
                    onClick={() => handleDecision("VERIFIED")}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all disabled:opacity-40 inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Approve Filing</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-xs text-[var(--foreground-muted)] space-y-2">
              <FileText className="w-6 h-6 mx-auto text-[var(--foreground-subtle)]" />
              <p>Select a case from the queue to view full dossier details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[var(--foreground-muted)]">
        Loading CSR Review Cockpit...
      </div>
    }>
      <ReviewCockpitContent />
    </Suspense>
  );
}
