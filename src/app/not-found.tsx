import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 relative z-20">
      <div
        className="w-full max-w-lg rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl flex flex-col items-center"
        style={{
          background: "rgba(11, 37, 69, 0.70)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.65), 0 0 45px -10px rgba(20, 184, 166, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.20)",
        }}
      >
        {/* Icon Tile */}
        <div className="w-14 h-14 rounded-2xl bg-[var(--brand-teal)]/15 border border-[var(--brand-teal)]/25 text-[var(--brand-teal)] flex items-center justify-center mb-6 shadow-sm">
          <Compass className="w-7 h-7" />
        </div>

        {/* Heading & Explanation */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-teal)] mb-1">
          404 Error
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-8 max-w-sm leading-relaxed">
          The page you are looking for doesn't exist, has been archived, or was moved to another location.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[var(--brand-teal)] text-[#071426] font-semibold text-xs hover:bg-[var(--brand-teal-hover)] transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
          <Link
            href="/visas"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <Search className="w-4 h-4 text-[var(--foreground-muted)]" />
            <span>Visa Navigator</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
