import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] rounded-lg ${className}`}
      aria-label="TravelDesk - Return to homepage"
    >
      {/* 36px White Rounded Tile Component */}
      <div className="w-9 h-9 min-w-[36px] bg-white rounded-lg flex items-center justify-center p-1 shadow-sm transition-transform duration-150 group-hover:scale-105">
        <Image
          src="/images/harbinger-logo.webp"
          alt="Harbinger Logo"
          width={32}
          height={24}
          className="h-5 w-auto object-contain"
          priority
        />
      </div>

      {/* Wordmark */}
      <span className="font-serif text-lg font-medium tracking-tight text-white group-hover:text-[var(--brand-teal)] transition-colors">
        Travel<span className="text-[var(--brand-teal)] font-normal">Desk</span>
      </span>
    </Link>
  );
}
