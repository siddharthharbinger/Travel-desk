# Design Sync Diff Report

**Sync Date:** 2026-10-03  
**Stitch Project ID:** `5624038136432353661` (TravelDesk AI Platform UI)  
**Target Branch:** `design-sync-2026-10-03`  

---

## 1. Executive Summary

This synchronization pulls the latest active design iterations from Stitch project `5624038136432353661` into the TravelDesk repository. The primary evolution in this release is the introduction of the **Immersive Window Scroll Zoom Landing Page (2026)** (`43c9079b`), which elevates the landing hero experience with a scroll-driven aircraft window zoom and layered atmospheric sky transition.

Two older screens (`29c94b39` and `85f43896`) have been hidden/retired in Stitch. All other functional screens (AI Visa Pre-Interview, Hotel Stays, and high-resolution corporate photography assets) remain 100% structurally and visually consistent.

---

## 2. Screens Diff Analysis

### 2.1 Added Screens (1)

| Screen ID | Title | Format | Status |
| :--- | :--- | :--- | :--- |
| `43c9079bea9149948ffec00fc9d546c6` | **TravelDesk - Immersive Window Scroll Zoom Landing (2026)** | HTML + Screenshot | **Added** (Active) |

#### Plain-Language Visual & Structural Differences
- **Visual:** Implements a dramatic golden-hour aircraft window view (`flight_aircraft_sunset.png`) layered over an expansive sunset cloud deck. As the traveler scrolls down the page, the cabin window frame progressively zooms in from scale `1.0` to `3.85`, immersing the viewer into the sky before dissolving into the platform's frosted glass navigation and service cards.
- **Structural:** Wraps the hero section, omni-search prompt bar, and corporate service capability pillars within a scroll-driven zoom stage (`#cinematic-zoom-scope`). The interaction is hardware-accelerated via `requestAnimationFrame` with passive scroll listeners and includes an explicit `@media (prefers-reduced-motion: reduce)` bypass for accessibility compliance.
- **Content:** Highlights 4 core corporate mobility capabilities:
  1. *AI Visa Pre-Screening* (Schengen & US B-1 statutory rule evaluation)
  2. *Corporate Flight Comparison* (Search-and-redirect via verified partner engines)
  3. *Embassy-Proximity Hotels* (Accommodations mapped near consular centers)
  4. *Travel Advisory* (Consular timelines and verified entry regulations)

---

### 2.2 Removed / Retired Screens (2)

| Screen ID | Title | Reason for Removal |
| :--- | :--- | :--- |
| `29c94b3984924b55ab138f23f861b2d1` | TravelDesk - Streamlined Cinematic Landing Page (2026) | Superseded by the new Immersive Window Scroll Zoom screen (`43c9079b`); marked `hidden: true` in Stitch project canvas. |
| `85f43896398c4a4094e139b7c40699cc` | Hotel Stays - Simplified Glass & Distinct Imagery | Older exploratory iteration of hotel accommodations; superseded by `eaae004ef9274b69b28bad3ba97d4954` ("Hotel Stays - Verified Accommodations (2026)"). |

---

### 2.3 Changed Screens / Specification (2)

| Screen / File | Nature of Change | Impact & Handling |
| :--- | :--- | :--- |
| `52ae617466d048188c64aa5a5a2a270f` (Lower Manhattan NYC Dusk) | Asset recompression (5 bytes delta) | Visual content is identical. Image already exists in `/public/images/dest_newyork.png`. |
| `DESIGN.md` | Stitch project theme YAML vs Codebase Design Specification | **Conflict detected:** Stitch's incoming design theme lacks Section 7 implementation rules and contains mock hotel pricing and turnaround figures that violate our Data Policy. Codebase `docs/design/DESIGN.md` is strictly preserved. |

---

### 2.4 Unchanged Screens & Photographic Assets (11)

