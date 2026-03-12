"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ProjectOption {
  id: string;
  title: string;
  clientName: string | null;
}

export default function NewCallSheetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetProjectId = searchParams.get("projectId") ?? "";

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [projectId, setProjectId] = useState(presetProjectId);
  const [shootDate, setShootDate] = useState("");
  const [callTime, setCallTime] = useState("07:00");
  const [wrapTime, setWrapTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [parkingNotes, setParkingNotes] = useState("");
  const [nearestHospital, setNearestHospital] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/production/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch {
        // Projects will just be empty
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      projectId,
      shootDate,
      callTime: callTime.trim(),
      wrapTime: wrapTime.trim() || null,
      locationName: locationName.trim() || null,
      locationAddress: locationAddress.trim() || null,
      parkingNotes: parkingNotes.trim() || null,
      nearestHospital: nearestHospital.trim() || null,
      generalNotes: generalNotes.trim() || null,
      specialInstructions: specialInstructions.trim() || null,
    };

    try {
      const res = await fetch("/api/production/callsheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create call sheet");
      }

      const created = await res.json();
      router.push(`/admin/production/callsheets/${created.id}`);
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
    <div className="p-4 sm:p-6 space-y-6">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            New Call Sheet
          </h2>
        </div>

        <div className="dashboard-card-body">
          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            {/* Project */}
            <div>
              <label htmlFor="projectId" className={labelClasses}>
                Project <span className="text-steel">*</span>
              </label>
              {loadingProjects ? (
                <div className={`${inputClasses} text-muted`}>
                  Loading projects...
                </div>
              ) : (
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
                      {p.clientName ? ` — ${p.clientName}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Shoot Date + Call Time + Wrap Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="shootDate" className={labelClasses}>
                  Shoot Date <span className="text-steel">*</span>
                </label>
                <input
                  id="shootDate"
                  type="date"
                  value={shootDate}
                  onChange={(e) => setShootDate(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label htmlFor="callTime" className={labelClasses}>
                  Call Time <span className="text-steel">*</span>
                </label>
                <input
                  id="callTime"
                  type="time"
                  value={callTime}
                  onChange={(e) => setCallTime(e.target.value)}
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
                  type="time"
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
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Studio A, Ranch exterior"
                />
              </div>
              <div>
                <label htmlFor="locationAddress" className={labelClasses}>
                  Location Address
                </label>
                <input
                  id="locationAddress"
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className={inputClasses}
                  placeholder="Full street address"
                />
              </div>
            </div>

            {/* Safety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parkingNotes" className={labelClasses}>
                  Parking Notes
                </label>
                <input
                  id="parkingNotes"
                  type="text"
                  value={parkingNotes}
                  onChange={(e) => setParkingNotes(e.target.value)}
                  className={inputClasses}
                  placeholder="Where to park"
                />
              </div>
              <div>
                <label htmlFor="nearestHospital" className={labelClasses}>
                  Nearest Hospital
                </label>
                <input
                  id="nearestHospital"
                  type="text"
                  value={nearestHospital}
                  onChange={(e) => setNearestHospital(e.target.value)}
                  className={inputClasses}
                  placeholder="Name and address"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="generalNotes" className={labelClasses}>
                General Notes
              </label>
              <textarea
                id="generalNotes"
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Any general information for the crew"
              />
            </div>

            <div>
              <label htmlFor="specialInstructions" className={labelClasses}>
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="NDAs, wardrobe, safety requirements, etc."
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
                {submitting ? "Creating..." : "Create Call Sheet"}
              </button>

              <Link
                href="/admin/production/callsheets"
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
