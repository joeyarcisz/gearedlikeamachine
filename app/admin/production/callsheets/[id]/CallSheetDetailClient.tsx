"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CALL_SHEET_STATUSES } from "@/lib/production-types";
import type {
  CallSheetDetail,
  CallSheetStatus,
  CrewCallEntry,
} from "@/lib/production-types";
import PrintableCallSheet from "@/components/admin/production/PrintableCallSheet";

// ── Helpers ──

function formatDateLong(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(iso: string) {
  return iso.split("T")[0];
}

// ── Status Badge ──

function StatusBadge({
  status,
  onClick,
}: {
  status: CallSheetStatus;
  onClick?: () => void;
}) {
  const config = CALL_SHEET_STATUSES.find((s) => s.value === status);
  const color = config?.color ?? "#707070";
  const label = config?.label ?? status;

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] rounded-full transition-opacity hover:opacity-80"
      style={{ backgroundColor: `${color}20`, color }}
      title="Click to change status"
    >
      {label}
    </button>
  );
}

// ── Info Row ──

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
        {label}
      </span>
      <p className="text-chrome text-sm mt-0.5 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

// ── Crew Member Selector ──

interface CrewMemberOption {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
}

// ── Main Component ──

interface CallSheetDetailClientProps {
  callSheet: CallSheetDetail;
}

