"use client";

import React, { useState, useMemo } from "react";
import { 
  Building2, 
  Calendar, 
  MapPin, 
  SlidersHorizontal, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Briefcase,
  AlertCircle,
  Receipt
} from "lucide-react";
import { RedirectModal } from "@/components/RedirectModal";

const HOTEL_PARTNERS = [
  {
    id: "booking",
    name: "Booking.com for Business",
    category: "European & Global Accommodation Inventory",
    badge: "Harbinger Recommended",
    url: "https://www.booking.com",
    description: "Extensive verified hotel network across Munich, Frankfurt, and New York. Features corporate rate filters with free cancellation policies.",
    features: ["Consulate-adjacent inventory", "Free cancellation options", "Itemized VAT receipts"],
  },
  {
    id: "makemytrip_hotels",
    name: "MakeMyTrip Corporate Stays",
    category: "Direct Corporate Invoicing & Indian Aggregation",
    badge: "Certified Partner",
    url: "https://www.makemytrip.com/hotels/",
    description: "Seamless business stays with domestic corporate billing integration and Indian corporate GST credit documentation.",
    features: ["GST invoice compliance", "Early check-in corporate flags", "Direct debit corporate accounts"],
  },
  {
    id: "agoda",
    name: "Agoda Business",
    category: "Flexible Urban Lodging & Long-Stay Inventory",
    badge: "Verified Global Partner",
    url: "https://www.agoda.com",
    description: "Preferred for extended business delegations and corporate serviced apartments near European commercial districts and Midtown Manhattan.",
    features: ["Extended-stay corporate rates", "Instant confirmation vouchers", "Zero booking fees"],
  },
];

const DESTINATIONS = [
  {
    id: "MUC",
    city: "Munich",
    country: "Germany",
    capPerNight: "€180 / night",
    consulateProximity: "Near VFS Global Munich / Karlsplatz / Hauptbahnhof",
    policyTier: "Tier 1 Western Europe",
  },
  {
    id: "NYC",
    city: "New York City",
    country: "United States",
    capPerNight: "$250 / night",
    consulateProximity: "Near Consulate General of India / Midtown Manhattan",
    policyTier: "Tier 1 US Metro",
  },
  {
    id: "FRA",
    city: "Frankfurt",
    country: "Germany",
    capPerNight: "€175 / night",
    consulateProximity: "Near Frankfurt Messe / Main Train Station",
    policyTier: "Tier 1 Western Europe",
  },
  {
    id: "PNQ",
    city: "Pune",
    country: "India",
    capPerNight: "₹6,000 / night",
    consulateProximity: "Near Harbinger HQ, Magarpatta Cybercity / Hinjawadi",
    policyTier: "Domestic Corporate Campus",
  },
];

