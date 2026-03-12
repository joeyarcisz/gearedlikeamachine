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

export async function GET(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    const where = projectId ? { projectId } : {};

    const shotLists = await prisma.shotList.findMany({
      where,
      include: {
        project: { select: { id: true, title: true } },
        _count: { select: { shots: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shotLists);
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

    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.projectId || typeof body.projectId !== "string") {
      return NextResponse.json({ error: "Project is required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: body.projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const shotList = await prisma.shotList.create({
      data: {
        projectId: body.projectId,
        title: body.title.trim(),
        sceneNumber: body.sceneNumber?.trim() || null,
        description: body.description?.trim() || null,
      },
      include: {
        project: { select: { id: true, title: true } },
        _count: { select: { shots: true } },
      },
    });

    return NextResponse.json(shotList, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
