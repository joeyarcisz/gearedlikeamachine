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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; equipmentId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { equipmentId } = await params;
    const body = await request.json();

    const existing = await prisma.projectEquipment.findUnique({ where: { id: equipmentId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.itemName !== undefined) data.itemName = body.itemName.trim();
    if (body.category !== undefined) data.category = body.category?.trim() || null;
    if (body.dailyRate !== undefined) data.dailyRate = body.dailyRate != null ? Number(body.dailyRate) : null;
    if (body.quantity !== undefined) data.quantity = Number(body.quantity);
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;

    const equipment = await prisma.projectEquipment.update({
      where: { id: equipmentId },
      data,
    });

    return NextResponse.json(equipment);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; equipmentId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { equipmentId } = await params;
    await prisma.projectEquipment.delete({ where: { id: equipmentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
