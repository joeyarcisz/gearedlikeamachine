# Estimator Tool — Design Spec

**Date:** 2026-03-14
**Status:** Approved
**Scope:** Database-backed rate catalog + estimate builder in admin panel + client-facing PDF generation. Includes scope-pricing.ts alignment.

---

## Overview

An internal estimator tool in the GLM admin panel that replaces BlinkBid as the primary bidding system. Joey searches a master rate catalog of crew, gear, post, and pre-production services, builds line-item estimates, and generates clean branded PDFs to send to clients. All pricing is based on DFW market research with standardized markup rules.

---

## Pricing Rules

### Rate Foundation
- **Base rate** = high end of DFW non-union range from `CREW_RATE_REFERENCE_2025_2026.md`
- **Bill rate** = base rate × markup, rounded up to nearest $50
- All client-facing rates must land on $50 increments — no odd numbers

### Markup by Category
| Category | Target Markup | Applies When |
|----------|--------------|--------------|
| Crew (hired) | 15% | Hiring freelancers for a production |
| Gear (production estimate) | 25% | Bundling gear into a production bid |
| Post (outsourced) | 30% | Hiring an editor, colorist, etc. |
| Owner labor | 0% | Joey's own time (DP, Director, Editing, Pre-pro) |
| Travel | 0% | Pass-through at cost |

### Rounding Rule
After applying markup percentage, round up to the nearest $50. Examples:
- Gaffer: $900 × 1.15 = $1,035 → **$1,050**
- 1st AC: $650 × 1.15 = $748 → **$750**
- RED Komodo-X: $450 × 1.25 = $563 → **$600**
- Editor (hired): $1,200 × 1.30 = $1,560 → **$1,600**

### inventory.ts Relationship
`inventory.ts` rates are standalone rental pricing (already market-audited). They stay as-is for the `/rentals` page. When gear appears on a production estimate, the CatalogItem uses the inventory.ts rate as its base rate and applies the 25% gear markup + $50 rounding.

---

## Data Model

