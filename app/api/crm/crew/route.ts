import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
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
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Prisma.CrewMemberWhereInput = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ];
    }

    const crew = await prisma.crewMember.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(crew);
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

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!body.role || typeof body.role !== "string" || !body.role.trim()) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const crewMember = await prisma.crewMember.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        role: body.role.trim(),
        dayRate: body.dayRate != null ? Number(body.dayRate) : null,
        kitFee: body.kitFee != null ? Number(body.kitFee) : null,
        notes: body.notes?.trim() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
        website: body.website?.trim() || null,
        instagram: body.instagram?.trim() || null,
        imdb: body.imdb?.trim() || null,
        w9OnFile: body.w9OnFile ?? false,
        ndaOnFile: body.ndaOnFile ?? false,
        rating: body.rating != null ? Number(body.rating) : null,
        tags: body.tags?.trim() || null,
      },
    });

    await logActivity({
      type: "created",
      description: `Crew member created: ${crewMember.name} (${crewMember.role})`,
      crewMemberId: crewMember.id,
    });

    return NextResponse.json(crewMember, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
