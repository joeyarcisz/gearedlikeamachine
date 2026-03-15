"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import SlideOutPanel from "./SlideOutPanel";
import OpportunityQuickPanel from "./OpportunityQuickPanel";
import StageTag from "./StageTag";
import Toast from "./Toast";
import { OPPORTUNITY_STAGES } from "@/lib/crm-types";
import type { CRMOpportunity } from "@/lib/crm-types";

interface KanbanBoardProps {
  opportunities: CRMOpportunity[];
}

const ACTIVE_STAGES = OPPORTUNITY_STAGES.filter(
  (s) => s !== "won" && s !== "lost" && s !== "deferred"
);
const CLOSED_STAGES = ["won", "lost", "deferred"] as const;

const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  "medium-high": 1,
  medium: 2,
  low: 3,
};

function sortOpps(opps: CRMOpportunity[]): CRMOpportunity[] {
  return [...opps].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority || ""] ?? 4;
    const pb = PRIORITY_ORDER[b.priority || ""] ?? 4;
    if (pa !== pb) return pa - pb;
    return a.title.localeCompare(b.title);
  });
}

function formatValue(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export default function KanbanBoard({ opportunities: initialOpps }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<CRMOpportunity | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedClosed, setExpandedClosed] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for disabling drag
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = useMemo(() => {
    const map = new Map<string, CRMOpportunity[]>();
    for (const stage of OPPORTUNITY_STAGES) {
      map.set(stage, []);
    }
    for (const opp of opportunities) {
      const list = map.get(opp.stage);
      if (list) list.push(opp);
    }
    return map;
  }, [opportunities]);

  const activeOpp = activeId
    ? opportunities.find((o) => o.id === activeId) || null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const oppId = active.id as string;
    const dropData = over.data.current as { stage?: string } | undefined;
    const newStage = dropData?.stage;
    if (!newStage) return;

    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp || opp.stage === newStage) return;

    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
    if (selectedOpp?.id === oppId) {
      setSelectedOpp((prev) => prev ? { ...prev, stage: newStage } : null);
    }

    const res = await fetch(`/api/crm/opportunities/${oppId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    if (res.ok) {
      setToast("Stage updated");
    } else {
      // Revert on failure
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, stage: opp.stage } : o))
      );
    }
  }

  const handleStageChange = useCallback((oppId: string, newStage: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
  }, []);

  function toggleClosedStage(stage: string) {
    setExpandedClosed((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  }

  // Filter active stages to only those with opportunities
  const populatedActiveStages = ACTIVE_STAGES.filter(
    (s) => (grouped.get(s)?.length || 0) > 0
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        <Link
          href="/admin/pipeline/new"
          className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
        >
          + New Opportunity
        </Link>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {populatedActiveStages.map((stage) => {
            const opps = sortOpps(grouped.get(stage) || []);
            const totalLow = opps.reduce(
              (sum, o) => sum + (o.estimatedValueLow || 0),
              0
            );
            const totalHigh = opps.reduce(
              (sum, o) => sum + (o.estimatedValueHigh || 0),
              0
            );
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                count={opps.length}
                totalLow={totalLow}
                totalHigh={totalHigh}
              >
                {opps.map((opp) => (
                  <KanbanCard
                    key={opp.id}
                    opportunity={opp}
                    onClick={() => setSelectedOpp(opp)}
                    isDragDisabled={isMobile}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>

        {/* Drag overlay (ghost card while dragging) */}
        <DragOverlay>
          {activeOpp ? (
            <div className="bg-[#0A0A0A] border border-[#E0E0E0]/50 rounded p-3 shadow-2xl w-[260px] opacity-90">
              <h3 className="text-sm text-white font-medium truncate">
                {activeOpp.title}
              </h3>
              {activeOpp.company && (
                <p className="text-[11px] text-[#999] truncate">
                  {activeOpp.company}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Won/Lost/Deferred summary rows */}
      <div className="mt-6 space-y-2">
        {CLOSED_STAGES.map((stage) => {
          const opps = grouped.get(stage) || [];
          if (opps.length === 0) return null;
          const totalLow = opps.reduce(
            (sum, o) => sum + (o.estimatedValueLow || 0),
            0
          );
          const totalHigh = opps.reduce(
            (sum, o) => sum + (o.estimatedValueHigh || 0),
            0
          );
          const isExpanded = expandedClosed.has(stage);
          return (
            <div
              key={stage}
              className="border border-card-border rounded"
            >
              <button
                onClick={() => toggleClosedStage(stage)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#1B1C1B]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#999] text-xs">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <StageTag stage={stage} />
                  <span className="text-[10px] text-[#999]">
                    {opps.length}
                  </span>
                </div>
                <span className="text-xs text-[#999]">
                  {formatValue(totalLow)}–{formatValue(totalHigh)}
                </span>
              </button>
              {isExpanded && (
                <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {sortOpps(opps).map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpp(opp)}
                      className="bg-[#0A0A0A] border border-card-border rounded p-3 cursor-pointer hover:border-[#E0E0E0]/30 transition-colors"
                    >
                      <h3 className="text-sm text-white truncate">
                        {opp.title}
                      </h3>
                      {opp.company && (
                        <p className="text-[11px] text-[#999] truncate">
                          {opp.company}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide-out panel */}
      <SlideOutPanel
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      >
        {selectedOpp && (
          <OpportunityQuickPanel
            key={selectedOpp.id}
            opportunity={selectedOpp}
            onStageChange={handleStageChange}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </SlideOutPanel>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
