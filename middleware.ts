import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API through
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Check for admin token cookie
  const token = request.cookies.get("glm_admin_token")?.value;
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/crm/:path*", "/api/estimates/:path*"],
};
