"use client";

import { useState } from "react";
import { featuredWork } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function FeaturedWork() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Featured Work
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Deep dives into our most impactful productions.
            </p>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn delay={200}>
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
            {/* Number navigation */}
            <div className="flex md:flex-col gap-4 md:gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {featuredWork.map((item, i) => (
                <button
                  key={item.number}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 whitespace-nowrap md:whitespace-normal ${
                    active === i
                      ? "text-steel border-l-2 border-steel bg-steel/5"
                      : "text-muted hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <span className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold shrink-0">
                    {item.number}
                  </span>
                  <span className="text-xs uppercase tracking-widest hidden sm:inline truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Active project detail */}
            <div className="bg-navy/30 border border-card-border p-6 sm:p-8 md:p-10">
              {featuredWork[active].image && (
                <div
                  className="w-full aspect-video mb-6 grayscale border border-card-border"
                  style={{
                    backgroundImage: `url('${featuredWork[active].image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              <span className="text-steel text-xs uppercase tracking-widest mb-2 block">
                {featuredWork[active].category}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wide mb-4">
                {featuredWork[active].title}
              </h3>
              <p className="text-muted text-base sm:text-lg leading-relaxed mb-6">
                {featuredWork[active].description}
              </p>
              <a
                href="#contact"
                className="text-steel text-sm uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-2"
              >
                View Project →
              </a>
            </div>
          </div>
        </ScrollFadeIn>
      </div>
    </section>
  );
}
