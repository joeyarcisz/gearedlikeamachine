import { productionSpecs } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";
import { specIcons } from "./icons";

export default function Showreel() {
  return (
    <section id="showreel" className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Live Feed
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider mb-4">
              The Reel
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl">
              A look inside our production output — motion, narrative, and everything in between.
            </p>
          </div>
        </ScrollFadeIn>
      </div>

      {/* Vimeo Embed — full width */}
      <ScrollFadeIn delay={200}>
        <div className="relative aspect-video bg-navy border-y border-card-border overflow-hidden mb-10 grayscale hover:grayscale-0 transition-all duration-500">
          <iframe
            src="https://player.vimeo.com/video/1153853483?h=0&title=0&byline=0&portrait=0"
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </ScrollFadeIn>

      {/* Production Specs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn delay={400}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {productionSpecs.map((spec) => (
              <div
                key={spec.label}
                className="bg-navy/50 border border-card-border px-4 py-3 text-center"
              >
                <span className="text-steel block mb-1 flex justify-center">
                  {(() => {
                    const Icon = specIcons[spec.icon];
                    return Icon ? <Icon className="w-6 h-6" /> : spec.icon;
                  })()}
                </span>
                <span className="text-chrome text-xs sm:text-sm uppercase tracking-widest font-[family-name:var(--font-heading)]">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
