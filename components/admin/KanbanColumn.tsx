"use client";

import { useDroppable } from "@dnd-kit/core";
import StageTag from "./StageTag";

interface KanbanColumnProps {
  stage: string;
  count: number;
  totalLow: number;
  totalHigh: number;
  children: React.ReactNode;
}

function formatValue(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export default function KanbanColumn({
  stage,
  count,
  totalLow,
  totalHigh,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${stage}`,
    data: { stage },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[260px] max-w-[300px] shrink-0 rounded border transition-colors ${
        isOver
          ? "border-[#E0E0E0]/50 bg-[#E0E0E0]/5"
          : "border-card-border bg-[#1B1C1B]/50"
      }`}
    >
      {/* Column header */}
      <div className="p-3 border-b border-card-border">
        <div className="flex items-center justify-between mb-1">
          <StageTag stage={stage} />
          <span className="text-[10px] text-[#999]">{count}</span>
        </div>
        {(totalLow > 0 || totalHigh > 0) && (
          <p className="text-[10px] text-[#999]">
            {formatValue(totalLow)}–{formatValue(totalHigh)}
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[80px]">
        {children}
      </div>
    </div>
  );
}
