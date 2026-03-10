"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import InlineStageDropdown from "./InlineStageDropdown";
import Toast from "./Toast";
import type { CRMOpportunity, CRMActivity } from "@/lib/crm-types";

interface OpportunityQuickPanelProps {
  opportunity: CRMOpportunity;
  onStageChange: (oppId: string, newStage: string) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS = ["high", "medium-high", "medium", "low"];

const PRIORITY_COLORS: Record<string, string> = {
  high: "border-red-500/40 text-red-400",
  "medium-high": "border-orange-500/40 text-orange-400",
  medium: "border-amber-500/40 text-amber-400",
  low: "border-[#999]/40 text-[#999]",
};

const ACTIVITY_COLORS: Record<string, string> = {
  note: "bg-blue-500",
  email_sent: "bg-purple-500",
  call: "bg-green-500",
  meeting: "bg-amber-500",
  stage_change: "bg-orange-500",
  created: "bg-emerald-500",
  updated: "bg-cyan-500",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatValue(low: number | null, high: number | null): string {
  if (!low && !high) return "—";
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n}`;
  if (low && high) return `${fmt(low)} – ${fmt(high)}`;
  return fmt(low || high!);
}

export default function OpportunityQuickPanel({
  opportunity,
  onStageChange,
  onClose,
}: OpportunityQuickPanelProps) {
  const [nextAction, setNextAction] = useState(opportunity.nextAction || "");
  const [priority, setPriority] = useState(opportunity.priority || "");
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState("note");
  const [activityDesc, setActivityDesc] = useState("");
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [stage, setStage] = useState(opportunity.stage);
  const priorityRef = useRef<HTMLDivElement>(null);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(
      `/api/crm/activities?opportunityId=${opportunity.id}&limit=5`
    );
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
    setLoading(false);
  }, [opportunity.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    setNextAction(opportunity.nextAction || "");
    setPriority(opportunity.priority || "");
    setStage(opportunity.stage);
    setLoading(true);
    fetchActivities();
  }, [opportunity.id, opportunity.nextAction, opportunity.priority, opportunity.stage, fetchActivities]);

  // Click-outside handler for priority dropdown
  useEffect(() => {
    if (!priorityOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [priorityOpen]);

  async function saveNextAction() {
    const res = await fetch(`/api/crm/opportunities/${opportunity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextAction }),
    });
    if (res.ok) setToast("Saved");
  }

  async function savePriority(newPriority: string) {
    setPriority(newPriority);
    setPriorityOpen(false);
    const res = await fetch(`/api/crm/opportunities/${opportunity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    if (res.ok) setToast("Priority updated");
  }

  async function logActivity() {
    if (!activityDesc.trim()) return;
    setLogging(true);
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activityType,
        description: activityDesc.trim(),
        opportunityId: opportunity.id,
        contactId: opportunity.contactId || undefined,
      }),
    });
    setLogging(false);
    if (res.ok) {
      setActivityDesc("");
      setToast("Activity logged");
      fetchActivities();
    }
  }

  function handleStageChange(newStage: string) {
    setStage(newStage);
    onStageChange(opportunity.id, newStage);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-card-border">
        <div>
          <h2 className="text-lg text-white font-[family-name:var(--font-heading)] tracking-wider">
            {opportunity.title}
          </h2>
          {opportunity.company && (
            <p className="text-[#999] text-sm mt-0.5">{opportunity.company}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#999] hover:text-white text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stage + Priority row */}
        <div className="flex gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Stage
            </label>
            <InlineStageDropdown
              stage={stage}
              type="opportunity"
              entityId={opportunity.id}
              onUpdated={handleStageChange}
            />
          </div>
          <div className="relative" ref={priorityRef}>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Priority
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPriorityOpen(!priorityOpen);
              }}
              className="cursor-pointer"
            >
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                  PRIORITY_COLORS[priority] || "border-card-border text-[#999]"
                }`}
              >
                {priority || "None"}
              </span>
            </button>
            {priorityOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] bg-[#303030] border border-card-border rounded shadow-lg py-1">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      savePriority(p);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#1B1C1B] ${
                      p === priority ? "bg-[#1B1C1B]" : ""
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                        PRIORITY_COLORS[p]
                      }`}
                    >
                      {p}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Action */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
            Next Action
          </label>
          <textarea
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            onBlur={saveNextAction}
            rows={2}
            className="w-full bg-black/60 border border-card-border text-white text-sm rounded px-3 py-2 focus:border-[#E0E0E0] focus:outline-none resize-none"
            placeholder="What's the next step?"
          />
        </div>

        {/* Value + Contact */}
        <div className="flex gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Value
            </label>
            <p className="text-sm text-[#E0E0E0]">
              {formatValue(opportunity.estimatedValueLow, opportunity.estimatedValueHigh)}
            </p>
          </div>
          {opportunity.contact && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
                Contact
              </label>
              <Link
                href={`/admin/contacts/${opportunity.contactId}`}
                className="text-sm text-[#E0E0E0] hover:text-white transition-colors"
              >
                {opportunity.contact.name}
              </Link>
            </div>
          )}
        </div>

        {/* Log Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-2">
            Log Activity
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="bg-black/60 border border-card-border text-white text-sm rounded px-2 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            >
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
            </select>
            <input
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") logActivity();
              }}
              placeholder="Description..."
              className="flex-1 bg-black/60 border border-card-border text-white text-sm rounded px-3 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            />
          </div>
          <button
            onClick={logActivity}
            disabled={logging || !activityDesc.trim()}
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1 rounded hover:bg-white disabled:opacity-40 transition-colors"
          >
            {logging ? "Logging..." : "Log"}
          </button>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-3">
            Recent Activity
          </label>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-black/30 rounded animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-[#999]">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      ACTIVITY_COLORS[a.type] || "bg-gray-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#E0E0E0] truncate">
                      {a.description}
                    </p>
                    <p className="text-[10px] text-[#999]">
                      {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-card-border">
        <Link
          href={`/admin/pipeline/${opportunity.id}`}
          className="text-[10px] uppercase tracking-widest text-[#E0E0E0] hover:text-white transition-colors"
        >
          Open Full View &rarr;
        </Link>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
