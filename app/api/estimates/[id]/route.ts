import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { computeLineTotal } from "@/lib/estimate-utils";

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

    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: {
        contact: { select: { id: true, name: true, company: true, email: true } },
        opportunity: { select: { id: true, title: true } },
        project: { select: { id: true, title: true } },
        lineItems: {
          orderBy: { sortOrder: "asc" },
          include: {
            catalogItem: {
              select: { id: true, name: true, isOwnerLabor: true, markupPercent: true, baseRate: true },
            },
          },
        },
      },
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json(estimate);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.estimate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    // Update estimate metadata + optionally sync line items in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.estimate.update({
        where: { id },
        data: {
          title: body.title?.trim() ?? existing.title,
          status: body.status ?? existing.status,
          contactId: body.contactId !== undefined ? (body.contactId || null) : existing.contactId,
          opportunityId: body.opportunityId !== undefined ? (body.opportunityId || null) : existing.opportunityId,
          projectId: body.projectId !== undefined ? (body.projectId || null) : existing.projectId,
          shootDays: body.shootDays !== undefined ? (body.shootDays != null ? Number(body.shootDays) : null) : existing.shootDays,
          validUntil: body.validUntil !== undefined ? (body.validUntil ? new Date(body.validUntil) : null) : existing.validUntil,
          notes: body.notes !== undefined ? (body.notes?.trim() || null) : existing.notes,
          clientNotes: body.clientNotes !== undefined ? (body.clientNotes?.trim() || null) : existing.clientNotes,
        },
      });

      // Bulk line item sync: if lineItems array is provided, diff against existing
      if (Array.isArray(body.lineItems)) {
        const existingItems = await tx.estimateLineItem.findMany({
          where: { estimateId: id },
          select: { id: true },
        });
        const existingIds = new Set(existingItems.map((i) => i.id));
        const incomingIds = new Set(
          body.lineItems.filter((li: { id?: string }) => li.id && existingIds.has(li.id)).map((li: { id: string }) => li.id)
        );

        // Delete items not in incoming array
        const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));
        if (toDelete.length > 0) {
          await tx.estimateLineItem.deleteMany({
            where: { id: { in: toDelete } },
          });
        }

        // Update existing items + create new items
        let newTotal = 0;
        for (let i = 0; i < body.lineItems.length; i++) {
          const li = body.lineItems[i];
          const lineTotal = computeLineTotal(
            li.unitRate,
            li.quantity ?? 1,
            li.days ?? 1,
            li.rateType || "DAY"
          );
          newTotal += lineTotal;

          if (li.id && existingIds.has(li.id)) {
            // Update existing
            await tx.estimateLineItem.update({
              where: { id: li.id },
              data: {
                name: li.name,
                category: li.category,
                department: li.department || null,
                rateType: li.rateType || "DAY",
                unitRate: li.unitRate,
                quantity: li.quantity ?? 1,
                days: li.days ?? 1,
                lineTotal,
                sortOrder: i,
                notes: li.notes || null,
                catalogItemId: li.catalogItemId || null,
              },
            });
          } else {
            // Create new
            await tx.estimateLineItem.create({
              data: {
                estimateId: id,
                name: li.name,
                category: li.category,
                department: li.department || null,
                rateType: li.rateType || "DAY",
                unitRate: li.unitRate,
                quantity: li.quantity ?? 1,
                days: li.days ?? 1,
                lineTotal,
                sortOrder: i,
                notes: li.notes || null,
                catalogItemId: li.catalogItemId || null,
              },
            });
          }
        }

        // Update estimate total
        await tx.estimate.update({
          where: { id },
          data: { total: newTotal },
        });
      }

      return updated;
    });

    if (body.status && body.status !== existing.status) {
      const statusLabel = body.status.charAt(0) + body.status.slice(1).toLowerCase();
      await logActivity({
        type: "note",
        description: `Estimate ${existing.estimateNumber} marked as ${statusLabel}`,
        contactId: result.contactId ?? undefined,
        opportunityId: result.opportunityId ?? undefined,
      });
    }

    return NextResponse.json(result);
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

    const existing = await prisma.estimate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    await prisma.estimate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
