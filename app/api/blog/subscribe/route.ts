import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name?.trim() || trimmedEmail.split("@")[0];

    // Upsert: if contact exists with this email, flag as subscriber.
    // If new, create as lead with subscriber flag.
    const existing = await prisma.contact.findFirst({
      where: { email: trimmedEmail },
    });

    if (existing) {
      await prisma.contact.update({
        where: { id: existing.id },
        data: { blogSubscriber: true },
      });
    } else {
      await prisma.contact.create({
        data: {
          name: trimmedName,
          email: trimmedEmail,
          blogSubscriber: true,
          sourceFiles: "blog_subscribe",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
