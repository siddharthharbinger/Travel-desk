import { getCurrentUser } from "@/lib/auth";
import { Headphones, ShieldCheck } from "lucide-react";

export default async function ReviewPage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div className="glass-panel p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-medium text-[var(--foreground)]">
              CSR Review Portal & Case Management
            </h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              Logged in as <span className="font-semibold text-[var(--foreground)]">{user?.name}</span> ({user?.role})
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[var(--glass-fill-nested)] border border-[var(--glass-border)]">
          <p className="text-xs text-[var(--foreground-muted)]">
            Case management table and decision cockpit. Authorized for CSR and Admin personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
