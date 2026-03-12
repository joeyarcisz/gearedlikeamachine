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
    const equipment = await prisma.projectEquipment.findMany({
      where: { projectId: id },
    });

    return NextResponse.json(equipment);
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

    if (!body.itemName || typeof body.itemName !== "string" || !body.itemName.trim()) {
      return NextResponse.json({ error: "Item name is required" }, { status: 400 });
    }

    const equipment = await prisma.projectEquipment.create({
      data: {
        projectId: id,
        itemName: body.itemName.trim(),
        category: body.category?.trim() || null,
        dailyRate: body.dailyRate != null ? Number(body.dailyRate) : null,
        quantity: body.quantity != null ? Number(body.quantity) : 1,
        notes: body.notes?.trim() || null,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
