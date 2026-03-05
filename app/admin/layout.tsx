import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;

  if (!token || !(await validateAdminSession(token))) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
