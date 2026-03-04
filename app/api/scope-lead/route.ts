import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, company, jobTitle } = body;

    // Validate required fields
    if (!email || !company || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send email via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // Notify owner
        await resend.emails.send({
          from: "Scope Tool <noreply@gearedlikeamachine.com>",
          to: "hello@gearedlikeamachine.com",
          subject: `New Scope Lead: ${company}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px;">
              <h2 style="margin-bottom: 16px;">New Scope Tool Lead</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 100px;">Email</td>
                  <td style="padding: 8px 0;"><strong>${escapeHtml(email)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Company</td>
                  <td style="padding: 8px 0;"><strong>${escapeHtml(company)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Job Title</td>
                  <td style="padding: 8px 0;"><strong>${escapeHtml(jobTitle)}</strong></td>
                </tr>
              </table>
              <p style="margin-top: 16px; color: #999; font-size: 12px;">
                Sent from the Scope & Estimate tool at gearedlikeamachine.com/scope
              </p>
            </div>
          `,
        });

        // Auto-reply to the lead
        await resend.emails.send({
          from: "Geared Like A Machine <hello@gearedlikeamachine.com>",
          to: email,
          subject: "Your Scope Tool is Ready — Geared Like A Machine",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; color: #333;">
              <div style="border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 24px;">
                <h1 style="font-size: 20px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
                  Geared Like A Machine
                </h1>
              </div>

              <p style="font-size: 15px; line-height: 1.6;">
                Hey there,
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                Thanks for using our Scope & Estimate tool. You now have full access to build
                and adjust your project scope as many times as you need:
              </p>

              <div style="margin: 24px 0;">
                <a href="https://gearedlikeamachine.com/scope"
                   style="display: inline-block; background: #222; color: #fff; padding: 12px 28px;
                          text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
                  Open Scope Tool
                </a>
              </div>

              <p style="font-size: 15px; line-height: 1.6;">
                Once you've built an estimate you're happy with, download the PDF and reply
                to this email — we'd love to talk through the details and get your project
                on the calendar.
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                We typically respond within a few hours.
              </p>

              <p style="font-size: 15px; line-height: 1.6; margin-top: 32px;">
                Talk soon,<br/>
                <strong>The GLAM Team</strong><br/>
                <span style="color: #999; font-size: 13px;">Geared Like A Machine</span>
              </p>

              <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #999;">
                <p>Geared Like A Machine &mdash; Video Production & Equipment Rentals</p>
                <p>hello@gearedlikeamachine.com &bull; gearedlikeamachine.com</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send lead email:", emailError);
        // Don't fail the request — lead gate still works via localStorage
      }
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
