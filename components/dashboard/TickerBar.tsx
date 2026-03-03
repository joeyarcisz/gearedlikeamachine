import { tickerServices } from "@/lib/data";

export default function TickerBar() {
  const items = [...tickerServices, ...tickerServices];

  return (
    <div
      className="dashboard-card overflow-hidden"
      style={{ "--card-delay": "450ms" } as React.CSSProperties}
    >
      <div className="py-3 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {items.map((service, i) => (
            <span
              key={i}
              className="text-chrome/40 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-heading)] mx-6"
            >
              {service}
              <span className="ml-6 text-steel/40">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
