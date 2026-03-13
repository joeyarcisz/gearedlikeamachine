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

export async function GET(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const templateId = searchParams.get("templateId");
    const projectId = searchParams.get("projectId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (templateId) where.templateId = templateId;
    if (projectId === "standalone") {
      where.projectId = null;
    } else if (projectId) {
      where.projectId = projectId;
    }
    if (search) {
      where.OR = [
        { recipientName: { contains: search, mode: "insensitive" } },
        { template: { name: { contains: search, mode: "insensitive" } } },
        { project: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        template: { select: { id: true, name: true, slug: true, category: true, requiresSignature: true, isExternal: true } },
        project: { select: { id: true, title: true } },
        signature: true,
        crewInvoice: { include: { crewMember: { select: { id: true, name: true } } } },
      },
    });

    // Stats
    const stats = {
      total: documents.length,
      awaiting: documents.filter((d) => ["SENT", "VIEWED"].includes(d.status)).length,
      completedToday: documents.filter((d) => {
        if (!d.completedAt) return false;
        const today = new Date().toISOString().split("T")[0];
        return d.completedAt.toISOString().split("T")[0] === today;
      }).length,
      overdue: documents.filter((d) => {
        if (!d.expiresAt || d.status === "COMPLETED" || d.status === "CANCELLED") return false;
        return new Date(d.expiresAt) < new Date();
      }).length,
    };

    return NextResponse.json({ documents, stats });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { templateId, projectId, formData, recipientName, recipientEmail, expiresAt, crewMemberId } = body;

    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    const template = await prisma.documentTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const document = await prisma.document.create({
      data: {
        templateId,
        projectId: projectId || null,
        formData: formData || {},
        recipientName: recipientName || null,
        recipientEmail: recipientEmail || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "DRAFT",
      },
      include: {
        template: { select: { id: true, name: true, slug: true, category: true, requiresSignature: true, isExternal: true } },
        project: { select: { id: true, title: true } },
      },
    });

    // If this is a crew invoice, create the CrewInvoice record
    if (template.slug === "crew-invoice" && crewMemberId) {
      await prisma.crewInvoice.create({
        data: {
          documentId: document.id,
          crewMemberId,
          status: "SENT",
        },
      });
    }

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
