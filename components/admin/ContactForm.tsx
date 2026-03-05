"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_STAGES, CONTACT_STAGE_LABELS } from "@/lib/crm-types";
import type { CRMContact, CRMOpportunity } from "@/lib/crm-types";
import StageTag from "./StageTag";
import Link from "next/link";

interface ContactFormProps {
  contact?: CRMContact & { opportunities?: CRMOpportunity[] };
}

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contact;

  const [name, setName] = useState(contact?.name ?? "");
  const [company, setCompany] = useState(contact?.company ?? "");
  const [email, setEmail] = useState(contact?.email ?? "");
  const [phone, setPhone] = useState(contact?.phone ?? "");
  const [stage, setStage] = useState(contact?.stage ?? "lead");
  const [lastContact, setLastContact] = useState(
    contact?.lastContact ? contact.lastContact.split("T")[0] : ""
  );
  const [nextAction, setNextAction] = useState(contact?.nextAction ?? "");
  const [notes, setNotes] = useState(contact?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      name: name.trim(),
      company: company.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      stage,
      lastContact: lastContact || null,
      nextAction: nextAction.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/crm/contacts/${contact.id}`
        : "/api/crm/contacts";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save contact");
      }

      router.push("/admin/contacts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this contact? This cannot be undone.")) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/crm/contacts/${contact!.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/contacts");
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
    <div className="space-y-6">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            {isEdit ? "Edit Contact" : "New Contact"}
          </h2>
        </div>

        <div className="dashboard-card-body">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            {/* Name + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Name <span className="text-steel">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClasses}>
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Stage + Last Contact */}
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
                  {CONTACT_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {CONTACT_STAGE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lastContact" className={labelClasses}>
                  Last Contact
                </label>
                <input
                  id="lastContact"
                  type="date"
                  value={lastContact}
                  onChange={(e) => setLastContact(e.target.value)}
                  className={inputClasses}
                />
              </div>
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
                {submitting ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}
              </button>

              <Link
                href="/admin/contacts"
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

      {/* Linked opportunities */}
      {isEdit && contact.opportunities && contact.opportunities.length > 0 && (
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Linked Opportunities
            </h2>
          </div>
          <div className="dashboard-card-body">
            <div className="space-y-2">
              {contact.opportunities.map((opp) => (
                <Link
                  key={opp.id}
                  href={`/admin/pipeline/${opp.id}`}
                  className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
                >
                  <div>
                    <span className="text-white text-sm">{opp.title}</span>
                    {opp.estimatedValueLow && opp.estimatedValueHigh && (
                      <span className="text-muted text-xs ml-3">
                        ${opp.estimatedValueLow.toLocaleString()} – ${opp.estimatedValueHigh.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <StageTag stage={opp.stage} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
