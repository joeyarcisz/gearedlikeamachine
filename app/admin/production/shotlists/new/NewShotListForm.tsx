"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface NewShotListFormProps {
  projects: { id: string; title: string }[];
}

export default function NewShotListForm({ projects }: NewShotListFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProjectId = searchParams.get("projectId") || "";

  const [projectId, setProjectId] = useState(preselectedProjectId);
  const [title, setTitle] = useState("");
  const [sceneNumber, setSceneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      projectId,
      title: title.trim(),
      sceneNumber: sceneNumber.trim() || null,
      description: description.trim() || null,
    };

    try {
      const res = await fetch("/api/production/shotlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create shot list");
      }

      const created = await res.json();
      router.push(`/admin/production/shotlists/${created.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          New Shot List
        </h2>
      </div>

      <div className="dashboard-card-body">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Project + Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="e.g. Scene 1 - Opening"
                required
              />
            </div>
          </div>

          {/* Scene Number */}
          <div className="max-w-xs">
            <label htmlFor="sceneNumber" className={labelClasses}>
              Scene Number
            </label>
            <input
              id="sceneNumber"
              type="text"
              value={sceneNumber}
              onChange={(e) => setSceneNumber(e.target.value)}
              className={inputClasses}
              placeholder="e.g. 1, 2A"
            />
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
              placeholder="Brief description of this shot list..."
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
              {submitting ? "Creating..." : "Create Shot List"}
            </button>

            <Link
              href="/admin/production/shotlists"
              className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
