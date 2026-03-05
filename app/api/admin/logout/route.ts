import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteAdminSession } from "@/lib/admin-auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("glm_admin_token")?.value;

    if (token) {
      await deleteAdminSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("glm_admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
