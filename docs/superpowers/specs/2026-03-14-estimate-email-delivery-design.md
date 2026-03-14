# Estimate Email Delivery

**Date:** 2026-03-14
**Status:** Approved
**Scope:** Add email delivery to the estimator tool so estimates can be sent directly to clients as PDF attachments.

## Context

The estimator tool is feature-complete (schema, API, admin UI, PDF generation, duplication, project conversion, bulk save). The one missing capability is sending estimates to clients via email. Currently the workflow is: generate PDF, download, manually attach to an email. This feature closes that gap.

Resend is already integrated in the codebase with 4+ working email implementations. The estimate system already has contact linking with email addresses, PDF generation via `@react-pdf/renderer`, and a SENT status in the EstimateStatus enum.

## Decisions

- **PDF attachment, not hosted link.** Client gets the PDF in their inbox. No public estimate viewer needed.
- **Auto-set status to SENT.** Sending the email moves DRAFT estimates to SENT automatically. Non-DRAFT estimates keep their current status.
- **Minimal branded email.** The PDF does the heavy lifting. The email is a clean wrapper with GLM branding, not a duplicate of the estimate content.
- **Button in EstimateBuilder header.** Single "Send to Client" button alongside existing actions. Disabled when no contact email is available.
- **Shared PDF generation.** Extract PDF rendering into a shared helper so both the download route and the send route use the same code.

## API Route

**`POST /api/estimates/[id]/send`**

### Request
No body required. The estimate ID in the URL is sufficient.

### Flow
1. Auth guard: `validateAdminSession()`
2. Fetch estimate with relations: contact (including email), line items (including catalogItem)
3. Validate: estimate exists, contact exists, contact has a non-empty email
4. Generate PDF buffer using shared helper (same output as the download route)
5. Send email via Resend:
   - `from`: `"Joey Arcisz | GLM <joey@gearedlikeamachine.com>"`
   - `to`: contact email
   - `subject`: `"Estimate {estimateNumber} - {title}"`
   - `html`: branded email template (see Email Content below)
   - `attachments`: `[{ filename: "{estimateNumber}.pdf", content: pdfBuffer }]`
6. If estimate status is DRAFT, update to SENT
7. Log activity: type `"email_sent"`, description `"Estimate {number} sent to {email}"`, contactId linked
8. Return `{ success: true, sentTo: email }`

### Error Responses
- 401: Unauthorized
- 400: No contact linked, or contact has no email
- 404: Estimate not found
- 503: RESEND_API_KEY not configured
- 500: Email send failure

## Email Content

Minimal branded HTML email:

```
Header:  "GEARED LIKE A MACHINE" (uppercase, tracked, styled text)
Body:    "Hi {contact first name},"
         "Please find the attached estimate for {estimate title}."
         [If validUntil set]: "This estimate is valid until {formatted date}."
Footer:  "Geared Like A Machine LLC - Dallas, TX - gearedlikeamachine.com"
```

- No line item summary in the email body
- No markup, base rates, or internal notes
- No em dashes
- No "GLAM"
- Font: system sans-serif stack
- Colors: dark background text on white, matching professional email conventions

## Shared PDF Helper

**`lib/estimate-pdf.ts`**

Extract from `app/api/estimates/[id]/pdf/route.ts`:
- The React PDF component tree (Document, Page, sections, styles)
- The `renderToBuffer()` call
- The data types

Export a single function:
```typescript
export async function generateEstimatePDF(estimateId: string): Promise<{ buffer: Buffer; filename: string }>
```

Both the existing PDF download route and the new send route call this function. The download route wraps the buffer in a Response with Content-Disposition. The send route passes the buffer to Resend as an attachment.

## UI Changes

### EstimateBuilder Header

Add "Send to Client" button in the header button row, between "Save" and "Duplicate":

- **Style:** Matches existing button pattern (`text-[10px] uppercase tracking-widest`)
- **Color:** Distinct from other buttons to indicate outbound action (e.g., blue-tinted like the SENT status badge: `bg-blue-500/20 text-blue-400 border-blue-500/30`)
- **Disabled when:**
  - No `estimateId` (new unsaved estimate)
  - No contact linked
  - Contact has no email
- **Disabled hint:** Button text changes to communicate the blocker: "Send to Client" when ready, "Link Contact to Send" when no contact, "No Client Email" when contact lacks email
- **On click:**
  1. Save estimate first (reuse existing `handleSave()`)
  2. POST to `/api/estimates/[id]/send`
  3. On success: update local status state to "SENT", show brief success indicator
  4. On failure: show error message

### No changes to EstimateList

Email sending is an intentional action from within the builder, not a bulk operation from the list view.

## Files to Create
- `lib/estimate-pdf.ts` - Shared PDF generation helper
- `app/api/estimates/[id]/send/route.ts` - Email send endpoint

## Files to Modify
- `app/api/estimates/[id]/pdf/route.ts` - Refactor to use shared helper
- `app/admin/estimates/EstimateBuilder.tsx` - Add Send to Client button

## Safety Rules
- No package installs (Resend already installed)
- No schema changes
- No env file changes
- No deletions (comment out old code if replacing)
- No "GLAM" in any output
- No em dashes in any output
- Preserve all existing styling
