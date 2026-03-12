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

    const existing = await prisma.scheduleCrewAssignment.findUnique({
      where: { id: assignmentId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.role !== undefined) data.role = body.role.trim();
    if (body.callTime !== undefined) data.callTime = body.callTime?.trim() || null;
    if (body.rate !== undefined) data.rate = body.rate != null ? Number(body.rate) : null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.crewMemberId !== undefined) data.crewMemberId = body.crewMemberId || null;

    const assignment = await prisma.scheduleCrewAssignment.update({
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
    await prisma.scheduleCrewAssignment.delete({ where: { id: assignmentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
