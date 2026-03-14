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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: {
        contact: { select: { id: true, name: true, company: true } },
      },
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    if (estimate.projectId) {
      return NextResponse.json({ error: "Estimate already linked to a project" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          title: estimate.title,
          clientName: estimate.contact?.company || estimate.contact?.name || null,
          contactId: estimate.contactId,
          status: "pre_production",
          budgetLow: estimate.total,
          budgetHigh: estimate.total,
        },
      });

      const updatedEstimate = await tx.estimate.update({
        where: { id },
        data: {
          projectId: project.id,
          status: "ACCEPTED",
        },
      });

      return { estimate: updatedEstimate, project };
    });

    await logActivity({
      type: "note",
      description: `Converted estimate ${estimate.estimateNumber} to project ${result.project.title}`,
      contactId: estimate.contactId ?? undefined,
    });

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
