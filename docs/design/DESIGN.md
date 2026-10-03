---
name: TravelDesk
colors:
  surface: '#071426'
  surface-dim: '#071426'
  surface-bright: '#2e3a4d'
  surface-container-lowest: '#030e20'
  surface-container-low: '#0f1c2e'
  surface-container: '#142032'
  surface-container-high: '#1e2a3d'
  surface-container-highest: '#293549'
  on-surface: '#d7e3fc'
  on-surface-variant: '#bbcac6'
  inverse-surface: '#d7e3fc'
  inverse-on-surface: '#253144'
  outline: '#859490'
  outline-variant: '#3c4947'
  surface-tint: '#4fdbc8'
  primary: '#4fdbc8'
  on-primary: '#003731'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#006b5f'
  secondary: '#b1c7f0'
  on-secondary: '#193151'
  secondary-container: '#314769'
  on-secondary-container: '#a0b6de'
  tertiary: '#ffb957'
  on-tertiary: '#462b00'
  tertiary-container: '#e1940b'
  on-tertiary-container: '#533400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#b1c7f0'
  on-secondary-fixed: '#001c3b'
  on-secondary-fixed-variant: '#314769'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb957'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#071426'
  on-background: '#d7e3fc'
  surface-variant: '#293549'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, precision-focused, dark-only interface crafted exclusively for enterprise business travel and visa pre-screening workflows. Tailored for Harbinger Group personnel traveling internationally on Indian passports, the tone is reassuring, meticulous, and unpretentious. It strips away hollow gamification, speculative approval gauges, and arbitrary readiness scores in favor of deterministic status states, concrete regulatory timelines, and auditable documentary checklists.

The visual style unites high-end editorial gravitas with deep-sea glassmorphism. By pairing an authoritative serif with crystalline frosted surfaces set against ambient sub-surface glows, the interface evokes the quiet assurance of a consulate conciergerie or a private executive lounge. It conveys rigorous regulatory compliance alongside serene, low-fatigue navigation under demanding transit scenarios.

## Colors

The system is strictly dark-only; light modes and theme switches are omitted. The palette leverages deep structural depths offset by luminous, functional accents with absolute WCAG AA/AAA legibility.

- **Background Canvas (`#071426`):** Deep oceanic navy anchoring the foundation. Enhanced with two diffuse, fixed radial background glows: Teal (`rgba(20, 184, 166, 0.08)` blur 140px) positioned top-left, and Deep Violet (`rgba(99, 102, 241, 0.06)` blur 160px) anchored bottom-right.
- **Surface Navy (`#0B2545`):** The primary container base, modulated via translucent alpha layers (`rgba(11, 37, 69, 0.70)`) to let ambient backdrops filter through frosted panels.
- **Primary Accent (`#14B8A6`):** Vibrant teal for primary interactive drivers, active progress nodes, and verified parameters. Hover states shift to `#0D9488`.
- **Warning / Review Flag (`#F5A524`):** Amber accent dedicated strictly to actionable compliance items, expiring passport margins (< 6 months), processing delays, and pending consular appointments.
- **Semantic Feedback:** Emerald Success (`#10B981`) for cleared documents and approved visas; Ruby Error (`#EF4444`) for rejected attestations, embassy blackouts, and blocking errors; Blue Info (`#3B82F6`) for embassy notices and jurisdictional guidelines.
- **Typography & Content Hierarchy:** Primary text uses pure white (`#FFFFFF`) with maximum contrast; secondary content and structured field keys use crisp cool off-white (`#E2E8F0`); metadata, borders, and disabled captions scale down cleanly through `#94A3B8` without ever falling below contrast thresholds.

## Typography

Typography establishes an intentional cadence between editorial elegance and operational clarity.

- **Newsreader** delivers the intellectual weight required for travel permits, passport compliance titles, and formal consular dossier overviews. Display variants adopt natural optical styling with moderate tracking and gentle italic usage for contextual annotations.
- **Inter** handles high-density flight manifests, visa requirement trees, passport validity matrices, and interactive inputs. With a tall x-height and distinct glyph design, it remains razor-sharp at 11px to 14px sizes across diverse display densities.
- **Data & Numeric Displays:** Numbers, passport expiry dates, flight numbers, and currency values leverage Inter's tabular lining figures (`font-variant-numeric: tabular-nums`) to guarantee exact vertical alignment across comparative data grids.

## Layout & Spacing

The layout is built on an adaptive fluid-grid framework governed by strict mathematical rhythm.

- **Desktop (>= 1280px):** 12-column responsive layout with max content bounded to 1440px. Column gutters rest at 24px (`gutter`), canvas margin at 48px (`margin-desktop`). Split-pane architectural layouts (e.g., Document Scanner on left, Validation Inspector on right) span 5:7 column balances.
- **Tablet (768px - 1279px):** 8-column layout with 24px margins and 16px gutters (`gutter-sm`). Dual-column forms stack sequentially while preserving context panels.
- **Mobile (< 768px):** 4-column layout with 16px lateral margin (`margin-mobile`) and 16px gutters. Dossier matrices flatten to linear, swipeable card stacks.
- **Component Padding Scale:** 
  - Micro tags, document indicators: `space-xs` (4px) to `space-sm` (8px).
  - Compact inputs, list item interiors: `space-md` (16px).
  - Deep glass surfaces, cards, and modal dialogs: `space-lg` (24px) to `space-xl` (40px).

