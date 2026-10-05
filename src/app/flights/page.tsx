"use client";

import React, { useState, useMemo } from "react";
import { 
  Plane, 
  Calendar, 
  MapPin, 
  SlidersHorizontal, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  ArrowRightLeft,
  Briefcase,
  AlertTriangle
} from "lucide-react";
import { RedirectModal } from "@/components/RedirectModal";

// Verified partner search URLs (no invented deep-links)
const PARTNERS = [
  {
    id: "ixigo",
    name: "ixigo Corporate",
    category: "Indian Corporate Corridors & Low-Fare Aggregation",
    badge: "Harbinger Recommended",
    url: "https://www.ixigo.com/flights",
    description: "Preferred engine for Indian origin departures (BOM / PNQ). Displays airline-direct corporate fares with verified baggage allowances.",
    features: ["Non-stop European routes", "Direct corporate billing invoice", "Transparent baggage breakdown"],
  },
  {
    id: "makemytrip",
    name: "MakeMyTrip Business",
    category: "Global Flight Aggregation & Corporate Desk",
    badge: "Certified Partner",
    url: "https://www.makemytrip.com/flights/",
    description: "Comprehensive multi-airline international itineraries connecting India with Germany (Lufthansa, Air India) and the United States (United, Emirates, Qatar Airways).",
    features: ["Split-ticket protection", "Multi-city corporate itineraries", "GST-compliant tax invoices"],
  },
  {
    id: "google_flights",
    name: "Google Flights",
    category: "Unbiased Comprehensive Fare & Schedule Matrix",
    badge: "Official Global Matrix",
    url: "https://www.google.com/travel/flights",
    description: "Independent schedule comparator. Use to verify historical on-time arrival records, aircraft model, seat pitch, and carbon emission metrics.",
    features: ["Direct airline re-routing", "Historical flight delay matrix", "Carbon emissions comparative tracking"],
  },
];

const AIRPORTS = [
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj Int'l (T2)", country: "India" },
  { code: "PNQ", city: "Pune", airport: "Pune Lohegaon Airport", country: "India" },
  { code: "DEL", city: "New Delhi", airport: "Indira Gandhi Int'l (T3)", country: "India" },
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda Int'l (T2)", country: "India" },
  { code: "MUC", city: "Munich", airport: "Franz Josef Strauss (T2)", country: "Germany" },
  { code: "FRA", city: "Frankfurt", airport: "Frankfurt Rhein-Main (T1)", country: "Germany" },
  { code: "JFK", city: "New York", airport: "John F. Kennedy Int'l", country: "United States" },
  { code: "EWR", city: "Newark", airport: "Newark Liberty Int'l", country: "United States" },
];

