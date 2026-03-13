# Document Management System — Design Spec

**Date:** 2026-03-13
**Status:** Approved
**Scope:** Full document management module within the existing GLM Next.js app. Converts 18 Operations Package templates into fillable web forms with digital signatures, shareable links, and organized storage. No separate service — everything runs within the existing Vercel/Next.js stack.

---

## Overview

GLM needs to convert its markdown-based operations templates into a web-based document management system where:

1. **Admin** creates documents from templates, pre-fills business terms, and generates shareable links
2. **External parties** (crew, clients, vendors) open links on any device, fill in their portions, type their name to sign, and submit
3. **Completed documents** are stored in PostgreSQL, searchable/filterable in the admin panel, with on-demand PDF generation

---

## Data Models

### Enums

```prisma
enum DocumentCategory {
  LEGAL
  PRODUCTION
  FINANCIAL
  CREW
}

enum DocumentStatus {
  DRAFT
  SENT
  VIEWED
  COMPLETED
  EXPIRED
  CANCELLED
}

enum CrewInvoiceStatus {
  SENT
  RETURNED
  PAID
}

enum PaymentMethod {
  ACH
  ZELLE
  CHECK
  WIRE
  PAYPAL
  VENMO
}
```

### DocumentTemplate

Seeded with all 18 document types. Not user-editable — updated through code/migrations.

```prisma
model DocumentTemplate {
  id                String           @id @default(cuid())
  name              String           // "Crew Deal Memo"
  slug              String           @unique // "crew-deal-memo"
  category          DocumentCategory
  description       String
  requiresSignature Boolean          @default(true)
  isExternal        Boolean          @default(false) // can be sent via shareable link
  fieldSchema       Json             // defines form fields, sections, validation
  defaultValues     Json?            // pre-fill defaults
  documents         Document[]
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
}
```

### Document

Each instance of a filled-out (or in-progress) document.

```prisma
model Document {
  id              String           @id @default(cuid())
  templateId      String
  template        DocumentTemplate @relation(fields: [templateId], references: [id])
  projectId       String?
  project         Project?         @relation(fields: [projectId], references: [id])
  token           String           @unique @default(uuid()) // for shareable links
  status          DocumentStatus   @default(DRAFT)
  formData        Json             // filled-in field values
  recipientName   String?
  recipientEmail  String?
  completedAt     DateTime?
  expiresAt       DateTime?        // optional link expiry
  signature       Signature?
  crewInvoice     CrewInvoice?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  @@index([status])
  @@index([templateId])
  @@index([projectId])
}
```

### Signature

Immutable record created at signing time. Never updated.

```prisma
model Signature {
  id         String   @id @default(cuid())
  documentId String   @unique
  document   Document @relation(fields: [documentId], references: [id])
  signerName String   // typed name
  signerIP   String
  userAgent  String
  agreedAt   DateTime @default(now())
}
```

### CrewInvoice

Extends the Document model for crew payment tracking. Links to CrewMember.

```prisma
model CrewInvoice {
  id             String            @id @default(cuid())
  documentId     String            @unique
  document       Document          @relation(fields: [documentId], references: [id])
  crewMemberId   String
  crewMember     CrewMember        @relation(fields: [crewMemberId], references: [id])
  paymentMethod  PaymentMethod?
  paymentDetails Json?             // routing/account, Zelle email, address, etc.
  status         CrewInvoiceStatus @default(SENT)
  paidAt         DateTime?
  paidNote       String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}
```

### Relation additions to existing models

```prisma
// Add to Project model:
documents Document[]

// Add to CrewMember model:
invoices CrewInvoice[]
```

### Field Schema Structure

The `fieldSchema` JSON on DocumentTemplate defines every field for that form type:

