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

    const where: Prisma.CallSheetWhereInput = {};
    if (projectId) {
      where.projectId = projectId;
    }

    const callSheets = await prisma.callSheet.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        _count: { select: { crewCalls: true } },
      },
      orderBy: { shootDate: "desc" },
    });

    return NextResponse.json(callSheets);
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
    if (!body.shootDate) {
      return NextResponse.json({ error: "Shoot date is required" }, { status: 400 });
    }
    if (!body.callTime || typeof body.callTime !== "string") {
      return NextResponse.json({ error: "Call time is required" }, { status: 400 });
    }

    const callSheet = await prisma.callSheet.create({
      data: {
        projectId: body.projectId,
        shootDate: new Date(body.shootDate),
        callTime: body.callTime.trim(),
        wrapTime: body.wrapTime?.trim() || null,
        locationName: body.locationName?.trim() || null,
        locationAddress: body.locationAddress?.trim() || null,
        parkingNotes: body.parkingNotes?.trim() || null,
        nearestHospital: body.nearestHospital?.trim() || null,
        weatherSummary: body.weatherSummary?.trim() || null,
        weatherTemp: body.weatherTemp?.trim() || null,
        sunrise: body.sunrise?.trim() || null,
        sunset: body.sunset?.trim() || null,
        generalNotes: body.generalNotes?.trim() || null,
        specialInstructions: body.specialInstructions?.trim() || null,
        status: body.status || "draft",
      },
      include: {
        project: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(callSheet, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
