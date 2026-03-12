"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PROJECT_STATUSES,
  PROJECT_TYPE_LABELS,
} from "@/lib/production-types";
import type { ProjectSummary, ProjectStatus } from "@/lib/production-types";

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = PROJECT_STATUSES.find((s) => s.value === status);
  const color = config?.color ?? "#707070";
  const label = config?.label ?? status;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] rounded-full whitespace-nowrap"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBudget(low: number | null, high: number | null) {
  if (!low && !high) return "—";
  if (low && high) return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  if (low) return `$${low.toLocaleString()}+`;
  return `Up to $${high!.toLocaleString()}`;
}

interface ProjectsPageClientProps {
  projects: ProjectSummary[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let results = projects;

    if (statusFilter !== "all") {
      results = results.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.clientName && p.clientName.toLowerCase().includes(q))
      );
    }

    return results;
  }, [projects, search, statusFilter]);

  const inputClasses =
    "bg-black/60 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Projects
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {filtered.length} total
          </span>
          <Link
            href="/admin/production/projects/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by title or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} flex-1`}
        />
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setStatusFilter("all")}
          className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border rounded-sm transition-colors ${
            statusFilter === "all"
              ? "border-steel text-steel bg-steel/10"
              : "border-card-border text-muted hover:text-white"
          }`}
        >
          All ({projects.length})
        </button>
        {PROJECT_STATUSES.map((ps) => {
          const count = projects.filter((p) => p.status === ps.value).length;
          if (count === 0) return null;
          return (
            <button
              key={ps.value}
              onClick={() => setStatusFilter(ps.value)}
              className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border rounded-sm transition-colors ${
                statusFilter === ps.value
                  ? "border-steel text-steel bg-steel/10"
                  : "border-card-border text-muted hover:text-white"
              }`}
            >
              {ps.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-body p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted text-sm">No projects found.</p>
              {projects.length === 0 && (
                <Link
                  href="/admin/production/projects/new"
                  className="inline-block mt-4 text-steel hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                >
                  Create your first project
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Title
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Client
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden lg:table-cell">
                      Dates
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden lg:table-cell">
                      Budget
                    </th>
                    <th className="text-center text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden xl:table-cell">
                      Sheets
                    </th>
                    <th className="text-center text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden xl:table-cell">
                      Shots
                    </th>
                    <th className="text-center text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden xl:table-cell">
                      Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/admin/production/projects/${p.id}`)}
                      className="border-b border-card-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-steel hover:text-white transition-colors text-sm">
                          {p.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-chrome text-sm">
                          {p.clientName || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted text-sm">
                          {p.projectType
                            ? PROJECT_TYPE_LABELS[p.projectType] || p.projectType
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-muted text-xs">
                          {p.startDate ? formatDate(p.startDate) : "—"}
                          {p.endDate && ` — ${formatDate(p.endDate)}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-muted text-xs">
                          {formatBudget(p.budgetLow, p.budgetHigh)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden xl:table-cell">
                        <span className="text-muted text-sm">
                          {p._count?.callSheets ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden xl:table-cell">
                        <span className="text-muted text-sm">
                          {p._count?.shotLists ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden xl:table-cell">
                        <span className="text-muted text-sm">
                          {p._count?.scheduleDays ?? 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <p className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
        Showing {filtered.length} of {projects.length} projects
      </p>
    </div>
  );
}
