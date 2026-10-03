"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Building2, 
  Plane, 
  FileCheck2,
  FileText,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [promptText, setPromptText] = useState("");

  const scopeRef = useRef<HTMLDivElement>(null);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const windowCanvasRef = useRef<HTMLDivElement>(null);
  const windowContainerRef = useRef<HTMLDivElement>(null);
  const skyLayerRef = useRef<HTMLDivElement>(null);

  // Cinematic Window Scroll Zoom Effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateZoom);
        ticking = true;
      }
    };

    const updateZoom = () => {
      const scope = scopeRef.current;
      const windowCanvas = windowCanvasRef.current;
      const windowContainer = windowContainerRef.current;
      const skyLayer = skyLayerRef.current;
      const stickyStage = stickyStageRef.current;

      if (!scope || !windowCanvas || !windowContainer || !skyLayer) {
        ticking = false;
        return;
      }

      const rect = scope.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDistance = rect.height - viewportHeight;
      const currentScroll = Math.max(0, -rect.top);
      const progress = Math.min(Math.max(currentScroll / Math.max(totalDistance * 0.7, 1), 0), 1);

      // Scale zoom from 1.0 to 3.85 into window center
      const scale = 1.0 + progress * 2.85;
      windowCanvas.style.transform = `scale(${scale.toFixed(3)})`;

      // Fade cabin window frame out smoothly
      const windowOpacity = Math.max(0, 1 - progress * 1.35);
      windowContainer.style.opacity = windowOpacity.toFixed(3);

      // Sunset clouds expand and brighten under frosted glass cards
      const cloudOpacity = Math.min(0.85, 0.15 + progress * 0.7);
      skyLayer.style.opacity = cloudOpacity.toFixed(3);

      // Deactivate sticky stage when scrolled past hero scope
      if (stickyStage) {
        if (rect.bottom < 0) {
          stickyStage.style.display = "none";
        } else {
          stickyStage.style.display = "block";
        }
      }

      ticking = false;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateZoom();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promptText.trim();
    if (!query) {
      window.location.href = "/visas";
      return;
    }
    window.location.href = `/visas?prompt=${encodeURIComponent(query)}`;
  };

  const suggestionChips = [
    { label: "Schengen Business Visa (Germany)", query: "Attending business client meetings in Munich Germany" },
    { label: "US B-1 Conference Visa", query: "Attending annual developer tech conference in New York" },
    { label: "Mumbai to Frankfurt Corridor", query: "Corporate travel from Mumbai to Frankfurt for executive meetings" },
    { label: "Munich Business Accommodations", query: "Hotel near German consulate in Munich" },
  ];

  return (
    <div className="space-y-24 py-4">
      {/* SCROLL-ZOOM CONTAINER: Wraps Hero and Integrated Mobility Services in continuous atmospheric depth */}
      <div ref={scopeRef} className="relative w-full" id="cinematic-zoom-scope">
        {/* Fixed Viewport Stage (Pinned during scroll) */}
        <div 
          ref={stickyStageRef} 
          className="fixed inset-0 overflow-hidden pointer-events-none -z-10" 
          id="cinematic-sticky-stage"
        >
          {/* Layer 1: Sunset Cloud Expansion Layer */}
          <div 
            ref={skyLayerRef} 
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none" 
            id="zoom-sky-layer" 
            style={{ opacity: 0.15 }}
          >
            {/* Ambient sunset sky backdrop */}
            <img 
              alt="Sunset sky expansion" 
              className="w-full h-full object-cover object-center scale-110 filter brightness-95 saturate-125" 
              src="/images/flight_aircraft_sunset.png" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--canvas-bg)]/60 via-[var(--surface-container-low)]/40 to-[var(--canvas-bg)]/90" />
            <div 
              className="absolute inset-0" 
              style={{
                background: "radial-gradient(circle at 50% 30%, rgba(245, 165, 36, 0.18) 0%, rgba(139, 92, 246, 0.20) 40%, transparent 100%)"
              }} 
            />
          </div>

          {/* Layer 2: Airplane Window Frame & Cabin Zoom Element */}
          <div 
            ref={windowContainerRef} 
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none" 
            id="zoom-window-container"
          >
            <div 
              ref={windowCanvasRef} 
              className="w-full h-full zoom-canvas relative" 
              id="zoom-window-canvas" 
              style={{ transform: "scale(1.0)" }}
            >
              <img 
                alt="Cinematic aircraft window view" 
                className="w-full h-full object-cover object-center" 
                src="/images/flight_aircraft_sunset.png" 
              />
              {/* Atmospheric overlay to blend with current theme */}
              <div 
                className="absolute inset-0" 
                style={{
                  background: "linear-gradient(180deg, rgba(7, 20, 38, 0.82) 0%, rgba(7, 20, 38, 0.90) 65%, rgba(0, 19, 46, 0.98) 100%)"
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-teal)]/10 via-[var(--brand-amber)]/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Hero Content Section */}
        <section className="relative z-10 px-4 sm:px-6 max-w-5xl mx-auto text-center pt-8 sm:pt-16 pb-12">
          {/* Floating Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--brand-teal)]/30 bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harbinger Enterprise Mobility · AI-Assisted Pre-Screening with Human Review</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[var(--foreground)] leading-[1.15] max-w-3xl mx-auto mb-6">
            Global business mobility,{" "}
            <span className="italic font-serif bg-gradient-to-r from-[var(--brand-teal)] via-[var(--foreground)] to-[var(--brand-amber)] bg-clip-text text-transparent">
              effortlessly accelerated.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            Streamline statutory visa pre-screening, consular readiness checks, and business itinerary search with intelligent workflows verified by trained corporate specialists.
          </p>

          {/* Central Stitch-Style Prompt Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form 
              onSubmit={handlePromptSubmit}
              className="glass-panel p-2 pl-4 flex items-center gap-2 shadow-2xl border border-[var(--glass-border)] glow-ring-active focus-within:border-[var(--brand-teal)] transition-all"
            >
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Where are you travelling, and why? (e.g., Attending Tech Summit in Munich...)"
                className="flex-1 bg-transparent border-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
                aria-label="Submit travel query to Visa Navigator"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-[11px] text-[var(--foreground-subtle)] font-medium">Quick suggestions:</span>
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptText(chip.query);
                    router.push(`/visas?prompt=${encodeURIComponent(chip.query)}`);
                  }}
                  className="px-2.5 py-1 rounded-full text-xs border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground-muted)] hover:text-[var(--brand-teal)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)]"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Integrated Corporate Mobility Services Grid (Stitch 2026 Core Capabilities) */}
        <section className="relative z-10 px-4 sm:px-6 max-w-7xl mx-auto pt-8 pb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-teal)] mb-1">
                Integrated Corporate Mobility Services
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--foreground)]">
                Enterprise Travel & Compliance Infrastructure
              </h2>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] max-w-md">
              Synchronized compliance assessment, itinerary intelligence, and accommodations tailored for executive travel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: AI Visa Pre-Screening */}
            <Link 
              href="/visas" 
              className="glass-card p-6 flex flex-col justify-between group cursor-pointer border border-[var(--glass-border)] hover:border-[var(--brand-teal)]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--brand-teal)] transition-colors">
                    AI Visa Pre-Screening
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    Rule-driven assessment for Schengen & U.S. business visas with statutory readiness scoring and checklist generation.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-[var(--brand-teal)]">
                <span>Evaluate Category</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Corporate Flight Comparison */}
            <Link 
              href="/flights" 
              className="glass-card p-6 flex flex-col justify-between group cursor-pointer border border-[var(--glass-border)] hover:border-[var(--brand-teal)]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--brand-amber)] transition-colors">
                    Flight Comparison
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    Direct and 1-stop corporate routing between BOM/DEL/BLR and key European/U.S. hubs via trusted partner search hubs.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-[var(--brand-amber)]">
                <span>Search Routes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Embassy-Proximity Accommodations */}
            <Link 
              href="/hotels" 
              className="glass-card p-6 flex flex-col justify-between group cursor-pointer border border-[var(--glass-border)] hover:border-[var(--brand-teal)]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-purple-400 transition-colors">
                    Hotel Stays
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    Executive hotels situated near consular offices and financial centers, aligned with corporate travel allowances.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-purple-400">
                <span>View Accommodations</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Destination Advisories */}
            <Link 
              href="/travel-info" 
              className="glass-card p-6 flex flex-col justify-between group cursor-pointer border border-[var(--glass-border)] hover:border-[var(--brand-teal)]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-blue-400 transition-colors">
                    Travel Advisory
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    Verified consular timelines, statutory passport rules, and transit advisories with direct official government links.
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold text-blue-400">
                <span>Explore Dossiers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Popular Business Corridors (High-Frequency Gateways) */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-teal)] mb-1">
              High-Frequency Gateways
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--foreground)]">
              Key Corporate Corridors
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              Factual entry requirements and consular dossiers for high-frequency business travel hubs.
            </p>
          </div>
          <Link
            href="/travel-info"
            className="text-xs font-semibold text-[var(--brand-teal)] hover:underline inline-flex items-center gap-1"
          >
            <span>Explore all destination dossiers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Corridor 1: Munich */}
          <div className="glass-card overflow-hidden group flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src="/images/dest_munich.png"
                  alt="Munich Marienplatz"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                    Schengen · Germany
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                  Munich Executive
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Short-stay Schengen Business (C) processing for meetings and industrial trade fairs.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--foreground-subtle)]">3-mo validity rule</span>
                <Link
                  href="/visas?prompt=Munich%20Germany%20client%20meetings"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Pre-Screen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Corridor 2: Frankfurt */}
          <div className="glass-card overflow-hidden group flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src="/images/dest_frankfurt.png"
                  alt="Frankfurt skyline with river Main"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                    Schengen · Germany
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                  Frankfurt Financial
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Primary corporate transit and banking gateway with Lufthansa direct connectivity from BOM.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--foreground-subtle)]">Direct flight hub</span>
                <Link
                  href="/visas?prompt=Frankfurt%20Germany%20corporate%20meetings"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Pre-Screen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Corridor 3: New York */}
          <div className="glass-card overflow-hidden group flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src="/images/dest_newyork.png"
                  alt="Lower Manhattan Skyline"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                    United States · B-1 / H-1B
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                  New York Tri-State
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  U.S. B-1 business visitor consultations and specialty occupation immigration pre-checks.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--foreground-subtle)]">Six-Month Club exempt</span>
                <Link
                  href="/visas?prompt=New%20York%20City%20corporate%20tech%20conference"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Pre-Screen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Corridor 4: Paris */}
          <div className="glass-card overflow-hidden group flex flex-col justify-between">
            <div>
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src="/images/dest_paris.png"
                  alt="Paris European city dusk"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-bg)] via-[var(--canvas-bg)]/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--canvas-bg)]/80 backdrop-blur-md text-[var(--brand-teal)] border border-[var(--glass-border)]">
                    Schengen · France
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">
                  Paris European Hub
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Key Western European headquarters corridor. Direct connectivity and bilateral trade meetings.
                </p>
              </div>
            </div>
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[var(--foreground-subtle)]">Consular pre-check</span>
                <Link
                  href="/visas?prompt=Paris%20France%20executive%20symposium"
                  className="inline-flex items-center gap-1 font-semibold text-[var(--brand-teal)] hover:underline"
                >
                  <span>Pre-Screen</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars (Engineered for Compliance & Trust) */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-teal)] mb-1">
            Deterministic Verification
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[var(--foreground)] mb-2">
            Engineered for Compliance & Trust
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            A deterministic, audit-logged workflow designed for corporate travellers and enterprise reviewers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">1. Visa Navigator</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Answer rule-driven questions to determine statutory requirements, consular timelines, and verified official government links.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">2. Document Validation</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Upload required checklists with server-side magic byte inspection, 10 MB limits, and isolated secure volume storage.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">3. Trained CSR Review</h3>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              Every filing is audited by trained human specialists before submission to official consular portals. AI assists; humans decide.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Search & Hub Strip */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="glass-panel p-8 text-center space-y-6 border border-[var(--glass-border)]">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl font-medium text-[var(--foreground)]">
              Search and Book on Trusted Partner Portals
            </h2>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              TravelDesk provides search redirection with prefilled business routes. All ticket purchases and bookings are completed directly on partner platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm"
            >
              <Plane className="w-4 h-4" />
              <span>Search Flights (BOM / PNQ)</span>
            </Link>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-[var(--foreground)] transition-colors"
            >
              <Building2 className="w-4 h-4 text-[var(--brand-amber)]" />
              <span>Search Accommodations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