All remaining screens and photographic assets have identical content hashes and remain active:
1. `49214e46423a4471ab5eb8195d2c4cda` — *AI Visa Pre-Interview - Schengen Business Visa* (Code & Screenshot match 100%)
2. `eaae004ef9274b69b28bad3ba97d4954` — *Hotel Stays - Verified Accommodations (2026)* (Code & Screenshot match 100%)
3. `58f006d1188844a6bfb005a9361a811d` — *TravelDesk - Cinematic Landing Page (Refined Glass 2026)* (Code & Screenshot match 100%)
4. `31f70c66caa749c381c02e707bfc3a4c` — *TravelDesk DESIGN.md Specification* (Markdown spec matches 100%)
5. `9845765782024992840` — `harbinger-logo.webp`
6. `100f71f6a1b549fd92a2e682c8d6df95` — Golden hour aircraft window (`flight_aircraft_sunset.png`)
7. `12f318635a87441c99d4899a1161f490` — Paris/Prague dusk aerial photography (`dest_paris.png`)
8. `a8dad1a8c4534c86b59177a0d9f2f756` — Frankfurt skyline dusk photography (`dest_frankfurt.png`)
9. `c8c059ad38494769bf65f81b52305b98` — Modern luxury hotel glass & limestone exterior (`hotel_pullman_exterior.png`)
10. `bf4bb7322c004524a66e0b5bd2244b92` — Historic luxury hotel grand lobby Sofitel Munich (`hotel_sofitel_lobby.png`)
11. `dc4c5dda06ac46c5866f92feef86e5b4` — Luxurious modern European hotel room interior Pullman Munich (`hotel_pullman_room.png`)
12. `f79519592a3b4c49b722d0847661521c` — Munich Marienplatz dusk view (`dest_munich.png`)

---

## 3. Design Token Verification

| Token Category | Stitch Project Value | Codebase Token (`globals.css` / Tailwind) | Alignment Status |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#4FDCB8` / `#14B8A6` | `--brand-teal: #14B8A6` (Dark) / `#0F766E` (Light accessible) | In sync (WCAG AA compliant) |
| **Secondary Accent**| `#D0BCFF` / `#8B5CF6` | Soft violet radial / glow accents | In sync |
| **Warning / Amber** | `#FFB957` / `#F5A524` | `--brand-amber: #F5A524` (Dark) / `#B45309` (Light) | In sync |
| **Background / Canvas** | `#00132E` | `--canvas-bg: #00132E` (Dark) / `#F8FAFC` (Light) | In sync |
| **Surfaces** | `#071C36`, `#0B2545`, `#133157` | `--surface-container-*` scale | In sync |
| **Typography** | Newsreader (Serif) + DM Sans (Sans) | `font-serif` (Newsreader) + `font-sans` (DM Sans/Inter) | In sync |
| **Glass Blur** | 20px (Desktop), 12px (Mobile) | `--glass-blur: 20px`, mobile `@media (max-width: 767px)`: 12px | In sync |
| **Glass Highlights** | Inset `0 1px 0 0 rgba(255, 255, 255, 0.20)` | `--glass-top-highlight` applied across all cards | In sync |

---

## 4. Imagery & Attribution Audit

- All photographic assets referenced in the new Stitch screen (`05_TravelDesk_-_Immersive_Window_Scroll_Zoom_Landing_(2026)_43c9079b.html`) are already stored locally in `/public/images/`:
  - Airplane window & sunset sky: `/images/flight_aircraft_sunset.png`
  - Harbinger corporate logo: `/images/harbinger-logo.webp`
  - Munich corridor: `/images/dest_munich.png`
  - New York corridor: `/images/dest_newyork.png`
  - Frankfurt corridor: `/images/dest_frankfurt.png`
  - Paris corridor: `/images/dest_paris.png`
- **Zero remote hotlinks:** No `googleusercontent.com` URLs are introduced into the React codebase.
- `public/images/ATTRIBUTION.md` has been updated to reflect the new active screen inventory.

---

## 5. Strict Data Policy & Governance Enforcement

1. **Stripped Invented Figures:** Stitch's incoming HTML contained mock statistics, simulated flight fares, and mock user ratings. These have been completely stripped in accordance with Section 1.4 and Section 7.7 of `DESIGN.md`.
2. **Search-and-Redirect Integrity:** Flights and Hotels remain factual search-and-redirect hubs without fake pricing or booking engines.
3. **No DESIGN.md Overwrite:** Stitch's raw `designMd` export contains contradictions to our Data Policy. Our curated `docs/design/DESIGN.md` remains the authoritative specification.
4. **Scope Gating:** Indian passport scope and demo mode (`NEXT_PUBLIC_DEMO_MODE`) remain intact and isolated.

---

## 6. Code Files Planned to Touch

The changes are **purely presentational** (enhancing the landing page hero with the scroll-zoom window interaction, updated capability cards, and asset references). No API routes, auth logic, or statutory verification rules are modified:

1. `src/app/page.tsx` — Integrate the immersive window scroll zoom hero and capability cards while preserving typed prompt submission, routing, and factual corridor cards.
2. `docs/design/ATTRIBUTION.md` — Update screen attribution and asset reference list.
3. `docs/design/stitch-manifest.json` — Update manifest with new screen hashes and sync timestamp.
