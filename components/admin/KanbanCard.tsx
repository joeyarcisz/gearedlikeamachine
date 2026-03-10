"use client";

import { useDraggable } from "@dnd-kit/core";
import type { CRMOpportunity } from "@/lib/crm-types";

interface KanbanCardProps {
  opportunity: CRMOpportunity;
  onClick: () => void;
  isDragDisabled?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "border-red-500/40 text-red-400",
  "medium-high": "border-orange-500/40 text-orange-400",
  medium: "border-amber-500/40 text-amber-400",
  low: "border-[#999]/40 text-[#999]",
};

function formatValue(low: number | null, high: number | null): string {
  if (!low && !high) return "";
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n}`;
  if (low && high) return `${fmt(low)}–${fmt(high)}`;
  return fmt(low || high!);
}

export default function KanbanCard({
  opportunity,
  onClick,
  isDragDisabled,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: opportunity.id,
      data: { opportunity },
      disabled: isDragDisabled,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#0A0A0A] border border-card-border rounded p-3 cursor-pointer hover:border-[#E0E0E0]/30 transition-colors ${
        isDragging ? "opacity-30" : ""
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm text-white font-medium truncate flex-1">
          {opportunity.title}
        </h3>
        {opportunity.priority && (
          <span
            className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border rounded-sm shrink-0 ${
              PRIORITY_COLORS[opportunity.priority] || "border-card-border text-[#999]"
            }`}
          >
            {opportunity.priority}
          </span>
        )}
      </div>
      {opportunity.company && (
        <p className="text-[11px] text-[#999] truncate">{opportunity.company}</p>
      )}
      {opportunity.contact?.name && (
        <p className="text-[11px] text-[#E0E0E0] truncate mt-0.5">
          {opportunity.contact.name}
        </p>
      )}
      {opportunity.nextAction && (
        <p className="text-[11px] text-[#999] truncate mt-1.5 italic">
          {opportunity.nextAction}
        </p>
      )}
      {(opportunity.estimatedValueLow || opportunity.estimatedValueHigh) && (
        <p className="text-xs text-[#E0E0E0] mt-1.5 text-right">
          {formatValue(opportunity.estimatedValueLow, opportunity.estimatedValueHigh)}
        </p>
      )}
    </div>
  );
}
