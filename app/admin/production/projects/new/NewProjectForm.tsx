"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECT_STATUSES, PROJECT_TYPES, PROJECT_TYPE_LABELS } from "@/lib/production-types";

interface ContactOption {
  id: string;
  name: string;
  company: string | null;
}

interface NewProjectFormProps {
  contacts: ContactOption[];
}

export default function NewProjectForm({ contacts }: NewProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [contactId, setContactId] = useState("");
  const [projectType, setProjectType] = useState("");
  const [status, setStatus] = useState("pre_production");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetLow, setBudgetLow] = useState("");
  const [budgetHigh, setBudgetHigh] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      title: title.trim(),
      clientName: clientName.trim() || null,
      contactId: contactId || null,
      projectType: projectType || null,
      status,
      description: description.trim() || null,
      startDate: startDate || null,
      endDate: endDate || null,
      budgetLow: budgetLow ? parseInt(budgetLow) : null,
      budgetHigh: budgetHigh ? parseInt(budgetHigh) : null,
      notes: notes.trim() || null,
    };

    try {
      const res = await fetch("/api/production/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create project");
      }

      const project = await res.json();
      router.push(`/admin/production/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            New Project
          </h2>
        </div>

        <div className="dashboard-card-body">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            {/* Title + Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Title <span className="text-steel">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClasses}
                  required
                  placeholder="e.g. FranklinWH Durability Campaign"
                />
              </div>
              <div>
                <label htmlFor="clientName" className={labelClasses}>
                  Client Name
                </label>
                <input
                  id="clientName"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. FranklinWH"
                />
              </div>
            </div>

            {/* Contact + Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactId" className={labelClasses}>
                  Linked Contact
                </label>
                <select
                  id="contactId"
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  className={selectClasses}
                >
                  <option value="">— None —</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.company ? ` (${c.company})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="projectType" className={labelClasses}>
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className={selectClasses}
                >
                  <option value="">— Select —</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {PROJECT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className={labelClasses}>
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={selectClasses}
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className={labelClasses}>
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="endDate" className={labelClasses}>
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetLow" className={labelClasses}>
                  Budget Low ($)
                </label>
                <input
                  id="budgetLow"
                  type="number"
                  value={budgetLow}
                  onChange={(e) => setBudgetLow(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 10000"
                />
              </div>
              <div>
                <label htmlFor="budgetHigh" className={labelClasses}>
                  Budget High ($)
                </label>
                <input
                  id="budgetHigh"
                  type="number"
                  value={budgetHigh}
                  onChange={(e) => setBudgetHigh(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 25000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClasses}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Brief project description..."
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClasses}>
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Internal notes..."
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
              >
                {submitting ? "Creating..." : "Create Project"}
              </button>

              <Link
                href="/admin/production/projects"
                className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
