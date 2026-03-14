import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { computeBillRate } from "@/lib/estimate-utils";
import type { RateType } from "@prisma/client";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.catalogItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Catalog item not found" }, { status: 404 });
    }

    const baseRate = body.baseRate ?? existing.baseRate;
    const markupPercent = body.markupPercent ?? existing.markupPercent;
    const isOwnerLabor = body.isOwnerLabor ?? existing.isOwnerLabor;
    const rateType: RateType = body.rateType ?? existing.rateType;
    const billRate = computeBillRate(baseRate, markupPercent, isOwnerLabor, rateType);

    const updated = await prisma.catalogItem.update({
      where: { id },
      data: {
        name: body.name?.trim() ?? existing.name,
        department: body.department?.trim() ?? existing.department,
        category: body.category ?? existing.category,
        rateType,
        baseRate,
        markupPercent,
        billRate,
        isOwnerLabor,
        active: body.active !== undefined ? body.active : existing.active,
        sortOrder: body.sortOrder ?? existing.sortOrder,
      },
    });

    return NextResponse.json(updated);
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

    const existing = await prisma.catalogItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Catalog item not found" }, { status: 404 });
    }

    await prisma.catalogItem.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
