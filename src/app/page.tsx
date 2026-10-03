"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Search, 
  Compass, 
  ShieldCheck, 
  Building2, 
  Plane, 
  FileCheck2,
  ChevronDown
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);

  // Gentle Parallax (at most 40px, normal scroll, uses requestAnimationFrame and respects prefers-reduced-motion)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroImageRef.current) {
            const scrollY = window.scrollY;
            // Cap parallax translation to at most 40px
            const offset = Math.min(40, scrollY * 0.12);
            heroImageRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    if (query.includes("schengen") || query.includes("germany") || query.includes("visa")) {
      router.push("/visas");
    } else if (query.includes("flight")) {
      router.push("/flights");
    } else if (query.includes("hotel")) {
      router.push("/hotels");
    } else if (query.includes("munich") || query.includes("york") || query.includes("dest") || query.includes("travel")) {
      router.push("/travel-info");
    } else {
      router.push(`/visas?q=${encodeURIComponent(query)}`);
    }
  };

  const handleQuickChip = (text: string) => {
    setSearchQuery(text);
    if (text.includes("Schengen") || text.includes("B-1")) {
      router.push("/visas");
    } else if (text.includes("flights")) {
      router.push("/flights");
    } else if (text.includes("hotels")) {
      router.push("/hotels");
    }
  };

  const faqs = [
    {
      q: "Which visa categories are supported for Harbinger employees?",
      a: "Pre-screening is tailored for Schengen C Business visas (Munich, Germany) and US B-1 Business Visitor visas (New York), covering Indian passport holders traveling on corporate business.",
    },
    {
      q: "How does the pre-screening interview work?",
      a: "You answer factual questions regarding travel dates, purpose of stay, and passport details. You then upload required documents for corporate service representative review before submission.",
    },
    {
      q: "How are flights and hotel reservations handled?",
      a: "TravelDesk serves as a search-and-redirect hub. You configure your travel dates and route, then transition securely to approved partner portals (ixigo, MakeMyTrip, Booking.com) to finalize bookings.",
    },
    {
      q: "What passport validity is required for business travel?",
      a: "For Schengen travel, your passport must be valid for at least 3 months beyond your planned departure from Schengen territory and issued within the previous 10 years. For US travel, Indian passports benefit from the Six-Month Club agreement, requiring validity for the intended duration of stay.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION WITH TWILIGHT FLIGHT WINDOW PHOTO */}
      <section className="relative w-full overflow-hidden -mt-20">
        <div className="relative w-full h-[620px] lg:h-[720px] overflow-hidden">
          {/* Parallax Background Photo (sharp, full-bleed, appears once, max 40px parallax) */}
          <div
            ref={heroImageRef}
            className="absolute inset-0 w-full h-[115%] bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: "url('/images/flight_aircraft_sunset.png')",
              top: "-5%",
            }}
          />

          {/* Dark Gradient Overlay & Scrim (fades into page canvas #071426 at bottom edge) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#071426]/75 via-[#071426]/45 to-[#071426] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#071426_90%)] pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto h-full px-6 pt-32 pb-16 flex flex-col justify-end items-center text-center">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white max-w-4xl tracking-tight mb-4 leading-tight">
              Global business mobility, effortlessly accelerated.
            </h1>
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl font-normal mb-8 leading-relaxed">
              Intelligent visa pre-screening and corporate travel coordination tailored specifically for Harbinger Group personnel holding Indian passports.
            </p>

            {/* Centered Glass Search & Prompt Bar */}
            <div
              className="w-full max-w-3xl rounded-2xl p-3 shadow-2xl"
              style={{
                background: "rgba(11, 37, 69, 0.75)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
              }}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-3 py-1 bg-[#071426]/70 rounded-xl border border-white/10">
                <Search className="w-5 h-5 text-[var(--brand-teal)] shrink-0" />
                <input
                  type="text"
                  id="global-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search visa requirements, destination rules, flight hubs..."
                  className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-[var(--foreground-subtle)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[var(--brand-teal)] text-[#071426] font-semibold text-xs hover:bg-[var(--brand-teal-hover)] transition-all shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 px-1 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] mr-1">
                  Quick Select:
                </span>
                {[
                  "Schengen business visa",
                  "US B-1 visa",
                  "Search flights",
                  "Find hotels",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleQuickChip(chip)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[var(--foreground)] border border-white/5 hover:border-[var(--brand-teal)]/30 transition-all font-medium text-xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE SERVICES GRID (4 FROSTED GLASS CARDS) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--brand-teal)] font-semibold">
              Mobility Operations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1">
              Core Travel Services
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-md">
            Structured travel workflows calibrated for Indian passport compliance and corporate itinerary coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Visa Pre-Screening */}
          <div
            className="flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
            style={{
              background: "rgba(11, 37, 69, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/15 border border-[var(--brand-teal)]/30 flex items-center justify-center text-[var(--brand-teal)] mb-5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">
                AI visa pre-screening
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6">
                Answer a short interview and upload your documents. A trained reviewer checks your case.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/interview/start"
                className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors group-hover:translate-x-0.5"
              >
                <span>Start pre-screening</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Flight Search */}
          <div
            className="flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
            style={{
              background: "rgba(11, 37, 69, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 shadow-sm">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">
                Flight search
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6">
                Search flights from Mumbai, Pune, or Delhi on approved partner portals.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/flights"
                className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors group-hover:translate-x-0.5"
              >
                <span>Search flights</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 3: Hotel Search */}
          <div
            className="flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
            style={{
              background: "rgba(11, 37, 69, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">
                Hotel search
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6">
                Search accommodations near Munich and New York business districts on partner sites.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/hotels"
                className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors group-hover:translate-x-0.5"
              >
                <span>Search hotels</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 4: Travel Info */}
          <div
            className="flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
            style={{
              background: "rgba(11, 37, 69, 0.65)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 1px 0 0 rgba(255, 255, 255, 0.14)",
            }}
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">
                Travel info
              </h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed mb-6">
                Official guides, transit rules, and verified consular resources for Munich and New York.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/travel-info"
                className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors group-hover:translate-x-0.5"
              >
                <span>View travel info</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (HORIZONTAL STEPPER) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div
          className="p-8 md:p-10 rounded-3xl"
          style={{
            background: "rgba(11, 37, 69, 0.50)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
          }}
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">How it works</h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">Four simple steps from pre-screening to application readiness.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#030e20]/60 border border-white/5 shadow-inner">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] text-xs flex items-center justify-center font-bold">
                  01
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Answer questions</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Provide travel dates, destination country, purpose of visit, and passport details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#030e20]/60 border border-white/5 shadow-inner">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] text-xs flex items-center justify-center font-bold">
                  02
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Upload documents</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Submit passport bio page, employer letter, invitation, and financial records.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#030e20]/60 border border-white/5 shadow-inner">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] text-xs flex items-center justify-center font-bold">
                  03
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Human review</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                A trained corporate service representative reviews your submission for completeness.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#030e20]/60 border border-white/5 shadow-inner">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] text-xs flex items-center justify-center font-bold">
                  04
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Next steps</h3>
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Receive booking guidance, biometric appointment instructions, or review notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESTINATION GUIDES (MUNICH & NEW YORK ONLY PER STEP 4) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">Travel guides</h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Active corporate corridors with dedicated pre-screening parameters.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destination 1: Munich */}
          <div
            className="group rounded-3xl overflow-hidden flex flex-col border border-white/10 transition-all duration-300 hover:border-white/20"
            style={{
              background: "rgba(11, 37, 69, 0.60)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src="/images/dest_munich.png"
                alt="Munich Marienplatz Neues Rathaus"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#030e20]/80 backdrop-blur-md border border-white/10">
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                  Germany • Schengen Area
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-white mb-2">Munich Business Hub</h3>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
                  Schengen C Business visa rules, consulate guidance, airport transit, and local transport connections.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/travel-info"
                  className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors"
                >
                  <span>View travel guide</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Destination 2: New York */}
          <div
            className="group rounded-3xl overflow-hidden flex flex-col border border-white/10 transition-all duration-300 hover:border-white/20"
            style={{
              background: "rgba(11, 37, 69, 0.60)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
              <Image
                src="/images/dest_newyork.png"
                alt="New York Manhattan skyline at dusk"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#030e20]/80 backdrop-blur-md border border-white/10">
                <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
                  United States • B-1 Visitor
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-serif text-xl font-medium text-white mb-2">New York Corporate Hub</h3>
                <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed mb-6">
                  US B-1 business visitor criteria, Six-Month Club passport validity rules, and consulate entry checklist.
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/travel-info"
                  className="inline-flex items-center text-xs font-semibold text-[var(--brand-teal)] hover:text-teal-300 transition-colors"
                >
                  <span>View travel guide</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ TEASER (CLEAN ACCORDION) */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[var(--brand-teal)] font-semibold">
            Assistance &amp; Clarity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-2">
            Answers regarding pre-screening processing, passport validity, and partner booking redirection.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
                style={{
                  background: "rgba(11, 37, 69, 0.60)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--brand-teal)] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[var(--foreground-muted)] leading-relaxed border-t border-white/5 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
