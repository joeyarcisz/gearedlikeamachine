"use client";

import { useState } from "react";
import type { LeadInfo } from "@/lib/scope-types";

interface LeadGateProps {
  onSubmit: (lead: LeadInfo) => void;
}

export default function LeadGate({ onSubmit }: LeadGateProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isValidEmail && company.trim() !== "" && jobTitle.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    const lead: LeadInfo = {
      email: email.trim(),
      company: company.trim(),
      jobTitle: jobTitle.trim(),
    };

    try {
      const res = await fetch("/api/scope-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    onSubmit(lead);
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold uppercase tracking-widest mb-4">
            Scope & Estimate
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
            Build your project scope and get an instant cost estimate.
            Enter your details below to access the free tool.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-steel transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">
              Company *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company name"
              className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-steel transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Your role"
              className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none focus:border-steel transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full bg-steel text-black py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitting ? "Loading..." : "Access Scope Tool"}
          </button>

          <p className="text-muted/50 text-xs text-center">
            Your info is only used to contact you about your project.
          </p>
        </form>
      </div>
    </div>
  );
}
