# Design System & UI Specification: TravelDesk by Harbinger

> **Platform Overview:**  
> TravelDesk is an enterprise-grade AI-assisted business travel & visa pre-screening platform engineered for executive mobility, compliance audits, and corporate travel logistics. This document establishes the foundational design tokens, glassmorphism specifications, typography rules, component patterns, and theming standards (Dark & Light) governing all TravelDesk user interfaces.

---

## 1. Brand Identity & Design Principles

### Core Metaphor: Aurora Glass Executive
The design balances **Apple-level glassmorphism and atmospheric depth** with **Linear/Stripe-level functional precision** and **governmental consular clarity**. It projects executive sophistication, trustworthiness, transparency, and high intelligence without gratuitous decoration.

### Principles
1. **Atmospheric Clarity (Frosted Glass, Not Flat Panels):**  
   Layers use calibrated backdrop blurs (`16–24px`), translucent fills (`8–14%` opacity in dark mode; `60–80%` in light mode), and subtle `1px` edge highlights. Text must never sit directly over high-frequency visual noise without an intervening frosted scrim.
2. **AI Transparency with Human Accountability:**  
   Every AI action, diagnostic check, and pre-screening rule is clearly positioned as *"AI-assisted pre-screening with human review"*. Microcopy emphasizes that the AI assists while trained corporate service representatives (CSRs) make statutory decisions. The AI never makes the final decision.
3. **Calm, High-Information Density:**  
   Complex itineraries, destination guides, and visa checklists feel organized and spacious through strict 8px grid discipline, compact data tags, and strong typographic hierarchy.
4. **Data Integrity & Honesty (Strict Policy):**  
   - No invented figures, ratings, prices, fares, durations, turnaround times, statistics, testimonials, or named people anywhere in the UI or seed data.
   - Strip all such invented content from Stitch-derived markup. Stitch screens are layout references only.
   - Metrics (KPI cards, counts, averages) are computed from real database records. Empty datasets show a proper empty state or "No data yet", never placeholder numbers.
   - Readiness score is computed via a documented formula based on required documents received and mandatory questions answered, displaying what it is based on. Flags come from deterministic, documented rules.
   - Visa and passport content (fees, timelines, requirements) appears only with an official government source link and a "last verified" date. If a figure cannot be verified, omit it and link to the official source instead. Passport validity rules must be verified specifically for Schengen and US (do not assume a generic 6-month rule).
   - Flights and Hotels are search-and-redirect hubs only: Search form -> redirect modal -> partner search in a new tab. No result cards, prices, ratings or fares. Include only factual guidance text.
   - Dates are generated dynamically relative to today; never hardcoded.

---

## 2. Color System & Theme Tokens

### 2.1 Dark Theme (Primary Default)
- **Base Background:** Deep Twilight Navy `#071426` / `#00132E`
- **Surface Elevation Containers:**
  - `surface-container-lowest`: `#000E24` (Deepest canvas backing)
  - `surface-container-low`: `#071C36` (Sub-sections, drawers)
  - `surface-container`: `#0B2545` (Standard cards)
  - `surface-container-high`: `#133157` (Hover states, active pills)
  - `surface-bright`: `#283A56` (Elevated borders and popovers)
- **Glass Card Fill:** `rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.10)`
- **Glass Border:** `1px solid rgba(255, 255, 255, 0.14)`
- **Glass Top Highlight:** `inset 0 1px 0 0 rgba(255, 255, 255, 0.20)`
- **Aurora Glows:**
  - Teal Radial: `radial-gradient(ellipse at 20% 0%, rgba(20, 184, 166, 0.18) 0%, transparent 60%)`
  - Violet Radial: `radial-gradient(ellipse at 80% 10%, rgba(139, 92, 246, 0.15) 0%, transparent 55%)`
  - Amber Accent: `radial-gradient(circle at 50% 90%, rgba(245, 165, 36, 0.08) 0%, transparent 50%)`

### 2.2 Light Theme (Pearl Executive)
- **Base Background:** Soft Pearl White `#F8FAFC` to `#F1F5F9`
- **Surface Elevation Containers:**
  - `surface-container-lowest`: `#FFFFFF`
  - `surface-container-low`: `#F8FAFC`
  - `surface-container`: `#F1F5F9`
  - `surface-container-high`: `#E2E8F0`
- **Glass Card Fill:** `rgba(255, 255, 255, 0.72)` to `rgba(255, 255, 255, 0.88)`
- **Glass Border:** `1px solid rgba(226, 232, 240, 0.80)`
- **Glass Shadow:** `0 12px 32px -4px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03)`
- **Pastel Blob Underglows:** Soft mint (`#CCFBF1`), lavender (`#EDE9FE`), and warm champagne (`#FEF3C7`) blurs.