## Elevation & Depth

Hierarchy relies on multi-layer frosted glass surfaces rather than flat, artificial drop shadows. The backdrop blur allows dark ambient light from radial underlays to bleed through softly, signaling depth.

- **Ground Level (Base Canvas):** Solid `#071426` with dynamic ambient radial glows. Non-interactive backdrop.
- **Level 1 (Card & Section Containers):**
  - Background: `rgba(11, 37, 69, 0.65)` layered over `rgba(255, 255, 255, 0.03)`
  - Backdrop Blur: `20px`
  - Border: `1px solid rgba(255, 255, 255, 0.10)`
  - Specular Inset Highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.14)`
  - Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.36)`
- **Level 2 (Interactive Floating Panels / Menus / Dropdowns):**
  - Background: `rgba(11, 37, 69, 0.85)`
  - Backdrop Blur: `24px`
  - Border: `1px solid rgba(255, 255, 255, 0.16)`
  - Specular Inset Highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.22)`
  - Shadow: `0 16px 40px -4px rgba(0, 0, 0, 0.55), 0 0 1px 1px rgba(20, 184, 166, 0.08)`
- **Level 3 (Modal Sheets / Critical Attention Overlays):**
  - Backdrop: `rgba(7, 20, 38, 0.75)` with `backdrop-filter: blur(8px)`
  - Container: `rgba(11, 37, 69, 0.95)` with `1px solid rgba(255, 255, 255, 0.22)`
  - Shadow: `0 24px 64px -8px rgba(0, 0, 0, 0.75)`

## Shapes

The design system employs a refined geometric curve (`roundedness: 2`) that balances high-tech precision with approachable warmth. 

- **Primary Radius (`rounded-md` / 8px):** Standard controls, inputs, status badges, chip selectors, and table containers.
- **Large Radius (`rounded-lg` / 16px):** Primary glassmorphic cards, visa dossier sections, preview viewports, and floating panels.
- **Maximum Radius (`rounded-xl` / 24px):** Global modal frames and presentation containers.
- **Pill Geometry (`rounded-full`):** Reserved strictly for compact status badges, category chips, and document verification pills to isolate them visually from structural panels.

## Components

### Buttons
- **Primary Action:** Solid background `#14B8A6`, text `#071426` (semibold), border `1px solid rgba(255, 255, 255, 0.2)`. Hover state switches to `#0D9488` with a subtle outer glow (`box-shadow: 0 0 16px rgba(20, 184, 166, 0.35)`). Active state applies `scale(0.98)`.
- **Secondary (Glass Action):** Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.14)`, text `#FFFFFF`. Top highlight `inset 0 1px 0 rgba(255, 255, 255, 0.12)`. Hover adds `background: rgba(255, 255, 255, 0.10)`.
- **Destructive Action:** Background `rgba(239, 68, 68, 0.15)`, border `1px solid rgba(239, 68, 68, 0.40)`, text `#FCA5A5`. Hover deepens background to `rgba(239, 68, 68, 0.25)`.

### Input Fields & Controls
- **Inputs & Selects:** Height 44px, background `rgba(7, 20, 38, 0.60)`, border `1px solid rgba(255, 255, 255, 0.12)`, text `#FFFFFF`, placeholder `#64748B`. Focused state applies `border-color: #14B8A6` and a crisp ring: `box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.20)`.
- **Checkboxes & Radios:** 18px dimensions, border `1px solid rgba(255, 255, 255, 0.30)`, background `rgba(7, 20, 38, 0.70)`. Selected state fills with `#14B8A6` bearing a stark `#071426` check icon.

### Chips & Badges
- **Status Pills:** Compact layout with `height: 24px`, padding `2px 10px`, font size `11px` uppercase tracking.
  - *Verified / Cleared:* Background `rgba(16, 185, 129, 0.15)`, text `#34D399`, border `1px solid rgba(16, 185, 129, 0.30)`.
  - *Flagged / Requires Action:* Background `rgba(245, 165, 36, 0.15)`, text `#FBBF24`, border `1px solid rgba(245, 165, 36, 0.35)`.
  - *Blocked / Non-Compliant:* Background `rgba(239, 68, 68, 0.15)`, text `#F87171`, border `1px solid rgba(239, 68, 68, 0.35)`.

### Cards & Container Panels
- True frosted panels using `backdrop-filter: blur(20px)`, background `rgba(11, 37, 69, 0.65)`, border `1px solid rgba(255, 255, 255, 0.12)`, and inset specular highlight `inset 0 1px 0 rgba(255, 255, 255, 0.14)`. Grouped content separated by 1px sub-dividers: `rgba(255, 255, 255, 0.08)`.

### Specialized Domain Components
- **Visa Dossier Checklist Item:** Row-based interactive items containing document title, issuing authority metadata, expiry warning pill, and action CTA (Upload / Review). Background shifts from `transparent` to `rgba(255, 255, 255, 0.04)` on hover.
- **Passport Validity Meter:** Chronological progress line showing current date, travel departure date, return date, and mandatory 6-month validity threshold. Safe zone marked with `#14B8A6`, danger zone (< 6 months) highlighted with `#F5A524` and `#EF4444`.