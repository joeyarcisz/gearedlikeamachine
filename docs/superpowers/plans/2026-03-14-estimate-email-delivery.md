# Estimate Email Delivery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Send to Client" button to the estimate builder that emails the PDF to the linked contact.

**Architecture:** Extract the PDF generation from the existing download route into a shared helper (`lib/estimate-pdf.ts`). Create a new send API route that uses the shared helper + Resend to email the PDF as an attachment. Add a button to the EstimateBuilder header.

**Tech Stack:** Next.js API routes, @react-pdf/renderer, Resend, React (client component)

**Spec:** `docs/superpowers/specs/2026-03-14-estimate-email-delivery-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/estimate-pdf.ts` | Create | Shared PDF generation: data fetching, React PDF component tree, `renderToBuffer`. Single export: `generateEstimatePDF(estimateId)` |
| `app/api/estimates/[id]/pdf/route.ts` | Modify | Slim down to auth + call shared helper + return Response |
| `app/api/estimates/[id]/send/route.ts` | Create | Auth, validate contact email, call shared helper, send via Resend, auto-set SENT status, log activity |
| `app/admin/estimates/EstimateBuilder.tsx` | Modify | Add "Send to Client" button with disabled states and success/error feedback |

---

## Chunk 1: Shared PDF Helper + Refactored Download Route

### Task 1: Extract PDF generation into shared helper

**Files:**
- Create: `lib/estimate-pdf.ts`
- Modify: `app/api/estimates/[id]/pdf/route.ts`

- [ ] **Step 1: Create `lib/estimate-pdf.ts`**

Move everything from the PDF route except the `authorize()` function and the `POST` handler into this new file. The file should contain:
- All imports: `React`, `@react-pdf/renderer` components, `@prisma/client` types, `prisma`
- `styles` object (the full `StyleSheet.create(...)`)
- `CATEGORY_DISPLAY` and `CATEGORY_ORDER` constants
- `rateSuffix`, `formatCurrency`, `formatRate` helper functions
- `LineItem` and `EstimateData` types
- `buildEstimatePDF` function (unchanged)
- New exported async function:

```typescript
export async function generateEstimatePDF(estimateId: string): Promise<{
  buffer: Uint8Array;
  filename: string;
  estimate: {
    estimateNumber: string;
    title: string;
    status: string;
    contactId: string | null;
    contact: { name: string; company: string | null; email: string | null } | null;
    validUntil: Date | null;
  };
}> {
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: {
      contact: { select: { name: true, company: true, email: true } },
      lineItems: {
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!estimate) {
    throw new Error("Estimate not found");
  }

  const pdfDoc = buildEstimatePDF({
    estimateNumber: estimate.estimateNumber,
    title: estimate.title,
    shootDays: estimate.shootDays,
    validUntil: estimate.validUntil,
    clientNotes: estimate.clientNotes,
    total: estimate.total,
    contact: estimate.contact,
    lineItems: estimate.lineItems,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(pdfDoc as any);

  return {
    buffer: new Uint8Array(buffer),
    filename: `${estimate.estimateNumber}.pdf`,
    estimate: {
      estimateNumber: estimate.estimateNumber,
      title: estimate.title,
      status: estimate.status,
      contactId: estimate.contactId,
      contact: estimate.contact,
      validUntil: estimate.validUntil,
    },
  };
}
```

Key detail: the return includes `estimate` metadata so the send route can access contact email, status, etc. without a second query. The contact select now includes `email: true`.

- [ ] **Step 2: Refactor PDF download route to use shared helper**

Replace the entire contents of `app/api/estimates/[id]/pdf/route.ts` with:

```typescript
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { generateEstimatePDF } from "@/lib/estimate-pdf";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { buffer, filename } = await generateEstimatePDF(id);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify PDF download still works**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm run build`
Expected: Build passes clean.

- [ ] **Step 4: Commit**

```bash
git add lib/estimate-pdf.ts "app/api/estimates/[id]/pdf/route.ts"
git commit -m "refactor: extract PDF generation into shared lib/estimate-pdf.ts"
```

---

## Chunk 2: Email Send API Route

### Task 2: Create the send endpoint

**Files:**
- Create: `app/api/estimates/[id]/send/route.ts`

- [ ] **Step 1: Create the send route**

