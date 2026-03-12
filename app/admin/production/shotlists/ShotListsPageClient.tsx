"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ShotListSummary } from "@/lib/production-types";

interface ShotListsPageClientProps {
  shotLists: (ShotListSummary & { project: { id: string; title: string } })[];
}

export default function ShotListsPageClient({ shotLists }: ShotListsPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = shotLists.filter((sl) => {
    const q = search.toLowerCase();
    return (
      sl.title.toLowerCase().includes(q) ||
      sl.project.title.toLowerCase().includes(q) ||
      (sl.sceneNumber?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Shot Lists
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {filtered.length} total
          </span>
          <Link
            href="/admin/production/shotlists/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
          >
            + New Shot List
          </Link>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by title or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
        />
      </div>

      {/* Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-body p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">
              {search ? "No shot lists match your search." : "No shot lists yet. Create your first one."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border text-left">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                      Title
                    </th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                      Scene #
                    </th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                      Project
                    </th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal text-center">
                      Shots
                    </th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sl) => (
                    <tr
                      key={sl.id}
                      onClick={() => router.push(`/admin/production/shotlists/${sl.id}`)}
                      className="border-b border-card-border/50 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {sl.title}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {sl.sceneNumber || "\u2014"}
                      </td>
                      <td className="px-4 py-3 text-steel">
                        {sl.project.title}
                      </td>
                      <td className="px-4 py-3 text-center text-muted">
                        {sl._count?.shots ?? 0}
                      </td>
                      <td className="px-4 py-3 text-muted text-xs">
                        {new Date(sl.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
