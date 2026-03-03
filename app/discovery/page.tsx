import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DiscoveryForm from "@/components/DiscoveryForm";

export const metadata: Metadata = {
  title: "Discovery | Geared Like A Machine",
  description:
    "Tell us about your project. Fill out a quick form and our team will follow up within 24 hours.",
  openGraph: {
    title: "Discovery | Geared Like A Machine",
    description:
      "Tell us about your project. Fill out a quick form and our team will follow up within 24 hours.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

export default function DiscoveryPage() {
  return (
    <DashboardShell>
      <div className="p-4">
        {/* Page header card */}
        <div
          className="dashboard-card mb-4"
          style={{ "--card-delay": "0ms" } as React.CSSProperties}
        >
          <div className="dashboard-card-header">
            <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Discovery — Start a Conversation
            </span>
          </div>
          <div className="dashboard-card-body text-center py-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-white mb-4">
              Discovery Form
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Give us the essentials and we&apos;ll follow up within 24 hours to
              talk through the details.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div
          className="dashboard-card mb-4"
          style={{ "--card-delay": "100ms" } as React.CSSProperties}
        >
          <div className="dashboard-card-body py-8 px-4 sm:px-8">
            <DiscoveryForm />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
