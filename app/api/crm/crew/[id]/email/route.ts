import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { subject, message, templateType } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const crewMember = await prisma.crewMember.findUnique({ where: { id } });
    if (!crewMember) {
      return NextResponse.json({ error: "Crew member not found" }, { status: 404 });
    }
    if (!crewMember.email) {
      return NextResponse.json(
        { error: "Crew member has no email address" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Joey Arcisz | GLM <joey@gearedlikeamachine.com>",
      to: crewMember.email,
      subject: subject.trim(),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">
${escapeHtml(message.trim())}
          </div>
          <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999;">
            <p>Geared Like A Machine</p>
            <p>joey@gearedlikeamachine.com</p>
          </div>
        </div>
      `,
    });

    // Update lastBooked
    await prisma.crewMember.update({
      where: { id },
      data: { lastBooked: new Date() },
    });

    // Log activity
    await logActivity({
      type: "email_sent",
      description: `Email sent: ${subject.trim()}`,
      crewMemberId: id,
      metadata: { subject: subject.trim(), templateType: templateType || null },
    });

    return NextResponse.json({ success: true });
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
