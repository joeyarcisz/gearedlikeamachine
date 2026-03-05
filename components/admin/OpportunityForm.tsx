"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from "@/lib/crm-types";
import type { CRMOpportunity, CRMContact } from "@/lib/crm-types";
import Link from "next/link";

interface OpportunityFormProps {
  opportunity?: CRMOpportunity;
  contacts: Pick<CRMContact, "id" | "name" | "company">[];
}

export default function OpportunityForm({ opportunity, contacts }: OpportunityFormProps) {
  const router = useRouter();
  const isEdit = !!opportunity;

  const [title, setTitle] = useState(opportunity?.title ?? "");
  const [company, setCompany] = useState(opportunity?.company ?? "");
  const [stage, setStage] = useState(opportunity?.stage ?? "lead");
  const [estimatedValueLow, setEstimatedValueLow] = useState(
    opportunity?.estimatedValueLow?.toString() ?? ""
  );
  const [estimatedValueHigh, setEstimatedValueHigh] = useState(
    opportunity?.estimatedValueHigh?.toString() ?? ""
  );
  const [lastTouch, setLastTouch] = useState(
    opportunity?.lastTouch ? opportunity.lastTouch.split("T")[0] : ""
  );
  const [nextAction, setNextAction] = useState(opportunity?.nextAction ?? "");
  const [owner, setOwner] = useState(opportunity?.owner ?? "");
  const [priority, setPriority] = useState(opportunity?.priority ?? "");
  const [notes, setNotes] = useState(opportunity?.notes ?? "");
  const [contactId, setContactId] = useState(opportunity?.contactId ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      title: title.trim(),
      company: company.trim() || null,
      stage,
      estimatedValueLow: estimatedValueLow ? parseInt(estimatedValueLow) : null,
      estimatedValueHigh: estimatedValueHigh ? parseInt(estimatedValueHigh) : null,
      lastTouch: lastTouch || null,
      nextAction: nextAction.trim() || null,
      owner: owner.trim() || null,
      priority: priority || null,
      notes: notes.trim() || null,
      contactId: contactId || null,
    };

    try {
      const url = isEdit
        ? `/api/crm/opportunities/${opportunity.id}`
        : "/api/crm/opportunities";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save opportunity");
      }

      router.push("/admin/pipeline");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/crm/opportunities/${opportunity!.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/pipeline");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
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
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          {isEdit ? "Edit Opportunity" : "New Opportunity"}
        </h2>
      </div>

      <div className="dashboard-card-body">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Title + Company */}
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
              />
            </div>
            <div>
              <label htmlFor="company" className={labelClasses}>
                Company
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Stage + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stage" className={labelClasses}>
                Stage
              </label>
              <select
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className={selectClasses}
              >
                {OPPORTUNITY_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {OPPORTUNITY_STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className={labelClasses}>
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={selectClasses}
              >
                <option value="">None</option>
                <option value="high">High</option>
                <option value="medium-high">Medium-High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Value range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="valueLow" className={labelClasses}>
                Est. Value (Low)
              </label>
              <input
                id="valueLow"
                type="number"
                value={estimatedValueLow}
                onChange={(e) => setEstimatedValueLow(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="valueHigh" className={labelClasses}>
                Est. Value (High)
              </label>
              <input
                id="valueHigh"
                type="number"
                value={estimatedValueHigh}
                onChange={(e) => setEstimatedValueHigh(e.target.value)}
                className={inputClasses}
                placeholder="0"
              />
            </div>
          </div>

          {/* Contact + Owner */}
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
                <option value="">None</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="owner" className={labelClasses}>
                Owner
              </label>
              <input
                id="owner"
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Last Touch */}
          <div className="max-w-xs">
            <label htmlFor="lastTouch" className={labelClasses}>
              Last Touch
            </label>
            <input
              id="lastTouch"
              type="date"
              value={lastTouch}
              onChange={(e) => setLastTouch(e.target.value)}
              className={inputClasses}
            />
          </div>

          {/* Next Action */}
          <div>
            <label htmlFor="nextAction" className={labelClasses}>
              Next Action
            </label>
            <textarea
              id="nextAction"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              rows={2}
              className={inputClasses}
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
              rows={4}
              className={inputClasses}
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
              {submitting ? "Saving..." : isEdit ? "Update Opportunity" : "Create Opportunity"}
            </button>

            <Link
              href="/admin/pipeline"
              className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
            >
              Cancel
            </Link>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="ml-auto text-red-400 hover:text-red-300 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