Create `app/api/estimates/[id]/send/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { generateEstimatePDF } from "@/lib/estimate-pdf";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Generate PDF (also fetches estimate + contact data)
    let pdfResult;
    try {
      pdfResult = await generateEstimatePDF(id);
    } catch {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const { buffer, filename, estimate } = pdfResult;

    // Validate contact has email
    if (!estimate.contact) {
      return NextResponse.json(
        { error: "No contact linked to this estimate" },
        { status: 400 }
      );
    }

    if (!estimate.contact.email) {
      return NextResponse.json(
        { error: "Contact has no email address" },
        { status: 400 }
      );
    }

    // Check Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    // Build email HTML
    const contactFirstName = estimate.contact.name.split(" ")[0];
    const validUntilStr = estimate.validUntil
      ? new Date(estimate.validUntil).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px;">
          <p style="font-size: 11px; letter-spacing: 3px; color: #999; margin: 0;">GEARED LIKE A MACHINE</p>
        </div>
        <div style="font-size: 15px; line-height: 1.7;">
          <p>Hi ${escapeHtml(contactFirstName)},</p>
          <p>Please find the attached estimate for <strong>${escapeHtml(estimate.title)}</strong>.</p>
          ${validUntilStr ? `<p>This estimate is valid until ${escapeHtml(validUntilStr)}.</p>` : ""}
          <p>If you have any questions, feel free to reply to this email.</p>
        </div>
        <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999;">
          <p style="margin: 0;">Geared Like A Machine LLC</p>
          <p style="margin: 4px 0 0 0;">Dallas, TX · gearedlikeamachine.com</p>
        </div>
      </div>
    `;

    // Send email
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Joey Arcisz | GLM <joey@gearedlikeamachine.com>",
      to: estimate.contact.email,
      subject: `Estimate ${estimate.estimateNumber} - ${estimate.title}`,
      html,
      attachments: [
        {
          filename,
          content: Buffer.from(buffer),
        },
      ],
    });

    // Auto-set status to SENT if currently DRAFT
    if (estimate.status === "DRAFT") {
      await prisma.estimate.update({
        where: { id },
        data: { status: "SENT" },
      });
    }

    // Log activity
    await logActivity({
      type: "email_sent",
      description: `Estimate ${estimate.estimateNumber} sent to ${estimate.contact.email}`,
      contactId: estimate.contactId ?? undefined,
    });

    return NextResponse.json({
      success: true,
      sentTo: estimate.contact.email,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm run build`
Expected: Build passes clean.

- [ ] **Step 3: Commit**

```bash
git add "app/api/estimates/[id]/send/route.ts"
git commit -m "feat: add POST /api/estimates/[id]/send for emailing estimates"
```

---

## Chunk 3: UI Button in EstimateBuilder

### Task 3: Add Send to Client button

**Files:**
- Modify: `app/admin/estimates/EstimateBuilder.tsx`

- [ ] **Step 1: Add `sending` and `sendSuccess` state variables**

Near the other state declarations (around line 73-76), add:

```typescript
const [sending, setSending] = useState(false);
const [sendSuccess, setSendSuccess] = useState<string | null>(null);
const [sendError, setSendError] = useState<string | null>(null);
```

- [ ] **Step 2: Add `handleSendToClient` function**

After the `handleConvertToProject` function (around line 329), add:

```typescript
async function handleSendToClient() {
  if (!estimateId && !title.trim()) return;
  setSending(true);
  setSendSuccess(null);
  setSendError(null);

  try {
    // Save first to ensure latest data
    const savedId = await handleSave();
    const targetId = savedId || estimateId;
    if (!targetId) {
      setSendError("Save the estimate first");
      setSending(false);
      return;
    }

    const res = await fetch(`/api/estimates/${targetId}/send`, { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setSendError(data.error || "Failed to send");
      setSending(false);
      return;
    }

    setSendSuccess(data.sentTo);
    // Auto-update status if it was DRAFT
    if (status === "DRAFT") {
      setStatus("SENT");
    }
  } catch {
    setSendError("Failed to send email");
  }
  setSending(false);
}
```

- [ ] **Step 3: Add the button to the header**

In the header button row (between the Save button and the Duplicate button, around line 389), add the Send to Client button:

```tsx
{estimateId && (
  <button
    onClick={handleSendToClient}
    disabled={saving || sending || !selectedContact || !selectedContact.email}
    className="text-[10px] uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
  >
    {sending
      ? "Sending..."
      : !selectedContact
        ? "Link Contact to Send"
        : !selectedContact.email
          ? "No Client Email"
          : "Send to Client"}
  </button>
)}
```

This button:
- Only shows when editing an existing estimate (has `estimateId`)
- Disabled when no contact is linked or contact has no email
- Label changes to explain why it's disabled
- Blue styling matches the SENT status badge color

- [ ] **Step 4: Add success/error feedback below the header**

After the convert success banner (around line 407), add:

```tsx
{sendSuccess && (
  <div className="bg-blue-500/10 border border-blue-500/30 rounded px-4 py-2 flex items-center justify-between">
    <span className="text-xs text-blue-400">
      Estimate sent to {sendSuccess}
    </span>
    <button
      onClick={() => setSendSuccess(null)}
      className="text-blue-400 hover:text-blue-300 text-sm"
    >
      &times;
    </button>
  </div>
)}
{sendError && (
  <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-2 flex items-center justify-between">
    <span className="text-xs text-red-400">
      {sendError}
    </span>
    <button
      onClick={() => setSendError(null)}
      className="text-red-400 hover:text-red-300 text-sm"
    >
      &times;
    </button>
  </div>
)}
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

Run: `npm run build`
Expected: Build passes clean.

- [ ] **Step 6: Run safety checks**

Run: `grep -rn "GLAM" ./app ./components ./lib --include="*.tsx" --include="*.ts"`
Expected: No matches.

Run: `grep -rn "\u2014" ./lib/estimate-pdf.ts "./app/api/estimates/[id]/send/route.ts"`
Expected: No matches (no em dashes).

- [ ] **Step 7: Commit**

```bash
git add app/admin/estimates/EstimateBuilder.tsx
git commit -m "feat: add Send to Client button to estimate builder"
```

---

## Chunk 4: Final Verification & Push

### Task 4: End-to-end verification and deploy

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: Build passes clean.

- [ ] **Step 2: Push to production**

```bash
git push origin main
```

- [ ] **Step 3: Report summary**

Report:
- Files created (with paths)
- Files modified (with paths)
- How the shared helper works
- How the send flow works end-to-end
- Button behavior and disabled states
