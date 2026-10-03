# TravelDesk by Harbinger: System Implementation Plan

**Date:** October 2026  
**Status:** Approved with Changes (Step 0)  
**Source of Truth:** [DESIGN.md](./DESIGN.md)

---

## 1. Latest Stitch Screen Inventory (15 Active Screens)

The Stitch project (`5624038136432353661`) was pruned to remove obsolete drafts. All previous downloads were cleaned out and replaced with **only the 15 active screens and assets** from the latest Stitch design state:

| Stitch Screen Title | Screen ID | Type | Target Next.js Route | Notes / Fidelity Target |
| :--- | :--- | :--- | :--- | :--- |
| **TravelDesk - Cinematic Landing Page (Refined Glass 2026)** | `58f006d1188844a6` | Page | `/` (Home) | Primary visual reference for landing page; hero prompt bar, corridor cards, feature modules, partner search hub. |
| **TravelDesk - Streamlined Cinematic Landing Page (2026)** | `29c94b3984924b55` | Page | `/` (Reference) | Alternate streamlined card layouts and responsive micro-interactions. |
| **Hotel Stays - Verified Accommodations (2026)** | `eaae004ef9274b69` | Page | `/hotels` | Primary reference for hotel search hub with verified interior/lobby photography, embassy proximity guidance, and partner redirection. |
| **Hotel Stays - Simplified Glass & Distinct Imagery** | `85f43896398c4a40` | Page | `/hotels` (Reference) | Simplified glass layout reference with high-contrast text treatments. |
| **AI Visa Pre-Interview - Schengen Business Visa** | `49214e46423a4471` | Page | `/interview` & `/interview/[id]` | Dual-pane cockpit: Left conversational wizard with question progress & quick chips; Right document checklist & CSR dispatch status. |
| **harbinger-logo.webp** | `9845765782024992` | Brand | `<Logo />` / `../../public/images/*` | Official Harbinger Group brand lockup image. |
| **TravelDesk DESIGN.md Specification** | `31f70c66caa749c3` | Spec | `./DESIGN.md` | Core design specification and theme tokens. |
| **Hotel & City Photography (8 screens)** | Various | Assets | `../../public/images/*` | Pullman guestroom interior, Pullman exterior, Sofitel grand lobby, Munich Marienplatz, Frankfurt skyline, NYC skyline, Paris/Prague dusk, Aircraft sunset. |

*Earlier visual mockups for Flights and CSR Review Portal are placed in [`./reference/`](./reference/) (`flights_reference_f1ae06bc.png` and `csr_review_reference_80a47785.png`) for layout matching under the strict Data Policy.*

---

## 2. Data Policy & Honesty Rules (Strict)

This policy strictly overrides any previous "Sample data" placeholders or invented mockup content:
1. **Zero Invented Metrics:** No fabricated figures, ratings, prices, fares, durations, turnaround times, statistics, testimonials, or named people anywhere in the UI or seed data.
2. **Real Database Metrics:** KPI cards, case counts, and averages are calculated exclusively from real database records. Empty states show "No data yet", never mock numbers.
3. **Readiness Score Formula:**
   $$\text{Readiness Score} = \text{round}\left( 50\% \times \frac{\text{Mandatory Questions Answered}}{\text{Total Mandatory Questions}} + 50\% \times \frac{\text{Required Documents Received}}{\text{Total Required Documents}} \right)$$
   The UI explicitly breaks down how the score is calculated. If any `CRITICAL` compliance flag is open, score is capped at 60% with an alert: *"Action Required: Critical compliance flag must be resolved"*.
4. **Official Source Links Only:** All visa fees, timelines, and statutory requirements appear only with an official government source link and a "last verified" date. Unverified figures are omitted.
5. **Passport Validity Rules (Country Specific):**
   - **Schengen:** Must be valid for at least 3 months beyond intended departure from Schengen area, and issued within the last 10 years (EU Visa Code Art. 12).
   - **United States:** Standard 6 months beyond stay, but citizens of countries in the US "Six-Month Club" (including India) require validity only for the duration of intended stay.
6. **Search-and-Redirect Hubs (Flights & Hotels):** No mock flight/hotel inventory or fake fares. Built as clean search forms with factual guidance, opening verified partner links (ixigo, MakeMyTrip, Booking.com) in a new tab with `rel="noopener noreferrer"`.
7. **Seed Data Integrity:** Demo accounts use generic names ("Demo Customer", "Demo CSR", "Demo Admin"). The starter question bank is tagged *"Starter set, pending CSR team approval"*. Optional demo cases require an explicit environment variable flag (`SEED_DEMO_CASES=true`).

---

