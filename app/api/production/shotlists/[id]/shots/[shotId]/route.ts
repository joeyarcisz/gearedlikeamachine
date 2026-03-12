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
  { params }: { params: Promise<{ id: string; shotId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, shotId } = await params;
    const body = await request.json();

    const existing = await prisma.shot.findFirst({
      where: { id: shotId, shotListId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Shot not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.shotNumber !== undefined) data.shotNumber = body.shotNumber.trim();
    if (body.size !== undefined) data.size = body.size?.trim() || null;
    if (body.movement !== undefined) data.movement = body.movement?.trim() || null;
    if (body.angle !== undefined) data.angle = body.angle?.trim() || null;
    if (body.lens !== undefined) data.lens = body.lens?.trim() || null;
    if (body.frameRate !== undefined) data.frameRate = body.frameRate?.trim() || null;
    if (body.equipment !== undefined) data.equipment = body.equipment?.trim() || null;
    if (body.lighting !== undefined) data.lighting = body.lighting?.trim() || null;
    if (body.description !== undefined) data.description = body.description.trim();
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl?.trim() || null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.completed !== undefined) data.completed = Boolean(body.completed);
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

    const shot = await prisma.shot.update({
      where: { id: shotId },
      data,
    });

    return NextResponse.json(shot);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; shotId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, shotId } = await params;

    const existing = await prisma.shot.findFirst({
      where: { id: shotId, shotListId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Shot not found" }, { status: 404 });
    }

    await prisma.shot.delete({ where: { id: shotId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
