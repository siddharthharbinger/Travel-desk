"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password Strength calculation
  const calculateStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-700" };
    if (pass.length < 10) return { score: 1, label: "Too Short (Min 10)", color: "bg-red-500" };

    let score = 2;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3 || score === 4) return { score: 3, label: "Strong", color: "bg-emerald-500" };
    return { score: 4, label: "Very Strong", color: "bg-teal-400" };
  };

  const strength = calculateStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update password.");
        return;
      }

      window.location.href = data.redirectUrl || "/dashboard";
    } catch {
      setError("A network error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel p-8 shadow-2xl relative border border-[var(--glass-border)]">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--brand-amber)]/20 text-[var(--brand-amber)] flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Password Update Required
            </h1>
            <p className="text-xs text-[var(--foreground-muted)] max-w-xs mx-auto">
              Your administrator requires you to set a permanent, secure password before accessing corporate travel tools.
            </p>
          </div>

          {error && (
            <div 
              className="mb-6 p-3 rounded-lg border border-[var(--brand-ruby)]/40 bg-[var(--brand-ruby)]/10 text-[var(--brand-ruby)] text-xs flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="currentPassword" 
                className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider"
              >
                Temporary / Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="newPassword" 
                className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider"
              >
                New Password (Min. 10 Characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 10 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input"
                />
              </div>

              {/* Strength Meter Bar */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[var(--foreground-muted)]">Security Strength:</span>
                    <span className="font-semibold text-[var(--foreground)]">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--glass-fill-nested)] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label 
                htmlFor="confirmPassword" 
                className="block text-xs font-medium text-[var(--foreground-muted)] mb-1.5 uppercase tracking-wider"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 10}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Password & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
