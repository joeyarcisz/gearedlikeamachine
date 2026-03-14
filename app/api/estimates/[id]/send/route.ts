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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

    // Update lastContact on the linked contact
    if (estimate.contactId) {
      await prisma.contact.update({
        where: { id: estimate.contactId },
        data: { lastContact: new Date() },
      });
    }

    // Log activity
    await logActivity({
      type: "email_sent",
      description: `Estimate ${estimate.estimateNumber} sent to ${estimate.contact.email}`,
      contactId: estimate.contactId ?? undefined,
      opportunityId: estimate.opportunityId ?? undefined,
    });

    return NextResponse.json({
      success: true,
      sentTo: estimate.contact.email,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
