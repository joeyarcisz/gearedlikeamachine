import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

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
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: { opportunities: true },
    });

    if (!contact) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
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

    // Fetch existing to detect stage change
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name.trim();
    if (body.company !== undefined) data.company = body.company?.trim() || null;
    if (body.email !== undefined) {
      const newEmail = body.email?.trim() || null;
      if (newEmail !== (existing.email ?? null)) data.email = newEmail;
    }
    if (body.phone !== undefined) data.phone = body.phone?.trim() || null;
    if (body.stage !== undefined) data.stage = body.stage;
    if (body.lastContact !== undefined)
      data.lastContact = body.lastContact ? new Date(body.lastContact) : null;
    if (body.nextAction !== undefined) data.nextAction = body.nextAction?.trim() || null;
    if (body.notes !== undefined) data.notes = body.notes?.trim() || null;
    if (body.sourceFiles !== undefined) data.sourceFiles = body.sourceFiles?.trim() || null;

    const contact = await prisma.contact.update({
      where: { id },
      data,
    });

    if (body.stage !== undefined && body.stage !== existing.stage) {
      await logActivity({
        type: "stage_change",
        description: `Stage changed from ${existing.stage} to ${body.stage}`,
        contactId: id,
        metadata: { from: existing.stage, to: body.stage },
      });
    }

    return NextResponse.json(contact);
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
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
