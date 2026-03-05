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

export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const opportunities = await prisma.opportunity.findMany({
      include: { contact: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(opportunities);
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

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        title: body.title.trim(),
        company: body.company?.trim() || null,
        stage: body.stage || "lead",
        estimatedValueLow: body.estimatedValueLow ? parseInt(body.estimatedValueLow) : null,
        estimatedValueHigh: body.estimatedValueHigh ? parseInt(body.estimatedValueHigh) : null,
        lastTouch: body.lastTouch ? new Date(body.lastTouch) : null,
        nextAction: body.nextAction?.trim() || null,
        owner: body.owner?.trim() || null,
        priority: body.priority?.trim() || null,
        notes: body.notes?.trim() || null,
        contactId: body.contactId || null,
      },
    });

    await logActivity({
      type: "created",
      description: `Opportunity created: ${opportunity.title}`,
      opportunityId: opportunity.id,
      contactId: body.contactId || undefined,
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
