import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { computeBillRate } from "@/lib/estimate-utils";
import type { CatalogCategory, RateType } from "@prisma/client";

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
    const items = await prisma.catalogItem.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { department: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(items);
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

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.department || typeof body.department !== "string" || !body.department.trim()) {
      return NextResponse.json({ error: "Department is required" }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }
    if (body.baseRate == null || typeof body.baseRate !== "number") {
      return NextResponse.json({ error: "Base rate is required" }, { status: 400 });
    }

    const markupPercent = body.markupPercent ?? 0;
    const isOwnerLabor = body.isOwnerLabor ?? false;
    const rateType: RateType = body.rateType ?? "DAY";
    const billRate = computeBillRate(body.baseRate, markupPercent, isOwnerLabor, rateType);

    const item = await prisma.catalogItem.create({
      data: {
        name: body.name.trim(),
        department: body.department.trim(),
        category: body.category as CatalogCategory,
        rateType,
        baseRate: body.baseRate,
        markupPercent,
        billRate,
        isOwnerLabor,
        sortOrder: body.sortOrder ?? 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
