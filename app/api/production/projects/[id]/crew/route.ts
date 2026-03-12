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
    const crew = await prisma.projectCrew.findMany({
      where: { projectId: id },
      include: {
        crewMember: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    });

    return NextResponse.json(crew);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.role || typeof body.role !== "string" || !body.role.trim()) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const crew = await prisma.projectCrew.create({
      data: {
        projectId: id,
        crewMemberId: body.crewMemberId || null,
        name: body.name.trim(),
        role: body.role.trim(),
        dayRate: body.dayRate != null ? Number(body.dayRate) : null,
        kitFee: body.kitFee != null ? Number(body.kitFee) : null,
        notes: body.notes?.trim() || null,
      },
      include: {
        crewMember: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
      },
    });

    return NextResponse.json(crew, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
