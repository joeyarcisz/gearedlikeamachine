import { siteConfig } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 border-y border-card-border overflow-hidden"
    >
      <div
        className="absolute inset-0 grayscale"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <ScrollFadeIn>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-6">
            Ready to Level Up
            <span className="text-steel">?</span>
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Let&apos;s build something cinematic together. Tell us about your
            project and we&apos;ll engineer the perfect video solution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-all duration-300 flex items-center gap-2"
            >
              Start Your Project
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#portfolio"
              className="group border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-all duration-300"
            >
              View Our Work
            </a>
          </div>

          <p className="text-muted text-xs sm:text-sm uppercase tracking-widest">
            Based in {siteConfig.location} — {siteConfig.availability}
          </p>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
