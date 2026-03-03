import { processSteps } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-navy/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Our Process
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Five precision-engineered steps from concept to delivery.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {processSteps.map((step, i) => (
            <ScrollFadeIn key={step.step} delay={i * 150}>
              <div className="relative">
                {/* Connector line */}
                {i < processSteps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+20px)] right-[-16px] h-[1px] bg-card-border" />
                )}

                <div className="text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 border-2 border-steel text-steel font-[family-name:var(--font-heading)] text-lg font-bold mb-4">
                    {step.step}
                  </div>

                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wide mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span className="inline-block bg-steel/10 text-steel text-xs uppercase tracking-widest px-3 py-1 border border-steel/20">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-8">
          {processSteps.map((step, i) => (
            <ScrollFadeIn key={step.step} delay={i * 100}>
              <div className="flex gap-4">
                {/* Timeline line + number */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 border-2 border-steel text-steel font-[family-name:var(--font-heading)] text-sm font-bold shrink-0">
                    {step.step}
                  </div>
                  {i < processSteps.length - 1 && (
                    <div className="w-[1px] grow bg-card-border mt-2" />
                  )}
                </div>

                <div className="pb-8">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wide mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-2">
                    {step.description}
                  </p>
                  <span className="inline-block bg-steel/10 text-steel text-xs uppercase tracking-widest px-3 py-1 border border-steel/20">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
