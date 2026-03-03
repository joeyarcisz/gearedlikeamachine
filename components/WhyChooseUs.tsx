import { whyChooseUs, whyChooseUsStats } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Why Choose Us
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Built different. Engineered for results.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 gap-5 mb-12">
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

        {/* Stats strip */}
        <ScrollFadeIn delay={400}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {whyChooseUsStats.map((stat) => (
              <div
                key={stat}
                className="bg-steel/5 border border-steel/20 py-4 px-6 text-center"
              >
                <span className="text-steel font-[family-name:var(--font-heading)] text-sm sm:text-base uppercase tracking-widest font-semibold">
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
