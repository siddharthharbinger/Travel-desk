"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  Download,
  Building2,
  Calendar
} from "lucide-react";
import { REQUIRED_DOCUMENTS } from "@/lib/prescreening-rules";

interface Question {
  id: string;
  key: string;
  visaType: string;
  stepCategory: string;
  orderIndex: number;
  questionText: string;
  helpText: string | null;
  responseType: string;
  options: string | null;
  isMandatory: boolean;
}

interface Answer {
  id: string;
  questionId: string;
  answerValue: string;
  hasFlag: boolean;
  flagDetails: string | null;
}

interface DocumentItem {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  isVerified: boolean;
  createdAt: string;
}

interface FlagItem {
  id: string;
  code: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  isResolved: boolean;
}

interface ApplicationData {
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
  interviewSessions: {
    id: string;
    answers: Answer[];
  }[];
  documents: DocumentItem[];
  flags: FlagItem[];
}

function InterviewCockpitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseIdParam = searchParams.get("caseId");
  const visaTypeParam = searchParams.get("visaType") || "SCHENGEN_BUSINESS";

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submittingCase, setSubmittingCase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Initialize or fetch application
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);

      try {
        let appId = caseIdParam;

        // If no caseId param, fetch user's most recent application or create one
        if (!appId) {
          const listRes = await fetch("/api/applications");
          if (listRes.status === 401) {
            router.push("/login");
            return;
          }
          const listData = await listRes.json();
          if (listData.applications && listData.applications.length > 0) {
            appId = listData.applications[0].id;
          } else {
            // Create a default case for this visa type
            const createRes = await fetch("/api/applications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                visaType: visaTypeParam,
                destinationCountry: visaTypeParam.startsWith("US") ? "United States" : "Germany",
                travelPurpose: "Commercial Negotiations and Strategy Review",
              }),
            });
            const createData = await createRes.json();
            appId = createData.application.id;
          }
        }

        // Fetch application full details
        const res = await fetch(`/api/applications/${appId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load application dossier");
          return;
        }

        setApplication(data.application);
        setQuestions(data.questions || []);

        // Resume at first unanswered question
        const answers = data.application?.interviewSessions?.[0]?.answers || [];
        const firstUnansweredIndex = (data.questions || []).findIndex(
          (q: Question) => !answers.some((a: Answer) => a.questionId === q.id)
        );

        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        } else {
          setCurrentQuestionIndex(0);
        }
      } catch (err) {
        console.error(err);
        setError("Network error connecting to pre-screening service.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [caseIdParam, visaTypeParam, router]);

  const currentQuestion = questions[currentQuestionIndex];
  const activeSession = application?.interviewSessions?.[0];
  const answers = activeSession?.answers || [];
  const existingAnswerObj = currentQuestion 
    ? answers.find((a) => a.questionId === currentQuestion.id) 
    : undefined;

  // Set answer input value when moving between questions
  useEffect(() => {
    if (existingAnswerObj) {
      setCurrentAnswer(existingAnswerObj.answerValue);
    } else {
      setCurrentAnswer("");
    }
  }, [currentQuestionIndex, existingAnswerObj]);

  const handleAnswerSubmit = async () => {
    if (!application || !currentQuestion || !currentAnswer.trim()) return;

    setSubmittingAnswer(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${application.id}/interview/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerValue: currentAnswer.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save answer");
        return;
      }

      // Refresh application state
      const refreshRes = await fetch(`/api/applications/${application.id}`);
      const refreshData = await refreshRes.json();
      setApplication(refreshData.application);

      // Move to next question if available
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch {
      setError("Network error recording response.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file || !application) return;

    setUploadingDoc(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", docType);

      const res = await fetch(`/api/applications/${application.id}/documents`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Document upload failed");
        return;
      }

      setUploadSuccess(`Successfully uploaded and validated ${file.name}`);

      // Refresh application
      const refreshRes = await fetch(`/api/applications/${application.id}`);
      const refreshData = await refreshRes.json();
      setApplication(refreshData.application);
    } catch {
      setError("Network error uploading document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmitToCsr = async () => {
    if (!application) return;
    setSubmittingCase(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${application.id}/submit`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error submitting application to CSR.");
    } finally {
      setSubmittingCase(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[var(--brand-teal)] mx-auto" />
        <p className="text-xs text-[var(--foreground-muted)]">Connecting to AI pre-screening engine...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-8 h-8 text-[var(--brand-ruby)] mx-auto" />
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Application Not Found</h2>
        <Link href="/dashboard" className="text-xs text-[var(--brand-teal)] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const activeFlags = application.flags.filter((f) => !f.isResolved);
  const requiredDocsList = REQUIRED_DOCUMENTS[application.visaType] || REQUIRED_DOCUMENTS.DEFAULT;
  const answeredQuestionsCount = answers.length;
  const allMandatoryAnswered = questions
    .filter((q) => q.isMandatory)
    .every((mq) => answers.some((a) => a.questionId === mq.id && a.answerValue));

  let parsedOptions: { label: string; value: string }[] = [];
  if (currentQuestion?.options) {
    try {
      parsedOptions = JSON.parse(currentQuestion.options);
    } catch {
      parsedOptions = [];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:text-[var(--brand-teal)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--brand-teal)] bg-[var(--brand-teal)]/10 px-2 py-0.5 rounded border border-[var(--brand-teal)]/20">
                {application.caseNumber}
              </span>
              <span className="text-sm font-semibold text-[var(--foreground)]">
                {application.visaType.replace(/_/g, " ")} Pre-Screening Cockpit
              </span>
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)]">
              {application.destinationCountry} · {application.travelPurpose}
            </p>
          </div>
        </div>

        {/* Status & Readiness Score Tag */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-[var(--foreground-subtle)] block">
              Readiness Score
            </span>
            <span className="font-mono font-bold text-sm text-[var(--brand-teal)]">
              {application.readinessScore}%
            </span>
          </div>
          <div className="w-16 h-2 rounded-full bg-[var(--canvas-bg-alt)] overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                application.readinessScore >= 80 ? "bg-emerald-500" : "bg-[var(--brand-teal)]"
              }`}
              style={{ width: `${application.readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Conversational AI Interviewer */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 space-y-6 border border-[var(--glass-border)]">
          {/* Stepper Progress */}
          <div className="flex items-center justify-between text-xs text-[var(--foreground-subtle)] pb-4 border-b border-[var(--glass-border)]">
            <span className="font-semibold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--brand-teal)]" />
              <span>AI Statutory Questionnaire</span>
            </span>
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Stepper pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {questions.map((q, idx) => {
              const isAnswered = answers.some((a) => a.questionId === q.id);
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent 
                      ? "w-8 bg-[var(--brand-teal)]" 
                      : isAnswered 
                      ? "w-4 bg-emerald-500/70" 
                      : "w-4 bg-[var(--canvas-bg-alt)] border border-[var(--glass-border)]"
                  }`}
                  aria-label={`Jump to question ${idx + 1}`}
                />
              );
            })}
          </div>

          {currentQuestion ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Question Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-teal)]">
                    {currentQuestion.stepCategory.replace(/_/g, " ")}
                  </span>
                  {currentQuestion.isMandatory && (
                    <span className="text-[10px] text-[var(--brand-amber)] font-medium">
                      * Mandatory
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-serif font-medium text-[var(--foreground)] leading-snug">
                  {currentQuestion.questionText}
                </h2>
                {currentQuestion.helpText && (
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {currentQuestion.helpText}
                  </p>
                )}
              </div>

              {/* Dynamic Inputs Based on Response Type */}
              <div className="space-y-3 pt-2">
                {currentQuestion.responseType === "SINGLE_CHOICE" && (
                  <div className="space-y-2">
                    {parsedOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCurrentAnswer(opt.value)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all ${
                          currentAnswer === opt.value
                            ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/15 text-[var(--foreground)] ring-1 ring-[var(--brand-teal)]"
                            : "border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground-muted)]"
                        }`}
                      >
                        <div className="font-semibold text-xs mb-0.5">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.responseType === "BOOLEAN" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentAnswer("true")}
                      className={`p-3.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        currentAnswer === "true"
                          ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/15 text-[var(--foreground)] ring-1 ring-[var(--brand-teal)]"
                          : "border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--foreground-muted)]"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentAnswer("false")}
                      className={`p-3.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        currentAnswer === "false"
                          ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/15 text-[var(--foreground)] ring-1 ring-[var(--brand-teal)]"
                          : "border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--foreground-muted)]"
                      }`}
                    >
                      No
                    </button>
                  </div>
                )}

                {currentQuestion.responseType === "DATE" && (
                  <div>
                    <input
                      type="date"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      className="w-full p-3 rounded-xl text-xs glass-input"
                    />
                  </div>
                )}

                {currentQuestion.responseType === "NUMBER" && (
                  <div>
                    <input
                      type="number"
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="e.g. 14"
                      className="w-full p-3 rounded-xl text-xs glass-input"
                    />
                  </div>
                )}

                {currentQuestion.responseType === "TEXT" && (
                  <div>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      rows={3}
                      placeholder="Enter detailed clarification..."
                      className="w-full p-3 rounded-xl text-xs glass-input resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Existing Flag on this question if any */}
              {existingAnswerObj?.hasFlag && (
                <div className="p-3.5 rounded-xl border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-xs text-[var(--brand-ruby)] flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold block">Regulatory Flag Triggered:</span>
                    <p className="text-[11px] leading-relaxed">{existingAnswerObj.flagDetails}</p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[var(--foreground-muted)] hover:bg-[var(--glass-fill)] disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="submit-interview-answer-btn"
                    disabled={!currentAnswer.trim() || submittingAnswer}
                    onClick={handleAnswerSubmit}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all inline-flex items-center gap-2"
                  >
                    <span>{submittingAnswer ? "Recording..." : "Save Answer"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">All Questions Completed</h3>
              <p className="text-xs text-[var(--foreground-muted)]">Upload your required documentation in the right pane to finalize your dossier.</p>
            </div>
          )}
        </div>

        {/* Right Column: Live Dossier Preview & Document Upload Hub */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Flags Banner */}
          {activeFlags.length > 0 && (
            <div className="glass-panel p-5 space-y-3 border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/[0.04]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand-ruby)] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Regulatory Flags ({activeFlags.length})</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--foreground-muted)]">
                {activeFlags.map((flag) => (
                  <li key={flag.id} className="p-2.5 rounded-lg bg-[var(--canvas-bg-alt)]/80 border border-[var(--glass-border)]">
                    <span className="font-semibold text-[var(--brand-ruby)] block text-[11px] mb-0.5">
                      [{flag.code}]
                    </span>
                    <span className="text-[11px] leading-relaxed">{flag.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document Upload Checklist */}
          <div className="glass-panel p-6 space-y-5 border border-[var(--glass-border)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>Mandatory Documents</span>
                </h3>
                <p className="text-[11px] text-[var(--foreground-subtle)]">
                  PDF, PNG, or JPEG · Max 10 MB per file · Magic-byte verified
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--brand-teal)]">
                {application.documents.length}/{requiredDocsList.length}
              </span>
            </div>

            <div className="space-y-3">
              {requiredDocsList.map((reqDoc) => {
                const uploaded = application.documents.find((d) => d.documentType === reqDoc.type);

                return (
                  <div 
                    key={reqDoc.type}
                    className="p-3.5 rounded-xl border border-[var(--glass-border)] bg-[var(--canvas-bg-alt)]/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-xs text-[var(--foreground)] flex items-center gap-1.5">
                          {uploaded ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[var(--brand-amber)] shrink-0" />
                          )}
                          <span>{reqDoc.label}</span>
                        </div>
                        <p className="text-[11px] text-[var(--foreground-subtle)] leading-relaxed mt-0.5">
                          {reqDoc.description}
                        </p>
                      </div>

                      {uploaded ? (
                        <a
                          href={`/api/documents/${uploaded.id}/download`}
                          className="px-2.5 py-1 rounded text-[11px] font-medium text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 hover:bg-[var(--brand-teal)]/10 transition-colors inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>View</span>
                        </a>
                      ) : (
                        <label className="cursor-pointer px-3 py-1 rounded text-[11px] font-semibold bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/25 border border-[var(--brand-teal)]/30 transition-colors inline-flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>{uploadingDoc ? "..." : "Upload"}</span>
                          <input
                            type="file"
                            accept=".pdf,image/png,image/jpeg"
                            onChange={(e) => handleFileUpload(e, reqDoc.type)}
                            disabled={uploadingDoc}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {uploaded && (
                      <div className="flex items-center justify-between text-[10px] text-[var(--foreground-subtle)] pt-1 border-t border-[var(--glass-border)]/50">
                        <span className="truncate max-w-[180px]">{uploaded.fileName}</span>
                        <span className="font-mono">{(uploaded.fileSize / 1024).toFixed(0)} KB</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Case to CSR Operations */}
          <div className="glass-panel p-6 space-y-4 border border-[var(--glass-border)]">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                Final Submission to CSR Review
              </h4>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Once submitted, a corporate specialist will audit your responses and documents. You will receive an operational dispatch notice.
              </p>
            </div>

            <button
              type="button"
              id="submit-case-to-csr-btn"
              onClick={handleSubmitToCsr}
              disabled={submittingCase || application.status === "SUBMITTED" || application.status === "VERIFIED"}
              className="w-full py-3 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              <span>{submittingCase ? "Submitting..." : application.status === "SUBMITTED" ? "Case Submitted to CSR" : "Submit Case to CSR Operations"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewCockpitPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-[var(--foreground-muted)]">
        Loading pre-screening cockpit...
      </div>
    }>
      <InterviewCockpitContent />
    </Suspense>
  );
}
