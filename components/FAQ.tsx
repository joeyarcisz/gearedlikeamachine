"use client";

import { useState } from "react";
import { faqItems } from "@/lib/data";
import ScrollFadeIn from "./ScrollFadeIn";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollFadeIn>
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              FAQ
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
              Common questions about working with us.
            </p>
          </div>
        </ScrollFadeIn>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <ScrollFadeIn key={i} delay={i * 80}>
              <div className="border border-card-border">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-navy/20 transition-colors"
                >
                  <span className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-semibold uppercase tracking-wide">
                    {item.question}
                  </span>
                  <span
                    className={`text-steel text-xl shrink-0 transition-transform duration-300 ${
                      openIndex === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`faq-answer ${openIndex === i ? "open" : ""}`}
                >
                  <div className="px-5 sm:px-6 pb-5">
                    <p className="text-muted text-sm sm:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
