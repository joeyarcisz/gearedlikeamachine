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
    const shots = await prisma.shot.findMany({
      where: { shotListId: id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(shots);
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

    const shotList = await prisma.shotList.findUnique({ where: { id } });
    if (!shotList) {
      return NextResponse.json({ error: "Shot list not found" }, { status: 404 });
    }

    if (!body.shotNumber || typeof body.shotNumber !== "string" || !body.shotNumber.trim()) {
      return NextResponse.json({ error: "Shot number is required" }, { status: 400 });
    }
    if (!body.description || typeof body.description !== "string" || !body.description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    // Determine next sort order if not provided
    let sortOrder = body.sortOrder != null ? Number(body.sortOrder) : undefined;
    if (sortOrder === undefined) {
      const lastShot = await prisma.shot.findFirst({
        where: { shotListId: id },
        orderBy: { sortOrder: "desc" },
      });
      sortOrder = (lastShot?.sortOrder ?? -1) + 1;
    }

    const shot = await prisma.shot.create({
      data: {
        shotListId: id,
        shotNumber: body.shotNumber.trim(),
        size: body.size?.trim() || null,
        movement: body.movement?.trim() || null,
        angle: body.angle?.trim() || null,
        lens: body.lens?.trim() || null,
        frameRate: body.frameRate?.trim() || null,
        equipment: body.equipment?.trim() || null,
        lighting: body.lighting?.trim() || null,
        description: body.description.trim(),
        imageUrl: body.imageUrl?.trim() || null,
        notes: body.notes?.trim() || null,
        completed: false,
        sortOrder,
      },
    });

    return NextResponse.json(shot, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
