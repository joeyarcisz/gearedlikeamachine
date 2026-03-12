"use client";

import { useState, useEffect, useMemo } from "react";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  dayRate: number | null;
  email: string | null;
}

interface CrewSelectorProps {
  onSelect: (crew: {
    id: string;
    name: string;
    role: string;
    dayRate: number | null;
  }) => void;
  onClose: () => void;
}

export default function CrewSelector({ onSelect, onClose }: CrewSelectorProps) {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    async function fetchCrew() {
      try {
        const res = await fetch("/api/crm/crew");
        if (res.ok) {
          const data = await res.json();
          setCrew(data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchCrew();
  }, []);

  const roles = useMemo(() => {
    const roleSet = new Set(crew.map((c) => c.role));
    return Array.from(roleSet).sort();
  }, [crew]);

  const filtered = useMemo(() => {
    let items = crew;
    if (roleFilter !== "All") {
      items = items.filter((c) => c.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q)
      );
    }
    return items;
  }, [crew, roleFilter, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-xl max-h-[80vh] bg-card border border-card-border rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-card-border flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Select Crew Member
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-card-border flex gap-3">
          <input
            type="text"
            placeholder="Search by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-black/60 border border-card-border text-white text-sm px-4 py-2 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
            autoFocus
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-black/60 border border-card-border text-white text-sm px-3 py-2 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer"
          >
            <option value="All">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted text-sm">
              Loading crew...
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted text-sm">
              No crew members found
            </div>
          ) : (
            <div className="divide-y divide-card-border/50">
              {filtered.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    onSelect({
                      id: member.id,
                      name: member.name,
                      role: member.role,
                      dayRate: member.dayRate,
                    });
                    onClose();
                  }}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white">{member.name}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      {member.role}
                    </div>
                  </div>
                  {member.dayRate != null && (
                    <div className="text-sm text-steel ml-4 shrink-0">
                      ${member.dayRate}/day
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
