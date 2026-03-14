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

/**
 * Generate next estimate number: GLM-YYYY-NNN
 * Uses transaction with retry on unique constraint violation.
 */
async function generateEstimateNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `GLM-${year}-`;
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await prisma.$transaction(async (tx) => {
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

        const estimateNumber = `${prefix}${String(nextNum).padStart(3, "0")}`;
        return estimateNumber;
      });

      return result;
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

  throw new Error("Failed to generate estimate number after retries");
}

export async function GET(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Prisma.EstimateWhereInput = {};
    if (status) {
      where.status = status as Prisma.EstimateWhereInput["status"];
    }

    const estimates = await prisma.estimate.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        contact: {
          select: { id: true, name: true, company: true },
        },
      },
    });

    return NextResponse.json(estimates);
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

    const estimateNumber = await generateEstimateNumber();

    const estimate = await prisma.estimate.create({
      data: {
        estimateNumber,
        title: body.title.trim(),
        status: body.status ?? "DRAFT",
        contactId: body.contactId || null,
        opportunityId: body.opportunityId || null,
        projectId: body.projectId || null,
        shootDays: body.shootDays != null ? Number(body.shootDays) : null,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        notes: body.notes?.trim() || null,
        clientNotes: body.clientNotes?.trim() || null,
      },
    });

    await logActivity({
      type: "note",
      description: `Created estimate ${estimateNumber}`,
      contactId: estimate.contactId ?? undefined,
      opportunityId: estimate.opportunityId ?? undefined,
    });

    return NextResponse.json(estimate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
