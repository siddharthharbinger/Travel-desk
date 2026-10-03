import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * =========================================================================
 * <Logo /> Component
 * NOTE FOR USER: This component houses the official company branding.
 * The primary logo graphic is stored at /public/images/harbinger-logo.webp.
 * Replace or customize below as needed.
 * =========================================================================
 */
export function Logo({ className = "", size = "md" }: LogoProps) {
  const heights = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] rounded-md ${className}`}
      aria-label="TravelDesk by Harbinger - Return to homepage"
    >
      {/* Harbinger Corporate Mark / Logo Image */}
      <div className="relative flex items-center">
        <Image
          src="/images/harbinger-logo.webp"
          alt="Harbinger Group"
          width={120}
          height={32}
          className={`${heights[size]} w-auto object-contain transition-opacity group-hover:opacity-90`}
          priority
        />
      </div>

      {/* Brand Divider & Wordmark */}
      <div className="h-4 w-px bg-[var(--glass-border)] hidden sm:block" />
      
      <span className="font-serif text-lg tracking-tight font-medium text-[var(--foreground)] hidden sm:inline-block">
        Travel<span className="text-[var(--brand-teal)]">Desk</span>
      </span>
    </Link>
  );
}