## 3. Authentication & Access Architecture

- **No Self-Registration:** Accounts are provisioned solely by administrators or seeded for demo testing. The `/login` page displays: *"Accounts are created by your administrator."*
- **Domain Restriction:** Enforces `@harbingergroup.com` domain on server-side validation (case-insensitive, unique).
- **Password Lifecycle & Forced Change:**
  - Password policy: minimum 10 characters with visual strength indicator on the change page.
  - On admin creation or password reset, a strong temporary password is generated and displayed **once** to the admin in a copy modal (no email sent in Sprint 1).
  - Stored strictly as a bcrypt hash with `mustChangePassword = true`.
  - The user is redirected to `/change-password` on first login and cannot access any protected route until completed.
- **Deactivation & Session Guardrails:**
  - Deactivated accounts are barred from logging in; active sessions are invalidated immediately on the next request.
  - Safeguards: Admin cannot deactivate or demote themselves; the last active admin cannot be removed.
- **Audit Logging:** Every administrative action (`USER_CREATED`, `USER_ROLE_CHANGED`, `USER_DEACTIVATED`, `USER_REACTIVATED`, `PASSWORD_RESET`, `CASE_DECISION_RECORDED`) is recorded with actor ID, target ID, metadata, and timestamp.
- **Rate Limiting & Session Timeouts:** Rate limit of 5 failed attempts per 15 minutes per email/IP with a generic error message. Session expiry after 8 hours, idle timeout after 30 minutes.
- **Demo Mode Isolation:** 1-click login buttons and the "Switch Role" menu appear **only** when `NEXT_PUBLIC_DEMO_MODE=true` and accept only seeded demo accounts. Passwords come from environment variables. Hidden in production.

---

## 4. Scope Cuts & Focused Deliverables

To maximize engineering polish and end-to-end functionality:
- **Visas:** Focus on Schengen Business (Germany), US B-1, US H-1B, and US L-1. (UK visa removed).
- **Travel Info:** Comprehensive business travel dossiers for **Munich** and **New York**.
- **Passport & FAQ:** Single, high-density reference pages with verified consular links.
- **Admin Users:** List and change role / deactivate / reset password view.
- **Case Review:** Single unified executive case detail view.
- **AI Concierge & Notifications:** Defined as an FAQ search & question routing modal; notifications table backed by real database events.

---

## 5. Full Prisma Schema Specification

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CUSTOMER
  CSR
  ADMIN
}

model User {
  id                  String       @id @default(cuid())
  name                String
  email               String       @unique
  passwordHash        String
  role                Role         @default(CUSTOMER)
  isActive            Boolean      @default(true)
  mustChangePassword  Boolean      @default(false)
  failedLoginAttempts Int          @default(0)
  lockedUntil         DateTime?
  lastLoginAt         DateTime?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  applications        Application[]
  decisions           CaseDecision[]
  assignedCases       Application[] @relation("AssignedCSR")
  auditLogs           AuditLog[]    @relation("ActorAudit")
  targetedAudits      AuditLog[]    @relation("TargetUserAudit")
  notifications       Notification[]

  @@index([email])
}

enum ApplicationStatus {
  DRAFT
  INTERVIEW_IN_PROGRESS
  SUBMITTED
  IN_REVIEW
  MORE_INFO_REQUESTED
  VERIFIED
  ESCALATED
}

model Application {
  id                 String            @id @default(cuid())
  caseNumber         String            @unique
  userId             String
  user               User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  assignedCsrId      String?
  assignedCsr        User?             @relation("AssignedCSR", fields: [assignedCsrId], references: [id])
  visaType           String
  destinationCountry String
  travelPurpose      String
  departureDate      DateTime?
  returnDate         DateTime?
  status             ApplicationStatus @default(DRAFT)
  readinessScore     Int               @default(0)
  readinessDetails   String?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  interviewSessions  InterviewSession[]
  documents          Document[]
  flags              CaseFlag[]
  decisions          CaseDecision[]
  auditLogs          AuditLog[]

  @@index([userId])
  @@index([status])
}

model InterviewSession {
  id                 String            @id @default(cuid())
  applicationId      String
  application        Application       @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  visaType           String
  currentQuestionId  String?
  isCompleted        Boolean           @default(false)
  summaryText        String?
  completedAt        DateTime?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  answers            InterviewAnswer[]
  flags              CaseFlag[]

  @@index([applicationId])
}

model InterviewAnswer {
  id                 String            @id @default(cuid())
  sessionId          String
  session            InterviewSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  questionId         String
  questionKey        String
  questionText       String
  answerValue        String
  isSkipped          Boolean           @default(false)
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  @@index([sessionId])
  @@index([questionKey])
}

