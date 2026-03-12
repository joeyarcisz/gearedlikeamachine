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
  { params }: { params: Promise<{ id: string; crewId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { crewId } = await params;
    const body = await request.json();

    const existing = await prisma.projectCrew.findUnique({ where: { id: crewId } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.role !== undefined) data.role = body.role.trim();
    if (body.crewMemberId !== undefined) data.crewMemberId = body.crewMemberId || null;
    if (body.dayRate !== undefined) data.dayRate = body.dayRate != null ? Number(body.dayRate) : null;
    if (body.kitFee !== undefined) data.kitFee = body.kitFee != null ? Number(body.kitFee) : null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;

    const crew = await prisma.projectCrew.update({
      where: { id: crewId },
      data,
    });

    return NextResponse.json(crew);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; crewId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { crewId } = await params;
    await prisma.projectCrew.delete({ where: { id: crewId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
