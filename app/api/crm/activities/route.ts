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

export async function GET(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");
    const opportunityId = searchParams.get("opportunityId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (contactId) where.contactId = contactId;
    if (opportunityId) where.opportunityId = opportunityId;

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      include: {
        contact: { select: { id: true, name: true } },
        opportunity: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, description, contactId, opportunityId } = body;

    if (!type || !description?.trim()) {
      return NextResponse.json(
        { error: "Type and description are required" },
        { status: 400 }
      );
    }

    const allowedManualTypes = ["note", "call", "meeting"];
    if (!allowedManualTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid activity type for manual creation" },
        { status: 400 }
      );
    }

    const activity = await logActivity({
      type,
      description: description.trim(),
      contactId: contactId || undefined,
      opportunityId: opportunityId || undefined,
    });

    // Update lastContact / lastTouch
    if (contactId) {
      await prisma.contact.update({
        where: { id: contactId },
        data: { lastContact: new Date() },
      });
    }
    if (opportunityId) {
      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: { lastTouch: new Date() },
      });
    }

    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
