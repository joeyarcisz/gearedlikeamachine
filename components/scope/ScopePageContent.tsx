"use client";

import { useRef, useState } from "react";
import ScopeWizard from "./ScopeWizard";

const VALUE_PROPS = [
  {
    title: "Instant Pricing",
    description:
      "No waiting for callbacks. Configure your project and see real numbers in under 3 minutes.",
  },
  {
    title: "Fully Itemized",
    description:
      "Every line item broken out: pre-production, crew, gear, post, and additional costs.",
  },
  {
    title: "Scope Summary",
    description:
      "A written project scope document generated from your selections, ready to share with stakeholders.",
  },
  {
    title: "PDF Export",
    description:
      "Download or print your estimate as a clean, branded document for internal review or approval.",
  },
];

export default function ScopePageContent() {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [engineStarted, setEngineStarted] = useState(false);

  function scrollToCalculator() {
    setEngineStarted(true);
    calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ── Hero ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden print:hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-6 font-[family-name:var(--font-heading)]">
              Scope Engine
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-[0.95] mb-6">
              Production Scope Engine
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
              Get a ballpark production estimate in under two minutes. Tell us
              what you&apos;re building, and we&apos;ll tell you what it takes.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <button
                onClick={scrollToCalculator}
                className="group w-full sm:w-auto bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Run the Engine
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
              <a
                href="/discovery"
                className="group w-full sm:w-auto text-center border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-all duration-300"
              >
                Prefer to Talk?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      {/* SECTION VISIBILITY - HIDDEN ONCE ENGINE STARTED 2026-03-07 */}
      {!engineStarted && (
      <section className="py-16 sm:py-20 border-y border-card-border print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Process
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold uppercase tracking-wider">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            <div>
              <span className="font-[family-name:var(--font-heading)] text-5xl font-bold text-steel/20 block mb-3">
                01
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2">
                Define Your Project
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Select your format: commercial, brand film, social campaign,
                documentary, or event coverage.
              </p>
            </div>
            <div>
              <span className="font-[family-name:var(--font-heading)] text-5xl font-bold text-steel/20 block mb-3">
                02
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2">
                Set Your Parameters
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Specify shoot days, crew size, locations, and deliverables. The
                engine adjusts in real time.
              </p>
            </div>
            <div>
              <span className="font-[family-name:var(--font-heading)] text-5xl font-bold text-steel/20 block mb-3">
                03
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2">
                Get Your Range
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                Receive an estimated production range based on current market
                rates and our operational model.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── What the Engine Evaluates ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      {/* SECTION VISIBILITY - HIDDEN ONCE ENGINE STARTED 2026-03-07 */}
      {!engineStarted && (
      <section className="py-16 sm:py-20 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Inputs
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold uppercase tracking-wider">
              What the Engine Evaluates
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="border border-card-border bg-navy/30 p-6 sm:p-8 space-y-4">
              {[
                "Project type & format",
                "Number of shoot days",
                "Crew size & specialization",
                "Location count & complexity",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-steel/40 shrink-0" />
                  <span className="text-sm text-chrome">{item}</span>
                </div>
              ))}
            </div>
            <div className="border border-card-border bg-navy/30 p-6 sm:p-8 space-y-4">
              {[
                "Camera & lighting package",
                "Post-production scope",
                "Deliverable formats & quantities",
                "Distribution & licensing needs",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-steel/40 shrink-0" />
                  <span className="text-sm text-chrome">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── Typical Production Ranges ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      {/* SECTION VISIBILITY - HIDDEN ONCE ENGINE STARTED 2026-03-07 */}
      {!engineStarted && (
      <section className="py-16 sm:py-20 border-y border-card-border print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Benchmarks
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold uppercase tracking-wider">
              Typical Production Ranges
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="border border-card-border p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-muted mb-3 font-[family-name:var(--font-heading)]">
                Targeted Campaigns
              </p>
              <p className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-steel mb-3">
                $8K &ndash; $20K
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Social content, product spots, single-day shoots with focused
                deliverables.
              </p>
            </div>
            <div className="border border-card-border p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-muted mb-3 font-[family-name:var(--font-heading)]">
                Brand Films &amp; Series
              </p>
              <p className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-steel mb-3">
                $25K &ndash; $75K
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Multi-day productions, full crew, post-production pipeline,
                multi-format delivery.
              </p>
            </div>
            <div className="border border-card-border p-6 sm:p-8">
              <p className="text-xs uppercase tracking-widest text-muted mb-3 font-[family-name:var(--font-heading)]">
                Large-Scale Productions
              </p>
              <p className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-steel mb-3">
                $100K+
              </p>
              <p className="text-muted text-sm leading-relaxed">
                Global campaigns, multi-location shoots, extended post,
                broadcast-grade deliverables.
              </p>
            </div>
          </div>

          <p className="text-muted text-xs mt-6 leading-relaxed">
            Ranges reflect market baselines. Your actual scope may vary based on
            creative complexity and timeline.
          </p>
        </div>
      </section>
      )}

      {/* ── Build Your Scope ── */}
      <section
        ref={calculatorRef}
        id="calculator"
        className="py-16 sm:py-20 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScopeWizard />
        </div>
      </section>

      {/* ── What You Get ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      <section className="py-16 sm:py-20 border-t border-card-border print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              Your Output
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold uppercase tracking-wider">
              What You Get
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="bg-navy/30 border border-card-border p-6 sm:p-8"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold uppercase tracking-wider mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      {/* PDF CLEANUP - HIDDEN FROM PDF OUTPUT 2026-03-07 - LIVES ON /SCOPE LANDING PAGE ONLY */}
      <section className="py-16 sm:py-20 border-t border-card-border print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-4">
            Need a Custom Quote?
          </h2>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Some projects don&apos;t fit neatly into a calculator. If yours
            requires custom scoping, retainer pricing, or multi-phase planning,
            reach out directly and we&apos;ll build it from scratch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/discovery"
              className="w-full sm:w-auto text-center bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
            >
              Discovery Form
            </a>
            <a
              href="mailto:hello@gearedlikeamachine.com"
              className="w-full sm:w-auto text-center border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-colors"
            >
              Email Us Direct
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
