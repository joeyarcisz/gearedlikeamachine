"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CrewTable from "@/components/admin/CrewTable";
import SlideOutPanel from "@/components/admin/SlideOutPanel";
import CrewQuickPanel from "@/components/admin/CrewQuickPanel";
import { CREW_ROLES } from "@/lib/crm-types";
import type { CRMCrewMember } from "@/lib/crm-types";

interface CrewPageClientProps {
  crew: CRMCrewMember[];
}

export default function CrewPageClient({ crew: initialCrew }: CrewPageClientProps) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedCrew, setSelectedCrew] = useState<CRMCrewMember | null>(null);

  const filtered = useMemo(() => {
    if (roleFilter === "all") return initialCrew;
    return initialCrew.filter((c) => c.role === roleFilter);
  }, [initialCrew, roleFilter]);

  const selectClasses =
    "bg-black/60 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Crew
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {initialCrew.length} total
          </span>
          <Link
            href="/admin/crew/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
          >
            + New Crew
          </Link>
        </div>
      </div>

      {/* Role filter */}
      <div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={selectClasses}
        >
          <option value="all">All Roles</option>
          {CREW_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <CrewTable crew={filtered} onSelectCrew={setSelectedCrew} />

      <SlideOutPanel
        open={!!selectedCrew}
        onClose={() => setSelectedCrew(null)}
      >
        {selectedCrew && (
          <CrewQuickPanel
            key={selectedCrew.id}
            crew={selectedCrew}
            onClose={() => setSelectedCrew(null)}
          />
        )}
      </SlideOutPanel>
    </div>
  );
}
