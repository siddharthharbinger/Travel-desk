"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NotificationBell } from "@/components/NotificationBell";
import { LogOut, KeyRound, Shield, ChevronDown, Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const isLoginPage = pathname === "/login";

  // Track scroll position to strengthen glass fill after 20px
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#071426]/35 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-[68px] flex items-center justify-between">
          {/* Left: Brand Logo & Wordmark (Corner-aligned) */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Minimalist Stitch-style Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] sm:text-sm font-medium transition-colors duration-150 relative py-1 ${
                    isActive
                      ? "text-white font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#4fdbc8] after:rounded-full"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Stitch-style Action Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell initialCount={unreadNotificationsCount} />

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                    aria-label="User profile and account settings"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--brand-teal)] to-teal-200 text-[#071426] font-bold text-xs flex items-center justify-center shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <span className="hidden sm:inline text-xs font-medium text-white/90 max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-150 ${profileOpen ? "rotate-180" : ""}`} />
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
              /* Stitch-style High-Contrast White Pill Button */
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold bg-white text-[#071426] hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-sm"
              >
                Sign in
              </Link>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pt-2 pb-6 bg-[#071426]/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/10 text-white font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!user && (
              <div className="pt-2 border-t border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-[#071426] hover:bg-white/90 transition-all shadow-sm"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
