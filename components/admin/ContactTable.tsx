"use client";

import { useState, useMemo, useEffect } from "react";
import InlineStageDropdown from "./InlineStageDropdown";
import { CONTACT_STAGES, CONTACT_STAGE_LABELS } from "@/lib/crm-types";
import type { CRMContact } from "@/lib/crm-types";

interface ContactTableProps {
  contacts: CRMContact[];
  onSelectContact: (contact: CRMContact) => void;
}

type SortKey = "name" | "company" | "stage" | "lastContact";
type SortDir = "asc" | "desc";

export default function ContactTable({ contacts, onSelectContact }: ContactTableProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [localContacts, setLocalContacts] = useState(contacts);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  const filtered = useMemo(() => {
    let result = localContacts;

    // Stage filter
    if (stageFilter !== "all") {
      result = result.filter((c) => c.stage === stageFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [localContacts, search, stageFilter, sortKey, sortDir]);

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
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} max-w-xs`}
        />
      </div>

      {/* Stage filter pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setStageFilter("all")}
          className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border rounded-sm transition-colors ${
            stageFilter === "all"
              ? "border-steel text-steel bg-steel/10"
              : "border-card-border text-muted hover:text-white"
          }`}
        >
          All ({localContacts.length})
        </button>
        {CONTACT_STAGES.map((stage) => {
          const count = localContacts.filter((c) => c.stage === stage).length;
          if (count === 0) return null;
          return (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border rounded-sm transition-colors ${
                stageFilter === stage
                  ? "border-steel text-steel bg-steel/10"
                  : "border-card-border text-muted hover:text-white"
              }`}
            >
              {CONTACT_STAGE_LABELS[stage]} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="border border-card-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              {(
                [
                  ["name", "Name"],
                  ["company", "Company"],
                  ["stage", "Stage"],
                  ["lastContact", "Last Contact"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] cursor-pointer hover:text-white transition-colors select-none"
                >
                  {label}
                  <span className="text-steel">{sortIcon(key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted text-xs">
                  No contacts found
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectContact(c)}
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
                <td className="px-4 py-3 text-chrome">
                  {c.company || "-"}
                </td>
                <td className="px-4 py-3">
                  <InlineStageDropdown
                    stage={c.stage}
                    type="contact"
                    entityId={c.id}
                    onUpdated={(newStage) => {
                      setLocalContacts((prev) =>
                        prev.map((lc) => lc.id === c.id ? { ...lc, stage: newStage } : lc)
                      );
                    }}
                  />
                </td>
                <td className="px-4 py-3 text-muted text-xs">
                  {c.lastContact
                    ? new Date(c.lastContact).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
        Showing {filtered.length} of {localContacts.length} contacts
      </p>
    </div>
  );
}
