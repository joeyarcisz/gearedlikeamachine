"use client";

import { productionSpecs } from "@/lib/data";
import { specIcons } from "@/components/icons";

export default function VideoPanel() {
  return (
    <div
      className="dashboard-card"
      id="showreel"
      style={{ "--card-delay": "100ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Live Feed — Showreel
        </span>
      </div>
      <div className="relative aspect-video bg-navy grayscale">
        <iframe
          src="https://player.vimeo.com/video/1153853483?h=0&title=0&byline=0&portrait=0"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      {/* Production specs strip */}
      <div className="grid grid-cols-4 border-t border-card-border">
        {productionSpecs.map((spec) => {
          const Icon = specIcons[spec.icon];
          return (
            <div
              key={spec.label}
              className="flex flex-col items-center py-2 px-1 border-r border-card-border last:border-r-0"
            >
              <span className="text-steel mb-0.5">
                {Icon ? <Icon className="w-4 h-4" /> : null}
              </span>
              <span className="text-chrome text-[9px] uppercase tracking-widest font-[family-name:var(--font-heading)] text-center leading-tight">
                {spec.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
