import { getCurrentUser } from "@/lib/auth";
import { UserCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="glass-panel p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
              Customer Application Dashboard
            </h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              Welcome back, <span className="font-semibold text-[var(--foreground)]">{user?.name}</span> ({user?.email})
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--glass-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[var(--glass-fill-nested)] space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-teal)]">
              Active Pre-Screening
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              Start or resume your visa pre-interview session to generate your statutory readiness report.
            </p>
            <Link
              href="/interview"
              className="inline-block mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-colors"
            >
              Start Visa Interview
            </Link>
          </div>

          <div className="p-4 rounded-lg bg-[var(--glass-fill-nested)] space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-amber)]">
              Assigned Corporate Specialist
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              Human review is performed by trained corporate service representatives upon interview completion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
