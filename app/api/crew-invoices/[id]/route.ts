import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) return false;
  return true;
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
    const { status, paidNote } = body;

    const existing = await prisma.crewInvoice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Crew invoice not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (status === "PAID") {
      updateData.paidAt = new Date();
      if (paidNote) updateData.paidNote = paidNote;
    }

    const invoice = await prisma.crewInvoice.update({
      where: { id },
      data: updateData,
      include: {
        crewMember: { select: { id: true, name: true } },
        document: { select: { id: true, formData: true } },
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating crew invoice:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
