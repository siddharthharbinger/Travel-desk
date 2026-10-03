import Link from "next/link";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full glass-panel p-8 text-center space-y-6 border border-[var(--brand-ruby)]/30 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[var(--brand-ruby)]/15 text-[var(--brand-ruby)] flex items-center justify-center mx-auto">
          <ShieldX className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            403 · Access Restricted
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
            Your corporate account does not have permission to access this portal or administrative resource.
          </p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            If you require reviewer or administrator privileges, please contact your corporate administrator.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