All monetary fields use `Int` (storing whole dollar amounts) to match the existing pattern used by `CrewMember.dayRate`, `ProjectCrew.dayRate`, `Opportunity.estimatedValueLow/High`, and `Project.budgetLow/High`. The only exception is `markupPercent` (Float, since it's a percentage) and mileage `baseRate`/`billRate` which use `Float` to support the $0.72/mi IRS rate. For the PER_MILE rate type only, `baseRate` and `billRate` are Float; all other rate types store Int values.

**Note on enums:** New enums use UPPER_CASE values, matching the newer convention established by `DocumentCategory`, `DocumentStatus`, `CrewInvoiceStatus`, and `PaymentMethod`.

### New Enums

```
enum CatalogCategory {
  CREW
  GEAR
  POST
  PRE_PRO
  TRAVEL
}

enum RateType {
  DAY
  HOUR
  FLAT
  PER_MILE
}

enum EstimateStatus {
  DRAFT
  SENT
  ACCEPTED
  DECLINED
  EXPIRED
}
```

### New Model: CatalogItem

The master rate catalog. Every billable item with base rate, markup, and computed bill rate.

```
model CatalogItem {
  id             String          @id @default(cuid())
  name           String
  department     String          // "Camera", "Electric", "Grip", "Post-Editorial", etc.
  category       CatalogCategory
  rateType       RateType        @default(DAY)
  baseRate       Int             // High-end DFW market rate (whole dollars; Float for PER_MILE only)
  markupPercent  Float           @default(0)
  billRate       Int             // baseRate × (1 + markup), rounded up to nearest $50 (Float for PER_MILE)
  isOwnerLabor   Boolean         @default(false)
  active         Boolean         @default(true)
  sortOrder      Int             @default(0)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  lineItems      EstimateLineItem[]

  @@index([category])
  @@index([department])
}
```

**Implementation note on PER_MILE:** Since Prisma doesn't support conditional column types, store mileage rates as Int in cents (72 = $0.72). The UI and PDF render cents to dollars for PER_MILE items. All other rate types use whole dollars.

### New Model: Estimate

A saved estimate, optionally linked to Contact, Opportunity, or Project.

```
model Estimate {
  id              String         @id @default(cuid())
  estimateNumber  String         @unique  // GLM-YYYY-NNN, auto-generated
  title           String
  status          EstimateStatus @default(DRAFT)
  contactId       String?
  contact         Contact?       @relation(fields: [contactId], references: [id], onDelete: SetNull)
  opportunityId   String?
  opportunity     Opportunity?   @relation(fields: [opportunityId], references: [id], onDelete: SetNull)
  projectId       String?
  project         Project?       @relation(fields: [projectId], references: [id], onDelete: SetNull)
  shootDays       Int?
  validUntil      DateTime?
  notes           String?        // Internal notes (never on PDF)
  clientNotes     String?        // Shows on PDF footer
  total           Int            @default(0)  // Sum of all line item totals
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  lineItems       EstimateLineItem[]
}
```

### New Model: EstimateLineItem

Individual line items on an estimate. Can reference a CatalogItem or be fully custom.

```
model EstimateLineItem {
  id             String          @id @default(cuid())
  estimateId     String
  estimate       Estimate        @relation(fields: [estimateId], references: [id], onDelete: Cascade)
  catalogItemId  String?
  catalogItem    CatalogItem?    @relation(fields: [catalogItemId], references: [id], onDelete: SetNull)
  name           String          // Copied from catalog or custom
  category       CatalogCategory
  department     String?
  rateType       RateType
  unitRate       Int             // Can override catalog billRate for this estimate (cents for PER_MILE)
  quantity       Float           @default(1)  // Float to support mileage (127.5 miles) and half-hours
  days           Int             @default(1)
  lineTotal      Int             // unitRate × quantity × days (computed, whole dollars)
  sortOrder      Int             @default(0)
  notes          String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```

### Existing Model Updates

Add back-reference relations to existing models (no new foreign keys needed — Prisma infers from the `Estimate` model's `@relation` directives):

- **Contact** — add `estimates Estimate[]`
- **Opportunity** — add `estimates Estimate[]`
- **Project** — add `estimates Estimate[]`

---

## Admin UI

### Navigation

New "Estimates" section in AdminShell sidebar, positioned between Production and Documents:
- **All Estimates** → `/admin/estimates` (icon: calculator/dollar SVG)
- **Rate Catalog** → `/admin/estimates/catalog` (icon: tag/price SVG)

Create `EstimatesIcon` and `CatalogIcon` SVG components in AdminShell.tsx following the existing icon pattern (24×24 viewBox, stroke-based, 1.5 strokeWidth).

### Page: Estimate List (`/admin/estimates`)

- Header: "Estimates" with count and total pipeline value
- Status filter pills: All, Draft, Sent, Accepted
- Table: estimate number, title/client, total, status badge, date
- "+ New Estimate" button → `/admin/estimates/new`
- Click row → `/admin/estimates/[id]` (edit view)

### Page: Estimate Builder (`/admin/estimates/new` and `/admin/estimates/[id]`)

The core tool. Single-page "use client" component.

**Header area:**
- Auto-generated estimate number (GLM-YYYY-NNN)
- Editable title field
- "Save Draft" and "Generate PDF" buttons

**Meta row:**
- Client/Contact search (searches CRM contacts)
- Opportunity link (optional)
- Shoot days (auto-populates "days" column for new items)
- Valid until date

**Search bar (primary interaction):**
- Full-text search across catalog items — searches `name` and `department` fields
- Dropdown results show: name, department, bill rate, and base+markup for admin context
- Click to add item to estimate
- Category quick-filter pills: All, Crew, Gear, Post, Pre-Pro, Travel

**Line items table:**
- Grouped by category section headers (Crew, Gear, Post-Production, etc.)
- Columns: Item name, Rate (editable inline), Qty, Days, Total, Remove (×)
- Owner labor items marked with ★
- "+ Add Custom Line Item" below table for ad-hoc entries

**Totals panel:**
- Margin amount (admin-only, not on PDF) — sum of markup across all line items
- Estimate total
- Note: "Margin shown admin-only. PDF shows total only."

**Notes area:**
- Internal notes (never appears on PDF)
- Client notes (appears on PDF footer)

### Page: Rate Catalog (`/admin/estimates/catalog`)

- View all catalog items grouped by department
- Columns: name, base rate, markup %, bill rate, rate type
- Owner labor items flagged with ★
- Inline edit for base rate and markup (bill rate auto-recalculates with $50 rounding)
- "+ Add Item" for new catalog entries
- Active/inactive toggle (soft delete)

---

## PDF Generation

### Implementation
- Server-side API route: `POST /api/estimates/[id]/pdf`
- Returns downloadable PDF
- Uses `@react-pdf/renderer` — lightweight, no headless browser required, works within Vercel serverless function size limits. React components render directly to PDF.

### PDF Layout

**White background, dark text** — professional print-ready look.

**Header:**
- GLM logo and "Geared Like A Machine" (top left)
- "Production Estimate" title, estimate number, date (top right)

**Client info row:**
- "Prepared For" — contact name and company (left)
- "Project" — estimate title, shoot days, valid until date (right)

**Line item sections** (grouped by category):
- Section header (Pre-Production, Production Crew, Equipment, Post-Production, Travel)
- Columns: Item, Rate (with /day or /hr), Qty/Hours, Days, Total
- Section subtotals

**Totals:**
- Section-by-section subtotal summary
- Grand total (bold, prominent)

**Footer:**
- Client notes (from estimate)
- Standard terms: "Estimate valid for 30 days. 50% deposit required to book dates."
- Company info: "Geared Like A Machine LLC · Dallas, TX · gearedlikeamachine.com"
- Page numbering

**PDF Rules:**
- No markup percentages, no base rates, no margin data — client sees bill rates only
- All rates in $50 increments
- No internal notes
- Estimate number for reference

---

## Catalog Seed Data

### Source
`CREW_RATE_REFERENCE_2025_2026.md` for crew rates. `inventory.ts` for gear base rates.

### Seed Script
`prisma/seed-catalog.ts` — standalone script, run independently with `npx tsx prisma/seed-catalog.ts`. Does not modify the existing `prisma/seed.ts` or affect its `prisma.seed` config.

### Item Count: ~120
- **Pre-Production** (~5): Creative Strategy, Production Planning, Storyboarding, Concept Development, Location Scouting
- **Crew** (~60): All departments from the rate reference — Camera (7), Electric (5), Grip (5), Sound (5), Art (10), Wardrobe (5), HMU (6), Set Ops (7), Transportation (4), PAs (4), Directors (3), Specialty (8)
- **Gear** (~40): Key packages and individual items from inventory.ts, grouped for estimate purposes (camera packages, lens sets, lighting, grip, audio, drones, monitoring, support)
- **Post-Production** (~15): Editorial (5), Color (2), Sound (5), VFX/Motion (3) — both owner and hired variants where applicable
- **Travel** (~5): Per diem ($75/day), Mileage (72 cents stored as Int, $0.72/mi IRS 2026), Hotel, Airfare, Ground Transport

### Owner Labor Items (isOwnerLabor = true, markupPercent = 0)
- Director of Photography
- Director (when Joey directs)
- Editing (when Joey edits)
- Pre-production services (Creative Strategy, Planning, Storyboarding, etc.)
- Color Grade (when Joey does it)

---

## Scope Engine Alignment

### What Changes
`scope-pricing.ts` crew day rates and gear tier rates updated to match catalog bill rates:

| Role | Current scope-pricing.ts | New (catalog bill rate) |
|------|-------------------------|------------------------|
| Director | $2,000 | $2,500 |
| DP | $1,500 | $1,600 |
| Camera Op | $750 | $900 |
| 1st AC | $650 | $750 |
| Gaffer | $850 | $1,050 |
| Key Grip | $800 | $950 |
| G&E Swing | $450 | $550 |
| Sound Mixer | $850 | $1,000 |
| HMU | $650 | $750 |
| PA | $250 | $300 |
| Producer | $1,200 | $1,400 |
| Teleprompter Op | $450 | $550 |
| Drone Op | $1,500 | $2,100 |

### What Stays
- `inventory.ts` — unchanged, standalone rental pricing
- Scope Engine UI components — unchanged
- Scope Engine calculation logic — unchanged (just new rate inputs)

---

## API Routes

All `/api/estimates/*` routes are NOT covered by the middleware matcher (which only protects `/admin/*` and `/api/crm/*`). Every route handler MUST include the `validateAdminSession()` auth guard, same pattern as `/api/production/*` and `/api/documents/*`.

### Catalog
- `GET /api/estimates/catalog` — list all active catalog items
- `POST /api/estimates/catalog` — create catalog item
- `PUT /api/estimates/catalog/[id]` — update catalog item
- `DELETE /api/estimates/catalog/[id]` — soft-delete (set active=false)

### Estimates
- `GET /api/estimates` — list estimates (with status filter)
- `POST /api/estimates` — create estimate (generates estimate number)
- `GET /api/estimates/[id]` — get estimate with line items
- `PUT /api/estimates/[id]` — update estimate
- `DELETE /api/estimates/[id]` — delete estimate

### Line Items
- `POST /api/estimates/[id]/items` — add line item
- `PUT /api/estimates/[id]/items/[itemId]` — update line item
- `DELETE /api/estimates/[id]/items/[itemId]` — remove line item

### PDF
- `POST /api/estimates/[id]/pdf` — generate and return PDF

---

## Files to Create

### Prisma
- Migration with CatalogItem, Estimate, EstimateLineItem models + enums
- `prisma/seed-catalog.ts` — catalog seed data (standalone, run with `npx tsx prisma/seed-catalog.ts`)

### Admin Pages
- `app/admin/estimates/page.tsx` — estimate list (server component wrapper)
- `app/admin/estimates/EstimateList.tsx` — "use client" list component
- `app/admin/estimates/new/page.tsx` — new estimate (server component wrapper)
- `app/admin/estimates/[id]/page.tsx` — edit estimate (server component wrapper)
- `app/admin/estimates/EstimateBuilder.tsx` — "use client" builder component (shared by new and edit)
- `app/admin/estimates/catalog/page.tsx` — catalog manager (server component wrapper)
- `app/admin/estimates/catalog/CatalogManager.tsx` — "use client" catalog component

### API Routes
- `app/api/estimates/route.ts` — list + create estimates
- `app/api/estimates/[id]/route.ts` — get + update + delete estimate
- `app/api/estimates/[id]/items/route.ts` — add line item
- `app/api/estimates/[id]/items/[itemId]/route.ts` — update + delete line item
- `app/api/estimates/[id]/pdf/route.ts` — PDF generation
- `app/api/estimates/catalog/route.ts` — list + create catalog items
- `app/api/estimates/catalog/[id]/route.ts` — update + delete catalog items

### Components
- `components/admin/EstimateSearch.tsx` — catalog search with dropdown
- `components/admin/LineItemRow.tsx` — editable line item row
- `components/admin/EstimateTotals.tsx` — totals panel with margin

### Files to Modify
- `components/admin/AdminShell.tsx` — add Estimates nav section with `EstimatesIcon` and `CatalogIcon`
- `lib/scope-pricing.ts` — update crew day rates and gear tiers to match catalog
- `prisma/schema.prisma` — add new models, enums, and back-reference relations on Contact/Opportunity/Project
- `middleware.ts` — add `/api/estimates/:path*` to the matcher array

---

## Implementation Notes

- **Estimate number generation** — use a Prisma transaction: query max `estimateNumber` for the current year, increment, and create the estimate in one atomic operation. If the `@unique` constraint is violated (concurrent creation race condition), catch the error and retry with the next number (max 3 retries). Format: GLM-2026-001.
- **Search** runs client-side against the full catalog (loaded on mount). ~120 items is small enough for in-memory filtering. Searches `name` and `department` fields with case-insensitive substring matching.
- **PDF library** — use `@react-pdf/renderer`. Lightweight, no headless browser needed, compatible with Vercel serverless. React components render directly to PDF documents.
- **Line item totals** recompute on every change. Estimate `total` saved on each update for list-view display without joins.
- **Duplicate estimate** — future enhancement, not in initial scope. When implemented: `POST /api/estimates/[id]/duplicate` copies line items, resets status to DRAFT, generates new estimate number, clears contactId.
- **Auth** — all API routes include `validateAdminSession()` guard in each handler. The middleware matcher is updated to include `/api/estimates/:path*` as an additional layer.
- **Activity logging** — estimate creation and status changes (DRAFT→SENT, SENT→ACCEPTED, etc.) should call `logActivity()` with type `note` and a descriptive message (e.g., "Created estimate GLM-2026-004", "Sent estimate to Savannah Vasquez"). No new ActivityType enum values needed.
- **PER_MILE rates** — stored as cents (Int). UI displays as dollars (divide by 100). Mileage line items: `lineTotal = (unitRate / 100) × quantity × days`, rounded to nearest dollar.
