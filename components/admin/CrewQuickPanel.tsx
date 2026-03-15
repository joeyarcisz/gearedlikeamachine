"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Toast from "./Toast";
import type { CRMActivity, CRMCrewMember } from "@/lib/crm-types";

interface CrewQuickPanelProps {
  crew: CRMCrewMember;
  onClose: () => void;
}

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

export default function CrewQuickPanel({ crew, onClose }: CrewQuickPanelProps) {
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState("note");
  const [activityDesc, setActivityDesc] = useState("");
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchActivities = useCallback(() => {
    fetch(`/api/crm/activities?crewMemberId=${crew.id}&limit=5`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setActivities(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [crew.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  async function logActivity() {
    if (!activityDesc.trim()) return;
    setLogging(true);
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activityType,
        description: activityDesc.trim(),
        crewMemberId: crew.id,
      }),
    });
    setLogging(false);
    if (res.ok) {
      setActivityDesc("");
      setToast("Activity logged");
      fetchActivities();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-card-border">
        <div>
          <h2 className="text-lg text-white font-[family-name:var(--font-heading)] tracking-wider">
            {crew.name}
          </h2>
          <p className="text-[#999] text-sm mt-0.5">{crew.role}</p>
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
        {/* Contact Info */}
        <div className="space-y-2">
          {crew.email && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Email</label>
              <a href={`mailto:${crew.email}`} className="text-steel text-sm hover:text-white transition-colors">
                {crew.email}
              </a>
            </div>
          )}
          {crew.phone && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Phone</label>
              <a href={`tel:${crew.phone}`} className="text-steel text-sm hover:text-white transition-colors">
                {crew.phone}
              </a>
            </div>
          )}
        </div>

        {/* Rates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Day Rate</label>
            <p className="text-sm text-[#E0E0E0]">
              {crew.dayRate != null ? `$${crew.dayRate.toLocaleString()}` : "-"}
            </p>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Kit Fee</label>
            <p className="text-sm text-[#E0E0E0]">
              {crew.kitFee != null ? `$${crew.kitFee.toLocaleString()}` : "-"}
            </p>
          </div>
        </div>

        {/* Location */}
        {(crew.city || crew.state) && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Location</label>
            <p className="text-sm text-[#E0E0E0]">
              {crew.city && crew.state ? `${crew.city}, ${crew.state}` : crew.city || crew.state}
            </p>
          </div>
        )}

        {/* Links */}
        {(crew.website || crew.instagram || crew.imdb) && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Links</label>
            {crew.website && (
              <a href={crew.website} target="_blank" rel="noopener noreferrer" className="text-steel text-sm hover:text-white transition-colors block">
                Website
              </a>
            )}
            {crew.instagram && (
              <a href={`https://instagram.com/${crew.instagram}`} target="_blank" rel="noopener noreferrer" className="text-steel text-sm hover:text-white transition-colors block">
                @{crew.instagram}
              </a>
            )}
            {crew.imdb && (
              <a href={crew.imdb} target="_blank" rel="noopener noreferrer" className="text-steel text-sm hover:text-white transition-colors block">
                IMDb
              </a>
            )}
          </div>
        )}

        {/* W-9 / NDA */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">W-9</label>
            <span className={crew.w9OnFile ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
              {crew.w9OnFile ? "\u2713 On File" : "\u2717 Missing"}
            </span>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">NDA</label>
            <span className={crew.ndaOnFile ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
              {crew.ndaOnFile ? "\u2713 On File" : "\u2717 Missing"}
            </span>
          </div>
        </div>

        {/* Rating */}
        {crew.rating != null && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Rating</label>
            <p className="text-sm text-[#E0E0E0]">{crew.rating} / 5</p>
          </div>
        )}

        {/* Tags */}
        {crew.tags && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1">Tags</label>
            <div className="flex flex-wrap gap-1">
              {crew.tags.split(",").map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] uppercase tracking-widest px-2 py-0.5 border border-card-border text-muted rounded-sm"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {crew.notes && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-0.5">Notes</label>
            <p className="text-sm text-[#E0E0E0] whitespace-pre-wrap">{crew.notes}</p>
          </div>
        )}

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
      <div className="p-5 border-t border-card-border flex items-center gap-4">
        <Link
          href={`/admin/crew/${crew.id}`}
          className="text-[10px] uppercase tracking-widest text-[#E0E0E0] hover:text-white transition-colors"
        >
          View Full Profile &rarr;
        </Link>
        {crew.email && (
          <Link
            href={`/admin/crew/${crew.id}`}
            className="text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors"
          >
            Send Email
          </Link>
        )}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
