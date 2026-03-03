import { stats } from "@/lib/data";
import StatCard from "@/components/dashboard/StatCard";
import VideoPanel from "@/components/dashboard/VideoPanel";
import ServicesPanel from "@/components/dashboard/ServicesPanel";
import SystemHealthPanel from "@/components/dashboard/SystemHealthPanel";
import PortfolioPanel from "@/components/dashboard/PortfolioPanel";
import ProcessPanel from "@/components/dashboard/ProcessPanel";
import CTAPanel from "@/components/dashboard/CTAPanel";
import TickerBar from "@/components/dashboard/TickerBar";
import GalleryPanel from "@/components/dashboard/GalleryPanel";

export default function Home() {
  return (
    <div id="top">
      <div className="dashboard-grid">
        {/* Row 1: Stat cards + System Health (right tall) */}
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            delay={i * 80}
          />
        ))}

        {/* System Health — spans 2 rows on right column */}
        <div className="row-span-2 hidden xl:block">
          <SystemHealthPanel />
        </div>

        {/* Row 2: Video panel (3 cols) + Capabilities (1 col) */}
        <div className="col-span-full xl:col-span-3">
          <VideoPanel />
        </div>

        <div className="hidden xl:block">
          <ServicesPanel />
        </div>

        {/* System Health — shown inline on smaller screens */}
        <div className="col-span-full xl:hidden">
          <SystemHealthPanel />
        </div>

        {/* Capabilities — shown inline on smaller screens */}
        <div className="col-span-full xl:hidden">
          <ServicesPanel />
        </div>

        {/* Row 3: Portfolio (2 cols) + Pipeline (1 col) + CTA (2 cols) */}
        <div className="col-span-full sm:col-span-1 xl:col-span-2">
          <PortfolioPanel />
        </div>

        <div className="col-span-full sm:col-span-1 xl:col-span-1">
          <ProcessPanel />
        </div>

        <div className="col-span-full xl:col-span-2">
          <CTAPanel />
        </div>

        {/* Row 4: Gallery (full width) */}
        <div className="col-span-full" id="gallery">
          <GalleryPanel />
        </div>

        {/* Row 5: Services ticker (full width) */}
        <div className="col-span-full">
          <TickerBar />
        </div>
      </div>
    </div>
  );
}
