import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "About | Geared Like A Machine",
  description:
    "A production company built on two decades across every format and role. Based in Texas, available worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Section 1: Hero ── */}
          <section className="py-20 sm:py-28">
            <ScrollFadeIn>
              <p className="font-mono text-xs text-muted tracking-[3px] uppercase mb-6">
                ABOUT
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider text-white">
                A Decade in the Making
              </h1>
              <div className="w-12 h-0.5 bg-steel my-4" />
              <p className="text-chrome text-lg sm:text-xl max-w-2xl leading-relaxed">
                The production company that took ten years to build right.
              </p>
            </ScrollFadeIn>
          </section>

          {/* ── Section 2: The Story ── */}
          <section className="py-20 sm:py-28 border-t border-card-border">
            <ScrollFadeIn>
              <p className="font-[family-name:var(--font-heading)] text-xs text-muted tracking-[3px] uppercase mb-8">
                THE STORY
              </p>
            </ScrollFadeIn>
            <div className="space-y-6 max-w-3xl">
              <ScrollFadeIn delay={100}>
                <p className="text-steel text-base sm:text-lg leading-relaxed">
                  A decade ago, we helped build a production company with
                  partners. Things were going well, but over time the visions
                  diverged. One by one, the partners moved on. We sold our
                  shares and walked away from something that was working,
                  because it wasn&apos;t building toward the right thing.
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={200}>
                <p className="text-steel text-base sm:text-lg leading-relaxed">
                  We spent the next ten years behind the camera on every kind of
                  production imaginable. Refined the vision. Studied what worked
                  and what didn&apos;t at every production company, agency, and
                  set. Learned what a production company should be.
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={300}>
                <p className="text-steel text-base sm:text-lg leading-relaxed">
                  GLM is that vision realized. A production company built on two
                  decades of experience and a commitment to running things
                  differently: more efficient, more precise, technology-forward.
                  This is the beginning of a bigger story.
                </p>
              </ScrollFadeIn>
            </div>
          </section>

          {/* ── Section 3: The Machine ── */}
          <section className="py-20 sm:py-28 border-t border-card-border">
            <ScrollFadeIn>
              <p className="font-[family-name:var(--font-heading)] text-xs text-muted tracking-[3px] uppercase mb-8">
                THE MACHINE
              </p>
            </ScrollFadeIn>
            <div className="flex gap-6 flex-wrap">
              {/* Production Card */}
              <ScrollFadeIn className="flex-1 min-w-[280px]" delay={100}>
                <div className="border border-card-border p-6 bg-card h-full">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wider text-white mb-4">
                    PRODUCTION
                  </h3>
                  <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
                    Every project benefits from two decades across every format
                    and role. Streamlined operations, no wasted motion, no
                    bloated crews.
                  </p>
                  <div className="border-t border-card-border pt-3">
                    <ul className="space-y-2">
                      {[
                        "Commercial",
                        "Documentary",
                        "Narrative",
                        "Short-form",
                        "Live production",
                        "Motion design",
                        "Full post pipeline (edit, color, sound, graphics)",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-steel text-xs sm:text-sm tracking-wide"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollFadeIn>

              {/* Rentals Card */}
              <ScrollFadeIn className="flex-1 min-w-[280px]" delay={200}>
                <div className="border border-card-border p-6 bg-card h-full">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase tracking-wider text-white mb-4">
                    RENTALS
                  </h3>
                  <p className="text-muted text-sm sm:text-base leading-relaxed mb-6">
                    The rental experience is due for an overhaul. We&apos;re
                    building a better way to get the right gear into the right
                    hands, faster, smarter, and with the kind of support that
                    only comes from people who use this equipment every day.
                  </p>
                  <div className="border-t border-card-border pt-3">
                    <ul className="space-y-2">
                      {[
                        "Cinema cameras",
                        "Lenses",
                        "Lighting",
                        "Grip",
                        "Drones",
                        "Monitoring",
                        "Audio",
                        "Curated packages",
                        "Texas-based",
                      ].map((item) => (
                        <li
                          key={item}
                          className="text-steel text-xs sm:text-sm tracking-wide"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-steel text-sm mt-4 italic">
                      Something new is coming.
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </section>

          {/* ── Section 4: The Range ── */}
          <section className="py-20 sm:py-28 border-t border-card-border">
            <ScrollFadeIn>
              <p className="font-[family-name:var(--font-heading)] text-xs text-muted tracking-[3px] uppercase mb-8">
                THE RANGE
              </p>
            </ScrollFadeIn>
            <div className="max-w-3xl space-y-6 mb-10">
              <ScrollFadeIn delay={100}>
                <p className="text-steel text-base sm:text-lg leading-relaxed">
                  If it involves a screen, we&apos;ve worked nearly every role
                  involved in getting the final product to the viewer. That kind
                  of range builds a perspective that most people in this industry
                  simply don&apos;t have.
                </p>
              </ScrollFadeIn>
              <ScrollFadeIn delay={200}>
                <p className="text-steel text-base sm:text-lg leading-relaxed">
                  It means understanding not just the creative, but the
                  logistics, the technology, the pipeline, and the decisions that
                  make or break a production at every stage.
                </p>
              </ScrollFadeIn>
            </div>
            <ScrollFadeIn delay={300}>
              <div className="flex flex-wrap gap-3">
                {[
                  "Live Production",
                  "NASCAR Broadcasts",
                  "Narrative Features",
                  "Global Campaigns",
                  "Viral Content",
                  "Motion Design",
                  "Event Stages",
                  "Commercial",
                  "Documentary",
                  "Full Post Pipeline",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 border border-card-border text-steel text-xs tracking-wider uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollFadeIn>
          </section>

          {/* ── Section 5: CTA ── */}
          <section className="py-20 sm:py-28 border-t border-card-border text-center">
            <ScrollFadeIn>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mb-4">
                Put Us to Work
              </h2>
              <p className="text-muted text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Ready to see what GLM can do for your next project?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/discovery"
                  className="group w-full sm:w-auto text-center bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start a Project
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/scope"
                  className="group w-full sm:w-auto text-center border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-all duration-300"
                >
                  Get an Estimate
                </Link>
              </div>
            </ScrollFadeIn>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
