# TravelDesk by Harbinger Group

> **Enterprise AI-Assisted Corporate Travel & Statutory Visa Pre-Screening Platform**  
> Built for executive cross-border mobility, regulatory compliance audits, and corporate travel operations.

---

## 1. Executive Summary & Design System

TravelDesk delivers an **Aurora Glass Executive** interface engineered to government consular accuracy and enterprise corporate governance standards:
- **Design Specifications:** Fully documented in [DESIGN.md](docs/design/DESIGN.md) and tracked in [IMPLEMENTATION_PLAN.md](docs/design/IMPLEMENTATION_PLAN.md).
- **Typography:** Optical serif display (`Newsreader`) paired with high-legibility geometric sans (`Inter`).
- **Glassmorphism:** Calibrated backdrop blurs (16–24px), translucent scrim fills (8–14% dark mode; 72–88% light mode), 1px edge highlights, and no flash on theme load.
- **Data Policy (Strict):** Zero invented figures, fake ratings, mock fares, or fabricated turnaround times. All metrics and KPI cards compute directly from active database records. Empty states render *"No data yet"*.

---

## 2. Architecture & Technology Stack

- **Framework:** Next.js 16.3.8 (App Router, Turbopack)
- **Runtime:** React 19.2.8, Node.js 22 LTS
- **Styling:** Tailwind CSS v4, Vanilla CSS tokens (`globals.css`)
- **Database & ORM:** SQLite with Prisma ORM v6
- **Authentication & Security:** Jose JWT sessions (8h expiry, 30m idle timeout), bcryptjs hashing, corporate rate-limiting (5 failed attempts/15 min)
- **File Storage:** Content inspection (magic-byte headers) with isolated volume storage outside `/public`
- **Testing:** Playwright E2E automated test suite (25 tests covering all 5 core modules)
- **Containerization:** Multi-stage `Dockerfile` and `docker-compose.yml`

---

## 3. Seeded Accounts & Environment Configuration

Copy `.env.example` to `.env` to configure your environment:

```bash
cp .env.example .env
```

### Seeded Demo Accounts

| Role | Corporate Email | Password (from `.env`) | Default Landing |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `customer@harbingergroup.com` | `DemoCustomer2026!` | `/dashboard` |
| **Demo CSR** | `csr@harbingergroup.com` | `DemoCSR2026!` | `/review` |
| **Demo Admin** | `admin@harbingergroup.com` | `DemoAdmin2026!` | `/admin` |

> [!NOTE]
> 1-click demo login buttons and the "Switch Role" menu appear **only** when `NEXT_PUBLIC_DEMO_MODE=true` in `.env`. In production mode, demo buttons and role switchers do not render. Accounts can only be provisioned by administrators via the Admin Portal (`/admin`).

---

## 4. Key Functional Modules

### 1. Visa Navigator & Statutory Directory (`/visas`, `/visas/info`)
- Interactive questionnaire evaluating travel parameters against statutory criteria:
  - Germany Schengen Business (C) vs National Work (D)
  - US Visitor (B-1) vs Specialty Occupation (H-1B) vs Intracompany Transferee (L-1)
- Indian passport validity rules:
  - **Schengen:** Passport must be valid for at least 3 months after departure from Schengen, issued within the last 10 years.
  - **United States:** Indian passports qualify for the US "Six-Month Club" exemption (valid for intended period of stay).
- Verified statutory fee schedules (€90 Schengen, $185 US B-1) with official government reference citations.

### 2. AI Pre-Screening Cockpit & Customer Dashboard (`/dashboard`, `/interview`)
- Structured statutory interview backed by database question bank.
- Deterministic compliance flag triggers (e.g. productive on-site labor attempt on business visa raises `FLAG_PERMIT_MISMATCH`).
- **Readiness Score Formula:**
  $$\text{Score} = \text{round}\left( 50\% \times \frac{\text{Mandatory Answers}}{\text{Total Mandatory Questions}} + 50\% \times \frac{\text{Uploaded Documents}}{\text{Required Documents}} \right) - \text{Penalties}$$
- File validation: 10 MB limit with magic byte signature inspection (`%PDF-`, `\x89PNG`, `\xFF\xD8\xFF`).

### 3. CSR Review Portal & Consular Dispatch (`/review`)
- Operational dispatch queue showing real DB counts: Active Cases, Pending Review, Flags Raised, Verified Cases.
- Comprehensive case dossier inspection: applicant details, question-by-question transcript, uploaded documents with access-checked streaming download, and statutory adjudication notes.

### 4. Flights & Hotels Search-and-Redirect Hubs (`/flights`, `/hotels`)
- Corporate dispatch hubs for Indian origin corridors (BOM/PNQ) to Europe and North America.
- Dynamic relative travel dates (generated relative to current date, never hardcoded).
- Indian passport transit advisory: London Heathrow Direct Airside Transit Visa (DATV) rules and Dual-Schengen transit warnings.
- Corporate lodging rate caps: Munich (€180/night), Frankfurt (€175/night), New York ($250/night), Pune (₹6,000/night).
- Corporate `RedirectModal`: Transparent handoff notice to verified partners (ixigo, MakeMyTrip, Google Flights, Booking.com, Agoda) in a new tab with `rel="noopener noreferrer"`.

### 5. System Administration & Security (`/admin`)
- **User Provisioning:** Create `@harbingergroup.com` accounts, edit roles, deactivate/reactivate, reset password.
- **Single-Disclosure Temporary Password:** Generates a strong temporary password displayed once in a secure copy modal, enforces `mustChangePassword=true` on first login.
- **Safeguards:** Self-deactivation and self-demotion prevention; last active admin cannot be removed.
- **Question Bank Authoring:** Full question manager tagged *"Starter set, pending CSR team approval"*.
- **Security Audit Trail:** Real-time chronological audit trail of all security and case events.

---

## 5. Local Setup & Execution Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seeding
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```

---

## 6. Automated Testing (Playwright)

TravelDesk includes a 25-test end-to-end smoke testing suite:

```bash
# Run all tests
npx playwright test

# Run individual test suites
npx playwright test e2e/auth.spec.ts              # Authentication & RBAC (9 tests)
npx playwright test e2e/visa-navigator.spec.ts    # Visa Navigator & Guides (8 tests)
npx playwright test e2e/prescreening-loop.spec.ts # Full Pre-Screening Loop (1 test)
npx playwright test e2e/search-redirect.spec.ts   # Flights & Hotels Hubs (3 tests)
npx playwright test e2e/admin-mgmt.spec.ts        # Admin Governance & Security (4 tests)
```

---

## 7. Docker Deployment

TravelDesk provides a production-hardened multi-stage Docker build:

```bash
# Build and run with Docker Compose
docker compose up -d --build
```

- Accessible on [http://localhost:3001](http://localhost:3001).
- SQLite database persists in `traveldesk_sqlite_data` volume.
- Uploaded files persist in `traveldesk_documents_storage` volume outside `/public`.

---

## 8. License & Attribution

- Built for **Harbinger Group Holdings Ltd**.
- Image and photography assets documented in [ATTRIBUTION.md](docs/design/ATTRIBUTION.md).
- Consular rules cross-checked against official European Union and US Department of State visa directives (verified October 2026).