```json
{
  "sections": [
    {
      "title": "Project Information",
      "description": "Details about the production (optional section description)",
      "fields": [
        {
          "name": "projectName",
          "type": "text",
          "label": "Project Name",
          "required": true,
          "prefilledByAdmin": true,
          "placeholder": "Enter project name",
          "helpText": "The official project/production title"
        },
        {
          "name": "shootDates",
          "type": "dateRange",
          "label": "Shoot Dates",
          "required": true,
          "prefilledByAdmin": true
        }
      ]
    },
    {
      "title": "Crew Member Information",
      "fields": [
        {
          "name": "legalName",
          "type": "text",
          "label": "Legal Name",
          "required": true,
          "prefilledByAdmin": false
        },
        {
          "name": "address",
          "type": "address",
          "label": "Mailing Address",
          "required": true,
          "prefilledByAdmin": false
        }
      ]
    }
  ]
}
```

Field types: `text`, `textarea`, `number`, `date`, `dateRange`, `select`, `checkbox`, `checkboxGroup`, `address`, `phone`, `email`, `currency`, `time`, `crewSelector`, `projectSelector`

Note: `fileUpload` is out of scope for v1. W-9 and COI tracking use boolean flags (`w9OnFile`, `coiOnFile`) on the CrewMember model, not file uploads. File storage (Vercel Blob or similar) can be added in a future iteration.

The `prefilledByAdmin` flag drives the hybrid pre-fill behavior:
- Admin view: sees and fills `prefilledByAdmin: true` fields
- Signer view: sees pre-filled fields as read-only, fills `prefilledByAdmin: false` fields

---

## Document Types (18 total)

### Signature-required, external-facing (9):

| Template | Category | Pre-filled by admin | Filled by signer |
|---|---|---|---|
| Crew Deal Memo | CREW | Project, role, rate, dates, OT terms | Legal name, address, SSN last 4, emergency contact |
| Independent Contractor Agreement | LEGAL | Project, scope, compensation, terms | Legal name, address, tax ID, signature |
| NDA | LEGAL | Disclosing party, effective date, scope | Receiving party name, title, company, signature |
| Talent Release | LEGAL | Production name, shoot date, usage rights | Talent name, address, signature |
| Location Release | LEGAL | Production name, shoot dates, location details | Property owner name, address, signature |
| Music License Agreement | LEGAL | Production, track details, usage terms, fee | Licensor name, company, signature |
| Equipment Rental Agreement | LEGAL | Equipment list, rental period, rates, deposit | Renter name, company, insurance info, signature |
| Master Service Agreement | LEGAL | Service terms, rates, payment terms | Client name, company, title, signature |
| Production Agreement | LEGAL | Project scope, deliverables, timeline, budget | Client name, company, title, signature |

### Internal fillable (9):

| Template | Category | Notes |
|---|---|---|
| Call Sheet | PRODUCTION | Department-grouped crew, call times, location, weather |
| Shot List | PRODUCTION | Scene/shot/description/lens/movement/notes |
| Production Budget | FINANCIAL | AICP-style line items, subtotals, contingency, production fee |
| Client Invoice | FINANCIAL | Standard billing — line items, subtotals, payment terms |
| Crew Invoice | CREW | Dual flow — pre-filled after job, crew enters payment method. Status: Sent/Returned/Paid |
| Estimate | FINANCIAL | 3-tier (Good/Better/Best), 30-day validity |
| Change Order | PRODUCTION | Scope change, cost/timeline impact, approval |
| Incident Report | PRODUCTION | Severity, injury details, witnesses, root cause, corrective actions |
| Safety Briefing Checklist | PRODUCTION | 10-section briefing, crew acknowledgment |

---

## Routes

### Public (no auth)

| Route | Purpose |
|---|---|
| `/d/[token]` | Shareable form — renders document for signer |
| `/d/[token]/complete` | Confirmation page after signing |

