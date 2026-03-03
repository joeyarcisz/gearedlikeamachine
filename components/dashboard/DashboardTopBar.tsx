"use client";

import { usePathname } from "next/navigation";

interface DashboardTopBarProps {
  onToggleSidebar: () => void;
}

const breadcrumbMap: Record<string, string> = {
  "/": "Command Grid",
  "/rentals": "Gear Rentals",
  "/scope": "Scope Tool",
};

export default function DashboardTopBar({ onToggleSidebar }: DashboardTopBarProps) {
  const pathname = usePathname();
  const pageLabel = breadcrumbMap[pathname] || "Command Grid";

  return (
    <div className="dashboard-topbar flex items-center justify-between px-4">
      {/* Left: hamburger (mobile) + breadcrumb */}
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
          Geared Like A Machine
          <span className="text-card-border mx-2">/</span>
          <span className="text-chrome">{pageLabel}</span>
        </span>
      </div>

      {/* Right: status indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
        <span className="text-chrome text-[10px] uppercase tracking-widest hidden sm:inline">
          All Systems Operational
        </span>
      </div>
    </div>
  );
}
