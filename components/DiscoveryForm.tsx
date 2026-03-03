"use client";

import { useState, type FormEvent } from "react";

const projectTypes = [
  "Brand Film",
  "Commercial",
  "Social Content",
  "Documentary",
  "Product Demo",
  "Event Coverage",
  "Other",
];

const budgetRanges = [
  "Under $5k",
  "$5k–$15k",
  "$15k–$50k",
  "$50k+",
  "Not sure yet",
];

const timelines = ["ASAP", "1–2 months", "3+ months", "Flexible"];

export default function DiscoveryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
      projectType: (form.elements.namedItem("projectType") as HTMLSelectElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim(),
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
    };

    try {
      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-steel mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mx-auto">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase tracking-wide text-white mb-3">
          Message Received
        </h3>
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
          Thanks for reaching out. We&apos;ll review your project details and get
          back to you within 24 hours. Check your inbox for a confirmation.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name <span className="text-steel">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email <span className="text-steel">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className={labelClasses}>
          Company / Brand
        </label>
        <input
          type="text"
          id="company"
          name="company"
          placeholder="Optional"
          className={inputClasses}
        />
      </div>

      {/* Project Type */}
      <div>
        <label htmlFor="projectType" className={labelClasses}>
          What are you looking for?
        </label>
        <select id="projectType" name="projectType" className={selectClasses}>
          <option value="">Select one...</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClasses}>
          Tell us about your project <span className="text-steel">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="What's the vision? Any key dates, deliverables, or goals?"
          className={inputClasses + " resize-y"}
        />
      </div>

      {/* Budget + Timeline row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className={labelClasses}>
            Budget Range
          </label>
          <select id="budget" name="budget" className={selectClasses}>
            <option value="">Select one...</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className={labelClasses}>
            Timeline
          </label>
          <select id="timeline" name="timeline" className={selectClasses}>
            <option value="">Select one...</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-steel text-black py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Sending..." : "Send It"}
      </button>
    </form>
  );
}
