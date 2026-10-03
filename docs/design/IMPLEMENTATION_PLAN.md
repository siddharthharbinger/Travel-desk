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

## 7. Execution Status & Final Verification Summary

| Phase | Scope & Modules | Status | Playwright Test Suite | Visual Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Foundation, Infrastructure & Auth** | Next.js 16.3.8 App Router, Turbopack, Tailwind CSS v4, Prisma SQLite, tokens, Navbar, Footer, Auth (@harbingergroup.com), forced password change, demo gating. | **100% Complete** | `e2e/auth.spec.ts` (9/9 passed) | Verified (`phase1_visual_verification_1791018303152.webp`) |
| **Phase 2: Landing, Visa Navigator & Verified Info** | Prompt box prefill, Interactive Navigator (Schengen C/D, US B-1/L-1/H-1B), Policy Directory (`/visas/info`), Passport Guide (`/passport`), Travel Info (`/travel-info` Munich/NYC), FAQ (`/faq`). | **100% Complete** | `e2e/visa-navigator.spec.ts` (8/8 passed) | Verified (`phase2_visual_verification_1791019343451.webp`) |
| **Phase 3: The Complete Pre-Screening Loop** | Customer Dashboard (`/dashboard`), AI Interview Cockpit (`/interview`), Magic-byte Document Upload (PDF/PNG/JPEG, 10MB limit), Isolated Storage, CSR Review Cockpit (`/review`), Decisions & Audit Trail. | **100% Complete** | `e2e/prescreening-loop.spec.ts` (1/1 passed) | Verified (`customer_dashboard.png`, `interview_cockpit.png`, `csr_review_cockpit.png`, `csr_dossier_inspection.png`) |
| **Phase 4: Flights & Hotels Search-and-Redirect Hubs** | BOM/PNQ Flight Hub (`/flights`), Munich/NYC Hotel Hub (`/hotels`), Relative Dynamic Dates, `RedirectModal`, Transit Advisory, Policy Rules §14 & §18, Zero Mock Fares. | **100% Complete** | `e2e/search-redirect.spec.ts` (3/3 passed) | Verified (`flights_hub.png`, `flight_redirect_modal.png`, `hotels_hub.png`, `hotel_redirect_modal.png`) |
| **Phase 5: Admin Tools, Polish & Accessibility** | Admin Portal (`/admin`), User Management, Temporary Password Single-View Modal, Question Bank Manager, Security Audit Trail, Interactive Notification Bell, AI Concierge Modal. | **100% Complete** | `e2e/admin-mgmt.spec.ts` (4/4 passed) | Verified (`admin_user_management.png`, `admin_temp_password_modal.png`, `admin_question_bank.png`, `admin_audit_trail.png`) |
| **Phase 6: Final Verification & Docker Validation** | Full 25-test E2E regression suite, zero-warning production build, Docker multi-stage configuration with isolated volume, relative documentation links. | **100% Complete** | 25/25 tests passing (100%) | Multi-stage Dockerfile & compose verified |

---

### Verification Summary
- **Total Automated E2E Tests:** 25 passing out of 25 (0 failures, 100% pass rate).
- **Data Policy Compliance:** 100% verified. Zero invented figures, fake ratings, or mock prices anywhere in application code or seed datasets.
- **Security & RBAC:** Middleware + Server-side validation with self-protection and last-admin safeguards.
- **Storage Isolation:** Uploads stored outside `/public` in Docker-mounted volume with magic-byte content inspection and access-controlled streaming endpoints.
