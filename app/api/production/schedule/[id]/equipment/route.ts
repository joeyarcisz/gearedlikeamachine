import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

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
    const assignments = await prisma.scheduleEquipmentAssignment.findMany({
      where: { scheduleDayId: id },
      orderBy: { itemName: "asc" },
    });

    return NextResponse.json(assignments);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const scheduleDay = await prisma.scheduleDay.findUnique({ where: { id } });
    if (!scheduleDay) {
      return NextResponse.json({ error: "Schedule day not found" }, { status: 404 });
    }

    if (!body.itemName || typeof body.itemName !== "string" || !body.itemName.trim()) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    const assignment = await prisma.scheduleEquipmentAssignment.create({
      data: {
        scheduleDayId: id,
        itemName: body.itemName.trim(),
        category: body.category?.trim() || null,
        quantity: body.quantity != null ? Number(body.quantity) : 1,
        notes: body.notes?.trim() || null,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
