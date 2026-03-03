"use client";

import { processSteps } from "@/lib/data";

export default function ProcessPanel() {
  return (
    <div
      className="dashboard-card"
      id="process"
      style={{ "--card-delay": "350ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Pipeline
        </span>
      </div>
      <div className="dashboard-card-body space-y-3">
        {processSteps.map((step, i) => {
          const progress = ((i + 1) / processSteps.length) * 100;
          return (
            <div key={step.step} className="flex items-start gap-3">
              {/* Step indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 border border-steel text-steel font-[family-name:var(--font-heading)] text-xs font-bold flex items-center justify-center">
                  {step.step}
                </div>
                {i < processSteps.length - 1 && (
                  <div className="w-px h-4 bg-card-border mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-wide text-white">
                    {step.title}
                  </h4>
                  <span className="text-steel/50 text-[9px] uppercase tracking-widest">
                    {step.deliverable}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-navy rounded overflow-hidden">
                  <div
                    className="h-full bg-steel/60 animate-fill-bar"
                    style={{ "--fill-width": `${progress}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
