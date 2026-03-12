"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CALL_SHEET_STATUSES } from "@/lib/production-types";
import type { CallSheetStatus } from "@/lib/production-types";

interface CallSheetRow {
  id: string;
  projectId: string;
  project: { id: string; title: string };
  shootDate: string;
  callTime: string;
  wrapTime: string | null;
  locationName: string | null;
  status: CallSheetStatus;
  _count: { crewCalls: number };
}

interface CallSheetsPageClientProps {
  callSheets: CallSheetRow[];
}

function StatusBadge({ status }: { status: CallSheetStatus }) {
  const config = CALL_SHEET_STATUSES.find((s) => s.value === status);
  const color = config?.color ?? "#707070";
  const label = config?.label ?? status;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] rounded-full"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CallSheetsPageClient({
  callSheets,
}: CallSheetsPageClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let results = callSheets;

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (cs) =>
          cs.project.title.toLowerCase().includes(q) ||
          (cs.locationName && cs.locationName.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((cs) => cs.status === statusFilter);
    }

    return results;
  }, [callSheets, search, statusFilter]);

  const inputClasses =
    "bg-black/60 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const selectClasses =
    "bg-black/60 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Call Sheets
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {filtered.length} total
          </span>
          <Link
            href="/admin/production/callsheets/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
          >
            + New Call Sheet
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by project or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} flex-1`}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${selectClasses} sm:w-48`}
        >
          <option value="all">All Statuses</option>
          {CALL_SHEET_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-body p-0">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted text-sm">No call sheets found.</p>
              {callSheets.length === 0 && (
                <Link
                  href="/admin/production/callsheets/new"
                  className="inline-block mt-4 text-steel hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                >
                  Create your first call sheet
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Shoot Date
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Project
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden md:table-cell">
                      Location
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Call Time
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Wrap Time
                    </th>
                    <th className="text-center text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden lg:table-cell">
                      Crew
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cs) => (
                    <tr
                      key={cs.id}
                      className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/production/callsheets/${cs.id}`}
                          className="text-white text-sm hover:text-steel transition-colors"
                        >
                          {formatDate(cs.shootDate)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-chrome text-sm">
                          {cs.project.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted text-sm">
                          {cs.locationName || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted text-sm">{cs.callTime}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted text-sm">
                          {cs.wrapTime || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <span className="text-muted text-sm">
                          {cs._count.crewCalls}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={cs.status} />
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
