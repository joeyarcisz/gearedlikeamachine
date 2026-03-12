"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ProjectOption {
  id: string;
  title: string;
}

const inputClasses =
  "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
const labelClasses =
  "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
const selectClasses =
  "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

export default function NewShootDayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get("projectId") ?? "";

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState(preselectedProjectId);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [wrapTime, setWrapTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/production/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch {
        // silently fail
      }
    }
    fetchProjects();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      projectId,
      date,
      startTime: startTime.trim(),
      wrapTime: wrapTime.trim() || null,
      locationName: locationName.trim() || null,
      locationAddress: locationAddress.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      const res = await fetch("/api/production/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create shoot day");
      }

      const created = await res.json();
      router.push(`/admin/production/schedule/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/production/schedule"
          className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
        >
          &larr; Schedule
        </Link>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            New Shoot Day
          </h2>
        </div>

        <div className="dashboard-card-body">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            {/* Project */}
            <div>
              <label htmlFor="projectId" className={labelClasses}>
                Project <span className="text-steel">*</span>
              </label>
              <select
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={selectClasses}
                required
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Start Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className={labelClasses}>
                  Date <span className="text-steel">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="startTime" className={labelClasses}>
                  Start Time <span className="text-steel">*</span>
                </label>
                <input
                  id="startTime"
                  type="text"
                  placeholder="6:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="wrapTime" className={labelClasses}>
                  Wrap Time
                </label>
                <input
                  id="wrapTime"
                  type="text"
                  placeholder="7:00 PM"
                  value={wrapTime}
                  onChange={(e) => setWrapTime(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="locationName" className={labelClasses}>
                  Location Name
                </label>
                <input
                  id="locationName"
                  type="text"
                  placeholder="Studio A, Lakeside Ranch, etc."
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="locationAddress" className={labelClasses}>
                  Location Address
                </label>
                <input
                  id="locationAddress"
                  type="text"
                  placeholder="123 Main St, Dallas, TX"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className={inputClasses}
                />
              </div>
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
                placeholder="Any special notes for this shoot day..."
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
                {submitting ? "Creating..." : "Create Shoot Day"}
              </button>
              <Link
                href="/admin/production/schedule"
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
