"use client";

import { useState, useMemo } from "react";

type ProjectType =
  | "commercial"
  | "brand-film"
  | "social"
  | "documentary"
  | "event"
  | "corporate"
  | "music-video";

type CrewSize = "minimal" | "standard" | "full" | "large";
type PostLevel = "light" | "standard" | "premium";
type Deliverable = "hero" | "social" | "bts" | "photo" | "raw" | "motion";

const PROJECT_TYPES: { key: ProjectType; label: string }[] = [
  { key: "commercial", label: "Commercial / Ad Spot" },
  { key: "brand-film", label: "Brand Film" },
  { key: "social", label: "Social Campaign" },
  { key: "documentary", label: "Documentary / Docu-Series" },
  { key: "event", label: "Event Coverage" },
  { key: "corporate", label: "Corporate / Internal" },
  { key: "music-video", label: "Music Video" },
];

const CREW_OPTIONS: { key: CrewSize; label: string; sub: string }[] = [
  { key: "minimal", label: "Minimal", sub: "1\u20133" },
  { key: "standard", label: "Standard", sub: "4\u20138" },
  { key: "full", label: "Full Production", sub: "9\u201315" },
  { key: "large", label: "Large Scale", sub: "16+" },
];

const DELIVERABLE_OPTIONS: { key: Deliverable; label: string }[] = [
  { key: "hero", label: "Hero Video (60\u201390s)" },
  { key: "social", label: "Social Cutdowns (15s/30s)" },
  { key: "bts", label: "Behind-the-Scenes" },
  { key: "photo", label: "Photography Stills" },
  { key: "raw", label: "Raw Footage Delivery" },
  { key: "motion", label: "Motion Graphics / Animation" },
];

const POST_OPTIONS: { key: PostLevel; label: string; sub: string }[] = [
  { key: "light", label: "Light", sub: "Color + basic edit" },
  { key: "standard", label: "Standard", sub: "Full edit, color, sound mix" },
  { key: "premium", label: "Premium", sub: "VFX, animation, full sound design" },
];

const BASE_RATES: Record<ProjectType, number> = {
  commercial: 3000,
  "brand-film": 4000,
  social: 2000,
  documentary: 3500,
  event: 2500,
  corporate: 2000,
  "music-video": 3000,
};

const CREW_MULT: Record<CrewSize, number> = {
  minimal: 1.0,
  standard: 1.8,
  full: 2.8,
  large: 4.0,
};

const POST_MULT: Record<PostLevel, number> = {
  light: 1.0,
  standard: 1.4,
  premium: 2.0,
};

const DELIV_COST: Record<Deliverable, number> = {
  hero: 2000,
  social: 800,
  bts: 500,
  photo: 1000,
  raw: 300,
  motion: 2500,
};

