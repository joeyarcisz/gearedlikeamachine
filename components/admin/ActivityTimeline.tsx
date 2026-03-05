"use client";

import { ACTIVITY_TYPE_LABELS } from "@/lib/crm-types";
import type { CRMActivity } from "@/lib/crm-types";

const activityTypeColors: Record<string, string> = {
  note: "border-blue-500/40 text-blue-400",
  email_sent: "border-purple-500/40 text-purple-400",
  call: "border-green-500/40 text-green-400",
  meeting: "border-amber-500/40 text-amber-400",
  stage_change: "border-orange-500/40 text-orange-400",
  created: "border-emerald-500/40 text-emerald-400",
  updated: "border-cyan-500/40 text-cyan-400",
};

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function ActivityTimeline({
  activities,
}: {
  activities: CRMActivity[];
}) {
  if (activities.length === 0) {
    return (
      <p className="text-muted text-sm py-4">No activity recorded yet.</p>
    );
  }

  return (
    <div className="relative pl-4">
      {/* Vertical line */}
      <div className="absolute left-1.5 top-2 bottom-2 w-px bg-card-border" />

      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-3">
            {/* Dot */}
            <div className="absolute -left-4 top-2 w-2 h-2 rounded-full bg-card-border shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                    activityTypeColors[activity.type] || "border-card-border text-muted"
                  }`}
                >
                  {ACTIVITY_TYPE_LABELS[activity.type] || activity.type}
                </span>
                <span className="text-muted text-[10px] uppercase tracking-widest">
                  {relativeTime(activity.createdAt)}
                </span>
              </div>
              <p className="text-white text-sm mt-1">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