### 2.3 Semantic Brand & Status Accents
| Role | Color Hex | Dark Mode Token | Light Mode Token | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | `#14B8A6` (Teal) | `#2DD4BF` / `#14B8A6` | `#0D9488` | Main CTAs, search buttons, active tabs, progress |
| **Harbinger Accent** | `#F5A524` (Amber) | `#FBBF24` / `#F5A524` | `#D97706` | Warning flags, pending reviews, badges, sample data |
| **Verified / Success** | `#10B981` (Emerald) | `#34D399` | `#059669` | Approved visa checks, verified docs, confirmed items |
| **Legal Escalation** | `#EF4444` (Ruby) | `#F87171` | `#DC2626` | Rejections, RFE alerts, legal escalation tags |
| **Informational / Audit** | `#3B82F6` (Electric Blue) | `#60A5FA` | `#2563EB` | Flight comparison routes, consular timelines, links |

---

## 3. Typography & Type Scale

TravelDesk employs a dual-typeface pairing:
1. **Editorial Display:** `Newsreader` (or `Fraunces`), serif, confident optical sizing, -0.02em to -0.04em tracking. Delivers timeless executive authority.
2. **UI & Data:** `Inter` (or `DM Sans`), sans-serif, tall x-height, tabular numbers (`font-variant-numeric: tabular-nums`).

### Type Scale Reference
- **Display 1 (Hero Title):** `text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight font-serif` (36px–60px, leading 1.1)
- **Heading 1 (Page Titles):** `text-3xl font-semibold font-serif` (30px, leading 1.25)
- **Heading 2 (Card / Section Headers):** `text-2xl font-serif font-medium` (24px, leading 1.3)
- **Heading 3 (Component Headers):** `text-lg md:text-xl font-medium font-sans` (18px–20px)
- **Body Regular:** `text-sm font-normal text-slate-300` (14px, leading 1.5)
- **Body Dense / Microcopy:** `text-xs font-medium text-slate-400` (12px minimum, leading 1.4). *Hard constraint: No text below 12px.*
- **Monospace / Numeric:** `font-mono text-xs uppercase tracking-wider` for Case IDs, PNRs, and IATA codes (e.g. `BOM → FRA`).

---

## 4. Glassmorphism Engine & CSS Classes

```css
/* Dark Glass Card (Default) */
.glass-panel {
  background: rgba(11, 31, 58, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 20px 40px -15px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.18);
  border-radius: 1rem; /* 16px */
}

/* Glass Interactive Form Field */
.glass-input {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #FFFFFF;
  border-radius: 0.75rem; /* 12px */
  transition: all 0.2s ease-in-out;
}
.glass-input:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #14B8A6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.25);
  outline: none;
}

/* Light Mode Glass Panel */
.glass-panel-light {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 
    0 16px 32px -4px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
}
```

---

## 5. Global Component Library

### 5.1 Floating 64px Navigation Bar
- **Dimensions:** Fixed height `64px`, floating with `16px` top/side margin, max-width `1280px` centered.
- **Left:** The official Harbinger Group logo mark (30px height) + editorial wordmark `"TravelDesk"` as one single unified lockup. No redundant sub-labels or AI tags.
- **Center:** Exactly 4 customer navigation links:
  1. `Visas`
  2. `Flights`
  3. `Hotels`
  4. `Travel Info`
  *(When logged in as CSR/Admin, a 5th tab `Review` is conditionally added).*
  Active tab is framed by a soft teal pill (`bg-teal-500/20 text-teal-300 border border-teal-500/30`).
- **Right:**
  - Theme Toggle icon (Moon / Sun)
  - Notifications Bell with amber badge indicator
  - Avatar Profile dropdown trigger (Vikram Malhotra). The menu contains:
    - User name & role label
    - `Help & FAQ`
    - `Switch Role (Demo: Customer / CSR)`
    - `Sign Out`
  - *Logged-out state:* Replaces avatar with a sleek `Sign In` glass pill button.

### 5.2 Stitch-Style Centered Prompt Bar
- **Structure:** Wide pill input (`max-w-3xl`) with high-translucency frosted glass, glowing border on hover/focus.
- **Microcopy:** Placeholder *"Where are you travelling, and why? (e.g., Attending Tech Summit in Munich...)"*
- **Action:** Circular teal submit button with arrow icon (`→`).
- **Suggestion Chips:** Quick tags below prompt:
  - `Schengen Business Visa (Germany)`
  - `US B-1 Conference Visa`
  - `Mumbai to Frankfurt Flights`
  - `Munich Hotels`

### 5.3 Listing Cards (Flights & Hotels)
- **Responsive Layout:** Flexbox with `flex-wrap` on action buttons and tags to eliminate truncation.
- **Hotel Cards:**
  - Every card features a unique high-resolution hotel photo (guestroom interior, historic lobby, or twilight exterior). City plazas are strictly forbidden for hotel cards.
  - Category tags (e.g. `Top Pick for Business`, `4-Star Superior`) sit in a dedicated top status row above the hotel name.
  - Corporate pricing displayed in INR (`₹14,200 / night`, total for 14 nights with VAT note).
  - Explicit `(Sample data)` tags adjacent to ratings and rates.
  - Secondary action button `Room Specs` paired with prominent primary redirect CTA: `View Deals on Booking.com ↗` or `View on ixigo ↗`.
