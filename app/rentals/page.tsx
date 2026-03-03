import type { Metadata } from "next";
import RentalInventory from "@/components/RentalInventory";
import { siteConfig } from "@/lib/data";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Equipment Rentals | Geared Like A Machine",
  description:
    "Browse our full equipment rental inventory — cameras, lenses, lighting, drones, grip, audio, monitoring, and more. Daily rates for professional production gear.",
  openGraph: {
    title: "Equipment Rentals | Geared Like A Machine",
    description:
      "Professional production equipment available for daily rental. 150+ items across cameras, lighting, lenses, drones, grip, and more.",
    type: "website",
    siteName: "Geared Like A Machine",
  },
};

export default function RentalsPage() {
  return (
    <DashboardShell>
      <div className="p-4">
        {/* Page header card */}
        <div className="dashboard-card mb-4" style={{ "--card-delay": "0ms" } as React.CSSProperties}>
          <div className="dashboard-card-header">
            <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Gear Rentals — Production Equipment
            </span>
          </div>
          <div className="dashboard-card-body text-center py-8">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-white mb-4">
              Equipment Rentals
            </h1>
            <p className="text-muted text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Our rental department carries cameras, lenses, lighting, drones,
              grip, audio, monitoring, power, and support gear — everything you
              need to execute at the highest level.
            </p>
          </div>
        </div>

        {/* Inventory card */}
        <div className="dashboard-card mb-4" style={{ "--card-delay": "100ms" } as React.CSSProperties}>
          <div className="dashboard-card-header">
            <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
              Inventory
            </span>
          </div>
          <div className="dashboard-card-body">
            <RentalInventory />
          </div>
        </div>

        {/* CTA card */}
        <div className="dashboard-card" style={{ "--card-delay": "200ms" } as React.CSSProperties}>
          <div className="dashboard-card-body py-10 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4">
              Need Gear for Your Next Shoot?
            </h2>
            <p className="text-muted text-sm sm:text-base mb-6 leading-relaxed max-w-xl mx-auto">
              Reach out to reserve equipment or build a custom package for your
              production. We&apos;ll put together exactly what you need.
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=Equipment%20Rental%20Inquiry`}
              className="inline-block bg-steel text-black px-8 py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200"
            >
              Inquire About Rentals
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
