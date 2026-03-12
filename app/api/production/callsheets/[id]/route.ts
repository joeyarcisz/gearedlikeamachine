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
    const callSheet = await prisma.callSheet.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, title: true, clientName: true } },
        crewCalls: {
          orderBy: { callTime: "asc" },
          include: {
            crewMember: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
      },
    });

    if (!callSheet) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(callSheet);
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

    const existing = await prisma.callSheet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.shootDate !== undefined) data.shootDate = new Date(body.shootDate);
    if (body.callTime !== undefined) data.callTime = body.callTime.trim();
    if (body.wrapTime !== undefined) data.wrapTime = body.wrapTime?.trim() || null;
    if (body.locationName !== undefined) data.locationName = body.locationName?.trim() || null;
    if (body.locationAddress !== undefined) data.locationAddress = body.locationAddress?.trim() || null;
    if (body.parkingNotes !== undefined) data.parkingNotes = body.parkingNotes?.trim() || null;
    if (body.nearestHospital !== undefined) data.nearestHospital = body.nearestHospital?.trim() || null;
    if (body.weatherSummary !== undefined) data.weatherSummary = body.weatherSummary?.trim() || null;
    if (body.weatherTemp !== undefined) data.weatherTemp = body.weatherTemp?.trim() || null;
    if (body.sunrise !== undefined) data.sunrise = body.sunrise?.trim() || null;
    if (body.sunset !== undefined) data.sunset = body.sunset?.trim() || null;
    if (body.generalNotes !== undefined) data.generalNotes = body.generalNotes?.trim() || null;
    if (body.specialInstructions !== undefined) data.specialInstructions = body.specialInstructions?.trim() || null;
    if (body.status !== undefined) data.status = body.status;

    const callSheet = await prisma.callSheet.update({
      where: { id },
      data,
      include: {
        project: { select: { id: true, title: true } },
        crewCalls: {
          orderBy: { callTime: "asc" },
        },
      },
    });

    return NextResponse.json(callSheet);
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
    await prisma.callSheet.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