export default function CallSheetDetailClient({
  callSheet: initial,
}: CallSheetDetailClientProps) {
  const router = useRouter();
  const [callSheet, setCallSheet] = useState(initial);
  const [showPrint, setShowPrint] = useState(false);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    shootDate: formatDateShort(initial.shootDate),
    callTime: initial.callTime,
    wrapTime: initial.wrapTime ?? "",
    locationName: initial.locationName ?? "",
    locationAddress: initial.locationAddress ?? "",
    parkingNotes: initial.parkingNotes ?? "",
    nearestHospital: initial.nearestHospital ?? "",
    weatherSummary: initial.weatherSummary ?? "",
    weatherTemp: initial.weatherTemp ?? "",
    sunrise: initial.sunrise ?? "",
    sunset: initial.sunset ?? "",
    generalNotes: initial.generalNotes ?? "",
    specialInstructions: initial.specialInstructions ?? "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Add crew state
  const [showAddCrew, setShowAddCrew] = useState(false);
  const [crewOptions, setCrewOptions] = useState<CrewMemberOption[]>([]);
  const [crewSearch, setCrewSearch] = useState("");
  const [crewFilteredOptions, setCrewFilteredOptions] = useState<
    CrewMemberOption[]
  >([]);
  const [showCrewDropdown, setShowCrewDropdown] = useState(false);
  const [newCrewMemberId, setNewCrewMemberId] = useState<string | null>(null);
  const [newCrewName, setNewCrewName] = useState("");
  const [newCrewRole, setNewCrewRole] = useState("");
  const [newCrewCallTime, setNewCrewCallTime] = useState(callSheet.callTime);
  const [newCrewNotes, setNewCrewNotes] = useState("");
  const [addingCrew, setAddingCrew] = useState(false);
  const [crewError, setCrewError] = useState("");

  // Inline edit call times
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);
  const [editCrewCallTime, setEditCrewCallTime] = useState("");

  // Load crew options
  useEffect(() => {
    async function loadCrew() {
      try {
        const res = await fetch("/api/crm/crew");
        if (res.ok) {
          const data = await res.json();
          setCrewOptions(data);
        }
      } catch {
        // Crew options will just be empty
      }
    }
    loadCrew();
  }, []);

  // Filter crew search
  useEffect(() => {
    if (!crewSearch.trim()) {
      setCrewFilteredOptions(crewOptions);
    } else {
      const q = crewSearch.toLowerCase();
      setCrewFilteredOptions(
        crewOptions.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q)
        )
      );
    }
  }, [crewSearch, crewOptions]);

  // ── Status Change ──

  const cycleStatus = useCallback(async () => {
    const statusOrder: CallSheetStatus[] = ["draft", "sent", "confirmed"];
    const currentIdx = statusOrder.indexOf(callSheet.status);
    const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];

    try {
      const res = await fetch(`/api/production/callsheets/${callSheet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCallSheet((prev) => ({ ...prev, status: updated.status }));
      }
    } catch {
      // Silently fail
    }
  }, [callSheet.id, callSheet.status]);

  // ── Edit Call Sheet ──

  function openEdit() {
    setEditData({
      shootDate: formatDateShort(callSheet.shootDate),
      callTime: callSheet.callTime,
      wrapTime: callSheet.wrapTime ?? "",
      locationName: callSheet.locationName ?? "",
      locationAddress: callSheet.locationAddress ?? "",
      parkingNotes: callSheet.parkingNotes ?? "",
      nearestHospital: callSheet.nearestHospital ?? "",
      weatherSummary: callSheet.weatherSummary ?? "",
      weatherTemp: callSheet.weatherTemp ?? "",
      sunrise: callSheet.sunrise ?? "",
      sunset: callSheet.sunset ?? "",
      generalNotes: callSheet.generalNotes ?? "",
      specialInstructions: callSheet.specialInstructions ?? "",
    });
    setEditError("");
    setEditing(true);
  }

  async function handleEditSave(e: FormEvent) {
    e.preventDefault();
    setEditError("");
    setEditSaving(true);

    try {
      const res = await fetch(`/api/production/callsheets/${callSheet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shootDate: editData.shootDate,
          callTime: editData.callTime,
          wrapTime: editData.wrapTime || null,
          locationName: editData.locationName || null,
          locationAddress: editData.locationAddress || null,
          parkingNotes: editData.parkingNotes || null,
          nearestHospital: editData.nearestHospital || null,
          weatherSummary: editData.weatherSummary || null,
          weatherTemp: editData.weatherTemp || null,
          sunrise: editData.sunrise || null,
          sunset: editData.sunset || null,
          generalNotes: editData.generalNotes || null,
          specialInstructions: editData.specialInstructions || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update");
      }

      const updated = await res.json();
      setCallSheet((prev) => ({
        ...prev,
        shootDate: updated.shootDate,
        callTime: updated.callTime,
        wrapTime: updated.wrapTime,
        locationName: updated.locationName,
        locationAddress: updated.locationAddress,
        parkingNotes: updated.parkingNotes,
        nearestHospital: updated.nearestHospital,
        weatherSummary: updated.weatherSummary,
        weatherTemp: updated.weatherTemp,
        sunrise: updated.sunrise,
        sunset: updated.sunset,
        generalNotes: updated.generalNotes,
        specialInstructions: updated.specialInstructions,
      }));
      setEditing(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setEditSaving(false);
    }
  }

  // ── Add Crew ──

  function selectCrewMember(member: CrewMemberOption) {
    setNewCrewMemberId(member.id);
    setNewCrewName(member.name);
    setNewCrewRole(member.role);
    setCrewSearch(member.name);
    setShowCrewDropdown(false);
  }

  function clearCrewSelection() {
    setNewCrewMemberId(null);
    setNewCrewName("");
    setNewCrewRole("");
    setCrewSearch("");
  }

  async function handleAddCrew(e: FormEvent) {
    e.preventDefault();
    setCrewError("");
    setAddingCrew(true);

    try {
      const res = await fetch(
        `/api/production/callsheets/${callSheet.id}/crew`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crewMemberId: newCrewMemberId || null,
            name: newCrewName.trim(),
            role: newCrewRole.trim(),
            callTime: newCrewCallTime.trim(),
            notes: newCrewNotes.trim() || null,
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add crew");
      }

      const newCrew = await res.json();
      setCallSheet((prev) => ({
        ...prev,
        crewCalls: [...prev.crewCalls, newCrew].sort((a, b) =>
          a.callTime.localeCompare(b.callTime)
        ),
      }));

      // Reset form
      clearCrewSelection();
      setNewCrewCallTime(callSheet.callTime);
      setNewCrewNotes("");
      setShowAddCrew(false);
    } catch (err) {
      setCrewError(err instanceof Error ? err.message : "Failed to add crew");
    } finally {
      setAddingCrew(false);
    }
  }

  // ── Remove Crew ──

  async function handleRemoveCrew(crewCallId: string) {
    if (!confirm("Remove this crew member from the call sheet?")) return;

    try {
      const res = await fetch(
        `/api/production/callsheets/${callSheet.id}/crew/${crewCallId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCallSheet((prev) => ({
          ...prev,
          crewCalls: prev.crewCalls.filter((c) => c.id !== crewCallId),
        }));
      }
    } catch {
      // Silently fail
    }
  }

  // ── Inline Edit Crew Call Time ──

  function startEditCrewTime(crew: CrewCallEntry) {
    setEditingCrewId(crew.id);
    setEditCrewCallTime(crew.callTime);
  }

  async function saveCrewTime(crewCallId: string) {
    try {
      const res = await fetch(
        `/api/production/callsheets/${callSheet.id}/crew/${crewCallId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callTime: editCrewCallTime }),
        }
      );
      if (res.ok) {
        setCallSheet((prev) => ({
          ...prev,
          crewCalls: prev.crewCalls
            .map((c) =>
              c.id === crewCallId ? { ...c, callTime: editCrewCallTime } : c
            )
            .sort((a, b) => a.callTime.localeCompare(b.callTime)),
        }));
      }
    } catch {
      // Silently fail
    } finally {
      setEditingCrewId(null);
    }
  }

  // ── Delete Call Sheet ──

  async function handleDelete() {
    if (
      !confirm(
        "Delete this call sheet? This will also remove all crew calls. This cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/production/callsheets/${callSheet.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/production/callsheets");
        router.refresh();
      }
    } catch {
      // Silently fail
    }
  }

  // ── Print ──

  function handlePrint() {
    setShowPrint(true);
    setTimeout(() => {
      window.print();
      setShowPrint(false);
    }, 100);
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";

  // ── Print View ──

  if (showPrint) {
    return <PrintableCallSheet callSheet={callSheet} />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 print:hidden">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/production/callsheets`}
            className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
          >
            Call Sheets
          </Link>
          <span className="text-muted/50">/</span>
          <span className="text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {formatDateLong(callSheet.shootDate)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="text-[10px] uppercase tracking-widest text-muted hover:text-white font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5 border border-card-border rounded hover:border-steel"
          >
            Print / PDF
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 font-[family-name:var(--font-heading)] transition-colors px-3 py-1.5"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="dashboard-card">
        <div className="dashboard-card-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              {callSheet.project.title}
            </h2>
            <StatusBadge status={callSheet.status} onClick={cycleStatus} />
          </div>
          <button
            type="button"
            onClick={openEdit}
            className="text-[10px] uppercase tracking-widest text-steel hover:text-white font-[family-name:var(--font-heading)] transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="dashboard-card-body">
          {/* Date and Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Shoot Date
              </span>
              <p className="text-white text-lg font-[family-name:var(--font-heading)] mt-0.5">
                {formatDateLong(callSheet.shootDate)}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Call Time
              </span>
              <p className="text-white text-lg font-[family-name:var(--font-heading)] mt-0.5">
                {callSheet.callTime}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Wrap Time
              </span>
              <p className="text-white text-lg font-[family-name:var(--font-heading)] mt-0.5">
                {callSheet.wrapTime || "TBD"}
              </p>
            </div>
          </div>

          {/* Location and Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <InfoRow label="Location" value={callSheet.locationName} />
              <InfoRow label="Address" value={callSheet.locationAddress} />
              <InfoRow label="Parking" value={callSheet.parkingNotes} />
              <InfoRow
                label="Nearest Hospital"
                value={callSheet.nearestHospital}
              />
            </div>
            <div className="space-y-4">
              <InfoRow label="Weather" value={callSheet.weatherSummary} />
              <InfoRow label="Temperature" value={callSheet.weatherTemp} />
              <div className="flex gap-8">
                {callSheet.sunrise && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Sunrise
                    </span>
                    <p className="text-chrome text-sm mt-0.5">
                      {callSheet.sunrise}
                    </p>
                  </div>
                )}
                {callSheet.sunset && (
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                      Sunset
                    </span>
                    <p className="text-chrome text-sm mt-0.5">
                      {callSheet.sunset}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {(callSheet.generalNotes || callSheet.specialInstructions) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-card-border/50">
              <InfoRow label="General Notes" value={callSheet.generalNotes} />
              <InfoRow
                label="Special Instructions"
                value={callSheet.specialInstructions}
              />
            </div>
          )}
        </div>
      </div>

      {/* Crew Section */}
      <div className="dashboard-card">
        <div className="dashboard-card-header flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Crew ({callSheet.crewCalls.length})
          </h2>
          <button
            type="button"
            onClick={() => {
              setShowAddCrew(true);
              setCrewError("");
            }}
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors font-[family-name:var(--font-heading)]"
          >
            + Add Crew
          </button>
        </div>

        <div className="dashboard-card-body p-0">
          {callSheet.crewCalls.length === 0 && !showAddCrew ? (
            <div className="p-8 text-center">
              <p className="text-muted text-sm">
                No crew assigned yet.
              </p>
              <button
                type="button"
                onClick={() => setShowAddCrew(true)}
                className="mt-3 text-steel hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
              >
                Add the first crew member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Name
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Role
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Call Time
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Notes
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 w-12">
                      &nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {callSheet.crewCalls.map((crew) => (
                    <tr
                      key={crew.id}
                      className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-white text-sm">{crew.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-chrome text-sm">{crew.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        {editingCrewId === crew.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={editCrewCallTime}
                              onChange={(e) =>
                                setEditCrewCallTime(e.target.value)
                              }
                              className="bg-black/60 border border-steel text-white text-sm px-2 py-1 focus:outline-none w-28"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveCrewTime(crew.id);
                                if (e.key === "Escape")
                                  setEditingCrewId(null);
                              }}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => saveCrewTime(crew.id)}
                              className="text-steel hover:text-white text-xs transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditCrewTime(crew)}
                            className="text-muted hover:text-steel text-sm transition-colors"
                            title="Click to edit"
                          >
                            {crew.callTime}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-muted text-sm">
                          {crew.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveCrew(crew.id)}
                          className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                          title="Remove"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Crew Form */}
          {showAddCrew && (
            <div className="border-t border-card-border p-4">
              <form onSubmit={handleAddCrew} className="space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
                  Add Crew Member
                </h3>

                {/* Crew Member Search */}
                <div className="relative">
                  <label className={labelClasses}>
                    Search Crew Database
                  </label>
                  <input
                    type="text"
                    value={crewSearch}
                    onChange={(e) => {
                      setCrewSearch(e.target.value);
                      setShowCrewDropdown(true);
                      if (newCrewMemberId) {
                        clearCrewSelection();
                      }
                    }}
                    onFocus={() => setShowCrewDropdown(true)}
                    className={inputClasses}
                    placeholder="Search by name or role, or leave empty for manual entry..."
                  />
                  {showCrewDropdown && crewFilteredOptions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-card-border max-h-48 overflow-y-auto">
                      {crewFilteredOptions.slice(0, 10).map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => selectCrewMember(member)}
                          className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center justify-between"
                        >
                          <span className="text-white text-sm">
                            {member.name}
                          </span>
                          <span className="text-muted text-xs">
                            {member.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual Name + Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>
                      Name <span className="text-steel">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCrewName}
                      onChange={(e) => setNewCrewName(e.target.value)}
                      className={inputClasses}
                      required
                      placeholder="Crew member name"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      Role <span className="text-steel">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCrewRole}
                      onChange={(e) => setNewCrewRole(e.target.value)}
                      className={inputClasses}
                      required
                      placeholder="e.g. DP, Gaffer, AC"
                    />
                  </div>
                </div>

                {/* Call Time + Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>
                      Call Time <span className="text-steel">*</span>
                    </label>
                    <input
                      type="time"
                      value={newCrewCallTime}
                      onChange={(e) => setNewCrewCallTime(e.target.value)}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Notes</label>
                    <input
                      type="text"
                      value={newCrewNotes}
                      onChange={(e) => setNewCrewNotes(e.target.value)}
                      className={inputClasses}
                      placeholder="Optional notes"
                    />
                  </div>
                </div>

                {crewError && (
                  <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    {crewError}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={addingCrew}
                    className="bg-steel text-black px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
                  >
                    {addingCrew ? "Adding..." : "Add to Call Sheet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCrew(false);
                      clearCrewSelection();
                      setNewCrewCallTime(callSheet.callTime);
                      setNewCrewNotes("");
                    }}
                    className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-2.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setEditing(false)}
          />
          <div className="relative bg-[#111111] border border-card-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111111] border-b border-card-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
                Edit Call Sheet
              </h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-muted hover:text-white transition-colors"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSave} className="p-6 space-y-5">
              {/* Date + Times */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>
                    Shoot Date <span className="text-steel">*</span>
                  </label>
                  <input
                    type="date"
                    value={editData.shootDate}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        shootDate: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Call Time <span className="text-steel">*</span>
                  </label>
                  <input
                    type="time"
                    value={editData.callTime}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        callTime: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className={labelClasses}>Wrap Time</label>
                  <input
                    type="time"
                    value={editData.wrapTime}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        wrapTime: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Location Name</label>
                  <input
                    type="text"
                    value={editData.locationName}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        locationName: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Location Address</label>
                  <input
                    type="text"
                    value={editData.locationAddress}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        locationAddress: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Safety */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Parking Notes</label>
                  <input
                    type="text"
                    value={editData.parkingNotes}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        parkingNotes: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Nearest Hospital</label>
                  <input
                    type="text"
                    value={editData.nearestHospital}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        nearestHospital: e.target.value,
                      }))
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Weather */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Weather Summary</label>
                  <input
                    type="text"
                    value={editData.weatherSummary}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        weatherSummary: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    placeholder="e.g. Partly cloudy"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Temperature</label>
                  <input
                    type="text"
                    value={editData.weatherTemp}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        weatherTemp: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    placeholder="e.g. 78F / 25C"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Sunrise</label>
                  <input
                    type="text"
                    value={editData.sunrise}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        sunrise: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    placeholder="e.g. 6:42 AM"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Sunset</label>
                  <input
                    type="text"
                    value={editData.sunset}
                    onChange={(e) =>
                      setEditData((d) => ({
                        ...d,
                        sunset: e.target.value,
                      }))
                    }
                    className={inputClasses}
                    placeholder="e.g. 7:38 PM"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={labelClasses}>General Notes</label>
                <textarea
                  value={editData.generalNotes}
                  onChange={(e) =>
                    setEditData((d) => ({
                      ...d,
                      generalNotes: e.target.value,
                    }))
                  }
                  rows={3}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Special Instructions</label>
                <textarea
                  value={editData.specialInstructions}
                  onChange={(e) =>
                    setEditData((d) => ({
                      ...d,
                      specialInstructions: e.target.value,
                    }))
                  }
                  rows={3}
                  className={inputClasses}
                />
              </div>

              {editError && (
                <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
                  {editError}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editSaving}
                  className="bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
                >
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
