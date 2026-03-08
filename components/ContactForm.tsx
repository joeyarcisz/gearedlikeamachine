"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Commercial",
  "Documentary",
  "Short-Form / Social",
  "Equipment Rental",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || undefined,
          projectType: form.projectType || undefined,
          description: form.message,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-8">
        <p className="font-[family-name:var(--font-heading)] text-xl uppercase tracking-wider text-steel mb-2">
          Your message is on its way.
        </p>
        <p className="text-muted text-sm">
          We will follow up within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-xs uppercase tracking-widest text-muted mb-1.5 font-[family-name:var(--font-heading)]">
            Name <span className="text-steel">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="cf-company" className="block text-xs uppercase tracking-widest text-muted mb-1.5 font-[family-name:var(--font-heading)]">
            Company
          </label>
          <input
            id="cf-company"
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
            placeholder="Company name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-xs uppercase tracking-widest text-muted mb-1.5 font-[family-name:var(--font-heading)]">
          Email <span className="text-steel">*</span>
        </label>
        <input
          id="cf-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="cf-project-type" className="block text-xs uppercase tracking-widest text-muted mb-1.5 font-[family-name:var(--font-heading)]">
          Project Type
        </label>
        <select
          id="cf-project-type"
          value={form.projectType}
          onChange={(e) => update("projectType", e.target.value)}
          className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors cursor-pointer appearance-none"
        >
          <option value="">Select a project type</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-xs uppercase tracking-widest text-muted mb-1.5 font-[family-name:var(--font-heading)]">
          Message <span className="text-steel">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full bg-navy/50 border border-card-border text-white text-sm px-4 py-2.5 focus:outline-none focus:border-steel transition-colors resize-none placeholder:text-muted/50"
          placeholder="Tell us about your project"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-steel text-black py-3 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-xs text-center">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