export default function HotelsPage() {
  const defaultDates = useMemo(() => {
    const today = new Date();
    
    const checkIn = new Date(today);
    checkIn.setDate(checkIn.getDate() + 25);
    
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 7);

    return {
      todayStr: today.toISOString().split("T")[0],
      checkInStr: checkIn.toISOString().split("T")[0],
      checkOutStr: checkOut.toISOString().split("T")[0],
    };
  }, []);

  const [destinationId, setDestinationId] = useState("MUC");
  const [checkInDate, setCheckInDate] = useState(defaultDates.checkInStr);
  const [checkOutDate, setCheckOutDate] = useState(defaultDates.checkOutStr);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [showModifySearch, setShowModifySearch] = useState(false);

  // Modal State
  const [selectedPartner, setSelectedPartner] = useState<(typeof HOTEL_PARTNERS)[0] | null>(null);

  const currentDestination = DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Corporate Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[var(--brand-amber)]/10 text-[var(--brand-amber)] border border-[var(--brand-amber)]/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>HARBINGER CORPORATE LODGING & EXPENSE DESK</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--foreground)] tracking-tight">
            Corporate Accommodation Dispatch Hub
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1 max-w-2xl">
            Search verified corporate stays with strict policy expense caps and consulate proximity in Munich, Frankfurt, New York, and Pune. Zero markup search-and-redirect.
          </p>
        </div>

        {/* Action Toggle */}
        <button
          onClick={() => setShowModifySearch(!showModifySearch)}
          id="modify-hotel-search-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] text-sm font-medium text-[var(--foreground)] transition-colors self-start md:self-auto"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--brand-teal)]" />
          <span>{showModifySearch ? "Close Lodging Parameters" : "Modify Lodging Parameters"}</span>
        </button>
      </div>

      {/* Summary Header Pill Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Destination City */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-amber)]/15 text-[var(--brand-amber)] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Destination City
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {currentDestination.city}, {currentDestination.country}
            </div>
            <span className="text-xs text-[var(--foreground-muted)] truncate block">
              {currentDestination.policyTier}
            </span>
          </div>
        </div>

        {/* Stay Dates */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Stay Window
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {checkInDate} → {checkOutDate}
            </div>
            <span className="text-xs text-[var(--foreground-muted)] block">
              Verified Corporate Travel Window
            </span>
          </div>
        </div>

        {/* Daily Expense Cap */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Policy Rate Cap
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              Max {currentDestination.capPerNight}
            </div>
            <span className="text-xs text-[var(--foreground-muted)] block">
              Inclusive of standard room taxes
            </span>
          </div>
        </div>

        {/* Accommodations Room */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-navy)]/15 dark:bg-[var(--brand-teal)]/15 text-[var(--brand-navy)] dark:text-[var(--brand-teal)] flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider block">
              Room Allocation
            </span>
            <div className="font-semibold text-sm text-[var(--foreground)] truncate">
              {rooms} Room(s) · {guests} Guest(s)
            </div>
            <span className="text-xs text-[var(--brand-teal)] block">
              Single Occupancy Standard
            </span>
          </div>
        </div>
      </div>

      {/* Expandable / Collapsible Search Form */}
      {showModifySearch && (
        <div className="glass-panel p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="border-b border-[var(--border)] pb-4">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Configure Hotel Location & Stay Requirements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Target Business Destination
              </label>
              <select
                id="hotel-destination-select"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.city}, {d.country} ({d.capPerNight})
                  </option>
                ))}
              </select>
            </div>

            {/* Check-In Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Check-in Date
              </label>
              <input
                type="date"
                id="hotel-checkin-date"
                min={defaultDates.todayStr}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              />
            </div>

            {/* Check-Out Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Check-out Date
              </label>
              <input
                type="date"
                id="hotel-checkout-date"
                min={checkInDate || defaultDates.todayStr}
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              />
            </div>

            {/* Guests & Rooms */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground-muted)]">
                Room & Guests
              </label>
              <select
                value={`${rooms}-${guests}`}
                onChange={(e) => {
                  const [r, g] = e.target.value.split("-").map(Number);
                  setRooms(r);
                  setGuests(g);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
              >
                <option value="1-1">1 Room · 1 Guest (Single Employee)</option>
                <option value="2-2">2 Rooms · 2 Guests (Separate Rooms)</option>
                <option value="1-2">1 Room · 2 Guests (Shared Room)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Consulate & Safety Advisory Box */}
      <div className="p-5 rounded-2xl bg-[var(--background-muted)]/60 border border-[var(--border)] space-y-2">
        <div className="flex items-center gap-2.5 font-semibold text-sm text-[var(--foreground)]">
          <MapPin className="w-5 h-5 text-[var(--brand-teal)] shrink-0" />
          <span>Consulate & Corporate Office Proximity Advisory for {currentDestination.city}</span>
        </div>
        <div className="text-xs text-[var(--foreground-muted)] leading-relaxed space-y-1.5 pl-7">
          <p>
            <strong>Recommended Zone:</strong> {currentDestination.consulateProximity}.
          </p>
          <p>
            <strong>Harbinger Security Requirement:</strong> Properties booked must provide 24/7 staffed front-desk security, interior corridor room access, and secure Wi-Fi for corporate VPN connectivity.
          </p>
        </div>
      </div>

      {/* Booking Partner Dispatch Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Authorized Corporate Lodging Providers
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              Select an approved accommodation search engine. A redirection notice will verify your destination and expense cap criteria.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOTEL_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="glass-panel p-6 flex flex-col justify-between space-y-6 hover:border-[var(--brand-amber)]/40 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--brand-amber)]/15 text-[var(--brand-amber)]">
                    {partner.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-[var(--foreground-muted)]" />
                </div>

                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--foreground)]">
                    {partner.name}
                  </h3>
                  <span className="text-xs font-medium text-[var(--brand-amber)]">
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
                id={`search-hotels-${partner.id}-btn`}
                onClick={() => setSelectedPartner(partner)}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--brand-teal)] text-white text-xs font-semibold hover:bg-[var(--brand-teal-light)] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Search Hotels on {partner.name.split(" ")[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Lodging Policy §18 */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[var(--brand-teal)]" />
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Harbinger Corporate Travel Policy §18 (Hotel & Lodging Guidelines)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[var(--foreground-muted)] leading-relaxed pt-2">
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--background-muted)]/50 border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--foreground)]">1. Maximum Nightly Room Rates</h4>
            <p>
              Reimbursement is capped at the pre-approved destination limits: Munich (€180/night), Frankfurt (€175/night), New York City ($250/night), and Pune (₹6,000/night). Any seasonal excess requires documented managerial exception approval prior to check-in.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--background-muted)]/50 border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--foreground)]">2. Non-Reimbursable Charges</h4>
            <p>
              Room mini-bar purchases, pay-per-view media, laundry services for stays under 4 consecutive nights, and spa/fitness personal services are strictly non-reimbursable personal expenses and must be settled separately at checkout.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-[var(--background-muted)]/50 border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--foreground)]">3. Valid Tax Invoice Requirement</h4>
            <p>
              The checkout folio must explicitly show the employee&apos;s name and company billing name <strong>Harbinger Group Holdings Ltd</strong>, with itemized local VAT/occupancy tax breakdown for corporate accounting audits.
            </p>
          </div>
        </div>
      </div>

      {/* Reusable Redirect Modal */}
      {selectedPartner && (
        <RedirectModal
          isOpen={!!selectedPartner}
          onClose={() => setSelectedPartner(null)}
          partnerName={selectedPartner.name}
          partnerUrl={selectedPartner.url}
          category="hotel"
          searchSummary={{
            destination: `${currentDestination.city}, ${currentDestination.country}`,
            dates: `${checkInDate} to ${checkOutDate} (${currentDestination.capPerNight} Cap)`,
            classOrGuests: `${rooms} Room(s) · ${guests} Guest(s)`,
          }}
        />
      )}
    </div>
  );
}
