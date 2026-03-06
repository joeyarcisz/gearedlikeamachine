import { testimonials } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-navy/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
              Client Feedback
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Don&apos;t take our word for it — hear from the brands we&apos;ve
              worked with.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollFadeIn key={t.name} delay={i * 150}>
              <div className="bg-black border border-card-border p-6 sm:p-8 h-full flex flex-col">
                {/* Quote mark */}
                <span className="text-steel/30 text-5xl font-serif leading-none mb-4">
                  &ldquo;
                </span>
                <p className="text-chrome text-sm sm:text-base leading-relaxed mb-6 grow">
                  {t.quote}
                </p>
                <div className="border-t border-card-border pt-4">
                  <p className="font-[family-name:var(--font-heading)] text-white font-semibold uppercase tracking-wider text-sm">
                    {t.name}
                  </p>
                  <p className="text-muted text-xs uppercase tracking-widest">
                    {t.title}, {t.company}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
