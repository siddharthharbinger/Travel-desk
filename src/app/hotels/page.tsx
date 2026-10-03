import { Building2 } from "lucide-react";

export default function HotelsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="glass-panel p-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
          Hotel Accommodations Hub
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-xl">
          Verified executive hotel options with consulate proximity guidance in Munich and New York. Search and book directly on partner booking sites.
        </p>
      </div>
    </div>
  );
}
