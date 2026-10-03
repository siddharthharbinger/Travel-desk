"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck, 
  Headphones, 
  Sparkles 
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify your credentials.");
        return;
      }

      window.location.href = from || data.redirectUrl || "/dashboard";
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "CUSTOMER" | "CSR" | "ADMIN") => {
    if (!isDemoMode || demoLoading) return;
    setError(null);
    setDemoLoading(role);

    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Unable to log in as ${role}.`);
        return;
      }

      window.location.href = from || data.redirectUrl || "/dashboard";
    } catch {
      setError("Demo authentication failed.");
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-panel p-8 shadow-2xl relative border border-[var(--glass-border)]">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Corporate Travel Sign In
            </h1>
            <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto">
              Accounts are created by your administrator. Use your authorized company credentials.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div 
              id="login-error-alert"
              data-testid="login-error"
              className="mb-6 p-3.5 rounded-lg border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] text-xs flex items-start gap-2.5 animate-in fade-in duration-150"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider"
              >
                Corporate Email (@harbingergroup.com)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@harbingergroup.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-[var(--foreground-subtle)]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider"
                >
                  Password
                </label>
                <span className="text-[11px] text-[var(--foreground-subtle)]">
                  Contact administrator if forgotten
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input placeholder:text-[var(--foreground-subtle)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo 1-Click Buttons (Gated behind NEXT_PUBLIC_DEMO_MODE=true) */}
          {isDemoMode && (
            <div className="mt-8 pt-6 border-t border-[var(--glass-border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--brand-amber)] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  1-Click Demo Evaluation
                </span>
                <span className="text-[10px] text-[var(--foreground-subtle)]">
                  NEXT_PUBLIC_DEMO_MODE=true
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("CUSTOMER")}
                  disabled={!!demoLoading}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] disabled:opacity-50"
                  aria-label="Log in as Demo Customer"
                >
                  <UserCheck className="w-4 h-4 text-[var(--brand-teal)] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[var(--foreground)]">Customer</span>
                  <span className="text-[10px] text-[var(--foreground-subtle)]">Applicant</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("CSR")}
                  disabled={!!demoLoading}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] disabled:opacity-50"
                  aria-label="Log in as Demo CSR"
                >
                  <Headphones className="w-4 h-4 text-[var(--brand-amber)] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[var(--foreground)]">CSR</span>
                  <span className="text-[10px] text-[var(--foreground-subtle)]">Reviewer</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin("ADMIN")}
                  disabled={!!demoLoading}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] disabled:opacity-50"
                  aria-label="Log in as Demo Admin"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-[var(--foreground)]">Admin</span>
                  <span className="text-[10px] text-[var(--foreground-subtle)]">System</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--brand-teal)]/30 border-t-[var(--brand-teal)] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
