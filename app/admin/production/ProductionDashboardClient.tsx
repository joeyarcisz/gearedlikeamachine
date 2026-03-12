"use client";

import Link from "next/link";
import {
  PROJECT_STATUSES,
  CALL_SHEET_STATUSES,
} from "@/lib/production-types";
import type { CallSheetStatus } from "@/lib/production-types";

interface ScheduleDayRow {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  wrapTime: string | null;
  locationName: string | null;
  project: { id: string; title: string };
}

interface CallSheetRow {
  id: string;
  projectId: string;
  shootDate: string;
  status: CallSheetStatus;
  project: { id: string; title: string };
}

interface DashboardData {
  activeProjects: number;
  projectsByStatus: Record<string, number>;
  upcomingShootDays: ScheduleDayRow[];
  recentCallSheets: CallSheetRow[];
  totalCrew: number;
  totalShots: number;
  completedShots: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status, type }: { status: string; type: "project" | "callsheet" }) {
  const configs = type === "project" ? PROJECT_STATUSES : CALL_SHEET_STATUSES;
  const config = configs.find((s) => s.value === status);
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

export default function ProductionDashboardClient({ data }: { data: DashboardData }) {
  const {
    activeProjects,
    projectsByStatus,
    upcomingShootDays,
    recentCallSheets,
    totalCrew,
    totalShots,
    completedShots,
  } = data;

  const shotPct = totalShots > 0 ? Math.round((completedShots / totalShots) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Production Hub
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Active Projects" value={activeProjects} />
        <StatBox
          label="Upcoming Shoots"
          value={upcomingShootDays.length}
          highlight={upcomingShootDays.length > 0}
        />
        <StatBox
          label="Total Shots"
          value={`${completedShots}/${totalShots}`}
          sub={totalShots > 0 ? `${shotPct}% complete` : undefined}
        />
        <StatBox label="Total Crew" value={totalCrew} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/production/projects/new"
          className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-4 py-2 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Project
        </Link>
        <Link
          href="/admin/production/callsheets/new"
          className="text-[10px] uppercase tracking-widest border border-card-border text-muted px-4 py-2 rounded hover:text-white hover:border-steel transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Call Sheet
        </Link>
        <Link
          href="/admin/production/shotlists/new"
          className="text-[10px] uppercase tracking-widest border border-card-border text-muted px-4 py-2 rounded hover:text-white hover:border-steel transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Shot List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shoots */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Upcoming Shoots
            </h2>
            <Link
              href="/admin/production/schedule"
              className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
            >
              View Schedule
            </Link>
          </div>
          <div className="dashboard-card-body">
            {upcomingShootDays.length === 0 ? (
              <p className="text-muted text-sm">No upcoming shoot days scheduled.</p>
            ) : (
              <div className="space-y-2">
                {upcomingShootDays.map((day) => (
                  <Link
                    key={day.id}
                    href={`/admin/production/projects/${day.projectId}`}
                    className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
                  >
                    <div>
                      <span className="text-white text-sm">{day.project.title}</span>
                      {day.locationName && (
                        <p className="text-muted text-xs mt-0.5">{day.locationName}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-steel text-xs">{formatDate(day.date)}</span>
                      <p className="text-muted text-[10px] mt-0.5">{day.startTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Call Sheets */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Recent Call Sheets
            </h2>
            <Link
              href="/admin/production/callsheets"
              className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
            >
              View All
            </Link>
          </div>
          <div className="dashboard-card-body">
            {recentCallSheets.length === 0 ? (
              <p className="text-muted text-sm">No call sheets yet.</p>
            ) : (
              <div className="space-y-2">
                {recentCallSheets.map((cs) => (
                  <Link
                    key={cs.id}
                    href={`/admin/production/callsheets/${cs.id}`}
                    className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
                  >
                    <div>
                      <span className="text-white text-sm">{cs.project.title}</span>
                      <p className="text-muted text-xs mt-0.5">
                        {formatDate(cs.shootDate)}
                      </p>
                    </div>
                    <StatusBadge status={cs.status} type="callsheet" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects by Status */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Projects by Status
          </h2>
          <Link
            href="/admin/production/projects"
            className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
          >
            View All Projects
          </Link>
        </div>
        <div className="dashboard-card-body">
          {Object.keys(projectsByStatus).length === 0 ? (
            <p className="text-muted text-sm">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {PROJECT_STATUSES.map((ps) => {
                const count = projectsByStatus[ps.value] || 0;
                return (
                  <div key={ps.value} className="text-center">
                    <p className="text-2xl font-bold text-white">{count}</p>
                    <p
                      className="text-[10px] uppercase tracking-widest mt-1 font-[family-name:var(--font-heading)]"
                      style={{ color: ps.color }}
                    >
                      {ps.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
  sub,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  sub?: string;
}) {
  return (
    <div className="dashboard-card">
      <div className="p-4 text-center">
        <p
          className={`text-2xl font-bold ${
            highlight ? "text-amber-400" : "text-white"
          }`}
        >
          {value}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
          {label}
        </p>
        {sub && (
          <p className="text-[10px] text-steel mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}