- **Flight Cards:**
  - Visual route progression: Departure time, IATA code, direct flight timeline bar with plane marker, arrival time.
  - Amenities badges: Baggage (`2x 23kg`), in-flight Wi-Fi, meal included, `Direct · No Schengen Transit Complications`.
  - Partner redirect CTAs clearly marked with external link icons.

### 5.4 AI Visa Interview & Document Verification Cockpit
- **Dual Pane Architecture:**
  - **Left Pane (Conversational Wizard):** Adaptive chatbot questions, progress tracker (`Question 6 of 18 · 35% Completed`), structured quick-reply diagnostic chips, audio/attachment input triggers.
  - **Right Pane (Audit & Document Checklist):** Step-by-step statutory verification status (Passed, Active, Pending, Amber Flag for OCR mismatches), inline PDF preview modal triggers, and CSR Live Dispatch queue card (`Sarah Jenkins · Est. Turnaround < 4 Hours`).

### 5.5 Persistent AI Concierge Launcher
- Floating button anchored to bottom-right (`fixed bottom-6 right-6 z-40`).
- Frosted dark pill with glowing teal icon and label: `AI CONCIERGE · Ask TravelDesk →`. Maintains a minimum `32px` clearance above the footer to prevent overlapping.

---

## 6. Footer & Partner Compliance Architecture

- **Brand Statement:** *"Executive travel logistics and regulatory cross-border compliance engineered with AI-assisted pre-screening and human review."*
- **Partner Booking Hub:** Neutral disclaimers replacing unverified claims:
  - Header: **Book via partners**
  - Text: *"Prices shown are indicative. Final price and booking confirmation on partner site."*
  - Partners: ixigo Corporate, MakeMyTrip MyBiz, Booking.com for Business.
- **Temporal Alignment:** All system dates set to **October 14 – 28, 2026**. Footer copyright reads: `© 2026 Harbinger Group Holdings Ltd. All rights reserved.`
## 7. Implementation Notes (Next.js build)

7.1 Tokens and theming
- Expose all colors, glass values, radii and shadows as CSS variables in globals.css; map them into the Tailwind theme. Dark is default; light via data-theme="light". Persist choice, respect system preference, prevent flash on load.
- GLASS SOURCE OF TRUTH: the tokens in section 2 (translucent white tint, 8-14% dark / 72-88% light, blur 16-24px). The .glass-panel snippet in section 4 is superseded: use fill rgba(255,255,255,0.08), blur 20px, border rgba(255,255,255,0.12), top highlight. If body text on a panel measures below 4.5:1, raise the tint, do not reduce the blur.
- Provide an @supports not (backdrop-filter) fallback using a solid surface-container color.
- Performance: blur 12px on screens below md; on long lists (flights, hotels) apply glass to the container and filters, and use plain translucent fills on individual cards.

7.2 Accessible text colors for light theme
Teal #0F766E, amber #B45309, emerald #047857, ruby #B91C1C, blue #1D4ED8. Never use color alone to convey status; pair with an icon and label.

7.3 Motion
Durations: fast 150ms, base 250ms, slow 500ms. Easing cubic-bezier(0.22, 1, 0.36, 1). List stagger 60ms. With prefers-reduced-motion, use opacity changes only.

7.4 Layout and system
- Breakpoints: 360 base, 640, 768, 1024, 1280. Navbar collapses to logo + hamburger below 768.
- Z-index: navbar 50, concierge launcher 40, modal 60, toast 70.
- Focus ring: 2px teal with 2px offset, visible in both themes.
- Icons: lucide-react, 1.5px stroke.

7.5 Status badges
Pending = amber, Uploaded = blue, Verified = emerald, Rejected = ruby (with reason), In review = blue, Escalated = ruby, Ready = emerald. Each has an icon.

7.6 States
Every data view needs a skeleton (shimmer), an empty state (icon, one line, one action), and an error state (message, retry). Form errors use ruby border plus icon and message text.

7.7 Demo-only, Auth, and Data Policy enforcement
- "Switch Role" and 1-click demo login buttons appear ONLY when NEXT_PUBLIC_DEMO_MODE=true, only for seeded demo accounts, and are enforced server-side. In production mode they do not render.
- Seed data contains ONLY demo users with generic names ("Demo Customer", "Demo CSR", "Demo Admin") and the starter question bank labeled "Starter set, pending CSR team approval". A demo case seeder exists but is OFF by default.
- Passwords for seeded demo accounts come from environment variables, never hard-coded in the repository.
- Accounts are created by administrators only (no self-registration, no Register/Sign up links). Login requires an email ending in @harbingergroup.com.
- On creation/reset, a strong temporary password is generated and shown once to admin. mustChangePassword=true is set; user is forced to change password on first login.
- Deactivated users are blocked from login and active sessions rejected immediately.
- Audio input in the interview is hidden in sprint 1.
- All dates are generated relative to today; never hard-coded.
- Turnaround times and live dispatch cards have NO invented figures; real metrics computed from database, empty states show "No data yet".
- Flights and Hotels: search-and-redirect hubs only. Search form -> redirect modal -> verified partner links in new tab. No result cards, prices, ratings or fares.
- Partner section is titled "Search and book on" with verified external links, no implied partnership.