URL example: `gearedlikeamachine.com/d/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### Admin (behind auth)

| Route | Purpose |
|---|---|
| `/admin/documents` | Dashboard — all documents, filterable |
| `/admin/documents/new` | Create document from template |
| `/admin/documents/[id]` | View completed document, download PDF, see signature |
| `/admin/documents/templates` | View available templates and field schemas |
| `/admin/crew/[id]` | Existing page — add Documents and Invoices tabs |

### API

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/documents` | GET | Admin | List documents with filters |
| `/api/documents` | POST | Admin | Create new document |
| `/api/documents/[id]` | GET | Admin | Get document details |
| `/api/documents/[id]` | PATCH | Admin | Update document (status, form data) |
| `/api/documents/[id]` | DELETE | Admin | Cancel/delete document (DRAFT or SENT only) |
| ~~`/api/documents/[id]/pdf`~~ | ~~GET~~ | ~~Admin~~ | ~~Removed — PDF generated client-side via jspdf + html2canvas~~ |
| `/api/d/[token]` | GET | Public | Fetch document data for form rendering |
| `/api/d/[token]` | POST | Public | Submit completed form + signature |
| `/api/crew-invoices/[id]` | PATCH | Admin | Update crew invoice status (Sent/Returned/Paid) |

---

## Field Component Library

Reusable React components imported by both the form renderer and custom document components.

### Core field types

| Component | Purpose |
|---|---|
| `TextField` | Names, titles, general text |
| `TextArea` | Notes, descriptions, special instructions |
| `NumberField` | Quantities, amounts |
| `DateField` | Single date picker |
| `DateRangeField` | Shoot date ranges, contract periods |
| `SelectField` | Dropdowns — role, department, status |
| `CheckboxField` | Single toggles, confirmations |
| `CheckboxGroup` | Multiple selections — gear categories, safety items |
| `AddressField` | Composite — street, city, state, zip |
| `PhoneField` | Formatted phone input |
| `EmailField` | Email with validation |
| `CurrencyField` | Dollar amounts with formatting |
| `TimeField` | Call times, wrap times |
| `SignatureBlock` | Typed name + "I agree" checkbox + timestamp/IP |
| ~~FileUpload~~ | ~~Out of scope for v1~~ |
| `CrewSelector` | Admin-only — picks from CrewMember records |
| `ProjectSelector` | Admin-only — picks from Projects |

### Shared wrapper

`FormField` container handles: label, required indicator, validation errors, read-only state (grey background + lock icon for pre-filled fields), help text tooltip.

`FormSection` groups fields under a titled header with optional description. Maps directly to `sections` array in `fieldSchema`.

### Escape hatch

Complex documents (dual crew invoice, production budget) get custom React components that import individual field components directly instead of using the JSON-driven renderer. Same visual style, custom logic.

---

## Document Lifecycle

### Standard flow

```
Admin creates document
  → status: DRAFT
  → fills admin fields, hits "Create & Generate Link"
  → status: SENT
  → copies link, texts/sends to signer

Signer opens link
  → status: VIEWED (auto-tracked on first open)
  → fills in their fields
  → types name, checks "I agree", hits Submit
  → status: COMPLETED
  → Signature record created (name, IP, user agent, timestamp)
  → formData saved to Document

Admin reviews
  → sees COMPLETED in dashboard
  → can view all data + signature details
  → can download PDF on demand
```

### Crew invoice flow

```
Admin creates crew invoice after job
  → pre-filled: crew name, project, role, days, rate, total
  → sends link to crew member
  → CrewInvoice status: SENT

Crew member opens link
  → sees payment summary (read-only)
  → selects payment method (ACH/Zelle/Check/Wire/PayPal/Venmo)
  → enters payment details
  → submits
  → CrewInvoice status: RETURNED

Admin processes payment
  → marks as PAID with date and optional note
  → CrewInvoice status: PAID
```

### VIEWED status tracking

The `VIEWED` status is set when the signer first interacts with the form (e.g., focuses on a field or scrolls past the header), not on the initial GET request. This avoids false positives from link previews (iMessage, Slack), bots, and browser prefetching. Implemented as a one-time POST/PATCH call triggered by a client-side interaction event.

### Link states

- **Valid link:** Form renders normally
- **Already completed:** Shows "This document has already been submitted" + completion date
- **Expired:** Shows "This link has expired. Please contact GLM for a new link."
- **Cancelled:** Shows "This document has been cancelled."
- **Invalid token:** Generic 404

---

## Admin Dashboard

### Main view (`/admin/documents`)

**Stats bar:** Total documents | Awaiting signature | Completed today | Overdue

