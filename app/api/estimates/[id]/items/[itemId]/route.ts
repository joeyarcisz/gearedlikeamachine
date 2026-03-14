import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { computeLineTotal } from "@/lib/estimate-utils";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

async function recomputeEstimateTotal(estimateId: string) {
  const lineItems = await prisma.estimateLineItem.findMany({
    where: { estimateId },
    select: { lineTotal: true },
  });
  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  await prisma.estimate.update({
    where: { id: estimateId },
    data: { total },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: estimateId, itemId } = await params;
    const body = await request.json();

    const existing = await prisma.estimateLineItem.findUnique({ where: { id: itemId } });
    if (!existing || existing.estimateId !== estimateId) {
      return NextResponse.json({ error: "Line item not found" }, { status: 404 });
    }

    const unitRate = body.unitRate ?? existing.unitRate;
    const quantity = body.quantity ?? existing.quantity;
    const days = body.days ?? existing.days;
    const rateType = body.rateType ?? existing.rateType;
    const lineTotal = computeLineTotal(unitRate, quantity, days, rateType);

    const updated = await prisma.estimateLineItem.update({
      where: { id: itemId },
      data: {
        name: body.name?.trim() ?? existing.name,
        category: body.category ?? existing.category,
        department: body.department !== undefined ? (body.department?.trim() || null) : existing.department,
        rateType,
        unitRate,
        quantity,
        days,
        lineTotal,
        sortOrder: body.sortOrder ?? existing.sortOrder,
        notes: body.notes !== undefined ? (body.notes?.trim() || null) : existing.notes,
      },
    });

    await recomputeEstimateTotal(estimateId);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: estimateId, itemId } = await params;

    const existing = await prisma.estimateLineItem.findUnique({ where: { id: itemId } });
    if (!existing || existing.estimateId !== estimateId) {
      return NextResponse.json({ error: "Line item not found" }, { status: 404 });
    }

    await prisma.estimateLineItem.delete({ where: { id: itemId } });
    await recomputeEstimateTotal(estimateId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
