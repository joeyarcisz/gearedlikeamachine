import type { Metadata } from "next";
import RentalInventory from "@/components/RentalInventory";
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

      </div>
    </DashboardShell>
  );
}
