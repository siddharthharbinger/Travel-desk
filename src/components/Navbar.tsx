"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Bell, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";

import { NotificationBell } from "@/components/NotificationBell";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const navLinks = [
    { label: "Visas", href: "/visas" },
    { label: "Flights", href: "/flights" },
    { label: "Hotels", href: "/hotels" },
    { label: "Travel Info", href: "/travel-info" },
  ];

  // Show Review tab for CSR and ADMIN
  if (user && (user.role === "CSR" || user.role === "ADMIN")) {
    navLinks.push({ label: "Review", href: "/review" });
  }

  // Show Admin tab for ADMIN
  if (user && user.role === "ADMIN") {
    navLinks.push({ label: "Admin", href: "/admin" });
  }

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

  return (
    <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto w-full transition-all">
      <nav 
        className="glass-panel h-16 px-4 sm:px-6 flex items-center justify-between shadow-2xl relative"
        aria-label="Main Navigation"
      >
        {/* Left: Brand Logo Lockup */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] ${
                  isActive
                    ? "bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] border border-[var(--brand-teal)]/40 shadow-sm font-semibold"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill-hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions, Theme Toggle, User Profile */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {user && <NotificationBell />}

          {user ? (
            /* User Dropdown */
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
                aria-expanded={profileOpen}
                aria-label="User profile and role menu"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-[var(--foreground)] hidden sm:inline-block max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
              </button>

              {profileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 glass-panel p-2 shadow-2xl border border-[var(--glass-border)] z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-[var(--glass-border)] mb-1">
                    <p className="font-medium text-[var(--foreground)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30">
                        <ShieldCheck className="w-3 h-3" />
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-[var(--glass-fill-hover)] text-[var(--foreground)]"
                    role="menuitem"
                  >
                    <UserIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
                    Customer Dashboard
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-[var(--glass-fill-hover)] text-[var(--foreground)]"
                      role="menuitem"
                    >
                      <ShieldCheck className="w-4 h-4 text-[var(--brand-teal)]" />
                      Admin Governance
                    </Link>
                  )}

                  {/* Demo Role Switcher (Shown ONLY when NEXT_PUBLIC_DEMO_MODE=true) */}
                  {isDemoMode && (
                    <div className="border-t border-b border-[var(--glass-border)] my-1 py-1.5 px-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--brand-amber)] mb-1.5 uppercase tracking-wider">
                        <SlidersHorizontal className="w-3 h-3" />
                        Demo: Switch Role
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(["CUSTOMER", "CSR", "ADMIN"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => handleSwitchRole(r)}
                            disabled={user.role === r || switchingRole}
                            className={`py-1 text-[11px] rounded font-medium transition-all ${
                              user.role === r
                                ? "bg-[var(--brand-teal)] text-white"
                                : "bg-[var(--glass-fill-nested)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill-hover)]"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--brand-ruby)] hover:bg-[var(--brand-ruby)]/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full text-xs font-medium border border-[var(--brand-teal)]/40 bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)] hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--foreground)]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel p-4 space-y-2 border border-[var(--glass-border)] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] border border-[var(--brand-teal)]/30 font-semibold"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--glass-fill-hover)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
