"use client";

import { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearPlayLogo } from "@/components/icons";

const adminNav = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon, exact: true },
  { label: "Contacts", href: "/admin/contacts", icon: ContactsIcon },
  { label: "Pipeline", href: "/admin/pipeline", icon: PipelineIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminTopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`sidebar-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-card-border">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <GearPlayLogo className="w-8 h-8 text-steel shrink-0" />
            <span className="font-[family-name:var(--font-heading)] text-[11px] font-bold tracking-[0.12em] uppercase text-white sidebar-label leading-tight">
              Geared Like<br />A Machine
            </span>
          </Link>
        </div>

        {/* Admin label */}
        <div className="px-4 py-2 border-b border-card-border">
          <span className="sidebar-label text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)]">
            Admin CRM
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {adminNav.map((link) => {
            const isActive = "exact" in link && link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200 rounded ${
                  isActive
                    ? "text-steel bg-steel/10"
                    : "text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="sidebar-label font-[family-name:var(--font-heading)]">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: back to site */}
        <div className="mt-auto border-t border-card-border px-4 py-4">
          <Link
            href="/"
            className="sidebar-label flex items-center gap-2 text-muted hover:text-steel transition-colors text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]"
          >
            <BackArrowIcon className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function ContactsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PipelineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
