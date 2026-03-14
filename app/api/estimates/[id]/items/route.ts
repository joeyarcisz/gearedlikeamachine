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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: estimateId } = await params;
    const body = await request.json();

    const estimate = await prisma.estimate.findUnique({ where: { id: estimateId } });
    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    let name = body.name;
    let category = body.category;
    let department = body.department || null;
    let rateType = body.rateType || "DAY";
    let unitRate = body.unitRate;

    if (body.catalogItemId) {
      const catalogItem = await prisma.catalogItem.findUnique({
        where: { id: body.catalogItemId },
      });
      if (!catalogItem) {
        return NextResponse.json({ error: "Catalog item not found" }, { status: 404 });
      }
      name = name || catalogItem.name;
      category = category || catalogItem.category;
      department = department || catalogItem.department;
      rateType = body.rateType || catalogItem.rateType;
      unitRate = unitRate ?? catalogItem.billRate;
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (unitRate == null) {
      return NextResponse.json({ error: "Unit rate is required" }, { status: 400 });
    }

    const quantity = body.quantity ?? 1;
    const days = body.days ?? 1;
    const lineTotal = computeLineTotal(unitRate, quantity, days, rateType);

    const lineItem = await prisma.estimateLineItem.create({
      data: {
        estimateId,
        catalogItemId: body.catalogItemId || null,
        name: name.trim(),
        category,
        department: department?.trim() || null,
        rateType,
        unitRate,
        quantity,
        days,
        lineTotal,
        sortOrder: body.sortOrder ?? 0,
        notes: body.notes?.trim() || null,
      },
    });

    await recomputeEstimateTotal(estimateId);

    return NextResponse.json(lineItem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
