import { services } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";
import { serviceIcons } from "./icons";

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              What We Do
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Full-service video production engineered for impact.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <ScrollFadeIn key={service.title} delay={i * 100}>
              <div className="group bg-navy/30 border border-card-border p-6 sm:p-8 hover:border-steel/50 transition-all duration-300 hover:scale-[1.02] h-full">
                <span className="text-steel mb-4 block">
                  {(() => {
                    const Icon = serviceIcons[service.icon];
                    return Icon ? <Icon className="w-8 h-8" /> : service.icon;
                  })()}
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase tracking-wide mb-3">
                  {service.title}
                </h3>
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
