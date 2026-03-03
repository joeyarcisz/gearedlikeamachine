import { services } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";
import { serviceIcons } from "./icons";

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-16">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Capabilities
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide">
              What We Bring to the Table
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="space-y-0 divide-y divide-card-border border-t border-card-border">
          {services.map((service, i) => (
            <ScrollFadeIn key={service.title} delay={i * 100}>
              <div className="group grid grid-cols-1 md:grid-cols-[80px_1fr_1.2fr] gap-4 md:gap-8 py-8 sm:py-10 items-start hover:bg-navy/20 transition-colors duration-300 px-2 sm:px-4">
                {/* Number */}
                <span className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-steel/40 group-hover:text-steel transition-colors duration-300">
                  {service.number}
                </span>

                {/* Title + Icon */}
                <div className="flex items-center gap-3">
                  <span className="text-steel shrink-0">
                    {(() => {
                      const Icon = serviceIcons[service.icon];
                      return Icon ? <Icon className="w-6 h-6" /> : service.icon;
                    })()}
                  </span>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-wide">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
