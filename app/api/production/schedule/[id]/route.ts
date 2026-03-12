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
    const scheduleDay = await prisma.scheduleDay.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true } },
        crewAssignments: {
          orderBy: { callTime: "asc" },
        },
        equipmentAssignments: {
          orderBy: { itemName: "asc" },
        },
      },
    });

    if (!scheduleDay) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(scheduleDay);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.scheduleDay.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.startTime !== undefined) data.startTime = body.startTime.trim();
    if (body.wrapTime !== undefined) data.wrapTime = body.wrapTime?.trim() || null;
    if (body.locationName !== undefined) data.locationName = body.locationName?.trim() || null;
    if (body.locationAddress !== undefined) data.locationAddress = body.locationAddress?.trim() || null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
    if (body.projectId !== undefined) data.projectId = body.projectId;

    const scheduleDay = await prisma.scheduleDay.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, title: true } },
        crewAssignments: {
          orderBy: { callTime: "asc" },
        },
        equipmentAssignments: {
          orderBy: { itemName: "asc" },
        },
      },
    });

    return NextResponse.json(scheduleDay);
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
    await prisma.scheduleDay.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
