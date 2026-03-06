import Image from "next/image";
import { processSteps } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

const stepImages: Record<number, { src: string; alt: string }> = {
  2: { src: "/process/blueprint-hand.jpg", alt: "Hand drawing on architectural blueprints" },
};

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-navy/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-16">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              The Blueprint
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide">
              How We Operate
            </h2>
          </div>
        </ScrollFadeIn>

        {/* Desktop: alternating zigzag layout */}
        <div className="hidden md:block relative">
          {/* Central vertical spine */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-card-border -translate-x-1/2" />

          <div className="space-y-0">
            {processSteps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ScrollFadeIn key={step.step} delay={i * 150}>
                  <div className={`relative grid grid-cols-2 gap-12 py-10 ${isLeft ? "" : ""}`}>
                    {/* Dot on spine */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-steel bg-black z-10" />

                    {isLeft ? (
                      <>
                        {/* Content on left */}
                        <div className="text-right pr-12">
                          <span className="font-[family-name:var(--font-heading)] text-5xl font-bold text-steel/20 block mb-2">
                            {String(step.step).padStart(2, "0")}
                          </span>
                          <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted text-sm leading-relaxed mb-3">
                            {step.description}
                          </p>
                          <span className="inline-block bg-steel/10 text-steel text-xs uppercase tracking-widest px-3 py-1 border border-steel/20">
                            {step.deliverable}
                          </span>
                        </div>
                        {/* Image or empty right */}
                        <div className="flex items-center justify-start pl-12">
                          {stepImages[step.step] && (
                            <div className="relative w-full aspect-[16/9] overflow-hidden border border-card-border">
                              <Image
                                src={stepImages[step.step].src}
                                alt={stepImages[step.step].alt}
                                fill
                                className="object-cover opacity-60 hover:opacity-90 transition-opacity duration-500"
                                sizes="400px"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Image or empty left */}
                        <div className="flex items-center justify-end pr-12">
                          {stepImages[step.step] && (
                            <div className="relative w-full aspect-[16/9] overflow-hidden border border-card-border">
                              <Image
                                src={stepImages[step.step].src}
                                alt={stepImages[step.step].alt}
                                fill
                                className="object-cover opacity-60 hover:opacity-90 transition-opacity duration-500"
                                sizes="400px"
                              />
                            </div>
                          )}
                        </div>
                        {/* Content on right */}
                        <div className="pl-12">
                          <span className="font-[family-name:var(--font-heading)] text-5xl font-bold text-steel/20 block mb-2">
                            {String(step.step).padStart(2, "0")}
                          </span>
                          <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide mb-3">
                            {step.title}
                          </h3>
                          <p className="text-muted text-sm leading-relaxed mb-3">
                            {step.description}
                          </p>
                          <span className="inline-block bg-steel/10 text-steel text-xs uppercase tracking-widest px-3 py-1 border border-steel/20">
                            {step.deliverable}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollFadeIn>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical stack with left accent */}
        <div className="md:hidden space-y-6">
          {processSteps.map((step, i) => (
            <ScrollFadeIn key={step.step} delay={i * 100}>
              <div className="border-l-2 border-steel/30 pl-6 py-2">
                <span className="font-[family-name:var(--font-heading)] text-3xl font-bold text-steel/20 block mb-1">
                  {String(step.step).padStart(2, "0")}
                </span>
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
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
