"use client";

import { featuredWork } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function FeaturedWork() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Case Files
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Under the Hood
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl">
              A closer look at the projects that define our craft.
            </p>
          </div>
        </ScrollFadeIn>
      </div>

      {/* Horizontal scroll strip */}
      <ScrollFadeIn delay={200}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-4 sm:px-6 pb-4" style={{ paddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 1.5rem))" }}>
            {featuredWork.map((item, i) => (
              <a
                key={item.number}
                href={item.href}
                className="group shrink-0 w-[300px] sm:w-[360px] bg-navy/30 border border-card-border hover:border-steel/40 transition-all duration-300"
              >
                {/* Image area */}
                {item.image ? (
                  <div
                    className="w-full h-48 grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={{
                      backgroundImage: `url('${item.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-navy/60 flex items-center justify-center">
                    <span className="font-[family-name:var(--font-heading)] text-6xl font-bold text-steel/10">
                      {item.number}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <span className="text-steel text-[10px] uppercase tracking-widest mb-2 block">
                    {item.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold uppercase tracking-wide mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
