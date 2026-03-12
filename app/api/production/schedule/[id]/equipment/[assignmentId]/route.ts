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
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { assignmentId } = await params;
    const body = await request.json();

    const existing = await prisma.scheduleEquipmentAssignment.findUnique({
      where: { id: assignmentId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.itemName !== undefined) data.itemName = body.itemName.trim();
    if (body.category !== undefined) data.category = body.category?.trim() || null;
    if (body.quantity !== undefined) data.quantity = Number(body.quantity);
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;

    const assignment = await prisma.scheduleEquipmentAssignment.update({
      where: { id: assignmentId },
      data,
    });

    return NextResponse.json(assignment);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { assignmentId } = await params;
    await prisma.scheduleEquipmentAssignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
