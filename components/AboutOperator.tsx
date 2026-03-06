import Image from "next/image";
import ScrollFadeIn from "./ScrollFadeIn";

export default function AboutOperator() {
  return (
    <section className="py-20 sm:py-28 bg-navy/30 border-y border-card-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image side */}
          <ScrollFadeIn>
            <div className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/about/joey-silhouette.jpg"
                  alt="Cinematographer on set"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              {/* Floating accent image */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-[45%] aspect-square border-2 border-card-border overflow-hidden">
                <Image
                  src="/about/joey-rooftop-bw.jpg"
                  alt="Joey Arcisz portrait"
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            </div>
          </ScrollFadeIn>

          {/* Text side */}
          <ScrollFadeIn delay={200}>
            <div className="lg:pl-4">
              <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
                The Operator
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6">
                Joey Arcisz
              </h2>
              <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  Two decades behind the camera. Director of Photography, director,
                  and the engine behind Geared Like A Machine. From Super Bowl
                  commercials to global fashion campaigns spanning 100+ countries,
                  the work speaks for itself.
                </p>
                <p>
                  Clients include SpaceX, U.S. Polo Assn., Chevrolet, Coca-Cola,
                  ESPN, Ford, Hilton, and Tige Boats. Based in Dallas-Fort Worth,
                  operating worldwide.
                </p>
                <p>
                  Every project gets the same thing: precision, intent, and a
                  relentless focus on the outcome. No filler. No guesswork. Just
                  execution.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-card-border">
                <div>
                  <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white block">
                    20+
                  </span>
                  <span className="text-muted text-xs uppercase tracking-widest">
                    Years
                  </span>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white block">
                    200+
                  </span>
                  <span className="text-muted text-xs uppercase tracking-widest">
                    Productions
                  </span>
                </div>
                <div>
                  <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white block">
                    100+
                  </span>
                  <span className="text-muted text-xs uppercase tracking-widest">
                    Countries
                  </span>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  );
}
