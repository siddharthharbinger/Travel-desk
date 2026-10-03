"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { LogOut, KeyRound, Shield, ChevronDown } from "lucide-react";

interface NavbarUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "CSR" | "ADMIN";
}

interface NavbarProps {
  user?: NavbarUser | null;
  unreadNotificationsCount?: number;
}

export function Navbar({ user, unreadNotificationsCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const isLoginPage = pathname === "/login";

  // Track scroll position to strengthen glass fill after 24px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleSwitchRole = async (targetRole: "CUSTOMER" | "CSR" | "ADMIN") => {
    if (!isDemoMode || switchingRole) return;
    setSwitchingRole(true);
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });
      if (res.ok) {
        setProfileOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Demo switch failed:", err);
    } finally {
      setSwitchingRole(false);
    }
  };

  // Helper for initials
  const getInitials = (name?: string) => {
    if (!name) return "TD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // Role-based links: Visas, Flights, Hotels, Travel Info, plus "Review" for CSR/Admin only
  const navLinks = [
    { label: "Visas", href: "/visas" },
    { label: "Flights", href: "/flights" },
    { label: "Hotels", href: "/hotels" },
    { label: "Travel Info", href: "/travel-info" },
  ];

  if (user && (user.role === "CSR" || user.role === "ADMIN")) {
    navLinks.push({ label: "Review", href: "/review" });
  }

  // Sign-in page = dedicated minimal header handled in login page
  if (isLoginPage) {
    return null;
  }

  return (
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full">
      <nav
        className="h-14 px-4 sm:px-6 rounded-full flex items-center justify-between transition-all duration-200"
        style={{
          backgroundColor: scrolled ? "rgba(7, 20, 38, 0.92)" : "rgba(7, 20, 38, 0.60)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 12px 36px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)",
        }}
        aria-label="Main Navigation"
      >
        {/* Left: Logo Tile & Wordmark */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Role-based Navigation Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-[var(--brand-teal)] text-[#071426] font-semibold shadow-[0_0_12px_rgba(20,184,166,0.35)]"
                    : "text-[var(--foreground)] hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: User State / Profile or Sign In */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell initialCount={unreadNotificationsCount} />

              {/* User Initials Avatar with Name inside Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                  aria-label="User profile and account settings"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--brand-teal)] to-teal-200 text-[#071426] font-bold text-xs flex items-center justify-center shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--foreground-muted)] transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 p-3 rounded-2xl glass-floating border border-white/15 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Identity inside Dropdown */}
                    <div className="pb-3 border-b border-white/10 px-1">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-[var(--foreground-subtle)] truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30">
                        <Shield className="w-3 h-3" />
                        <span>{user.role}</span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="py-2 space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--foreground)] hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/change-password"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--foreground)] hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                        <span>Change Password</span>
                      </Link>
                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--foreground)] hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    {/* Demo Role Switcher */}
                    {isDemoMode && (
                      <div className="py-2 border-t border-white/10">
                        <p className="px-3 text-[10px] uppercase font-semibold text-[var(--foreground-subtle)] tracking-wider mb-1.5">
                          Switch Role (Demo)
                        </p>
                        <div className="grid grid-cols-3 gap-1 px-1">
                          {(["CUSTOMER", "CSR", "ADMIN"] as const).map((r) => (
                            <button
                              key={r}
                              onClick={() => handleSwitchRole(r)}
                              disabled={switchingRole || user.role === r}
                              className={`py-1 text-[11px] rounded font-medium transition-colors ${
                                user.role === r
                                  ? "bg-[var(--brand-teal)] text-[#071426] font-semibold"
                                  : "bg-white/5 hover:bg-white/10 text-[var(--foreground)]"
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sign out */}
                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-300 hover:bg-red-500/15 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Logged-out Nav: Sign In Button */
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--brand-teal)] text-[#071426] hover:bg-[var(--brand-teal-hover)] transition-all shadow-[0_0_12px_rgba(20,184,166,0.3)]"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
