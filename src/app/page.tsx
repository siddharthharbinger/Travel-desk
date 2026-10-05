"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  Plane, 
  Building2, 
  Gavel, 
  ChevronDown, 
  ExternalLink 
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  // Cinematic Window Scroll Zoom:
  // Progressively zooms in as traveler scrolls down from the top,
  // stops zooming once reaching the "How it works" card,
  // and stays fixed without moving till the end of the page.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroImageRef.current) {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            // Calculate exact position of "How it works" section relative to document
            let stopScroll = 1000;
            if (howItWorksRef.current) {
              const rect = howItWorksRef.current.getBoundingClientRect();
              const howItWorksDocTop = scrollY + rect.top;
              // Stop zooming when the top of "How it works" card reaches the upper viewport (35% from top)
              stopScroll = Math.max(howItWorksDocTop - window.innerHeight * 0.35, 1);
            }

            // Progress from 0.0 (top of page) to 1.0 (How it works reached)
            const progress = Math.min(Math.max(scrollY / stopScroll, 0), 1);

            // Zoom smoothly from scale 1.0 to 1.35
            // High-resolution 4K asset (3840x2143) guarantees 100% pin-sharp clarity without any blur
            const scale = 1.0 + progress * 0.35;

            heroImageRef.current.style.transform = `translate3d(0, 0, 0) scale(${scale.toFixed(4)})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    const lower = query.toLowerCase();

    if (lower.startsWith("search flight") || lower === "flight" || lower === "flights") {
      router.push("/flights");
    } else if (lower.startsWith("find hotel") || lower === "hotel" || lower === "hotels") {
      router.push("/hotels");
    } else {
      router.push(`/visas?prompt=${encodeURIComponent(query)}`);
    }
  };

  const fillSearch = (val: string) => {
    setSearchQuery(val);
    const query = val.toLowerCase();
    if (query.includes("schengen") || query.includes("b-1")) {
      router.push("/visas");
    } else if (query.includes("flights")) {
      router.push("/flights");
    } else if (query.includes("hotels")) {
      router.push("/hotels");
    }
  };

  const toggleAccordion = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen">
      {/* CINEMATIC AIRPLANE WINDOW BACKGROUND WITH SCROLL ZOOM */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
        aria-hidden="true"
      >
        <div
          id="hero-scroll-zoom-bg"
          ref={heroImageRef}
          className="absolute inset-0 w-full h-full will-change-transform select-none"
          style={{
            transformOrigin: "center 42%",
            transform: "translate3d(0, 0, 0) scale(1)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <img
            src="/images/flight_aircraft_sunset.png"
            alt=""
            className="w-full h-full object-cover object-[center_42%] pointer-events-none"
            decoding="async"
            loading="eager"
          />
        </div>
        {/* Scrim & atmospheric gradient layers: preserve contrast, text legibility and rich deep palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071426]/75 via-[#071426]/35 to-[#071426]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#071426_92%)] pointer-events-none" />
      </div>

      {/* PAGE CONTENT CONTAINER */}
      <div className="relative z-10 flex flex-col w-full">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden">
          <div className="relative w-full overflow-hidden flex flex-col items-center justify-center">
            {/* Hero Content Container */}
            <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 flex flex-col items-center text-center">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[48px] lg:leading-[56px] text-[#d7e3fc] max-w-4xl tracking-tight mb-3 selection:bg-[#4fdbc8]/20">
                Global business mobility, effortlessly accelerated.
              </h1>

              {/* Centered Glass Search & Prompt Bar */}
              <div className="w-full max-w-3xl rounded-2xl bg-[#0b2545]/70 backdrop-blur-2xl p-3 shadow-xl border border-white/10">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 px-3 py-1 bg-[#071426]/70 rounded-xl">
                  <Search className="text-[#4fdbc8] w-[22px] h-[22px] shrink-0" />
                  <input
                    id="global-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where are you travelling? (e.g., Munich client meetings, US conference, London summit)"
                    className="w-full bg-transparent py-2.5 text-sm text-[#d7e3fc] placeholder:text-[#859490] focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Submit travel query to Visa Navigator"
                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[#4fdbc8] text-[#003731] font-semibold text-sm hover:opacity-95 transition-opacity"
                  >
                    Search
                  </button>
                </form>

                {/* Suggestion Quick Chips */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-3 px-1">
                  <span className="text-[11px] text-[#bbcac6] uppercase tracking-wider font-medium mr-1">
                    Quick Select:
                  </span>
                  <button
                    type="button"
                    onClick={() => fillSearch("Schengen business visa")}
                    className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#d7e3fc] text-xs font-semibold tracking-wide transition-colors"
                  >
                    Schengen business visa
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSearch("US B-1 visa")}
                    className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#d7e3fc] text-xs font-semibold tracking-wide transition-colors"
                  >
                    US B-1 visa
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSearch("Search flights")}
                    className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#d7e3fc] text-xs font-semibold tracking-wide transition-colors"
                  >
                    Search flights
                  </button>
                  <button
                    type="button"
                    onClick={() => fillSearch("Find hotels")}
                    className="px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#d7e3fc] text-xs font-semibold tracking-wide transition-colors"
                  >
                    Find hotels
                  </button>
                </div>
              </div>

              {/* Capability & Trust Highlights Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 max-w-2xl w-full">
                <div className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-[#4fdbc8] shrink-0" />
                  <span className="text-xs font-medium text-[#d7e3fc]">Indian Passport Calibrated</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-sm">
                  <Plane className="w-4 h-4 text-[#71f8e4] shrink-0" />
                  <span className="text-xs font-medium text-[#d7e3fc]">Schengen & US B-1 Tracks</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-sm">
                  <Building2 className="w-4 h-4 text-[#ffb957] shrink-0" />
                  <span className="text-xs font-medium text-[#d7e3fc]">Verified Corporate Review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID (4 FROSTED GLASS CARDS) */}
        <section className="w-full max-w-[1280px] mx-auto px-6 pt-2 pb-12 sm:pb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#4fdbc8] font-semibold">
                Mobility Operations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#d7e3fc] mt-1">
                Core Travel Services
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#bbcac6] max-w-md leading-relaxed">
              Structured travel workflows calibrated to Indian passport regulatory frameworks and corporate expense boundaries.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Visa Pre-Screening */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0b2545]/65 backdrop-blur-[20px] shadow-lg transition-transform hover:-translate-y-1 duration-200 border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#4fdbc8]/10 flex items-center justify-center text-[#4fdbc8] mb-5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#d7e3fc] mb-2">
                AI visa pre-screening
              </h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed mb-6">
                Answer a short interview and upload your documents. A trained reviewer checks your case.
              </p>
            </div>
            <div className="pt-4 flex items-center">
              <Link
                href="/visas"
                className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
              >
                <span>Start pre-screening</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Flight Search */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0b2545]/65 backdrop-blur-[20px] shadow-lg transition-transform hover:-translate-y-1 duration-200 border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#314769]/50 flex items-center justify-center text-[#b1c7f0] mb-5 shadow-sm">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#d7e3fc] mb-2">
                Flight search
              </h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed mb-6">
                Search flights from Mumbai or Pune on partner sites.
              </p>
            </div>
            <div className="pt-4 flex items-center">
              <Link
                href="/flights"
                className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
              >
                <span>Search flights</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Hotel Search */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0b2545]/65 backdrop-blur-[20px] shadow-lg transition-transform hover:-translate-y-1 duration-200 border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#293549] flex items-center justify-center text-[#71f8e4] mb-5 shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#d7e3fc] mb-2">
                Hotel search
              </h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed mb-6">
                Search hotels on partner sites.
              </p>
            </div>
            <div className="pt-4 flex items-center">
              <Link
                href="/hotels"
                className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
              >
                <span>Search hotels</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 4: Travel Info */}
          <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#0b2545]/65 backdrop-blur-[20px] shadow-lg transition-transform hover:-translate-y-1 duration-200 border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#e1940b]/30 flex items-center justify-center text-[#ffb957] mb-5 shadow-sm">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#d7e3fc] mb-2">
                Travel info
              </h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed mb-6">
                Guides and official links for Munich and New York.
              </p>
            </div>
            <div className="pt-4 flex items-center">
              <Link
                href="/travel-info"
                className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
              >
                <span>View travel info</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (HORIZONTAL STEPPER) */}
      <section 
        ref={howItWorksRef}
        id="how-it-works"
        className="w-full max-w-[1280px] mx-auto px-6 py-8 sm:py-10"
      >
        <div className="p-6 md:p-8 rounded-3xl bg-[#0b2545]/50 backdrop-blur-xl shadow-lg border border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-[36px] sm:leading-[44px] text-[#d7e3fc]">
                How it works
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#0f1c2e]/70 border border-white/5 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[#4fdbc8]/20 text-[#4fdbc8] text-sm flex items-center justify-center font-bold">
                  01
                </span>
              </div>
              <h3 className="font-semibold text-base text-[#d7e3fc] mb-1">Answer questions</h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed">
                Provide travel dates, destination country, purpose of visit, and passport details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#0f1c2e]/70 border border-white/5 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[#4fdbc8]/20 text-[#4fdbc8] text-sm flex items-center justify-center font-bold">
                  02
                </span>
              </div>
              <h3 className="font-semibold text-base text-[#d7e3fc] mb-1">Upload documents</h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed">
                Submit employer sponsorship letter, bank statements, itinerary, and photograph.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#0f1c2e]/70 border border-white/5 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[#4fdbc8]/20 text-[#4fdbc8] text-sm flex items-center justify-center font-bold">
                  03
                </span>
              </div>
              <h3 className="font-semibold text-base text-[#d7e3fc] mb-1">Human review</h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed">
                A dedicated Harbinger CSR audits your package for consistency and completeness.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col p-5 rounded-2xl bg-[#0f1c2e]/70 border border-white/5 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div className="flex items-center mb-4">
                <span className="h-8 w-8 rounded-full bg-[#4fdbc8]/20 text-[#4fdbc8] text-sm flex items-center justify-center font-bold">
                  04
                </span>
              </div>
              <h3 className="font-semibold text-base text-[#d7e3fc] mb-1">Next steps</h3>
              <p className="text-xs sm:text-sm text-[#bbcac6] leading-relaxed">
                Receive booking guidance, biometric appointment instructions, or interview preparation notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATION GUIDES (EXACTLY TWO DESTINATION CARDS ONLY: MUNICH & NYC) */}
      <section className="w-full max-w-[1280px] mx-auto px-6 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-[36px] sm:leading-[44px] text-[#d7e3fc]">
              Travel guides
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#bbcac6]">
            Active regional routes with dedicated pre-screening parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destination Card 1: Munich */}
          <div className="group rounded-3xl overflow-hidden bg-[#0b2545]/60 backdrop-blur-xl shadow-xl flex flex-col border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="relative h-72 w-full overflow-hidden">
              <Image
                src="/images/dest_munich.png"
                alt="Munich Marienplatz Neues Rathaus at dusk"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#030e20]/80 backdrop-blur-md border border-white/10">
                <span className="text-[11px] text-[#d7e3fc] uppercase tracking-wider font-semibold">
                  Germany • EU Schengen
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#d7e3fc] mb-2">
                  Munich Business Hub
                </h3>
                <p className="text-sm text-[#b1c7f0] leading-relaxed mb-6">
                  Schengen C Business visa rules, consulate guidance, and local transport.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <Link
                  href="/travel-info"
                  className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
                >
                  <span>View travel guide</span>
                  <ArrowRight className="w-[18px] h-[18px] ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Destination Card 2: New York */}
          <div className="group rounded-3xl overflow-hidden bg-[#0b2545]/60 backdrop-blur-xl shadow-xl flex flex-col border border-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="relative h-72 w-full overflow-hidden">
              <Image
                src="/images/dest_newyork.png"
                alt="New York Manhattan skyline illuminated at dusk"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#030e20]/80 backdrop-blur-md border border-white/10">
                <span className="text-[11px] text-[#d7e3fc] uppercase tracking-wider font-semibold">
                  United States • ESTA/B-1
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#d7e3fc] mb-2">
                  New York Corporate Hub
                </h3>
                <p className="text-sm text-[#b1c7f0] leading-relaxed mb-6">
                  US B-1 business visitor criteria and entry checklist.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <Link
                  href="/visas"
                  className="inline-flex items-center text-[#4fdbc8] hover:text-[#71f8e4] transition-colors font-semibold text-sm group/link"
                >
                  <span>View travel guide</span>
                  <ArrowRight className="w-[18px] h-[18px] ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ TEASER (CLEAN ACCORDION) */}
      <section className="w-full max-w-[1000px] mx-auto px-6 py-8 sm:py-10">
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#4fdbc8] font-semibold">
            Assistance &amp; Clarity
          </span>
          <h2 className="font-serif text-3xl sm:text-[36px] sm:leading-[44px] text-[#d7e3fc] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#bbcac6] mt-2">
            Specific answers regarding pre-screening processing times, ticket issuance, and consulate readiness.
          </p>
        </div>

        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <div className="rounded-2xl bg-[#0b2545]/60 backdrop-blur-xl overflow-hidden shadow-sm border border-white/5">
            <button
              type="button"
              onClick={() => toggleAccordion(1)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-base text-[#d7e3fc] font-medium pr-4">
                Which visa categories are supported for Harbinger employees?
              </span>
              <ChevronDown
                className={`text-[#4fdbc8] w-5 h-5 shrink-0 transition-transform duration-200 ${
                  openFaq === 1 ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFaq === 1 && (
              <div className="px-6 pb-5 pt-1 text-[#bbcac6] text-sm leading-relaxed border-t border-white/5">
                We currently provide pre-screening for Schengen Short-Stay Business Visas (Type C) and US B-1 Business Visitor visas. Information on H-1B and L-1 work authorizations is available under Travel Info. Official visa policies can be confirmed via{" "}
                <a
                  className="text-[#4fdbc8] underline inline-flex items-center gap-0.5 hover:text-[#71f8e4]"
                  href="https://eur-lex.europa.eu"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  See official source <ExternalLink className="w-3.5 h-3.5 ml-0.5 inline" />
                </a>
                .
              </div>
            )}
          </div>

          {/* FAQ Item 2 */}
          <div className="rounded-2xl bg-[#0b2545]/60 backdrop-blur-xl overflow-hidden shadow-sm border border-white/5">
            <button
              type="button"
              onClick={() => toggleAccordion(2)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-base text-[#d7e3fc] font-medium pr-4">
                Can I book flights and hotels directly within TravelDesk?
              </span>
              <ChevronDown
                className={`text-[#4fdbc8] w-5 h-5 shrink-0 transition-transform duration-200 ${
                  openFaq === 2 ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFaq === 2 && (
              <div className="px-6 pb-5 pt-1 text-[#bbcac6] text-sm leading-relaxed border-t border-white/5">
                TravelDesk acts as a pre-screening and search hub. Once your travel requirements are defined, you can seamlessly redirect to our approved booking partners including ixigo, MakeMyTrip, and Booking.com.
              </div>
            )}
          </div>

          {/* FAQ Item 3 */}
          <div className="rounded-2xl bg-[#0b2545]/60 backdrop-blur-xl overflow-hidden shadow-sm border border-white/5">
            <button
              type="button"
              onClick={() => toggleAccordion(3)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-base text-[#d7e3fc] font-medium pr-4">
                How long does the internal pre-screening review take?
              </span>
              <ChevronDown
                className={`text-[#4fdbc8] w-5 h-5 shrink-0 transition-transform duration-200 ${
                  openFaq === 3 ? "rotate-180" : ""
                }`}
              />
            </button>
            {openFaq === 3 && (
              <div className="px-6 pb-5 pt-1 text-[#bbcac6] text-sm leading-relaxed border-t border-white/5">
                Submissions are reviewed by internal corporate mobility coordinators within 24–48 business hours prior to external consular submission.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARD */}
      <section className="w-full max-w-[1280px] mx-auto px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#0b2545]/80 backdrop-blur-2xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4fdbc8]/10 text-[#4fdbc8] text-[11px] font-semibold uppercase mb-3">
              <Plane className="w-4 h-4" />
              <span>Harbinger Mobility Office</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-[36px] sm:leading-[44px] text-[#d7e3fc] tracking-tight">
              Ready to prepare your international travel?
            </h2>
            <p className="text-sm text-[#b1c7f0] mt-2 leading-relaxed">
              Verify your passport timeline, evaluate consulate checklist readiness, and connect to certified booking tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/visas"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#14b8a6] text-[#00423b] font-semibold text-sm hover:brightness-110 active:scale-95 transition-all text-center shadow-lg"
            >
              Start Pre-Screening
            </Link>
            <Link
              href="/travel-info"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#d7e3fc] font-semibold text-sm transition-colors text-center border border-white/5"
            >
              Browse Travel Info
            </Link>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
