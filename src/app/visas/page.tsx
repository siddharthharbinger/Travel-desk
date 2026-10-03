import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function VisasPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="glass-panel p-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
          Visa Navigator
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-xl">
          Rule-driven pre-screening engine for Schengen Business (Germany), US B-1, H-1B, and L-1 corporate categories.
        </p>
        <div className="pt-4">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-all shadow-md"
          >
            <span>Launch Pre-Screening Interview</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
