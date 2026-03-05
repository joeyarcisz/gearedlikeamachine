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
    const stage = searchParams.get("stage");

    const where: Prisma.ContactWhereInput = {};
    if (stage) {
      where.stage = stage as Prisma.ContactWhereInput["stage"];
    }

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(contacts);
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

    const contact = await prisma.contact.create({
      data: {
        name: body.name.trim(),
        company: body.company?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        stage: body.stage || "lead",
        lastContact: body.lastContact ? new Date(body.lastContact) : null,
        nextAction: body.nextAction?.trim() || null,
        notes: body.notes?.trim() || null,
        sourceFiles: body.sourceFiles?.trim() || null,
      },
    });

    await logActivity({
      type: "created",
      description: `Contact created: ${contact.name}`,
      contactId: contact.id,
    });

    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
