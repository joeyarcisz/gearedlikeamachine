import { portfolioItems } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

// Bento grid layout — first item is large, rest vary
const bentoLayout = [
  "col-span-2 row-span-2",  // large hero tile
  "col-span-1 row-span-1",  // standard
  "col-span-1 row-span-1",  // standard
  "col-span-1 row-span-2",  // tall
  "col-span-1 row-span-1",  // standard
  "col-span-1 row-span-1",  // standard
  "col-span-1 row-span-1",  // standard
];

export default function PortfolioGrid() {
  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-navy/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Production Log
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
              Recent Builds
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl">
              Selected projects from our production floor.
            </p>
          </div>
        </ScrollFadeIn>

        {/* Bento grid — desktop */}
        <div className="hidden md:grid grid-cols-4 auto-rows-[200px] gap-2">
          {portfolioItems.map((item, i) => {
            const hasPage = item.videoUrl && item.videoUrl !== "#";
            const Tag = hasPage ? "a" : "div";
            const linkProps = hasPage ? { href: item.videoUrl } : {};
            return (
              <ScrollFadeIn key={item.title} delay={i * 80}>
                <Tag
                  {...linkProps}
                  className={`group block relative overflow-hidden bg-navy border border-card-border ${bentoLayout[i] || "col-span-1 row-span-1"} h-full ${hasPage ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className="absolute inset-0 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    style={{
                      backgroundImage: `url('${item.thumbnail}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-steel text-[10px] sm:text-xs uppercase tracking-widest mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold uppercase tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="font-[family-name:var(--font-heading)] text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                </Tag>
              </ScrollFadeIn>
            );
          })}
        </div>

        {/* Mobile — simple 2-column grid */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {portfolioItems.map((item, i) => {
            const hasPage = item.videoUrl && item.videoUrl !== "#";
            const Tag = hasPage ? "a" : "div";
            const linkProps = hasPage ? { href: item.videoUrl } : {};
            return (
              <ScrollFadeIn key={item.title} delay={i * 80}>
                <Tag
                  {...linkProps}
                  className={`group block relative aspect-square overflow-hidden bg-navy border border-card-border ${hasPage ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={{
                      backgroundImage: `url('${item.thumbnail}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-steel text-[9px] uppercase tracking-widest block mb-0.5">
                      {item.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                </Tag>
              </ScrollFadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
