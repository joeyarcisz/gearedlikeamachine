import { tickerServices } from "@/lib/data";

export default function ServicesTicker() {
  const items = [...tickerServices, ...tickerServices];

  return (
    <section className="py-8 border-y border-card-border overflow-hidden bg-black">
      <div className="animate-marquee flex whitespace-nowrap">
        {items.map((service, i) => (
          <span
            key={i}
            className="text-chrome/40 text-sm sm:text-base uppercase tracking-[0.3em] font-[family-name:var(--font-heading)] mx-8 sm:mx-12"
          >
            {service}
            <span className="ml-8 sm:ml-12 text-steel/40">•</span>
          </span>
        ))}
      </div>
    </section>
  );
}
