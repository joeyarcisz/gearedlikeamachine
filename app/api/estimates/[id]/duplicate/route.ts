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

/**
 * Generate next estimate number: GLM-YYYY-NNN
 * Same logic as the main estimates POST route.
 */
async function generateEstimateNumber(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `GLM-${year}-`;

  const latest = await tx.estimate.findFirst({
    where: { estimateNumber: { startsWith: prefix } },
    orderBy: { estimateNumber: "desc" },
    select: { estimateNumber: true },
  });

  let nextNum = 1;
  if (latest) {
    const currentNum = parseInt(latest.estimateNumber.replace(prefix, ""), 10);
    nextNum = currentNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(3, "0")}`;
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

    const source = await prisma.estimate.findUnique({
      where: { id },
      include: {
        lineItems: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!source) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const maxRetries = 3;
    let newEstimate = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        newEstimate = await prisma.$transaction(async (tx) => {
          const estimateNumber = await generateEstimateNumber(tx);

          const estimate = await tx.estimate.create({
            data: {
              estimateNumber,
              title: `${source.title} (Copy)`,
              status: "DRAFT",
              contactId: null,
              opportunityId: null,
              projectId: null,
              shootDays: source.shootDays,
              validUntil: null,
              notes: source.notes,
              clientNotes: source.clientNotes,
              total: source.total,
            },
          });

          if (source.lineItems.length > 0) {
            await tx.estimateLineItem.createMany({
              data: source.lineItems.map((li) => ({
                estimateId: estimate.id,
                catalogItemId: li.catalogItemId,
                name: li.name,
                category: li.category,
                department: li.department,
                rateType: li.rateType,
                unitRate: li.unitRate,
                quantity: li.quantity,
                days: li.days,
                lineTotal: li.lineTotal,
                sortOrder: li.sortOrder,
                notes: li.notes,
              })),
            });
          }

          const full = await tx.estimate.findUnique({
            where: { id: estimate.id },
            include: { lineItems: { orderBy: { sortOrder: "asc" } } },
          });

          return full;
        });

        break;
      } catch (error: unknown) {
        const isUniqueViolation =
          error instanceof Error &&
          "code" in error &&
          (error as { code: string }).code === "P2002";
        if (!isUniqueViolation || attempt === maxRetries - 1) {
          throw error;
        }
      }
    }

    if (!newEstimate) {
      return NextResponse.json({ error: "Failed to duplicate estimate" }, { status: 500 });
    }

    await logActivity({
      type: "note",
      description: `Duplicated estimate ${newEstimate.estimateNumber} from ${source.estimateNumber}`,
    });

    return NextResponse.json(newEstimate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