enum DocumentStatus {
  PENDING
  UPLOADED
  VERIFIED
  REJECTED
}

model Document {
  id                 String            @id @default(cuid())
  applicationId      String
  application        Application       @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  documentType       String
  originalFilename   String
  sanitizedFilename  String
  filePath           String
  mimeType           String
  fileSizeBytes      Int
  magicBytesVerified Boolean           @default(true)
  status             DocumentStatus    @default(PENDING)
  rejectionReason    String?
  verifiedByUserId   String?
  verifiedAt         DateTime?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  @@index([applicationId])
  @@index([status])
}

enum FlagSeverity {
  INFO
  WARNING
  CRITICAL
}

model CaseFlag {
  id                 String            @id @default(cuid())
  applicationId      String
  application        Application       @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  sessionId          String?
  session            InterviewSession? @relation(fields: [sessionId], references: [id], onDelete: SetNull)
  flagType           String
  severity           FlagSeverity      @default(WARNING)
  code               String
  message            String
  resolved           Boolean           @default(false)
  resolvedAt         DateTime?
  resolvedByUserId   String?
  createdAt          DateTime          @default(now())

  @@index([applicationId])
  @@index([code])
}

model CaseDecision {
  id                 String            @id @default(cuid())
  applicationId      String
  application        Application       @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  actorId            String
  actor              User              @relation(fields: [actorId], references: [id])
  action             String
  notes              String
  previousStatus     ApplicationStatus
  newStatus          ApplicationStatus
  createdAt          DateTime          @default(now())

  @@index([applicationId])
}

model AuditLog {
  id                 String            @id @default(cuid())
  actorId            String?
  actor              User?             @relation("ActorAudit", fields: [actorId], references: [id], onDelete: SetNull)
  targetUserId       String?
  targetUser         User?             @relation("TargetUserAudit", fields: [targetUserId], references: [id], onDelete: SetNull)
  applicationId      String?
  application        Application?      @relation(fields: [applicationId], references: [id], onDelete: SetNull)
  action             String
  details            String?
  ipAddress          String?
  userAgent          String?
  createdAt          DateTime          @default(now())

  @@index([actorId])
  @@index([applicationId])
  @@index([action])
}

model Question {
  id                 String            @id @default(cuid())
  key                String            @unique
  visaType           String
  stepCategory       String
  orderIndex         Int
  questionText       String
  helpText           String?
  responseType       String
  options            String?
  isMandatory        Boolean           @default(true)
  followUpLogic      String?
  flagTriggerRule    String?
  isActive           Boolean           @default(true)
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt

  @@index([visaType])
  @@index([orderIndex])
}

