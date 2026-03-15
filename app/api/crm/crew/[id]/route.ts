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
    const crewMember = await prisma.crewMember.findUnique({
      where: { id },
      include: { activities: { orderBy: { createdAt: "desc" }, take: 50 } },
    });

    if (!crewMember) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(crewMember);
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

    const existing = await prisma.crewMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.role !== undefined) data.role = body.role.trim();
    if (body.email !== undefined) {
      const newEmail = body.email?.trim() || null;
      if (newEmail !== (existing.email ?? null)) data.email = newEmail;
    }
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
    if (body.dayRate !== undefined) data.dayRate = body.dayRate != null ? Number(body.dayRate) : null;
    if (body.kitFee !== undefined) data.kitFee = body.kitFee != null ? Number(body.kitFee) : null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.city !== undefined) data.city = body.city?.trim() || null;
    if (body.state !== undefined) data.state = body.state?.trim() || null;
    if (body.website !== undefined) data.website = body.website?.trim() || null;
    if (body.instagram !== undefined) data.instagram = body.instagram?.trim() || null;
    if (body.imdb !== undefined) data.imdb = body.imdb?.trim() || null;
    if (body.w9OnFile !== undefined) data.w9OnFile = body.w9OnFile;
    if (body.ndaOnFile !== undefined) data.ndaOnFile = body.ndaOnFile;
    if (body.rating !== undefined) data.rating = body.rating != null ? Number(body.rating) : null;
    if (body.tags !== undefined) data.tags = body.tags?.trim() || null;
    if (body.lastBooked !== undefined) data.lastBooked = body.lastBooked ? new Date(body.lastBooked) : null;

    const crewMember = await prisma.crewMember.update({
      where: { id },
      data,
    });

    return NextResponse.json(crewMember);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Crew deletion is disabled. Archive by adding a tag instead." },
    { status: 405 }
  );
}
