"use client";

import { siteConfig, stats } from "@/lib/data";
import { useEffect, useRef, useState } from "react";
import StartHereModal from "./StartHereModal";

function Counter({
  target,
  suffix,
  started,
}: {
  target: number;
  suffix: string;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen bg-black overflow-hidden"
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 lg:gap-16 items-center">
            {/* Left — Text content */}
            <div className="animate-fade-in-up">
              <p className="text-steel text-xs sm:text-sm uppercase tracking-[0.3em] mb-6 font-[family-name:var(--font-heading)]">
                {siteConfig.location} — {siteConfig.availability}
              </p>

              <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wide leading-[0.95] mb-6">
                {siteConfig.tagline}
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
                {siteConfig.description}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mb-14">
                <button
                  onClick={() => setModalOpen(true)}
                  className="group bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Start Here
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
                <a
                  href="#showreel"
                  className="group border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-all duration-300 flex items-center gap-2"
                >
                  Watch Reel
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    ▶
                  </span>
                </a>
              </div>

              {/* Stats row — integrated into hero */}
              <div ref={ref} className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-card-border pt-8">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-steel">
                      <Counter
                        target={stat.value}
                        suffix={stat.suffix}
                        started={started}
                      />
                    </div>
                    <p className="text-muted text-[10px] sm:text-xs uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Video */}
            <div className="relative">
              <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-card-border">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/hero-bg.jpg"
                  className="absolute inset-0 w-full h-full object-cover grayscale"
                >
                  <source src="/gears.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20" />
              </div>
              {/* Decorative offset border */}
              <div className="hidden lg:block absolute -bottom-3 -right-3 w-full h-full border border-steel/20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      <StartHereModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
