"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface ScheduleDayRow {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  wrapTime: string | null;
  locationName: string | null;
  locationAddress: string | null;
  notes: string | null;
  project: { id: string; title: string };
  _count: {
    crewAssignments: number;
    equipmentAssignments: number;
  };
}

interface SchedulePageClientProps {
  scheduleDays: ScheduleDayRow[];
  projects: { id: string; title: string }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDateFull(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function isPast(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

function isToday(d: Date) {
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getFullYear() &&
    d.getUTCMonth() === now.getMonth() &&
    d.getUTCDate() === now.getDate()
  );
}

export default function SchedulePageClient({
  scheduleDays,
  projects,
}: SchedulePageClientProps) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Filter for list view
  const filtered = useMemo(() => {
    let items = scheduleDays;
    if (projectFilter) {
      items = items.filter((d) => d.projectId === projectFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (d) =>
          d.project.title.toLowerCase().includes(q) ||
          (d.locationName?.toLowerCase().includes(q) ?? false) ||
          (d.locationAddress?.toLowerCase().includes(q) ?? false)
      );
    }
    return items;
  }, [scheduleDays, projectFilter, search]);

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const { year, month } = calMonth;
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const startOffset = firstDay.getUTCDay();
    const totalDays = lastDay.getUTCDate();

    const days: { date: Date | null; shoots: ScheduleDayRow[] }[] = [];

    // Leading empty cells
    for (let i = 0; i < startOffset; i++) {
      days.push({ date: null, shoots: [] });
    }

    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(Date.UTC(year, month, d));
      const shoots = scheduleDays.filter((s) => {
        const sd = new Date(s.date);
        return isSameDay(sd, date);
      });
      days.push({ date, shoots });
    }

    return days;
  }, [calMonth, scheduleDays]);

  const monthLabel = new Date(
    Date.UTC(calMonth.year, calMonth.month, 1)
  ).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  function prevMonth() {
    setCalMonth((prev) => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: m };
    });
  }

  function nextMonth() {
    setCalMonth((prev) => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: m };
    });
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Schedule
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {scheduleDays.length} shoot {scheduleDays.length === 1 ? "day" : "days"}
          </span>

          {/* View toggle */}
          <div className="flex border border-card-border rounded overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors ${
                view === "list"
                  ? "bg-steel text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors ${
                view === "calendar"
                  ? "bg-steel text-black"
                  : "text-muted hover:text-white"
              }`}
            >
              Calendar
            </button>
          </div>

          <Link
            href="/admin/production/schedule/new"
            className="text-[10px] uppercase tracking-widest bg-steel text-black px-3 py-1.5 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
          >
            + New Shoot Day
          </Link>
        </div>
      </div>

      {view === "list" ? (
        <>
          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search project or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/60 border border-card-border text-white text-sm px-4 py-2 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50 w-64"
            />
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-black/60 border border-card-border text-white text-sm px-3 py-2 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="dashboard-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Project
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Location
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Start
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Wrap
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Crew
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Equipment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-muted text-sm"
                      >
                        No shoot days found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((day) => (
                      <tr
                        key={day.id}
                        className={`border-b border-card-border/50 hover:bg-white/5 transition-colors ${
                          isPast(day.date) ? "opacity-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/production/schedule/${day.id}`}
                            className="text-white hover:text-steel transition-colors"
                          >
                            {formatDateFull(day.date)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-chrome">
                          {day.project.title}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {day.locationName || "-"}
                        </td>
                        <td className="px-4 py-3 text-chrome">{day.startTime}</td>
                        <td className="px-4 py-3 text-muted">
                          {day.wrapTime || "-"}
                        </td>
                        <td className="px-4 py-3 text-chrome">
                          {day._count.crewAssignments}
                        </td>
                        <td className="px-4 py-3 text-chrome">
                          {day._count.equipmentAssignments}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Calendar View */
        <div className="dashboard-card">
          {/* Month navigation */}
          <div className="dashboard-card-header justify-between">
            <button
              onClick={prevMonth}
              className="text-muted hover:text-white transition-colors text-sm px-2"
            >
              &larr;
            </button>
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              {monthLabel}
            </h2>
            <button
              onClick={nextMonth}
              className="text-muted hover:text-white transition-colors text-sm px-2"
            >
              &rarr;
            </button>
          </div>

          <div className="dashboard-card-body p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-card-border">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center py-2 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((cell, idx) => {
                if (!cell.date) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[90px] border-b border-r border-card-border/30 bg-black/20"
                    />
                  );
                }

                const dayNum = cell.date.getUTCDate();
                const today = isToday(cell.date);
                const hasShoots = cell.shoots.length > 0;

                return (
                  <div
                    key={dayNum}
                    className={`min-h-[90px] border-b border-r border-card-border/30 p-1.5 ${
                      today ? "bg-steel/10 ring-1 ring-inset ring-steel/30" : ""
                    } ${hasShoots ? "bg-white/[0.02]" : ""}`}
                  >
                    <div
                      className={`text-[11px] font-[family-name:var(--font-heading)] mb-1 ${
                        today ? "text-steel font-bold" : "text-muted"
                      }`}
                    >
                      {dayNum}
                    </div>
                    <div className="space-y-0.5">
                      {cell.shoots.map((shoot) => (
                        <Link
                          key={shoot.id}
                          href={`/admin/production/schedule/${shoot.id}`}
                          className="block px-1.5 py-1 bg-steel/15 border border-steel/20 rounded text-[10px] text-steel truncate hover:bg-steel/25 transition-colors"
                          title={`${shoot.project.title} - ${shoot.startTime}`}
                        >
                          <span className="font-medium">{shoot.startTime}</span>{" "}
                          <span className="text-chrome">
                            {shoot.project.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
