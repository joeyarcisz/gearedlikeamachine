import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getPostBySlug } from "@/lib/blog";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const post = await getPostBySlug(slug.trim());
    if (!post) {
      return NextResponse.json(
        { error: "Post not found or still in draft" },
        { status: 404 }
      );
    }

    const subscribers = await prisma.contact.findMany({
      where: {
        blogSubscriber: true,
        email: { not: null },
      },
      select: { email: true, name: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers to notify" },
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

    const postUrl = `https://gearedlikeamachine.com/blog/${post.slug}`;

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      if (!sub.email) continue;
      try {
        await resend.emails.send({
          from: "Geared Like A Machine <hello@gearedlikeamachine.com>",
          to: sub.email,
          subject: `New post: ${post.title}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; color: #333; margin: 0 auto;">
              <div style="border-bottom: 2px solid #0A0A0A; padding-bottom: 16px; margin-bottom: 24px;">
                <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999;">Geared Like A Machine</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 700; color: #0A0A0A; margin-bottom: 12px; line-height: 1.2;">
                ${escapeHtml(post.title)}
              </h1>
              <p style="font-size: 15px; line-height: 1.6; color: #555; margin-bottom: 24px;">
                ${escapeHtml(post.excerpt)}
              </p>
              <a href="${postUrl}" style="display: inline-block; background: #0A0A0A; color: #fff; padding: 12px 28px; text-decoration: none; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
                Read the full post
              </a>
              <div style="border-top: 1px solid #ddd; margin-top: 40px; padding-top: 16px;">
                <p style="font-size: 11px; color: #999; line-height: 1.6;">
                  You received this because you subscribed to the GLM blog.<br>
                  <a href="${postUrl}" style="color: #999;">gearedlikeamachine.com</a>
                </p>
              </div>
            </div>
          `,
        });
        sent++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send notifications" },
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
