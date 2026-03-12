"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ShotListDetail, ShotEntry } from "@/lib/production-types";
import {
  SHOT_SIZES,
  SHOT_MOVEMENTS,
  SHOT_ANGLES,
  SHOT_FRAME_RATES,
} from "@/lib/production-types";
import PrintableShotList from "@/components/admin/production/PrintableShotList";

// ── Size badge colors ──
const SIZE_COLORS: Record<string, string> = {
  ES: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  WS: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  FS: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  MFS: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  MS: "bg-green-500/20 text-green-300 border-green-500/30",
  MCU: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  CU: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  ECU: "bg-red-500/20 text-red-300 border-red-500/30",
};

function SizeBadge({ size }: { size: string | null }) {
  if (!size) return null;
  const colors = SIZE_COLORS[size] || "bg-white/10 text-muted border-white/20";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold border rounded ${colors}`}
    >
      {size}
    </span>
  );
}

// ── Shared CSS classes ──
const inputClasses =
  "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
const labelClasses =
  "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
const selectClasses =
  "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

// ── Empty shot form state ──
function emptyShot() {
  return {
    shotNumber: "",
    size: "",
    movement: "",
    angle: "",
    lens: "",
    frameRate: "",
    equipment: "",
    lighting: "",
    description: "",
    notes: "",
  };
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

interface Props {
  shotList: ShotListDetail;
}

export default function ShotListDetailClient({ shotList: initial }: Props) {
  const router = useRouter();
  const [shotList, setShotList] = useState(initial);
  const [shots, setShots] = useState<ShotEntry[]>(initial.shots);
  const [view, setView] = useState<"list" | "grid">("list");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const [showPrint, setShowPrint] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(shotList.description || "");

  const completedCount = shots.filter((s) => s.completed).length;
  const totalCount = shots.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // ── Toggle shot completion ──
  const toggleCompleted = useCallback(
    async (shot: ShotEntry) => {
      const newVal = !shot.completed;
      setShots((prev) =>
        prev.map((s) => (s.id === shot.id ? { ...s, completed: newVal } : s))
      );

      try {
        const res = await fetch(
          `/api/production/shotlists/${shotList.id}/shots/${shot.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: newVal }),
          }
        );
        if (!res.ok) throw new Error("Failed to update");
      } catch {
        // Revert on failure
        setShots((prev) =>
          prev.map((s) => (s.id === shot.id ? { ...s, completed: !newVal } : s))
        );
      }
    },
    [shotList.id]
  );

  // ── Delete shot ──
  const deleteShot = useCallback(
    async (shotId: string) => {
      if (!confirm("Delete this shot?")) return;

      const prev = shots;
      setShots((s) => s.filter((shot) => shot.id !== shotId));

      try {
        const res = await fetch(
          `/api/production/shotlists/${shotList.id}/shots/${shotId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to delete");
      } catch {
        setShots(prev);
      }
    },
    [shotList.id, shots]
  );

  // ── Move shot up/down ──
  const moveShot = useCallback(
    async (shotId: string, direction: "up" | "down") => {
      const idx = shots.findIndex((s) => s.id === shotId);
      if (idx < 0) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= shots.length) return;

      const newShots = [...shots];
      [newShots[idx], newShots[swapIdx]] = [newShots[swapIdx], newShots[idx]];
      // Update sort orders
      newShots.forEach((s, i) => {
        s.sortOrder = i;
      });
      setShots(newShots);

      // Persist both sort orders
      try {
        await Promise.all([
          fetch(
            `/api/production/shotlists/${shotList.id}/shots/${newShots[idx].id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sortOrder: idx }),
            }
          ),
          fetch(
            `/api/production/shotlists/${shotList.id}/shots/${newShots[swapIdx].id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sortOrder: swapIdx }),
            }
          ),
        ]);
      } catch {
        // Revert
        setShots(shots);
      }
    },
    [shotList.id, shots]
  );

  // ── Save description ──
  const saveDescription = useCallback(async () => {
    try {
      const res = await fetch(`/api/production/shotlists/${shotList.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: descriptionDraft }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setShotList((prev) => ({ ...prev, description: descriptionDraft || null }));
      setEditingDescription(false);
    } catch {
      // keep editing
    }
  }, [shotList.id, descriptionDraft]);

  // ── Delete shot list ──
  const handleDeleteShotList = useCallback(async () => {
    if (!confirm("Delete this entire shot list? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/production/shotlists/${shotList.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/production/shotlists");
      router.refresh();
    } catch {
      alert("Failed to delete shot list.");
    }
  }, [shotList.id, router]);

  // ── Print view ──
  if (showPrint) {
    return (
      <div>
        <div className="p-4 sm:p-6 print:hidden">
          <button
            onClick={() => setShowPrint(false)}
            className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors mb-4"
          >
            &larr; Back to Editor
          </button>
          <button
            onClick={() => window.print()}
            className="ml-4 bg-steel text-black px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)]"
          >
            Print
          </button>
        </div>
        <PrintableShotList shotList={shotList} shots={shots} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/production/shotlists"
              className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
            >
              &larr; Shot Lists
            </Link>
          </div>
          <h1 className="text-lg uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            {shotList.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted">
            {shotList.sceneNumber && (
              <span className="uppercase tracking-widest font-[family-name:var(--font-heading)]">
                Scene {shotList.sceneNumber}
              </span>
            )}
            <span className="text-card-border">|</span>
            <Link
              href={`/admin/production/shotlists?projectId=${shotList.projectId}`}
              className="text-steel hover:text-white transition-colors"
            >
              {shotList.project.title}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowPrint(true)}
            className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5 border border-card-border rounded hover:border-steel"
          >
            Print View
          </button>
          <button
            onClick={handleDeleteShotList}
            className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5 border border-red-400/30 rounded hover:border-red-400"
          >
            Delete List
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          {editingDescription ? (
            <div className="space-y-3">
              <textarea
                value={descriptionDraft}
                onChange={(e) => setDescriptionDraft(e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Shot list description..."
              />
              <div className="flex gap-2">
                <button
                  onClick={saveDescription}
                  className="bg-steel text-black px-4 py-2 text-[10px] uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)]"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingDescription(false);
                    setDescriptionDraft(shotList.description || "");
                  }}
                  className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingDescription(true)}
              className="cursor-pointer group"
            >
              <p className="text-sm text-muted group-hover:text-white transition-colors">
                {shotList.description || "Click to add description..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
              Shot Progress
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              {completedCount} of {totalCount} completed ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-card-border">
            <div
              className="h-full bg-steel transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Controls: View Toggle + Add Shot ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border border-card-border rounded overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors ${
              view === "list"
                ? "bg-steel text-black"
                : "text-muted hover:text-white"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors ${
              view === "grid"
                ? "bg-steel text-black"
                : "text-muted hover:text-white"
            }`}
          >
            Grid
          </button>
        </div>

        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingShotId(null);
          }}
          className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
        >
          + Add Shot
        </button>
      </div>

      {/* ── List View ── */}
      {view === "list" && (
        <div className="dashboard-card">
          <div className="dashboard-card-body p-0">
            {shots.length === 0 ? (
              <div className="p-8 text-center text-muted text-sm">
                No shots yet. Click &quot;Add Shot&quot; to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border text-left">
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal w-8">
                        #
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                        Shot
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                        Size
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal hidden md:table-cell">
                        Movement
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal hidden md:table-cell">
                        Angle
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal hidden lg:table-cell">
                        Lens
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal hidden lg:table-cell">
                        Equipment
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal">
                        Description
                      </th>
                      <th className="px-3 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] font-normal text-center w-10">
                        Done
                      </th>
                      <th className="px-3 py-3 w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {shots.map((shot, idx) => (
                      <tr
                        key={shot.id}
                        className={`border-b border-card-border/50 transition-colors ${
                          shot.completed
                            ? "opacity-50"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td className="px-3 py-3 text-muted text-xs">
                          {idx + 1}
                        </td>
                        <td
                          className={`px-3 py-3 text-white font-medium cursor-pointer hover:text-steel transition-colors ${
                            shot.completed ? "line-through" : ""
                          }`}
                          onClick={() => {
                            setEditingShotId(shot.id);
                            setShowAddForm(false);
                          }}
                        >
                          {shot.shotNumber}
                        </td>
                        <td className="px-3 py-3">
                          <SizeBadge size={shot.size} />
                        </td>
                        <td className="px-3 py-3 text-muted hidden md:table-cell">
                          {shot.movement || "\u2014"}
                        </td>
                        <td className="px-3 py-3 text-muted hidden md:table-cell">
                          {shot.angle || "\u2014"}
                        </td>
                        <td className="px-3 py-3 text-muted hidden lg:table-cell">
                          {shot.lens || "\u2014"}
                        </td>
                        <td className="px-3 py-3 text-muted hidden lg:table-cell">
                          {shot.equipment || "\u2014"}
                        </td>
                        <td
                          className={`px-3 py-3 text-muted text-xs max-w-[200px] truncate ${
                            shot.completed ? "line-through" : ""
                          }`}
                        >
                          {shot.description}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={shot.completed}
                            onChange={() => toggleCompleted(shot)}
                            className="w-4 h-4 accent-steel cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveShot(shot.id, "up")}
                              disabled={idx === 0}
                              className="text-muted hover:text-white disabled:opacity-20 transition-colors p-1"
                              title="Move up"
                            >
                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => moveShot(shot.id, "down")}
                              disabled={idx === shots.length - 1}
                              className="text-muted hover:text-white disabled:opacity-20 transition-colors p-1"
                              title="Move down"
                            >
                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteShot(shot.id)}
                              className="text-red-400/60 hover:text-red-400 transition-colors p-1"
                              title="Delete shot"
                            >
                              <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3.5 h-3.5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Grid / Storyboard View ── */}
      {view === "grid" && (
        <div>
          {shots.length === 0 ? (
            <div className="dashboard-card">
              <div className="dashboard-card-body p-8 text-center text-muted text-sm">
                No shots yet. Click &quot;Add Shot&quot; to get started.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shots.map((shot) => (
                <div
                  key={shot.id}
                  className={`bg-card border border-card-border rounded-lg overflow-hidden transition-all ${
                    shot.completed ? "opacity-50" : "hover:border-steel/50"
                  }`}
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-black/40 border-b border-card-border flex items-center justify-center">
                    {shot.imageUrl ? (
                      <img
                        src={shot.imageUrl}
                        alt={`Shot ${shot.shotNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted/40">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="w-10 h-10 mx-auto mb-1"
                        >
                          <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                          Storyboard
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">
                          {shot.shotNumber}
                        </span>
                        <SizeBadge size={shot.size} />
                      </div>
                      <input
                        type="checkbox"
                        checked={shot.completed}
                        onChange={() => toggleCompleted(shot)}
                        className="w-4 h-4 accent-steel cursor-pointer"
                      />
                    </div>

                    {(shot.movement || shot.angle) && (
                      <div className="flex items-center gap-2 text-xs text-muted">
                        {shot.movement && <span>{shot.movement}</span>}
                        {shot.movement && shot.angle && (
                          <span className="text-card-border">|</span>
                        )}
                        {shot.angle && <span>{shot.angle}</span>}
                      </div>
                    )}

                    <p
                      className={`text-xs text-muted leading-relaxed line-clamp-2 ${
                        shot.completed ? "line-through" : ""
                      }`}
                    >
                      {shot.description}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          setEditingShotId(shot.id);
                          setShowAddForm(false);
                        }}
                        className="text-steel hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteShot(shot.id)}
                        className="text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add Shot Form (modal overlay) ── */}
      {showAddForm && (
        <ShotFormModal
          shotListId={shotList.id}
          onClose={() => setShowAddForm(false)}
          onSaved={(newShot) => {
            setShots((prev) => [...prev, newShot]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* ── Edit Shot Form (modal overlay) ── */}
      {editingShotId && (
        <ShotFormModal
          shotListId={shotList.id}
          shot={shots.find((s) => s.id === editingShotId)}
          onClose={() => setEditingShotId(null)}
          onSaved={(updatedShot) => {
            setShots((prev) =>
              prev.map((s) => (s.id === updatedShot.id ? updatedShot : s))
            );
            setEditingShotId(null);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SHOT FORM MODAL (Create + Edit)
// ═══════════════════════════════════════════════════════

interface ShotFormModalProps {
  shotListId: string;
  shot?: ShotEntry;
  onClose: () => void;
  onSaved: (shot: ShotEntry) => void;
}

function ShotFormModal({ shotListId, shot, onClose, onSaved }: ShotFormModalProps) {
  const isEdit = !!shot;
  const [form, setForm] = useState(
    shot
      ? {
          shotNumber: shot.shotNumber,
          size: shot.size || "",
          movement: shot.movement || "",
          angle: shot.angle || "",
          lens: shot.lens || "",
          frameRate: shot.frameRate || "",
          equipment: shot.equipment || "",
          lighting: shot.lighting || "",
          description: shot.description,
          notes: shot.notes || "",
        }
      : emptyShot()
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const data = {
      shotNumber: form.shotNumber.trim(),
      size: form.size || null,
      movement: form.movement || null,
      angle: form.angle || null,
      lens: form.lens.trim() || null,
      frameRate: form.frameRate || null,
      equipment: form.equipment.trim() || null,
      lighting: form.lighting.trim() || null,
      description: form.description.trim(),
      notes: form.notes.trim() || null,
    };

    try {
      const url = isEdit
        ? `/api/production/shotlists/${shotListId}/shots/${shot!.id}`
        : `/api/production/shotlists/${shotListId}/shots`;

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save shot");
      }

      const saved = await res.json();
      onSaved({
        id: saved.id,
        shotNumber: saved.shotNumber,
        size: saved.size,
        movement: saved.movement,
        angle: saved.angle,
        lens: saved.lens,
        frameRate: saved.frameRate,
        equipment: saved.equipment,
        lighting: saved.lighting,
        description: saved.description,
        imageUrl: saved.imageUrl ?? null,
        notes: saved.notes,
        completed: saved.completed,
        sortOrder: saved.sortOrder,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111] border border-card-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              {isEdit ? "Edit Shot" : "Add Shot"}
            </h2>
            <button
              onClick={onClose}
              className="text-muted hover:text-white transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Shot Number + Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shotNumber" className={labelClasses}>
                  Shot Number <span className="text-steel">*</span>
                </label>
                <input
                  id="shotNumber"
                  type="text"
                  value={form.shotNumber}
                  onChange={(e) => updateField("shotNumber", e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 1A"
                  required
                />
              </div>
              <div>
                <label htmlFor="size" className={labelClasses}>
                  Size
                </label>
                <select
                  id="size"
                  value={form.size}
                  onChange={(e) => updateField("size", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select size...</option>
                  {SHOT_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Movement + Angle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="movement" className={labelClasses}>
                  Movement
                </label>
                <select
                  id="movement"
                  value={form.movement}
                  onChange={(e) => updateField("movement", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select movement...</option>
                  {SHOT_MOVEMENTS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="angle" className={labelClasses}>
                  Angle
                </label>
                <select
                  id="angle"
                  value={form.angle}
                  onChange={(e) => updateField("angle", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select angle...</option>
                  {SHOT_ANGLES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lens + Frame Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lens" className={labelClasses}>
                  Lens
                </label>
                <input
                  id="lens"
                  type="text"
                  value={form.lens}
                  onChange={(e) => updateField("lens", e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. 50mm"
                />
              </div>
              <div>
                <label htmlFor="frameRate" className={labelClasses}>
                  Frame Rate
                </label>
                <select
                  id="frameRate"
                  value={form.frameRate}
                  onChange={(e) => updateField("frameRate", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select frame rate...</option>
                  {SHOT_FRAME_RATES.map((fr) => (
                    <option key={fr} value={fr}>
                      {fr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Equipment + Lighting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="equipment" className={labelClasses}>
                  Equipment
                </label>
                <input
                  id="equipment"
                  type="text"
                  value={form.equipment}
                  onChange={(e) => updateField("equipment", e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Steadicam"
                />
              </div>
              <div>
                <label htmlFor="lighting" className={labelClasses}>
                  Lighting
                </label>
                <input
                  id="lighting"
                  type="text"
                  value={form.lighting}
                  onChange={(e) => updateField("lighting", e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Key + Fill"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClasses}>
                Description <span className="text-steel">*</span>
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Describe the shot..."
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClasses}>
                Notes
              </label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={2}
                className={inputClasses}
                placeholder="Additional notes..."
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
                {submitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Shot"
                  : "Add Shot"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