model Notification {
  id                 String            @id @default(cuid())
  userId             String
  user               User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  title              String
  message            String
  linkUrl            String?
  isRead             Boolean           @default(false)
  createdAt          DateTime          @default(now())

  @@index([userId])
}
```

---

## 6. Question Bank JSON Schema & Deterministic Rules

### Question Bank Structure
```json
[
  {
    "id": "q_schengen_purpose",
    "key": "schengen_purpose",
    "visaType": "SCHENGEN_BUSINESS",
    "stepCategory": "TRAVEL_DETAILS",
    "orderIndex": 1,
    "questionText": "What is the primary commercial purpose of your travel to Germany?",
    "helpText": "A Schengen Business (C) Visa covers business negotiations, client meetings, and short-term technical consultations without local productive work.",
    "responseType": "SINGLE_CHOICE",
    "options": [
      { "label": "Client Consultations & Commercial Meetings", "value": "client_meetings" },
      { "label": "Internal Strategy & Technical Training", "value": "internal_training" },
      { "label": "Trade Fair / Industrial Conference", "value": "trade_fair" },
      { "label": "Direct On-Site Productive Employment / Contracting", "value": "local_employment" }
    ],
    "isMandatory": true,
    "flagTriggerRule": {
      "field": "value",
      "operator": "equals",
      "operand": "local_employment",
      "flag": {
        "code": "FLAG_PERMIT_MISMATCH",
        "severity": "CRITICAL",
        "message": "Selected purpose involves local productive labor. Schengen C visa does not permit local employment; a national work visa (D Visa) is required."
      }
    }
  },
  {
    "id": "q_passport_validity",
    "key": "passport_validity_date",
    "visaType": "ALL",
    "stepCategory": "DOCUMENTATION",
    "orderIndex": 2,
    "questionText": "What is the exact expiration date shown on your current passport?",
    "helpText": "Enter date in YYYY-MM-DD format as printed on your passport bio-data page.",
    "responseType": "DATE",
    "isMandatory": true,
    "flagTriggerRule": {
      "type": "PASSPORT_VALIDITY_CHECK"
    }
  },
  {
    "id": "q_previous_refusal",
    "key": "has_previous_refusal",
    "visaType": "ALL",
    "stepCategory": "IMMIGRATION_HISTORY",
    "orderIndex": 3,
    "questionText": "Have you ever been refused a visa or entry clearance to the destination country or Schengen area?",
    "helpText": "Full transparency is required by consular authorities. Prior refusals must be declared with grounds.",
    "responseType": "BOOLEAN",
    "isMandatory": true,
    "flagTriggerRule": {
      "field": "value",
      "operator": "equals",
      "operand": "true",
      "flag": {
        "code": "FLAG_PREVIOUS_REFUSAL",
        "severity": "WARNING",
        "message": "Applicant reported previous visa refusal. Requires submission of refusal letter and consular explanation."
      }
    }
  }
]
```

---

## 7. New Phase Execution Plan (Updated Order)

### Phase 1: Foundation, Infrastructure & Auth
- Scaffolding: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- Design tokens & glass primitives in `globals.css` with dark/light themes (no flash on load).
- Navigation: Floating 64px `Navbar` (role-aware), responsive mobile drawer, and `Footer`.
- Prisma database schema + SQLite migration.
- Seed script: Demo accounts (`Demo Customer`, `Demo CSR`, `Demo Admin`) with passwords from environment variables, starter question bank tagged *"Starter set, pending CSR team approval"*.
- Auth.js implementation with domain restriction (`@harbingergroup.com`), temporary passwords, forced change-password workflow, and session management.
- Multi-stage `Dockerfile` and `docker-compose.yml`.
- **Playwright Smoke Tests (Phase 1):** Login per role, password change enforcement, deactivated user blocking, role route protection (403/redirect).

### Phase 2: Landing, Visa Navigator & Verified Info
- Landing page with Stitch-style prompt box and prompt suggestions.
- Interactive Visa Navigator Wizard (Schengen Business, US B-1, H-1B, L-1) with rule evaluation, official consulate links, and "last verified" dates.
- Visa Info directory (`/visas/info`), Passport services guide (`/passport`), Destination guides (`/travel-info` - Munich & New York), and FAQ (`/faq`).
- **Playwright Smoke Tests (Phase 2):** Prompt box prefill into Navigator, questionnaire evaluation, verified consulate external links.

### Phase 3: The Complete Visa Pre-Screening Loop
- Customer Dashboard (`/dashboard`): application status tracker, dynamic readiness score display, notification feed.
- AI Visa Pre-Interview Cockpit (`/interview`): Left pane conversational wizard backed by `getNextQuestion(session, answer)`, progress indicator, deterministic summary generator.
- Secure Document Hub: checklist per visa type, drag-and-drop, magic byte content inspection (PDF/PNG/JPG), 10 MB limit, Docker volume storage outside `/public`, access-checked download endpoint.
- CSR & Admin Review Cockpit (`/review`): Case table, KPI metrics from real DB, Case Detail view with full transcript, flags, document inspector, internal notes, and decision actions (`Proceed`, `Request More Info`, `Escalate`).
- **Playwright Smoke Tests (Phase 3):** Full loop from starting interview to summary generation, uploading document with magic-byte validation, and CSR decision with audit trail.

### Phase 4: Flights & Hotels Search-and-Redirect Hubs
- Flights search hub (`/flights`) with BOM/PNQ defaults, date picker, airline/cabin filters, and factual route guidance.
- Hotels search hub (`/hotels`) with Munich/New York destinations and consulate proximity tags.
- Verified `RedirectModal` connecting to external partner search endpoints (ixigo, MakeMyTrip, Booking.com) in new tab with `rel="noopener noreferrer"`.
- **Playwright Smoke Tests (Phase 4):** Search submission, redirect modal handoff, external link verification.

### Phase 5: Admin Tools, Polish & Accessibility
- Admin Question Bank CRUD interface (`/admin/questions`).
- Admin User Management (list users, modify role, deactivate/reactivate, reset password with temporary copy modal).
- Full accessibility pass: WCAG AA contrast check, 2px focus ring, keyboard navigation, minimum 12px font size.
- **Playwright Smoke Tests (Phase 5):** Admin question modification, user role alteration, password reset modal.

### Phase 6: Final Verification & Docker Validation
- Clean environment validation: `docker-compose up` from clean clone.
- Comprehensive end-to-end Playwright smoke test run.
- Production build and lint validation (`npm run build`, `npm run lint`).
- Final documentation and `README.md`.
