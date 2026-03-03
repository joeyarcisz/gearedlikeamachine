import { productionSpecs } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";
import { specIcons } from "./icons";

export default function Showreel() {
  return (
    <section id="showreel" className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              See What We Create
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              A glimpse into our world of cinematic storytelling and
              precision-crafted video content.
            </p>
          </div>
        </ScrollFadeIn>
      </div>

      {/* Vimeo Embed — full width */}
      <ScrollFadeIn delay={200}>
        <div className="relative aspect-video bg-navy border-y border-card-border overflow-hidden mb-10 grayscale">
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
