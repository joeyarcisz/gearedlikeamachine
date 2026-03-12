import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function GET(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where: Prisma.ScheduleDayWhereInput = {};
    if (projectId) {
      where.projectId = projectId;
    }

    const scheduleDays = await prisma.scheduleDay.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        _count: {
          select: {
            crewAssignments: true,
            equipmentAssignments: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(scheduleDays);
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

    if (!body.projectId || typeof body.projectId !== "string") {
      return NextResponse.json({ error: "Project is required" }, { status: 400 });
    }
    if (!body.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    if (!body.startTime || typeof body.startTime !== "string") {
      return NextResponse.json({ error: "Start time is required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: body.projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const scheduleDay = await prisma.scheduleDay.create({
      data: {
        projectId: body.projectId,
        date: new Date(body.date),
        startTime: body.startTime.trim(),
        wrapTime: body.wrapTime?.trim() || null,
        locationName: body.locationName?.trim() || null,
        locationAddress: body.locationAddress?.trim() || null,
        notes: body.notes?.trim() || null,
        sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
      },
      include: {
        project: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(scheduleDay, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
