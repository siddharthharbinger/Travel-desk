"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileCheck2, 
  Plus, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Building2, 
  Calendar, 
  FileText,
  Upload,
  RefreshCw,
  Bell
} from "lucide-react";

interface Application {
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
  documents: { id: string; documentType: string; fileName: string; isVerified: boolean }[];
  flags: { id: string; code: string; severity: string; message: string; isResolved: boolean }[];
  decisions: { id: string; decision: string; notes: string; createdAt: string }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Application Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visaType, setVisaType] = useState("SCHENGEN_BUSINESS");
  const [destinationCountry, setDestinationCountry] = useState("Germany");
  const [travelPurpose, setTravelPurpose] = useState("Client Consultations & Commercial Meetings");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (res.ok) {
        setApplications(data.applications || []);
      } else {
        setError(data.error || "Failed to load applications");
      }
    } catch {
      setError("Network error loading applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visaType,
          destinationCountry,
          travelPurpose,
          departureDate: departureDate || undefined,
          returnDate: returnDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create application");
        return;
      }

      setIsModalOpen(false);
      // Navigate straight to interview cockpit
      router.push(`/interview?caseId=${data.application.id}`);
    } catch {
      setError("An unexpected error occurred while creating case.");
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return { label: "Verified by CSR", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 };
      case "SUBMITTED":
        return { label: "Submitted for Review", class: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Clock };
      case "IN_REVIEW":
        return { label: "CSR Under Review", class: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: RefreshCw };
      case "MORE_INFO_REQUESTED":
        return { label: "More Info Requested", class: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle };
      case "ESCALATED":
        return { label: "Escalated to Legal", class: "bg-[var(--brand-ruby)]/15 text-[var(--brand-ruby)] border-[var(--brand-ruby)]/30", icon: AlertCircle };
      case "INTERVIEW_IN_PROGRESS":
        return { label: "Interview in Progress", class: "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border-[var(--brand-teal)]/30", icon: Compass };
      default:
        return { label: "Draft Application", class: "bg-slate-500/15 text-slate-400 border-slate-500/30", icon: FileText };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Travel Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[var(--foreground)] tracking-tight">
            Customer Application Dashboard
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] max-w-xl">
            Track case status, view statutory readiness scores, and complete AI pre-screening interviews.
          </p>
        </div>

        <button
          type="button"
          id="new-application-btn"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Visa Pre-Screening</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Case List */}
      {loading ? (
        <div className="glass-panel p-12 text-center text-xs text-[var(--foreground-muted)]">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--brand-teal)]" />
          <span>Loading corporate applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4 border border-[var(--glass-border)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] flex items-center justify-center mx-auto">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[var(--foreground)]">No Active Visa Applications</h3>
            <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto">
              You do not have any travel cases currently registered. Start a new pre-screening to evaluate your itinerary and check compliance.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-all shadow-sm"
            >
              Start First Pre-Screening
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const badge = getStatusBadge(app.status);
            const StatusIcon = badge.icon;
            const activeFlags = app.flags.filter((f) => !f.isResolved);
            const latestDecision = app.decisions[0];

            return (
              <div 
                key={app.id}
                className="glass-panel p-6 border border-[var(--glass-border)] space-y-5 hover:border-[var(--brand-teal)]/40 transition-all"
              >
                {/* Top Row: Case Number & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[var(--brand-teal)] px-2.5 py-1 rounded bg-[var(--brand-teal)]/10 border border-[var(--brand-teal)]/20">
                      {app.caseNumber}
                    </span>
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {app.visaType.replace(/_/g, " ")} · {app.destinationCountry}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.class}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block mb-1">
                      Travel Purpose
                    </span>
                    <p className="text-[var(--foreground)] font-medium line-clamp-1">{app.travelPurpose}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block mb-1">
                      Travel Dates
                    </span>
                    <p className="text-[var(--foreground)] font-medium">
                      {app.departureDate ? new Date(app.departureDate).toLocaleDateString() : "Pending"}
                      {app.returnDate ? ` → ${new Date(app.returnDate).toLocaleDateString()}` : ""}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] block mb-1">
                      Uploaded Documents
                    </span>
                    <p className="text-[var(--foreground)] font-medium">
                      {app.documents.length} document{app.documents.length === 1 ? "" : "s"} on file
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                        Readiness Score
                      </span>
                      <span className="font-mono font-bold text-[var(--brand-teal)]">{app.readinessScore}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[var(--canvas-bg-alt)] overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          app.readinessScore >= 80 
                            ? "bg-emerald-500" 
                            : app.readinessScore >= 50 
                            ? "bg-[var(--brand-teal)]" 
                            : "bg-[var(--brand-amber)]"
                        }`}
                        style={{ width: `${app.readinessScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Readiness Formula Transparent Breakdown */}
                {app.readinessDetails && (
                  <div className="p-2.5 rounded-lg bg-[var(--canvas-bg-alt)]/40 border border-[var(--glass-border)] text-[11px] text-[var(--foreground-subtle)] font-mono">
                    {app.readinessDetails}
                  </div>
                )}

                {/* Flags Warning if active */}
                {activeFlags.length > 0 && (
                  <div className="p-3 rounded-lg bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/30 text-xs text-[var(--brand-amber)] space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{activeFlags.length} Pre-Screening Flag(s) Detected:</span>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc text-[11px]">
                      {activeFlags.map((f) => (
                        <li key={f.id}>{f.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Latest CSR Feedback if present */}
                {latestDecision && (
                  <div className="p-3 rounded-lg bg-[var(--canvas-bg-alt)]/60 border border-[var(--glass-border)] text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-[var(--brand-teal)] uppercase tracking-wider">
                      CSR Operations Update ({new Date(latestDecision.createdAt).toLocaleDateString()}):
                    </span>
                    <p className="text-[var(--foreground)]">{latestDecision.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <Link
                    href={`/interview?caseId=${app.id}`}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white inline-flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{app.status === "DRAFT" || app.status === "INTERVIEW_IN_PROGRESS" ? "Continue Pre-Screening" : "View Interview Dossier"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Application Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[var(--glass-border)] shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
              <h2 className="text-lg font-serif font-semibold text-[var(--foreground)]">
                Initiate Visa Pre-Screening
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                  Destination Country
                </label>
                <select
                  value={destinationCountry}
                  onChange={(e) => {
                    const c = e.target.value;
                    setDestinationCountry(c);
                    if (c === "Germany") setVisaType("SCHENGEN_BUSINESS");
                    else if (c === "United States") setVisaType("US_B1");
                  }}
                  className="w-full px-3 py-2 text-xs glass-input"
                >
                  <option value="Germany" className="bg-[var(--canvas-bg)]">Germany (Schengen Area)</option>
                  <option value="United States" className="bg-[var(--canvas-bg)]">United States of America</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                  Visa Category
                </label>
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full px-3 py-2 text-xs glass-input"
                >
                  {destinationCountry === "Germany" ? (
                    <>
                      <option value="SCHENGEN_BUSINESS" className="bg-[var(--canvas-bg)]">Schengen Business Visa (Type C)</option>
                      <option value="GERMAN_D_VISA" className="bg-[var(--canvas-bg)]">German National Employment (Type D)</option>
                    </>
                  ) : (
                    <>
                      <option value="US_B1" className="bg-[var(--canvas-bg)]">US B-1 Temporary Business Visitor</option>
                      <option value="US_L1" className="bg-[var(--canvas-bg)]">US L-1 Intra-Company Transferee</option>
                      <option value="US_H1B" className="bg-[var(--canvas-bg)]">US H-1B Specialty Occupation</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                  Commercial Travel Purpose
                </label>
                <input
                  type="text"
                  value={travelPurpose}
                  onChange={(e) => setTravelPurpose(e.target.value)}
                  placeholder="e.g. Client commercial meetings and quarterly strategy review"
                  required
                  className="w-full px-3 py-2 text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs glass-input"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--glass-fill)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-create-application-btn"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-md disabled:opacity-50"
                >
                  {creating ? "Creating Case..." : "Launch Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
