import { whyChooseUs } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              The Engine Room
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl">
              Built different. Engineered for outcomes.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 gap-5">
          {whyChooseUs.map((item, i) => (
            <ScrollFadeIn key={item.title} delay={i * 100}>
              <div className="bg-navy/30 border border-card-border p-6 sm:p-8 h-full">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wide mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