export default function FlightsPage() {
  // Compute default relative dates: Departure = today + 25 days, Return = departure + 14 days
  const defaultDates = useMemo(() => {
    const today = new Date();
    
    const dep = new Date(today);
    dep.setDate(dep.getDate() + 25);
    
    const ret = new Date(dep);
    ret.setDate(ret.getDate() + 14);

    return {
      todayStr: today.toISOString().split("T")[0],
      depStr: dep.toISOString().split("T")[0],
      retStr: ret.toISOString().split("T")[0],
      depFormatted: dep.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      retFormatted: ret.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  }, []);

  const [origin, setOrigin] = useState("BOM");
  const [destination, setDestination] = useState("MUC");
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [departureDate, setDepartureDate] = useState(defaultDates.depStr);
  const [returnDate, setReturnDate] = useState(defaultDates.retStr);
  const [cabinClass, setCabinClass] = useState("economy");
  const [passengers, setPassengers] = useState(1);
  const [showModifySearch, setShowModifySearch] = useState(false);

  // Modal State
  const [selectedPartner, setSelectedPartner] = useState<(typeof PARTNERS)[0] | null>(null);

  const originAirport = AIRPORTS.find((a) => a.code === origin) || AIRPORTS[0];
  const destAirport = AIRPORTS.find((a) => a.code === destination) || AIRPORTS[4];

  const handleOpenRedirect = (partner: (typeof PARTNERS)[0]) => {
    setSelectedPartner(partner);
  };

  const handleCloseRedirect = () => {
    setSelectedPartner(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Corporate Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] border border-[var(--brand-teal)]/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>HARBINGER MOBILITY & EXPENSE DESK</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--foreground)] tracking-tight">
            Corporate Flight Dispatch Hub
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-2xl">
            Search commercial corridors connecting Indian corporate hubs (Mumbai/Pune) with European and North American destinations. Zero markup search-and-redirect with statutory transit validation.
          </p>
        </div>

        {/* Action Toggle */}
        <button
          onClick={() => setShowModifySearch(!showModifySearch)}
          id="modify-flight-search-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] hover:bg-[var(--glass-fill-hover)] text-sm font-medium text-[var(--foreground)] transition-colors self-start md:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--brand-teal)]" />
          <span>{showModifySearch ? "Close Search Parameters" : "Modify Search Parameters"}</span>
        </button>
      </div>

      {/* Summary Header Pill Strip (matching reference screen layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Origin & Destination */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Origin & Destination
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {origin} → {destination}
            </div>
            <span className="text-xs text-[var(--foreground-muted)] truncate block">
              {originAirport.city} to {destAirport.city}
            </span>
          </div>
        </div>

        {/* Travel Window */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Travel Window
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {departureDate} {tripType === "round" ? `→ ${returnDate}` : ""}
            </div>
            <span className="text-xs text-[var(--foreground-muted)] block">
              {tripType === "round" ? "Round Trip" : "One-Way Itinerary"}
            </span>
          </div>
        </div>

        {/* Corporate Account */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-navy)]/15 dark:bg-[var(--brand-teal)]/15 text-[var(--brand-navy)] dark:text-[var(--brand-teal)] flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Corporate Account
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {passengers} Traveller(s)
            </div>
            <span className="text-xs text-[var(--brand-teal)] block">
              Harbinger Tier 1 Protocol
            </span>
          </div>
        </div>

        {/* Permitted Classes */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Permitted Classes
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate capitalize">
              {cabinClass} Class
            </div>
            <span className="text-xs text-[var(--foreground-muted)] block">
              In-Policy §14-Exception A
            </span>
          </div>
        </div>
      </div>

      {/* Expandable / Collapsible Search Form */}
      {showModifySearch && (
        <div className="glass-panel p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Configure Corporate Itinerary & Route
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTripType("round")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tripType === "round"
                    ? "bg-[var(--brand-teal)] text-[#071426] font-semibold"
                    : "bg-[var(--glass-fill)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Round Trip
              </button>
              <button
                type="button"
                onClick={() => setTripType("oneway")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tripType === "oneway"
                    ? "bg-[var(--brand-teal)] text-[#071426] font-semibold"
                    : "bg-[var(--glass-fill)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                One-Way
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origin Airport */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Origin City / Airport
              </label>
              <select
                id="flight-origin-select"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              >
                {AIRPORTS.filter((a) => a.country === "India").map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code}) - {a.airport}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Airport */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Destination City / Airport
              </label>
              <select
                id="flight-destination-select"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              >
                {AIRPORTS.filter((a) => a.country !== "India").map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code}) - {a.airport}
                  </option>
                ))}
              </select>
            </div>

            {/* Departure Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Departure Date (Min: Today)
              </label>
              <input
                type="date"
                id="flight-departure-date"
                min={defaultDates.todayStr}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              />
            </div>

            {/* Return Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Return Date {tripType === "oneway" && "(Disabled for One-Way)"}
              </label>
              <input
                type="date"
                id="flight-return-date"
                disabled={tripType === "oneway"}
                min={departureDate || defaultDates.todayStr}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] ${
                  tripType === "oneway" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Cabin Class Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Authorized Cabin Class
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "economy", label: "Economy", note: "Standard policy" },
                  { id: "premium", label: "Prem Economy", note: "Flights > 8h" },
                  { id: "business", label: "Business", note: "VP Pre-approval" },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCabinClass(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      cabinClass === c.id
                        ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/10 text-[var(--foreground)]"
                        : "border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <div className="text-xs font-semibold">{c.label}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">{c.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Passenger Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Corporate Travellers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              >
                <option value={1}>1 Corporate Traveller (Employee)</option>
                <option value={2}>2 Travellers (Employee + Colleague)</option>
                <option value={3}>3 Travellers (Project Team Delegation)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Transit Advisory Banner (crucial for Indian passport business travelers) */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2.5 font-semibold text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Statutory Airport Transit & Visa Advisory (Indian Passport Holders)</span>
        </div>
        <div className="text-xs text-[var(--foreground-muted)] leading-relaxed space-y-1.5 pl-7">
          <p>
            <strong>UK Airport Transit (London Heathrow / Gatwick):</strong> Indian passport holders changing flights airside in the UK require a Direct Airside Transit Visa (DATV) unless holding an eligible exemption (such as a valid US visa or valid Schengen Type D national visa).
          </p>
          <p>
            <strong>Dual-Schengen Airport Transit:</strong> If your route connects between two airports within the Schengen zone (e.g., BOM → Frankfurt → Munich), the second leg is an internal Schengen flight. You <em>must</em> hold a valid Schengen C Business or D National visa to clear border control at the first port of entry.
          </p>
        </div>
      </div>

      {/* Search & Redirect Partner Dispatch Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Authorized Corporate Booking Engines
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              Select a verified partner to initiate search with zero markup. A redirection notice will verify your routing parameters before leaving TravelDesk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="glass-panel p-6 flex flex-col justify-between space-y-6 hover:border-[var(--brand-teal)]/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]">
                    {partner.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-[var(--foreground-muted)]" />
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--foreground)]">
                    {partner.name}
                  </h3>
                  <span className="text-xs font-medium text-[var(--brand-teal)]">
                    {partner.category}
                  </span>
                </div>

                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {partner.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                  {partner.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                id={`search-flights-${partner.id}-btn`}
                onClick={() => handleOpenRedirect(partner)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand-teal)] text-[#071426] text-xs font-semibold hover:bg-[var(--brand-teal-hover)] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Search Flights on {partner.name.split(" ")[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Travel Governance & Expense Rules */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[var(--brand-teal)]" />
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Harbinger Corporate Travel Policy §14 (Air Travel Compliance)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[var(--foreground-muted)] leading-relaxed pt-2">
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--glass-fill-nested)] border border-[var(--glass-border)]">
            <h4 className="font-semibold text-[var(--foreground)]">1. Flight Duration & Cabin Tier</h4>
            <p>
              Journeys under 8 continuous flight hours are restricted to Economy. Premium Economy is permissible on non-stop intercontinental routes exceeding 8 hours (e.g. BOM-MUC / BOM-FRA). Business Class requires VP of Mobility authorization.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--glass-fill-nested)] border border-[var(--glass-border)]">
            <h4 className="font-semibold text-[var(--foreground)]">2. Checked Baggage Compliance</h4>
            <p>
              Corporate bookings must include at least one checked bag (23 kg / 50 lbs minimum). Employees should not purchase unbundled &ldquo;hand-baggage only&rdquo; fares on long-haul routes to prevent excess baggage surcharge claims.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--glass-fill-nested)] border border-[var(--glass-border)]">
            <h4 className="font-semibold text-[var(--foreground)]">3. Invoicing & GST Credit</h4>
            <p>
              Select airline-direct or corporate agency invoicing to include Harbinger Group&apos;s corporate GSTIN/VAT registration on all airline tickets. Keep e-tickets and boarding passes for expense audit reconciliation.
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Redirect Modal */}
      {selectedPartner && (
        <RedirectModal
          isOpen={!!selectedPartner}
          onClose={handleCloseRedirect}
          partnerName={selectedPartner.name}
          partnerUrl={selectedPartner.url}
          category="flight"
          searchSummary={{
            origin: `${originAirport.city} (${origin})`,
            destination: `${destAirport.city} (${destination})`,
            dates: tripType === "round" ? `${departureDate} to ${returnDate}` : `${departureDate} (One-Way)`,
            classOrGuests: `${cabinClass.toUpperCase()} Class · ${passengers} Traveller(s)`,
          }}
        />
      )}
    </div>
  );
}
