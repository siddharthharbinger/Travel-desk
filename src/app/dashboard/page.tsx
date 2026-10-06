"use client";

import { useEffect, useState, useMemo } from "react";
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
  Calendar, 
  FileText,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp
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

  // Minimal UI Controls
  const [filter, setFilter] = useState<"ALL" | "IN_PROGRESS" | "VERIFIED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New Application Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visaType, setVisaType] = useState("SCHENGEN_BUSINESS");
  const [destinationCountry, setDestinationCountry] = useState("Germany");
  const [travelPurpose, setTravelPurpose] = useState("Commercial Meetings & Consultations");
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
      router.push(`/interview?caseId=${data.application.id}`);
    } catch {
      setError("An unexpected error occurred while creating case.");
    } finally {
      setCreating(false);
    }
  };

  const formatVisaType = (type: string) => {
    switch (type) {
      case "SCHENGEN_BUSINESS":
        return "Schengen Business Visa (Type C)";
      case "GERMAN_D_VISA":
        return "German Employment Visa (Type D)";
      case "US_B1":
        return "US B-1 Business Visitor";
      case "US_L1":
        return "US L-1 Intra-Company Transferee";
      case "US_H1B":
        return "US H-1B Specialty Occupation";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return { label: "Verified", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400" };
      case "SUBMITTED":
        return { label: "Submitted", class: "bg-blue-500/15 text-blue-400 border-blue-500/30", dot: "bg-blue-400" };
      case "IN_REVIEW":
        return { label: "Under Review", class: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400" };
      case "MORE_INFO_REQUESTED":
        return { label: "Action Needed", class: "bg-amber-500/15 text-amber-400 border-amber-500/30", dot: "bg-amber-400 animate-pulse" };
      case "ESCALATED":
        return { label: "Special Review", class: "bg-[var(--brand-ruby)]/15 text-[var(--brand-ruby)] border-[var(--brand-ruby)]/30", dot: "bg-[var(--brand-ruby)]" };
      case "INTERVIEW_IN_PROGRESS":
        return { label: "In Progress", class: "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border-[var(--brand-teal)]/30", dot: "bg-[var(--brand-teal)]" };
      default:
        return { label: "Draft", class: "bg-slate-500/15 text-slate-400 border-slate-500/30", dot: "bg-slate-400" };
    }
  };

  const inProgressCount = applications.filter((a) => a.status !== "VERIFIED").length;
  const verifiedCount = applications.filter((a) => a.status === "VERIFIED").length;

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (filter === "IN_PROGRESS" && app.status === "VERIFIED") return false;
      if (filter === "VERIFIED" && app.status !== "VERIFIED") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCase = app.caseNumber.toLowerCase().includes(q);
        const matchCountry = app.destinationCountry.toLowerCase().includes(q);
        const matchVisa = app.visaType.toLowerCase().includes(q);
        const matchPurpose = app.travelPurpose.toLowerCase().includes(q);
        return matchCase || matchCountry || matchVisa || matchPurpose;
      }

      return true;
    });
  }, [applications, filter, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight">
            My Applications
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Track and manage your corporate visa pre-screenings and clearances.
          </p>
        </div>

        <button
          type="button"
          id="new-application-btn"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-[#071426] transition-all shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Application</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Minimal Tabs */}
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 self-start">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "ALL"
                ? "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("IN_PROGRESS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "IN_PROGRESS"
                ? "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("VERIFIED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === "VERIFIED"
                ? "bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 font-semibold"
                : "text-white/60 hover:text-white"
            }`}
          >
            Verified ({verifiedCount})
          </button>
        </div>

        {/* Minimal Search Input */}
        {applications.length > 3 && (
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Application List */}
      {loading ? (
        <div className="glass-panel p-12 text-center text-xs text-[var(--foreground-muted)] rounded-2xl">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--brand-teal)]" />
          <span>Loading your applications...</span>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-panel p-10 text-center space-y-3 rounded-2xl border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] flex items-center justify-center mx-auto">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              {filter === "ALL" ? "No applications found" : `No ${filter.toLowerCase().replace("_", " ")} applications`}
            </h3>
            <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto">
              {filter === "ALL" 
                ? "Start a new visa pre-screening to evaluate your itinerary and travel compliance."
                : "Switch tabs or create a new application to get started."}
            </p>
          </div>
          {filter === "ALL" && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-[#071426] hover:bg-[var(--brand-teal-hover)] transition-all shadow-sm"
              >
                Create Application
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => {
            const badge = getStatusBadge(app.status);
            const activeFlags = app.flags.filter((f) => !f.isResolved);
            const latestDecision = app.decisions[0];
            const isExpanded = expandedId === app.id;

            return (
              <div 
                key={app.id}
                className="glass-panel rounded-xl border border-white/10 hover:border-white/20 transition-all p-4 sm:p-5 flex flex-col gap-3 group"
              >
                {/* Main Horizontal Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Destination, Visa Type, Case #, Dates */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-semibold text-white">
                        {app.destinationCountry}
                      </h3>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        · {formatVisaType(app.visaType)}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--foreground-subtle)] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {app.caseNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[var(--foreground-subtle)]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/40" />
                        <span>
                          {app.departureDate ? (
                            `${new Date(app.departureDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}${app.returnDate ? ` – ${new Date(app.returnDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}`
                          ) : (
                            "Dates pending"
                          )}
                        </span>
                      </span>

                      {app.documents.length > 0 && (
                        <span className="hidden sm:inline">
                          · {app.documents.length} doc{app.documents.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Status badge, Readiness Score & Action Button */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Status Pill */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.class}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>

                    {/* Clean Readiness */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs">
                      <span className="text-[var(--foreground-subtle)]">Ready:</span>
                      <span className="font-mono font-semibold text-[var(--brand-teal)]">{app.readinessScore}%</span>
                    </div>

                    {/* Primary Action Button */}
                    <Link
                      href={`/interview?caseId=${app.id}`}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm ${
                        app.status === "VERIFIED"
                          ? "border border-white/15 bg-white/5 hover:bg-white/10 text-white"
                          : "bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-[#071426]"
                      }`}
                    >
                      <span>{app.status === "VERIFIED" ? "View Case" : "Continue"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Optional Details Toggle */}
                    {(latestDecision || activeFlags.length > 0 || app.travelPurpose) && (
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="p-1.5 text-white/40 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title={isExpanded ? "Collapse details" : "Expand details"}
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Details Drawer (Only shown when expanded) */}
                {isExpanded && (
                  <div className="pt-3 mt-1 border-t border-white/10 text-xs space-y-2.5 animate-in fade-in duration-150">
                    {app.travelPurpose && (
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[var(--foreground-subtle)] font-semibold">Purpose</span>
                        <p className="text-[var(--foreground)] mt-0.5">{app.travelPurpose}</p>
                      </div>
                    )}

                    {/* Action banner if More Info Requested */}
                    {app.status === "MORE_INFO_REQUESTED" && latestDecision && (
                      <div className="p-3 rounded-lg bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/30 text-[var(--brand-amber)] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-semibold block">Action Requested:</span>
                          <p className="text-[11px]">{latestDecision.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Reviewer note if present */}
                    {latestDecision?.notes && app.status !== "MORE_INFO_REQUESTED" && (
                      <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[var(--foreground-muted)] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase text-[var(--foreground-subtle)] font-semibold block">Reviewer Note</span>
                          <span>{latestDecision.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* Active Flags if any */}
                    {activeFlags.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-[var(--brand-ruby)]/10 border border-[var(--brand-ruby)]/25 text-[11px] space-y-1">
                        <span className="text-[var(--brand-ruby)] font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Pre-Screening Flags ({activeFlags.length}):</span>
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[var(--foreground-muted)] pl-1">
                          {activeFlags.map((f) => (
                            <li key={f.id}>{f.message}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Application Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-panel p-6 sm:p-7 max-w-md w-full space-y-4 border border-white/15 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-serif font-semibold text-white">
                New Visa Pre-Screening
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-white/50 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
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
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
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
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
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
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
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

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[var(--foreground-muted)] hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-create-application-btn"
                  disabled={creating}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-[#071426] shadow-md disabled:opacity-50 cursor-pointer"
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

