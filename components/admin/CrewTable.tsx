"use client";

import { useState, useMemo } from "react";
import type { CRMCrewMember } from "@/lib/crm-types";

interface CrewTableProps {
  crew: CRMCrewMember[];
  onSelectCrew: (crew: CRMCrewMember) => void;
}

type SortKey = "name" | "dayRate" | "lastBooked" | "rating";
type SortDir = "asc" | "desc";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function CrewTable({ crew, onSelectCrew }: CrewTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let result = crew;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortKey === "dayRate") {
        cmp = (a.dayRate ?? 0) - (b.dayRate ?? 0);
      } else if (sortKey === "lastBooked") {
        const aTime = a.lastBooked ? new Date(a.lastBooked).getTime() : 0;
        const bTime = b.lastBooked ? new Date(b.lastBooked).getTime() : 0;
        cmp = aTime - bTime;
      } else if (sortKey === "rating") {
        cmp = (a.rating ?? 0) - (b.rating ?? 0);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [crew, search, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return " \u2195";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search crew..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} max-w-xs`}
        />
      </div>

      <div className="border border-card-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              <th
                onClick={() => handleSort("name")}
                className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:text-white transition-colors select-none"
              >
                Name<span className="text-steel">{sortIcon("name")}</span>
              </th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Role
              </th>
              <th
                onClick={() => handleSort("dayRate")}
                className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:text-white transition-colors select-none"
              >
                Day Rate<span className="text-steel">{sortIcon("dayRate")}</span>
              </th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Location
              </th>
              <th
                onClick={() => handleSort("lastBooked")}
                className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:text-white transition-colors select-none"
              >
                Last Booked<span className="text-steel">{sortIcon("lastBooked")}</span>
              </th>
              <th
                onClick={() => handleSort("rating")}
                className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:text-white transition-colors select-none"
              >
                Rating<span className="text-steel">{sortIcon("rating")}</span>
              </th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Tags
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted text-xs">
                  No crew members found
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectCrew(c)}
                className="border-b border-card-border hover:bg-graphite/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-steel hover:text-white transition-colors">
                    {c.name}
                  </span>
                  {c.email && (
                    <div className="text-muted text-xs mt-0.5">{c.email}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-chrome">{c.role}</td>
                <td className="px-4 py-3 text-chrome">
                  {c.dayRate != null ? `$${c.dayRate.toLocaleString()}` : "-"}
                </td>
                <td className="px-4 py-3 text-chrome">
                  {c.city && c.state
                    ? `${c.city}, ${c.state}`
                    : c.city || c.state || "-"}
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {timeAgo(c.lastBooked)}
                </td>
                <td className="px-4 py-3 text-chrome">
                  {c.rating != null ? c.rating : "-"}
                </td>
                <td className="px-4 py-3">
                  {c.tags ? (
                    <div className="flex flex-wrap gap-1">
                      {c.tags.split(",").map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-card-border text-muted rounded-sm"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
        Showing {filtered.length} of {crew.length} crew members
      </p>
    </div>
  );
}
