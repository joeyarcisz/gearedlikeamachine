"use client";

import { useState } from "react";
import Link from "next/link";
import StageTag from "./StageTag";
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from "@/lib/crm-types";
import type { CRMOpportunity } from "@/lib/crm-types";

interface PipelineBoardProps {
  opportunities: CRMOpportunity[];
}

const collapsedByDefault = new Set(["won", "lost", "deferred"]);

export default function PipelineBoard({ opportunities }: PipelineBoardProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(
    new Set(collapsedByDefault)
  );

  function toggleStage(stage: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  }

  // Group opportunities by stage
  const grouped = new Map<string, CRMOpportunity[]>();
  for (const stage of OPPORTUNITY_STAGES) {
    grouped.set(stage, []);
  }
  for (const opp of opportunities) {
    const list = grouped.get(opp.stage);
    if (list) {
      list.push(opp);
    } else {
      // Unknown stage, put in lead
      grouped.get("lead")!.push(opp);
    }
  }

  const priorityColors: Record<string, string> = {
    high: "border-red-500/40 text-red-400",
    "medium-high": "border-orange-500/40 text-orange-400",
    medium: "border-amber-500/40 text-amber-400",
    low: "border-muted/40 text-muted",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          {opportunities.length} opportunities
        </span>
        <Link
          href="/admin/pipeline/new"
          className="bg-steel text-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)] shrink-0"
        >
          + New Opportunity
        </Link>
      </div>

      {OPPORTUNITY_STAGES.map((stage) => {
        const items = grouped.get(stage) || [];
        const isCollapsed = collapsed.has(stage);

        return (
          <div key={stage} className="border border-card-border">
            {/* Stage header */}
            <button
              onClick={() => toggleStage(stage)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted text-xs">
                  {isCollapsed ? "▸" : "▾"}
                </span>
                <StageTag stage={stage} />
                <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                  ({items.length})
                </span>
              </div>
              {items.length > 0 && (
                <span className="text-chrome text-xs font-[family-name:var(--font-heading)]">
                  ${items.reduce((sum, o) => sum + (o.estimatedValueLow || 0), 0).toLocaleString()}
                  {" – "}
                  ${items.reduce((sum, o) => sum + (o.estimatedValueHigh || 0), 0).toLocaleString()}
                </span>
              )}
            </button>

            {/* Cards */}
            {!isCollapsed && items.length > 0 && (
              <div className="border-t border-card-border/50">
                {items.map((opp) => (
                  <Link
                    key={opp.id}
                    href={`/admin/pipeline/${opp.id}`}
                    className="block px-4 py-3 border-b border-card-border/30 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm font-medium">
                            {opp.title}
                          </span>
                          {opp.priority && (
                            <span
                              className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border rounded-sm ${
                                priorityColors[opp.priority] || "border-card-border text-muted"
                              }`}
                            >
                              {opp.priority}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-xs text-muted">
                          {opp.company && <span>{opp.company}</span>}
                          {opp.contact && (
                            <span className="text-chrome">{opp.contact.name}</span>
                          )}
                        </div>

                        {opp.nextAction && (
                          <p className="text-muted text-xs mt-1.5 line-clamp-1">
                            Next: {opp.nextAction}
                          </p>
                        )}
                      </div>

                      {(opp.estimatedValueLow || opp.estimatedValueHigh) && (
                        <span className="text-chrome text-xs whitespace-nowrap font-[family-name:var(--font-heading)]">
                          ${(opp.estimatedValueLow || 0).toLocaleString()} – $
                          {(opp.estimatedValueHigh || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isCollapsed && items.length === 0 && (
              <div className="border-t border-card-border/50 px-4 py-4 text-center">
                <span className="text-muted text-xs">No opportunities in this stage</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
