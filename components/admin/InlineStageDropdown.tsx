"use client";

import { useState, useRef, useEffect } from "react";
import StageTag from "./StageTag";
import Toast from "./Toast";
import {
  CONTACT_STAGES,
  CONTACT_STAGE_LABELS,
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE_LABELS,
} from "@/lib/crm-types";

interface InlineStageDropdownProps {
  stage: string;
  type: "contact" | "opportunity";
  entityId: string;
  onUpdated: (newStage: string) => void;
}

export default function InlineStageDropdown({
  stage,
  type,
  entityId,
  onUpdated,
}: InlineStageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const stages = type === "contact" ? CONTACT_STAGES : OPPORTUNITY_STAGES;
  const labels =
    type === "contact" ? CONTACT_STAGE_LABELS : OPPORTUNITY_STAGE_LABELS;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSelect(newStage: string) {
    if (newStage === stage) {
      setOpen(false);
      return;
    }
    setSaving(true);
    const endpoint =
      type === "contact"
        ? `/api/crm/contacts/${entityId}`
        : `/api/crm/opportunities/${entityId}`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    setSaving(false);
    if (res.ok) {
      setOpen(false);
      onUpdated(newStage);
      setToast("Stage updated");
    }
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
        className="cursor-pointer disabled:opacity-50"
        disabled={saving}
      >
        <StageTag stage={stage} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] bg-[#303030] border border-card-border rounded shadow-lg py-1 max-h-[280px] overflow-y-auto">
          {stages.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(s);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#1B1C1B] flex items-center gap-2 ${
                s === stage ? "bg-[#1B1C1B]" : ""
              }`}
            >
              <StageTag stage={s} />
              <span className="text-[#999] text-xs">{labels[s]}</span>
            </button>
          ))}
        </div>
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
