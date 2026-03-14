import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, projectType, description, budget, timeline } =
      body;

    // Validate required fields
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and project description are required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Send emails via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // Notify owner
        await resend.emails.send({
          from: "Discovery Form <noreply@gearedlikeamachine.com>",
          to: "joey@gearedlikeamachine.com",
          subject: `New Discovery: ${escapeHtml(name)}${company ? `, ${escapeHtml(company)}` : ""}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="margin-bottom: 16px;">New Discovery Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;">Name</td>
                  <td style="padding: 8px 0;"><strong>${escapeHtml(name)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email</td>
                  <td style="padding: 8px 0;"><strong>${escapeHtml(email)}</strong></td>
                </tr>
                ${company ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;"><strong>${escapeHtml(company)}</strong></td></tr>` : ""}
                ${projectType ? `<tr><td style="padding: 8px 0; color: #666;">Project Type</td><td style="padding: 8px 0;"><strong>${escapeHtml(projectType)}</strong></td></tr>` : ""}
                ${budget ? `<tr><td style="padding: 8px 0; color: #666;">Budget</td><td style="padding: 8px 0;"><strong>${escapeHtml(budget)}</strong></td></tr>` : ""}
                ${timeline ? `<tr><td style="padding: 8px 0; color: #666;">Timeline</td><td style="padding: 8px 0;"><strong>${escapeHtml(timeline)}</strong></td></tr>` : ""}
              </table>
              <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-left: 3px solid #222;">
                <p style="margin: 0 0 4px; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Project Description</p>
                <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(description)}</p>
              </div>
              <p style="margin-top: 16px; color: #999; font-size: 12px;">
                Sent from the Discovery form at gearedlikeamachine.com/discovery
              </p>
            </div>
          `,
        });

        // Auto-reply to the user
        await resend.emails.send({
          from: "Joey Arcisz | GLM <joey@gearedlikeamachine.com>",
          to: email,
          subject:
            "We Got Your Message | Geared Like A Machine",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; color: #333;">
              <div style="border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="font-size: 20px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                  Geared Like A Machine
                </h1>
              </div>

              <p style="font-size: 15px; line-height: 1.6;">
                Hey ${escapeHtml(name.split(" ")[0])},
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                Thanks for reaching out through our discovery form. We&rsquo;ve received
                your project details and a member of our team will follow up within 24 hours.
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                In the meantime, feel free to reply to this email with any additional info,
                references, or questions.
              </p>

              <p style="font-size: 15px; line-height: 1.6; margin-top: 32px;">
                Talk soon,<br/>
                <strong>The GLM Team</strong><br/>
                <span style="color: #999; font-size: 13px;">Geared Like A Machine</span>
              </p>

              <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999;">
                <p>Geared Like A Machine | Video Production & Equipment Rentals</p>
                <p>joey@gearedlikeamachine.com &bull; gearedlikeamachine.com</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send discovery email:", emailError);
        // Don't fail the request, form submission still counts
      }
    }

    // Upsert contact into CRM
    try {
      const { prisma } = await import("@/lib/prisma");
      const { logActivity } = await import("@/lib/activity");

      const discoveryNote = [
        `Discovery form submission`,
        company ? `Company: ${company}` : null,
        projectType ? `Project type: ${projectType}` : null,
        budget ? `Budget: ${budget}` : null,
        timeline ? `Timeline: ${timeline}` : null,
        `Description: ${description}`,
      ]
        .filter(Boolean)
        .join("\n");

      const existing = await prisma.contact.findFirst({
        where: { email },
      });

      if (existing) {
        const updatedNotes = existing.notes
          ? `${existing.notes}\n\n---\n${discoveryNote}`
          : discoveryNote;

        await prisma.contact.update({
          where: { id: existing.id },
          data: {
            lastContact: new Date(),
            notes: updatedNotes,
          },
        });

        await logActivity({
          type: "updated",
          description: `Discovery form resubmitted`,
          contactId: existing.id,
          metadata: { source: "discovery_form", projectType, budget, timeline },
        });
      } else {
        const contact = await prisma.contact.create({
          data: {
            name,
            email,
            company: company || null,
            stage: "lead",
            lastContact: new Date(),
            nextAction: "Follow up on discovery submission",
            notes: discoveryNote,
          },
        });

        await logActivity({
          type: "created",
          description: `Contact created from discovery form`,
          contactId: contact.id,
          metadata: { source: "discovery_form", projectType, budget, timeline },
        });
      }
    } catch (crmError) {
      console.error("Failed to upsert CRM contact from discovery:", crmError);
      // Don't fail the request, form submission still counts
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
