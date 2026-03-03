import type { Metadata } from "next";
import ScopeWizard from "@/components/scope/ScopeWizard";

export const metadata: Metadata = {
  title: "Scope & Instant Estimate | Geared Like A Machine",
  description:
    "Build your video production project scope and get an instant cost estimate. Free tool from Geared Like A Machine.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ScopePage() {
  return (
    <div className="p-4">
      <div className="dashboard-card" style={{ "--card-delay": "0ms" } as React.CSSProperties}>
        <div className="dashboard-card-header no-print">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            Scope Tool — Instant Estimate
          </span>
        </div>
        <div className="dashboard-card-body">
          <ScopeWizard />
        </div>
      </div>
    </div>
  );
}
