"use client";

import { siteConfig } from "@/lib/data";
import { GearDecoration } from "./icons";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background video */}
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
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

      {/* Grid overlay for industrial feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative gears */}
      <GearDecoration className="absolute -top-10 -left-10 w-64 h-64 text-steel opacity-[0.04] animate-spin-slow" />
      <GearDecoration className="absolute -bottom-16 -right-16 w-80 h-80 text-steel opacity-[0.03] animate-spin-slow-reverse" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up">
        <p className="text-steel text-sm sm:text-base uppercase tracking-[0.3em] mb-6 font-[family-name:var(--font-heading)]">
          {siteConfig.location} — {siteConfig.availability}
        </p>

        <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wide leading-[0.95] mb-6">
          {siteConfig.tagline.split(" ").map((word, i) => (
            <span key={i}>
              {word}
              {i < siteConfig.tagline.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p className="text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {siteConfig.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="group bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-all duration-300 flex items-center gap-2"
          >
            Start Your Project
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
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
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
