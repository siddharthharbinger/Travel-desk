import { Plane, Search } from "lucide-react";

export default function FlightsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="glass-panel p-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
          <Plane className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
          Flight Search Hub
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] max-w-xl">
          Search corporate business travel corridors with origins Mumbai (BOM) and Pune (PNQ). Connects directly to verified partner search engines.
        </p>
      </div>
    </div>
  );
}