**Filter bar:**
- Type — dropdown of all 18 document types
- Status — Draft / Sent / Viewed / Completed / Expired
- Project — dropdown of projects + "Standalone"
- Date range — created date
- Search — free text (recipient name, project name, document title)

**Table columns:** Document Type | Recipient | Project | Status | Created | Completed | Actions (View, Copy Link, Download PDF)

Sorted most recent first. Status badges: grey=Draft, blue=Sent, yellow=Viewed, green=Completed, red=Expired.

### Project integration

Existing project detail page gets a **Documents** tab showing all linked documents. Quick-create button auto-links to project and pre-fills project name/dates.

### Crew integration

Existing crew member detail pages get:
- **Documents** section — all documents where this person is the recipient
- **Invoices** section — Sent/Returned/Paid status board with payment history

---

## Public Form Page UX

### Layout (`/d/[token]`)

- **Header:** GLM logo centered, document title below (Rajdhani 700, all caps), project name if linked
- **Progress dots:** Section indicators showing scroll position (all sections on one scrollable page)
- **Pre-filled sections:** Light grey background, lock icon, read-only
- **Signer sections:** White background, active inputs, clear labels, large tap targets
- **Signature block:** "By typing your name and checking the box below, you agree to the terms of this document." Text input + checkbox + Submit button
- **Mobile-first:** Must work on phone screens. Large fonts, generous spacing, no tiny controls.

### Brand

Monochromatic, professional, minimal. GLM logo, Rajdhani headings, Inter body, steel/charcoal palette. No hero images or decorative elements — this is a business document.

---

## PDF Generation

Using **client-side PDF generation** via `jspdf` + `html2canvas`. The admin clicks "Download PDF" and the browser renders the document's HTML view into a PDF locally. No serverless function needed, no native binary issues on Vercel.

**Flow:**
1. Admin navigates to `/admin/documents/[id]` — sees the full rendered document
2. Clicks "Download PDF"
3. Client-side JS captures the document's rendered HTML container via `html2canvas`
4. Converts to PDF via `jspdf` with proper page sizing (8.5" x 11")
5. Browser downloads the PDF

**Why not `@react-pdf/renderer`:** It depends on `yoga-layout` (native binary) which has reliability issues in Vercel's serverless environment — cold start failures, memory constraints. Client-side generation avoids this entirely.

**PDF-optimized view:** The document detail page includes a "Print View" mode that renders the document with PDF-optimized styling (no interactive elements, proper margins, page break hints). This same view is what `html2canvas` captures.

**Five category templates (HTML/CSS for print):**
- `LegalDocumentPrint` — MSA, NDA, production agreement, contractor agreement, releases (category: LEGAL)
- `CrewDocumentPrint` — deal memo, crew invoice (category: CREW — table-heavy with rates/totals)
- `ProductionDocumentPrint` — call sheet, shot list, gear checklist, incident report, safety briefing (category: PRODUCTION)
- `FinancialDocumentPrint` — client invoice, estimate, change order, budget (category: FINANCIAL)

**Template-to-category mapping:** Each document template has a `category` enum value. The PDF renderer selects the print template by matching `template.category` to the corresponding print component. Crew Deal Memo → CREW, Crew Invoice → CREW, etc.

**Brand in PDF:**
- Rajdhani 700 headings, Inter 400 body
- GLM logo top-left, document title top-right
- Steel/charcoal palette
- Signature block at bottom: typed name, timestamp, IP
- Footer: "Document signed digitally via Geared Like A Machine LLC"

---

## Auth & Access Control

**Current:** Single admin password (bcrypt hash in env var). All admin routes protected by middleware.

**Document system:** Same auth — only logged-in admin can create, view, manage documents. Public `/d/[token]` routes require no auth (token-based access).

**Future-ready:** Code structured with auth checks isolated so role-based access can be added later without a rewrite. Document creation, viewing, and management permissions can be split when needed.

---

## Auth Strategy for Document Routes

Follow the same pattern as existing production API routes: **inline auth checks**, not middleware. The middleware matcher stays as-is (`/admin/:path*` and `/api/crm/:path*`). Admin pages under `/admin/documents/*` are already covered by the `/admin/:path*` matcher.

