import { services } from "@/lib/data";
import { serviceIcons } from "@/components/icons";

export default function ServicesPanel() {
  return (
    <div
      className="dashboard-card"
      id="services"
      style={{ "--card-delay": "200ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Capabilities
        </span>
      </div>
      <div className="dashboard-card-body grid grid-cols-2 gap-3">
        {services.map((service) => {
          const Icon = serviceIcons[service.icon];
          return (
            <div
              key={service.title}
              className="bg-navy/40 border border-card-border p-3 hover:border-steel/40 transition-colors"
            >
              <span className="text-steel block mb-2">
                {Icon ? <Icon className="w-5 h-5" /> : null}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-wide text-white mb-1">
                {service.title}
              </h3>
              <p className="text-muted text-[11px] leading-relaxed line-clamp-3">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
