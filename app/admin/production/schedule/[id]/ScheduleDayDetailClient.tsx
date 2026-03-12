"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EquipmentSelector from "@/components/admin/production/EquipmentSelector";
import CrewSelector from "@/components/admin/production/CrewSelector";
import PrintableScheduleDay from "@/components/admin/production/PrintableScheduleDay";
import type { ScheduleCrewEntry, ScheduleEquipmentEntry } from "@/lib/production-types";
import type { InventoryItem } from "@/lib/inventory";

interface ScheduleDayData {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  wrapTime: string | null;
  locationName: string | null;
  locationAddress: string | null;
  notes: string | null;
  project: { id: string; title: string };
  crewAssignments: ScheduleCrewEntry[];
  equipmentAssignments: ScheduleEquipmentEntry[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  scheduleDay: ScheduleDayData;
  inventory: InventoryItem[];
  categories: readonly string[];
}

function formatDateLong(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const inputClasses =
  "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
const labelClasses =
  "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";

export default function ScheduleDayDetailClient({
  scheduleDay: initial,
  inventory,
  categories,
}: Props) {
  const router = useRouter();
  const [day, setDay] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [showCrewSelector, setShowCrewSelector] = useState(false);
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(false);
  const [showManualCrew, setShowManualCrew] = useState(false);
  const [showManualEquipment, setShowManualEquipment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [editDate, setEditDate] = useState(day.date.split("T")[0]);
  const [editStartTime, setEditStartTime] = useState(day.startTime);
  const [editWrapTime, setEditWrapTime] = useState(day.wrapTime ?? "");
  const [editLocationName, setEditLocationName] = useState(day.locationName ?? "");
  const [editLocationAddress, setEditLocationAddress] = useState(day.locationAddress ?? "");
  const [editNotes, setEditNotes] = useState(day.notes ?? "");

  // Manual crew form state
  const [manualCrewName, setManualCrewName] = useState("");
  const [manualCrewRole, setManualCrewRole] = useState("");
  const [manualCrewCallTime, setManualCrewCallTime] = useState("");
  const [manualCrewRate, setManualCrewRate] = useState("");
  const [manualCrewNotes, setManualCrewNotes] = useState("");

  // Manual equipment form state
  const [manualEqName, setManualEqName] = useState("");
  const [manualEqCategory, setManualEqCategory] = useState("");
  const [manualEqQuantity, setManualEqQuantity] = useState("1");
  const [manualEqNotes, setManualEqNotes] = useState("");

  // ── Refresh data ──
  async function refreshDay() {
    try {
      const res = await fetch(`/api/production/schedule/${day.id}`);
      if (res.ok) {
        const data = await res.json();
        setDay(data);
      }
    } catch {
      // silently fail
    }
  }

  // ── Edit day details ──
  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/production/schedule/${day.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editDate,
          startTime: editStartTime.trim(),
          wrapTime: editWrapTime.trim() || null,
          locationName: editLocationName.trim() || null,
          locationAddress: editLocationAddress.trim() || null,
          notes: editNotes.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update");
      }

      const updated = await res.json();
      setDay(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete day ──
  async function handleDelete() {
    if (!confirm("Delete this shoot day? This cannot be undone.")) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/production/schedule/${day.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/production/schedule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setSubmitting(false);
    }
  }

  // ── Add crew from selector ──
  async function handleCrewSelect(crew: {
    id: string;
    name: string;
    role: string;
    dayRate: number | null;
  }) {
    try {
      const res = await fetch(`/api/production/schedule/${day.id}/crew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crewMemberId: crew.id,
          name: crew.name,
          role: crew.role,
          rate: crew.dayRate,
          callTime: day.startTime,
        }),
      });
      if (res.ok) {
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Add manual crew ──
  async function handleManualCrewSubmit(e: FormEvent) {
    e.preventDefault();
    if (!manualCrewName.trim() || !manualCrewRole.trim()) return;

    try {
      const res = await fetch(`/api/production/schedule/${day.id}/crew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: manualCrewName.trim(),
          role: manualCrewRole.trim(),
          callTime: manualCrewCallTime.trim() || null,
          rate: manualCrewRate ? Number(manualCrewRate) : null,
          notes: manualCrewNotes.trim() || null,
        }),
      });
      if (res.ok) {
        setManualCrewName("");
        setManualCrewRole("");
        setManualCrewCallTime("");
        setManualCrewRate("");
        setManualCrewNotes("");
        setShowManualCrew(false);
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Remove crew ──
  async function removeCrew(assignmentId: string) {
    try {
      const res = await fetch(
        `/api/production/schedule/${day.id}/crew/${assignmentId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Add equipment from selector ──
  async function handleEquipmentSelect(item: {
    itemName: string;
    category: string;
    dailyRate: number;
  }) {
    try {
      const res = await fetch(`/api/production/schedule/${day.id}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: item.itemName,
          category: item.category,
          quantity: 1,
        }),
      });
      if (res.ok) {
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Add manual equipment ──
  async function handleManualEquipmentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!manualEqName.trim()) return;

    try {
      const res = await fetch(`/api/production/schedule/${day.id}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: manualEqName.trim(),
          category: manualEqCategory.trim() || null,
          quantity: manualEqQuantity ? Number(manualEqQuantity) : 1,
          notes: manualEqNotes.trim() || null,
        }),
      });
      if (res.ok) {
        setManualEqName("");
        setManualEqCategory("");
        setManualEqQuantity("1");
        setManualEqNotes("");
        setShowManualEquipment(false);
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Remove equipment ──
  async function removeEquipment(assignmentId: string) {
    try {
      const res = await fetch(
        `/api/production/schedule/${day.id}/equipment/${assignmentId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await refreshDay();
      }
    } catch {
      // silently fail
    }
  }

  // ── Print ──
  function handlePrint() {
    window.print();
  }

  // Total day rate
  const totalCrewRate = day.crewAssignments.reduce(
    (sum, c) => sum + (c.rate ?? 0),
    0
  );

  return (
    <>
      <div className="p-4 sm:p-6 space-y-6 print:hidden">
        {/* Back + Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/admin/production/schedule"
            className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
          >
            &larr; Schedule
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5 border border-card-border rounded"
            >
              Print
            </button>
            <button
              onClick={() => setEditing(!editing)}
              className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5 border border-card-border rounded text-muted hover:text-white"
            >
              {editing ? "Cancel Edit" : "Edit Details"}
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Header Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Shoot Day Details
            </h1>
          </div>

          <div className="dashboard-card-body">
            {editing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="editDate" className={labelClasses}>
                      Date
                    </label>
                    <input
                      id="editDate"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="editStartTime" className={labelClasses}>
                      Start Time
                    </label>
                    <input
                      id="editStartTime"
                      type="text"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="editWrapTime" className={labelClasses}>
                      Wrap Time
                    </label>
                    <input
                      id="editWrapTime"
                      type="text"
                      value={editWrapTime}
                      onChange={(e) => setEditWrapTime(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editLocationName" className={labelClasses}>
                      Location Name
                    </label>
                    <input
                      id="editLocationName"
                      type="text"
                      value={editLocationName}
                      onChange={(e) => setEditLocationName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="editLocationAddress" className={labelClasses}>
                      Location Address
                    </label>
                    <input
                      id="editLocationAddress"
                      type="text"
                      value={editLocationAddress}
                      onChange={(e) => setEditLocationAddress(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="editNotes" className={labelClasses}>
                    Notes
                  </label>
                  <textarea
                    id="editNotes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    className={inputClasses}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    {error}
                  </p>
                )}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-steel text-black px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-2.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="text-xl text-white font-[family-name:var(--font-heading)] uppercase tracking-wide">
                  {formatDateLong(day.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/production/schedule?projectId=${day.projectId}`}
                    className="text-steel hover:text-white text-sm transition-colors"
                  >
                    {day.project.title}
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] block mb-1">
                      Location
                    </span>
                    <span className="text-chrome">
                      {day.locationName || "TBD"}
                    </span>
                    {day.locationAddress && (
                      <span className="text-muted block text-xs mt-0.5">
                        {day.locationAddress}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] block mb-1">
                      Start Time
                    </span>
                    <span className="text-chrome">{day.startTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] block mb-1">
                      Wrap Time
                    </span>
                    <span className="text-chrome">{day.wrapTime || "TBD"}</span>
                  </div>
                </div>
                {day.notes && (
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] block mb-1">
                      Notes
                    </span>
                    <p className="text-chrome text-sm whitespace-pre-wrap">
                      {day.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Crew Assignments */}
        <div className="dashboard-card">
          <div className="dashboard-card-header justify-between">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Crew ({day.crewAssignments.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCrewSelector(true)}
                className="text-[10px] uppercase tracking-widest bg-steel text-black px-3 py-1 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
              >
                + From CRM
              </button>
              <button
                onClick={() => setShowManualCrew(!showManualCrew)}
                className="text-[10px] uppercase tracking-widest border border-card-border text-muted hover:text-white px-3 py-1 rounded transition-colors font-[family-name:var(--font-heading)]"
              >
                + Manual
              </button>
            </div>
          </div>

          <div className="dashboard-card-body p-0">
            {/* Manual crew form */}
            {showManualCrew && (
              <div className="p-4 border-b border-card-border bg-black/30">
                <form onSubmit={handleManualCrewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={manualCrewName}
                      onChange={(e) => setManualCrewName(e.target.value)}
                      className={inputClasses}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Role *"
                      value={manualCrewRole}
                      onChange={(e) => setManualCrewRole(e.target.value)}
                      className={inputClasses}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Call Time"
                      value={manualCrewCallTime}
                      onChange={(e) => setManualCrewCallTime(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Day Rate"
                      value={manualCrewRate}
                      onChange={(e) => setManualCrewRate(e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Notes"
                      value={manualCrewNotes}
                      onChange={(e) => setManualCrewNotes(e.target.value)}
                      className={`${inputClasses} sm:col-span-2`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-steel text-black px-4 py-2 text-[10px] uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)]"
                    >
                      Add Crew
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualCrew(false)}
                      className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Crew table */}
            {day.crewAssignments.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted text-sm">
                No crew assigned yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Role
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Call Time
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Day Rate
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Notes
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.crewAssignments.map((crew) => (
                      <tr
                        key={crew.id}
                        className="border-b border-card-border/50 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-white">{crew.name}</td>
                        <td className="px-4 py-3 text-chrome">{crew.role}</td>
                        <td className="px-4 py-3 text-chrome">
                          {crew.callTime || "-"}
                        </td>
                        <td className="px-4 py-3 text-chrome">
                          {crew.rate != null ? `$${crew.rate}` : "-"}
                        </td>
                        <td className="px-4 py-3 text-muted text-xs">
                          {crew.notes || ""}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => removeCrew(crew.id)}
                            className="text-red-400/60 hover:text-red-400 transition-colors text-xs"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-card-border">
                      <td
                        colSpan={3}
                        className="px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] text-right"
                      >
                        Total Day Rate
                      </td>
                      <td className="px-4 py-3 text-steel font-semibold">
                        ${totalCrewRate.toLocaleString()}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Assignments */}
        <div className="dashboard-card">
          <div className="dashboard-card-header justify-between">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Equipment ({day.equipmentAssignments.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEquipmentSelector(true)}
                className="text-[10px] uppercase tracking-widest bg-steel text-black px-3 py-1 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
              >
                + From Inventory
              </button>
              <button
                onClick={() => setShowManualEquipment(!showManualEquipment)}
                className="text-[10px] uppercase tracking-widest border border-card-border text-muted hover:text-white px-3 py-1 rounded transition-colors font-[family-name:var(--font-heading)]"
              >
                + Manual
              </button>
            </div>
          </div>

          <div className="dashboard-card-body p-0">
            {/* Manual equipment form */}
            {showManualEquipment && (
              <div className="p-4 border-b border-card-border bg-black/30">
                <form onSubmit={handleManualEquipmentSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Item Name *"
                      value={manualEqName}
                      onChange={(e) => setManualEqName(e.target.value)}
                      className={inputClasses}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={manualEqCategory}
                      onChange={(e) => setManualEqCategory(e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={manualEqQuantity}
                      onChange={(e) => setManualEqQuantity(e.target.value)}
                      className={inputClasses}
                      min={1}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Notes"
                    value={manualEqNotes}
                    onChange={(e) => setManualEqNotes(e.target.value)}
                    className={inputClasses}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-steel text-black px-4 py-2 text-[10px] uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors font-[family-name:var(--font-heading)]"
                    >
                      Add Equipment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualEquipment(false)}
                      className="text-muted hover:text-white text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Equipment table */}
            {day.equipmentAssignments.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted text-sm">
                No equipment assigned yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-card-border">
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Item Name
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Qty
                      </th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                        Notes
                      </th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.equipmentAssignments.map((eq) => (
                      <tr
                        key={eq.id}
                        className="border-b border-card-border/50 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-white">{eq.itemName}</td>
                        <td className="px-4 py-3 text-chrome">
                          {eq.category || "-"}
                        </td>
                        <td className="px-4 py-3 text-chrome">{eq.quantity}</td>
                        <td className="px-4 py-3 text-muted text-xs">
                          {eq.notes || ""}
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => removeEquipment(eq.id)}
                            className="text-red-400/60 hover:text-red-400 transition-colors text-xs"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crew Selector Modal */}
      {showCrewSelector && (
        <CrewSelector
          onSelect={handleCrewSelect}
          onClose={() => setShowCrewSelector(false)}
        />
      )}

      {/* Equipment Selector Modal */}
      {showEquipmentSelector && (
        <EquipmentSelector
          inventory={inventory}
          categories={categories}
          onSelect={handleEquipmentSelect}
          onClose={() => setShowEquipmentSelector(false)}
        />
      )}

      {/* Print View */}
      <PrintableScheduleDay
        date={day.date}
        projectTitle={day.project.title}
        locationName={day.locationName}
        locationAddress={day.locationAddress}
        startTime={day.startTime}
        wrapTime={day.wrapTime}
        notes={day.notes}
        crewAssignments={day.crewAssignments}
        equipmentAssignments={day.equipmentAssignments}
      />
    </>
  );
}
