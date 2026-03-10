"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface LogActivityFormProps {
  contactId?: string;
  opportunityId?: string;
  crewMemberId?: string;
}

const MANUAL_TYPES = [
  { value: "note", label: "Note" },
  { value: "call", label: "Call" },
  { value: "meeting", label: "Meeting" },
];

export default function LogActivityForm({
  contactId,
  opportunityId,
  crewMemberId,
}: LogActivityFormProps) {
  const router = useRouter();
  const [type, setType] = useState("note");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description: description.trim(),
          contactId,
          opportunityId,
          crewMemberId: !contactId ? crewMemberId : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to log activity");
      }

      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const selectClasses =
    "bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={selectClasses}
      >
        {MANUAL_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <div className="flex-1">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What happened?"
          rows={2}
          className={inputClasses}
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !description.trim()}
        className="self-start bg-steel text-black px-5 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)] shrink-0"
      >
        {submitting ? "Logging..." : "Log"}
      </button>

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
    </form>
  );
}
