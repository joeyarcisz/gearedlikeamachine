"use client";

import { whyChooseUs, activityTimestamps } from "@/lib/data";

export default function SystemHealthPanel() {
  return (
    <div
      className="dashboard-card flex flex-col"
      style={{ "--card-delay": "250ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          System Health
        </span>
      </div>

      {/* Why Choose Us as status indicators */}
      <div className="p-3 space-y-2 border-b border-card-border">
        {whyChooseUs.map((item) => (
          <div key={item.title} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="font-[family-name:var(--font-heading)] text-[11px] uppercase tracking-wide text-white truncate">
              {item.title}
            </span>
            <span className="text-green-500/70 text-[9px] uppercase tracking-widest ml-auto shrink-0">
              Active
            </span>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px] xl:max-h-none">
        <p className="text-muted text-[9px] uppercase tracking-widest">Activity Feed</p>
        {activityTimestamps.map((entry, i) => (
          <div key={i} className="flex gap-2">
            {entry.image ? (
              <div
                className="w-8 h-8 rounded bg-navy border border-card-border shrink-0 bg-cover bg-center grayscale"
                style={{ backgroundImage: `url('${entry.image}')` }}
              />
            ) : (
              <div className="w-8 h-8 rounded bg-navy border border-card-border shrink-0 flex items-center justify-center">
                <span className="text-muted text-[9px]">--</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-heading)] text-[11px] text-white uppercase tracking-wide truncate">
                {entry.label}
              </p>
              <p className="text-muted text-[10px] leading-snug line-clamp-2">
                {entry.detail}
              </p>
              <p className="text-chrome/50 text-[9px] mt-0.5">{entry.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
