import { portfolioItems } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function PortfolioGrid() {
  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-navy/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Our Work
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Selected projects showcasing our range and creative capability.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems.map((item, i) => (
            <ScrollFadeIn key={item.title} delay={i * 100}>
              <a
                href={item.videoUrl}
                className="group block relative aspect-[4/3] bg-navy border border-card-border overflow-hidden"
              >
                {/* Thumbnail or placeholder */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-navy to-black grayscale"
                  style={{
                    backgroundImage: `url('${item.thumbnail}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-steel text-xs uppercase tracking-widest mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wide">
                    {item.title}
                  </h3>
                </div>

                {/* Always visible label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wide">
                    {item.title}
                  </h3>
                </div>

                {/* Scale effect */}
                <div className="absolute inset-0 group-hover:scale-[1.02] transition-transform duration-500" />
              </a>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
