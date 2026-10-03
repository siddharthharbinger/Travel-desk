"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Lock, Eye, EyeOff, FlaskConical, ShieldAlert, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLocked(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 423 || data.isLocked || (data.error && data.error.toLowerCase().includes("too many attempts"))) {
          setIsLocked(true);
          setError(data.error || "Security Notice: Too many attempts, try again in 15 minutes.");
        } else {
          setError(data.error || "Incorrect email or password. Please try again or contact your administrator.");
        }
        return;
      }

      window.location.href = from || data.redirectUrl || "/dashboard";
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsLocked(false);
    setDemoNotice(`Autofilled ${roleName} credentials`);
    setTimeout(() => setDemoNotice(null), 3000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 py-8 relative z-20">
      {/* Primary Authentication Glass Container */}
      <div className="w-full max-w-[480px] transition-all duration-300">
        <div
          className="relative rounded-2xl p-8 md:p-10 flex flex-col gap-6"
          style={{
            background: "rgba(11, 37, 69, 0.70)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.65), 0 0 45px -10px rgba(20, 184, 166, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.20)",
          }}
        >
          {/* Card Branding & Header */}
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-serif text-3xl font-medium tracking-tight text-white">
              Sign in
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">
              Accounts are created by your administrator.
            </p>
          </div>

          {/* State Banners: Locked State */}
          {isLocked && (
            <div
              id="banner-locked"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 shadow-sm animate-in fade-in"
              role="alert"
            >
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-left text-xs leading-relaxed">
                <span className="font-semibold block mb-0.5 text-amber-300">Security Notice</span>
                {error || "Too many attempts, try again in 15 minutes."}
              </div>
            </div>
          )}

          {/* State Banners: Error State */}
          {!isLocked && error && (
            <div
              id="login-error-alert"
              className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 shadow-sm animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-left text-xs leading-relaxed">
                {error}
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <form className="flex flex-col gap-5" id="auth-form" onSubmit={handleLogin}>
            {/* Email Input Section */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]" htmlFor="email">
                Company email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@harbingergroup.com"
                className="w-full h-11 px-4 rounded-lg glass-input text-sm placeholder:text-[var(--foreground-subtle)] focus:bg-[#071426]/80 transition-all"
              />
            </div>

            {/* Password Input Section */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold tracking-wider uppercase text-[var(--foreground)]" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-4 pr-11 rounded-lg glass-input text-sm placeholder:text-[var(--foreground-subtle)] focus:bg-[#071426]/80 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 p-1 text-[var(--foreground-subtle)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit"
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-1 rounded-lg bg-[var(--brand-teal)] text-[#071426] font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:bg-[var(--brand-teal-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span id="btn-text">Sign in</span>
              )}
            </button>
          </form>

          {/* Footnote */}
          <div className="pt-1 text-center">
            <p className="text-xs text-[var(--foreground-subtle)]">
              Forgot password? <span className="text-[var(--brand-teal)] hover:underline cursor-pointer">Contact your administrator.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Demo Accounts Strip (Below Main Card) */}
      {isDemoMode && (
        <section className="w-full max-w-[480px] mt-4 z-20">
          <div className="rounded-xl bg-[#0b2545]/60 border border-white/10 backdrop-blur-md p-4 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                Demo accounts (testing only)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                aria-label="Log in as Demo Customer"
                onClick={async () => {
                  handleFillDemo(
                    process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL || "customer@harbingergroup.com",
                    process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD || "DemoCustomer2026!",
                    "Customer (Employee)"
                  );
                  try {
                    const res = await fetch("/api/auth/demo-login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: "CUSTOMER" }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      window.location.href = from || data.redirectUrl || "/dashboard";
                    }
                  } catch {
                    // Fallback to form autofill
                  }
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--brand-teal)]/40 transition-all group text-center"
              >
                <span className="text-xs font-semibold text-white group-hover:text-[var(--brand-teal)] transition-colors">
                  Customer
                </span>
                <span className="text-[10px] text-[var(--foreground-subtle)]">(Employee)</span>
              </button>

              <button
                type="button"
                aria-label="Log in as Demo CSR"
                onClick={async () => {
                  handleFillDemo(
                    process.env.NEXT_PUBLIC_DEMO_CSR_EMAIL || "csr@harbingergroup.com",
                    process.env.NEXT_PUBLIC_DEMO_CSR_PASSWORD || "DemoCSR2026!",
                    "CSR (Reviewer)"
                  );
                  try {
                    const res = await fetch("/api/auth/demo-login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: "CSR" }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      window.location.href = from || data.redirectUrl || "/review";
                    }
                  } catch {
                    // Fallback to form autofill
                  }
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--brand-teal)]/40 transition-all group text-center"
              >
                <span className="text-xs font-semibold text-white group-hover:text-[var(--brand-teal)] transition-colors">
                  CSR
                </span>
                <span className="text-[10px] text-[var(--foreground-subtle)]">(Reviewer)</span>
              </button>

              <button
                type="button"
                aria-label="Log in as Demo Admin"
                onClick={async () => {
                  handleFillDemo(
                    process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@harbingergroup.com",
                    process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "DemoAdmin2026!",
                    "Admin (Manager)"
                  );
                  try {
                    const res = await fetch("/api/auth/demo-login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: "ADMIN" }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      window.location.href = from || data.redirectUrl || "/review";
                    }
                  } catch {
                    // Fallback to form autofill
                  }
                }}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--brand-teal)]/40 transition-all group text-center"
              >
                <span className="text-xs font-semibold text-white group-hover:text-[var(--brand-teal)] transition-colors">
                  Admin
                </span>
                <span className="text-[10px] text-[var(--foreground-subtle)]">(Manager)</span>
              </button>
            </div>
            {demoNotice && (
              <div className="text-center text-[11px] text-[var(--brand-teal)] font-medium animate-in fade-in">
                {demoNotice}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Authorized Users Discrete Footer */}
      <footer className="mt-8 text-center text-[var(--foreground-subtle)] text-xs z-10">
        <p>Authorized users only.</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-[var(--foreground-subtle)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
