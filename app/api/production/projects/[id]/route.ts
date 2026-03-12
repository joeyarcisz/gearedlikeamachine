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
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        contact: { select: { id: true, name: true, company: true, email: true, phone: true } },
        callSheets: {
          orderBy: { shootDate: "desc" },
          include: { _count: { select: { crewCalls: true } } },
        },
        shotLists: {
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { shots: true } } },
        },
        scheduleDays: {
          orderBy: { date: "asc" },
          include: {
            _count: {
              select: { crewAssignments: true, equipmentAssignments: true },
            },
          },
        },
        projectCrew: {
          include: {
            crewMember: {
              select: { id: true, name: true, email: true, phone: true, role: true },
            },
          },
        },
        projectEquipment: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(project);
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title.trim();
    if (body.clientName !== undefined) data.clientName = body.clientName?.trim() || null;
    if (body.contactId !== undefined) data.contactId = body.contactId || null;
    if (body.status !== undefined) data.status = body.status;
    if (body.projectType !== undefined) data.projectType = body.projectType?.trim() || null;
    if (body.description !== undefined) data.description = body.description?.trim() || null;
    if (body.startDate !== undefined) data.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.budgetLow !== undefined) data.budgetLow = body.budgetLow != null ? Number(body.budgetLow) : null;
    if (body.budgetHigh !== undefined) data.budgetHigh = body.budgetHigh != null ? Number(body.budgetHigh) : null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;

    const project = await prisma.project.update({
      where: { id },
      data,
    });

    return NextResponse.json(project);
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
