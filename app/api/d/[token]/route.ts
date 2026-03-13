import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const document = await prisma.document.findUnique({
      where: { token },
      include: {
        template: {
          select: {
            name: true,
            slug: true,
            category: true,
            requiresSignature: true,
            isExternal: true,
            fieldSchema: true,
          },
        },
        project: { select: { title: true } },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (document.status === "COMPLETED") {
      return NextResponse.json({
        status: "COMPLETED",
        completedAt: document.completedAt,
        templateName: document.template.name,
      });
    }

    if (document.status === "EXPIRED" || (document.expiresAt && new Date(document.expiresAt) < new Date())) {
      return NextResponse.json({ status: "EXPIRED" });
    }

    if (document.status === "CANCELLED") {
      return NextResponse.json({ status: "CANCELLED" });
    }

    return NextResponse.json({
      token: document.token,
      status: document.status,
      templateName: document.template.name,
      templateSlug: document.template.slug,
      category: document.template.category,
      requiresSignature: document.template.requiresSignature,
      fieldSchema: document.template.fieldSchema,
      formData: document.formData,
      projectName: document.project?.title || null,
      recipientName: document.recipientName,
      expiresAt: document.expiresAt,
    });
  } catch (error) {
    console.error("Error fetching public document:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const document = await prisma.document.findUnique({
      where: { token },
      include: {
        template: { select: { requiresSignature: true, slug: true } },
        crewInvoice: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (document.status === "COMPLETED") {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }

    if (document.status === "CANCELLED") {
      return NextResponse.json({ error: "Document cancelled" }, { status: 400 });
    }

    if (document.expiresAt && new Date(document.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Document expired" }, { status: 400 });
    }

    const body = await request.json();
    const { formData, signature, paymentMethod, paymentDetails } = body;

    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip") || "unknown";
    const userAgent = headerStore.get("user-agent") || "unknown";

    // Update document
    await prisma.document.update({
      where: { token },
      data: {
        formData: { ...(document.formData as object), ...formData },
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Create signature if required
    if (document.template.requiresSignature && signature?.signerName) {
      await prisma.signature.create({
        data: {
          documentId: document.id,
          signerName: signature.signerName,
          signerIP: ip,
          userAgent,
        },
      });
    }

    // Update crew invoice if applicable
    if (document.crewInvoice && paymentMethod) {
      await prisma.crewInvoice.update({
        where: { id: document.crewInvoice.id },
        data: {
          paymentMethod,
          paymentDetails: paymentDetails || null,
          status: "RETURNED",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting document:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Mark document as viewed (triggered by client-side interaction)
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const document = await prisma.document.findUnique({ where: { token } });

    if (!document || document.status !== "SENT") {
      return NextResponse.json({ success: true });
    }

    await prisma.document.update({
      where: { token },
      data: { status: "VIEWED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking viewed:", error);
    return NextResponse.json({ success: true }); // Non-critical, don't fail
  }
}