API routes handle auth inline:
- `/api/documents/*` — inline admin auth check (same pattern as `/api/production/*`)
- `/api/d/[token]/*` — public, no auth. Token validation in route handler.
- `/api/crew-invoices/*` — inline admin auth check

This avoids the `/api/d` vs `/api/documents` prefix collision in the matcher and follows the existing codebase pattern for production routes.

---

## File Structure

```
app/
  d/
    [token]/
      page.tsx              # Public form renderer
      complete/
        page.tsx            # Post-submission confirmation
  admin/
    documents/
      page.tsx              # Dashboard with filters
      new/
        page.tsx            # Template picker + pre-fill form
      [id]/
        page.tsx            # Document detail view
      templates/
        page.tsx            # Template browser
  api/
    documents/
      route.ts              # GET (list) + POST (create)
      [id]/
        route.ts            # GET + PATCH
        # PDF generated client-side, no server route needed
    d/
      [token]/
        route.ts            # GET (fetch for form) + POST (submit)
    crew-invoices/
      [id]/
        route.ts            # PATCH (update status)

components/
  documents/
    fields/
      TextField.tsx
      TextArea.tsx
      NumberField.tsx
      DateField.tsx
      DateRangeField.tsx
      SelectField.tsx
      CheckboxField.tsx
      CheckboxGroup.tsx
      AddressField.tsx
      PhoneField.tsx
      EmailField.tsx
      CurrencyField.tsx
      TimeField.tsx
      SignatureBlock.tsx
      CrewSelector.tsx
      ProjectSelector.tsx
      FormField.tsx         # Shared wrapper
      FormSection.tsx       # Section grouper
    FormRenderer.tsx        # JSON schema → form renderer
    DocumentDashboard.tsx   # Admin dashboard with filters
    DocumentDetail.tsx      # Admin detail view
    CrewInvoiceCard.tsx     # Status card for crew invoices
    print/
      LegalDocumentPrint.tsx
      CrewDocumentPrint.tsx
      ProductionDocumentPrint.tsx
      FinancialDocumentPrint.tsx
      PdfDownloadButton.tsx     # Client-side jspdf + html2canvas trigger

lib/
  document-types.ts         # TypeScript interfaces for documents
  document-templates.ts     # Template seed data (all 18 fieldSchemas)
```

---

## Template Seed Data

All 18 document templates are defined in `lib/document-templates.ts` as a typed array. Each template includes the full `fieldSchema` JSON that drives form rendering.

Seeded to the database via a dedicated seed function that uses `upsert` keyed on `slug` — idempotent and safe to run on production. This is a separate function from the existing destructive CRM seed logic. The main seed script calls both but the template seed never deletes existing data.

---

## Technical Decisions

| Decision | Rationale |
|---|---|
| `jspdf` + `html2canvas` over `@react-pdf/renderer` | Client-side PDF avoids native binary issues on Vercel serverless. No cold start failures. |
| JSON fieldSchema over hardcoded forms | Add new document types via data, not code (for standard forms) |
| Token-based public access over auth | Zero friction for signers — open link, fill, submit |
| Single Document model over per-type tables | Flexible schema with JSON formData avoids table explosion |
| Category-based PDF templates over per-type | 4 templates cover 18 types since layouts within categories are similar |
| Database storage over file storage | Simpler infrastructure, PDF generated on demand from data |
| Typed signature over drawn | Minimum friction for signer, same legal weight under ESIGN/UETA |

---

## Dependencies

New npm packages:
- `jspdf` — client-side PDF generation
- `html2canvas` — HTML-to-canvas rendering for PDF capture
- No other new dependencies expected

---

## Out of Scope

- Email notifications (admin copies link and sends manually)
- Role-based access control (admin-only for now, structured for future)
- Document versioning/revision tracking
- Bulk document creation
- Template editor UI (templates defined in code)
- E-signature certificate/audit trail beyond IP + timestamp
- File upload fields (W-9, COI tracked as boolean flags on CrewMember for v1)
- Server-side PDF generation (client-side via jspdf + html2canvas)
