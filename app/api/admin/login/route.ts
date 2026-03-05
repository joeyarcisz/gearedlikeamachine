import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    }

    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createAdminSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set("glm_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
