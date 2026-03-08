import ScrollFadeIn from "./ScrollFadeIn";

// TODO: Replace with real client quotes
const TESTIMONIALS = [
  {
    quote:
      "The production quality was unlike anything we had seen from a vendor at this scale. Every deadline hit, every frame delivered.",
    name: "[Client Name]",
    title: "[Title]",
    company: "SpaceX",
  },
  {
    quote:
      "They brought a level of creative precision that matched our brand's global standards. We have used them across multiple campaigns.",
    name: "[Client Name]",
    title: "[Title]",
    company: "U.S. Polo Assn.",
  },
  {
    quote:
      "From concept to final delivery, the process ran exactly as described. We always knew what to expect at every stage.",
    name: "[Client Name]",
    title: "[Title]",
    company: "Chevrolet",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Client Feedback
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
              In Their Words
            </h2>
          </div>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <ScrollFadeIn key={t.company} delay={i * 100}>
              {/* TODO: Replace with real client quote */}
              <div className="bg-navy/30 border border-card-border p-6 sm:p-8 h-full flex flex-col">
                <p className="text-steel text-sm sm:text-base leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-[family-name:var(--font-heading)] text-white text-sm font-bold uppercase tracking-wider">
                    {t.name}
                  </p>
                  <p className="text-muted text-xs">
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