function roundTo500(n: number) {
  return Math.round(n / 500) * 500;
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default function ScopeCalculator() {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [shootDays, setShootDays] = useState(1);
  const [crewSize, setCrewSize] = useState<CrewSize | null>(null);
  const [locations, setLocations] = useState(1);
  const [deliverables, setDeliverables] = useState<Set<Deliverable>>(new Set());
  const [postLevel, setPostLevel] = useState<PostLevel | null>(null);

  function toggleDeliverable(d: Deliverable) {
    setDeliverables((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function buildMailto() {
    const lines: string[] = ["Production Scope Estimate", ""];

    if (projectType) {
      const label = PROJECT_TYPES.find((t) => t.key === projectType)?.label;
      lines.push(`Project Type: ${label}`);
    }

    lines.push(`Shoot Days: ${shootDays}`);

    if (crewSize) {
      const crew = CREW_OPTIONS.find((c) => c.key === crewSize);
      lines.push(`Crew Size: ${crew?.label} (${crew?.sub})`);
    }

    lines.push(`Locations: ${locations >= 5 ? "5+" : locations}`);

    if (deliverables.size > 0) {
      const labels = Array.from(deliverables)
        .map((d) => DELIVERABLE_OPTIONS.find((o) => o.key === d)?.label)
        .filter(Boolean);
      lines.push(`Deliverables: ${labels.join(", ")}`);
    }

    if (postLevel) {
      const post = POST_OPTIONS.find((p) => p.key === postLevel);
      lines.push(`Post-Production: ${post?.label} (${post?.sub})`);
    }

    if (estimate) {
      lines.push("");
      lines.push(`Estimated Range: $${fmt(estimate.low)} \u2013 $${fmt(estimate.high)}`);
    }

    lines.push("");
    lines.push("---");
    lines.push("Generated via gearedlikeamachine.com/scope");

    const subject = encodeURIComponent("Production Scope Estimate");
    const body = encodeURIComponent(lines.join("\n"));
    return `mailto:hello@gearedlikeamachine.com?subject=${subject}&body=${body}`;
  }

  const estimate = useMemo(() => {
    if (!projectType || !crewSize || !postLevel) return null;

    const base = BASE_RATES[projectType];
    const locMult = 1.0 + (locations - 1) * 0.15;
    const delivTotal = Array.from(deliverables).reduce(
      (s, d) => s + DELIV_COST[d],
      0
    );
    const raw =
      base * shootDays * CREW_MULT[crewSize] * locMult * POST_MULT[postLevel] +
      delivTotal;
    return { low: roundTo500(raw), high: roundTo500(raw * 1.35) };
  }, [projectType, shootDays, crewSize, locations, deliverables, postLevel]);

  return (
    <>
      <div className="space-y-10">
        {/* Project Type */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
            Project Type
          </label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setProjectType(t.key)}
                className={`px-4 py-3 min-h-[44px] text-sm tracking-wide border transition-all duration-200 cursor-pointer ${
                  projectType === t.key
                    ? "bg-steel text-black border-steel font-semibold"
                    : "border-card-border text-chrome hover:border-steel/50 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shoot Days + Locations */}
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
              Shoot Days
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShootDays((d) => Math.max(1, d - 1))}
                className="w-11 h-11 border border-card-border text-chrome hover:border-steel/50 hover:text-white transition-colors flex items-center justify-center text-lg cursor-pointer"
              >
                &minus;
              </button>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white w-8 text-center">
                {shootDays}
              </span>
              <button
                onClick={() => setShootDays((d) => Math.min(10, d + 1))}
                className="w-11 h-11 border border-card-border text-chrome hover:border-steel/50 hover:text-white transition-colors flex items-center justify-center text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
              Locations
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocations((l) => Math.max(1, l - 1))}
                className="w-11 h-11 border border-card-border text-chrome hover:border-steel/50 hover:text-white transition-colors flex items-center justify-center text-lg cursor-pointer"
              >
                &minus;
              </button>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white w-8 text-center">
                {locations >= 5 ? "5+" : locations}
              </span>
              <button
                onClick={() => setLocations((l) => Math.min(5, l + 1))}
                className="w-11 h-11 border border-card-border text-chrome hover:border-steel/50 hover:text-white transition-colors flex items-center justify-center text-lg cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Crew Size */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
            Crew Size
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CREW_OPTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => setCrewSize(c.key)}
                className={`px-4 py-3 border transition-all duration-200 cursor-pointer text-left ${
                  crewSize === c.key
                    ? "bg-steel text-black border-steel"
                    : "border-card-border text-chrome hover:border-steel/50 hover:text-white"
                }`}
              >
                <span className="block text-sm font-semibold tracking-wide">
                  {c.label}
                </span>
                <span
                  className={`block text-xs mt-0.5 ${
                    crewSize === c.key ? "text-black/60" : "text-muted"
                  }`}
                >
                  {c.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
            Deliverables
          </label>
          <div className="flex flex-wrap gap-2">
            {DELIVERABLE_OPTIONS.map((d) => (
              <button
                key={d.key}
                onClick={() => toggleDeliverable(d.key)}
                className={`px-4 py-3 min-h-[44px] text-sm tracking-wide border transition-all duration-200 cursor-pointer ${
                  deliverables.has(d.key)
                    ? "bg-steel text-black border-steel font-semibold"
                    : "border-card-border text-chrome hover:border-steel/50 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Post-Production Level */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-4 font-[family-name:var(--font-heading)] font-semibold">
            Post-Production Level
          </label>
          <div className="grid sm:grid-cols-3 gap-2">
            {POST_OPTIONS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPostLevel(p.key)}
                className={`px-4 py-3 border transition-all duration-200 cursor-pointer text-left ${
                  postLevel === p.key
                    ? "bg-steel text-black border-steel"
                    : "border-card-border text-chrome hover:border-steel/50 hover:text-white"
                }`}
              >
                <span className="block text-sm font-semibold tracking-wide">
                  {p.label}
                </span>
                <span
                  className={`block text-xs mt-0.5 ${
                    postLevel === p.key ? "text-black/60" : "text-muted"
                  }`}
                >
                  {p.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Estimate Display */}
        <div
          className={`border-t border-card-border pt-8 transition-opacity duration-500 ${
            estimate ? "opacity-100" : "opacity-30"
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]">
            Estimated Range
          </p>
          <p className="font-[family-name:var(--font-heading)] text-2xl sm:text-4xl md:text-5xl font-bold text-steel">
            {estimate
              ? `$${fmt(estimate.low)} \u2013 $${fmt(estimate.high)}`
              : "$\u2014 \u2013 $\u2014"}
          </p>
          {!estimate && (
            <p className="text-muted text-xs mt-3">
              Select project type, crew size, and post-production level to see
              your estimate.
            </p>
          )}
        </div>
      </div>

      {/* ── Ready to Move Forward CTA ── */}
      <div className={`mt-16 pt-16 border-t border-card-border text-center ${estimate ? "pb-24 sm:pb-0" : ""}`}>
        <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase tracking-wider mb-4">
          Ready to Move Forward?
        </h3>
        <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Your estimate is a starting point. Send your scope to our team and
          we&apos;ll refine it into a production-ready plan within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={buildMailto()}
            className="w-full sm:w-auto text-center bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
          >
            Send My Scope
          </a>
          <a
            href="tel:+16822297699"
            className="w-full sm:w-auto text-center border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-colors"
          >
            Call Us: (682) 229-7699
          </a>
        </div>
        <p className="text-muted text-xs mt-6">
          No commitment. No obligation. Just a clear plan.
        </p>
      </div>

      {/* Mobile Sticky Estimate */}
      {estimate && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-card-border bg-navy/95 backdrop-blur-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">
                Estimated Range
              </p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-steel">
                {`$${fmt(estimate.low)} \u2013 $${fmt(estimate.high)}`}
              </p>
            </div>
            <a
              href="/discovery"
              className="bg-steel text-black px-5 py-3 min-h-[44px] flex items-center text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors shrink-0"
            >
              Let&apos;s Talk
            </a>
          </div>
        </div>
      )}
    </>
  );
}
