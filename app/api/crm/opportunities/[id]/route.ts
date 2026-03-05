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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { contact: true },
    });

    if (!opportunity) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Fetch existing to detect stage change
    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.company !== undefined) data.company = body.company?.trim() || null;
    if (body.stage !== undefined) data.stage = body.stage;
    if (body.estimatedValueLow !== undefined)
      data.estimatedValueLow = body.estimatedValueLow ? parseInt(body.estimatedValueLow) : null;
    if (body.estimatedValueHigh !== undefined)
      data.estimatedValueHigh = body.estimatedValueHigh ? parseInt(body.estimatedValueHigh) : null;
    if (body.lastTouch !== undefined)
      data.lastTouch = body.lastTouch ? new Date(body.lastTouch) : null;
    if (body.nextAction !== undefined) data.nextAction = body.nextAction?.trim() || null;
    if (body.owner !== undefined) data.owner = body.owner?.trim() || null;
    if (body.priority !== undefined) data.priority = body.priority?.trim() || null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.contactId !== undefined) data.contactId = body.contactId || null;

    const opportunity = await prisma.opportunity.update({
      where: { id },
      data,
    });

    if (body.stage !== undefined && body.stage !== existing.stage) {
      await logActivity({
        type: "stage_change",
        description: `Stage changed from ${existing.stage} to ${body.stage}`,
        opportunityId: id,
        contactId: existing.contactId ?? undefined,
        metadata: { from: existing.stage, to: body.stage },
      });
    }

    return NextResponse.json(opportunity);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.opportunity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
