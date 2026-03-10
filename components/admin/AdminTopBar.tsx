"use client";

import { usePathname, useRouter } from "next/navigation";

interface AdminTopBarProps {
  onToggleSidebar: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/contacts": "Contacts",
  "/admin/contacts/new": "New Contact",
  "/admin/crew": "Crew",
  "/admin/crew/new": "New Crew Member",
  "/admin/pipeline": "Pipeline",
  "/admin/pipeline/new": "New Opportunity",
};

export default function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Handle dynamic routes like /admin/contacts/[id]
  let pageLabel = breadcrumbMap[pathname] || "Admin";
  if (pathname.startsWith("/admin/contacts/") && !breadcrumbMap[pathname]) {
    pageLabel = "Edit Contact";
  } else if (pathname.startsWith("/admin/crew/") && !breadcrumbMap[pathname]) {
    pageLabel = "Edit Crew Member";
  } else if (pathname.startsWith("/admin/pipeline/") && !breadcrumbMap[pathname]) {
    pageLabel = "Edit Opportunity";
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="dashboard-topbar flex items-center justify-between px-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-muted hover:text-white p-1"
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <span className="text-muted text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
          GLM Admin
          <span className="text-card-border mx-2">/</span>
          <span className="text-chrome">{pageLabel}</span>
        </span>
      </div>

      {/* Right: logout */}
      <button
        onClick={handleLogout}
        className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
