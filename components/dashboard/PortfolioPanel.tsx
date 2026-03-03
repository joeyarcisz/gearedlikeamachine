import { portfolioItems } from "@/lib/data";

export default function PortfolioPanel() {
  return (
    <div
      className="dashboard-card"
      id="portfolio"
      style={{ "--card-delay": "300ms" } as React.CSSProperties}
    >
      <div className="dashboard-card-header">
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          Portfolio
        </span>
      </div>
      <div className="dashboard-card-body grid grid-cols-3 gap-2">
        {portfolioItems.map((item) => (
          <a
            key={item.title}
            href={item.videoUrl}
            className="group relative aspect-[4/3] bg-navy overflow-hidden block"
          >
            <div
              className="absolute inset-0 grayscale bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url('${item.thumbnail}')` }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-steel text-[9px] uppercase tracking-widest">
                {item.category}
              </span>
              <span className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-wide text-white">
                {item.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
