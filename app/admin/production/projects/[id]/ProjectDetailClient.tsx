"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  CALL_SHEET_STATUSES,
} from "@/lib/production-types";
import type {
  ProjectDetail,
  ProjectStatus,
  CallSheetStatus,
  ProjectCrewMember,
  ProjectEquipmentItem,
} from "@/lib/production-types";
import type { InventoryItem } from "@/lib/inventory";
import EquipmentSelector from "@/components/admin/production/EquipmentSelector";

interface CrewMemberOption {
  id: string;
  name: string;
  role: string;
  dayRate: number | null;
  kitFee: number | null;
}

interface ProjectDetailClientProps {
  project: ProjectDetail;
  crewMembers: CrewMemberOption[];
  inventory: InventoryItem[];
  inventoryCategories: readonly string[];
}

type Tab = "overview" | "crew" | "equipment" | "callsheets" | "shotlists" | "schedule" | "documents";

function StatusBadge({ status, type }: { status: string; type: "project" | "callsheet" }) {
  const configs = type === "project" ? PROJECT_STATUSES : CALL_SHEET_STATUSES;
  const config = configs.find((s) => s.value === status);
  const color = config?.color ?? "#707070";
  const label = config?.label ?? status;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] rounded-full"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBudget(low: number | null, high: number | null) {
  if (!low && !high) return "—";
  if (low && high) return `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  if (low) return `$${low.toLocaleString()}+`;
  return `Up to $${high!.toLocaleString()}`;
}

export default function ProjectDetailClient({
  project: initialProject,
  crewMembers,
  inventory,
  inventoryCategories,
}: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Editable fields
  const [editStatus, setEditStatus] = useState(project.status);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editClientName, setEditClientName] = useState(project.clientName ?? "");
  const [editProjectType, setEditProjectType] = useState(project.projectType ?? "");
  const [editDescription, setEditDescription] = useState(project.description ?? "");
  const [editNotes, setEditNotes] = useState(project.notes ?? "");
  const [editStartDate, setEditStartDate] = useState(
    project.startDate ? project.startDate.split("T")[0] : ""
  );
  const [editEndDate, setEditEndDate] = useState(
    project.endDate ? project.endDate.split("T")[0] : ""
  );
  const [editBudgetLow, setEditBudgetLow] = useState(
    project.budgetLow?.toString() ?? ""
  );
  const [editBudgetHigh, setEditBudgetHigh] = useState(
    project.budgetHigh?.toString() ?? ""
  );

  const handleStatusChange = useCallback(
    async (newStatus: string) => {
      try {
        const res = await fetch(`/api/production/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update status");
        setProject((prev) => ({ ...prev, status: newStatus as ProjectStatus }));
        setEditStatus(newStatus as ProjectStatus);
      } catch {
        setError("Failed to update status");
      }
    },
    [project.id]
  );

  const handleSaveOverview = useCallback(async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/production/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: editTitle.trim(),
          clientName: editClientName.trim() || null,
          projectType: editProjectType || null,
          description: editDescription.trim() || null,
          notes: editNotes.trim() || null,
          startDate: editStartDate || null,
          endDate: editEndDate || null,
          budgetLow: editBudgetLow ? parseInt(editBudgetLow) : null,
          budgetHigh: editBudgetHigh ? parseInt(editBudgetHigh) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setProject((prev) => ({
        ...prev,
        title: updated.title,
        clientName: updated.clientName,
        projectType: updated.projectType,
        description: updated.description,
        notes: updated.notes,
        startDate: updated.startDate,
        endDate: updated.endDate,
        budgetLow: updated.budgetLow,
        budgetHigh: updated.budgetHigh,
      }));
      setEditing(false);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }, [
    project.id,
    editTitle,
    editClientName,
    editProjectType,
    editDescription,
    editNotes,
    editStartDate,
    editEndDate,
    editBudgetLow,
    editBudgetHigh,
  ]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this project and all associated data? This cannot be undone."))
      return;
    try {
      const res = await fetch(`/api/production/projects/${project.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/production/projects");
      router.refresh();
    } catch {
      setError("Failed to delete project");
    }
  }, [project.id, router]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "crew", label: `Crew (${project.projectCrew.length})` },
    { key: "equipment", label: `Equipment (${project.projectEquipment.length})` },
    { key: "callsheets", label: `Call Sheets (${project.callSheets.length})` },
    { key: "shotlists", label: `Shot Lists (${project.shotLists.length})` },
    { key: "schedule", label: `Schedule (${project.scheduleDays.length})` },
    { key: "documents", label: "Documents" },
  ];

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/production/projects"
              className="text-muted hover:text-steel text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
            >
              Projects
            </Link>
            <span className="text-muted text-xs">/</span>
          </div>
          <h1 className="text-sm sm:text-base uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            {project.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            {project.clientName && (
              <span className="text-chrome text-sm">{project.clientName}</span>
            )}
            {project.projectType && (
              <span className="text-muted text-xs">
                {PROJECT_TYPE_LABELS[project.projectType] || project.projectType}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={editStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-black/60 border border-card-border text-white text-xs uppercase tracking-widest px-3 py-2 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer font-[family-name:var(--font-heading)]"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <StatusBadge status={project.status} type="project" />
        </div>
      </div>

      {/* Project meta row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="dashboard-card">
          <div className="p-3 text-center">
            <p className="text-sm font-bold text-white">
              {formatDate(project.startDate)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
              Start
            </p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="p-3 text-center">
            <p className="text-sm font-bold text-white">
              {formatDate(project.endDate)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
              End
            </p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="p-3 text-center">
            <p className="text-sm font-bold text-white">
              {formatBudget(project.budgetLow, project.budgetHigh)}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
              Budget
            </p>
          </div>
        </div>
        <div className="dashboard-card">
          <div className="p-3 text-center">
            <p className="text-sm font-bold text-white">
              {project.contact ? project.contact.name : "—"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
              Contact
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-card-border pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-[10px] uppercase tracking-widest px-4 py-2.5 transition-colors font-[family-name:var(--font-heading)] border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-steel text-steel"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab
          project={project}
          editing={editing}
          saving={saving}
          onEdit={() => setEditing(true)}
          onCancel={() => {
            setEditing(false);
            setEditTitle(project.title);
            setEditClientName(project.clientName ?? "");
            setEditProjectType(project.projectType ?? "");
            setEditDescription(project.description ?? "");
            setEditNotes(project.notes ?? "");
            setEditStartDate(project.startDate ? project.startDate.split("T")[0] : "");
            setEditEndDate(project.endDate ? project.endDate.split("T")[0] : "");
            setEditBudgetLow(project.budgetLow?.toString() ?? "");
            setEditBudgetHigh(project.budgetHigh?.toString() ?? "");
          }}
          onSave={handleSaveOverview}
          onDelete={handleDelete}
          editFields={{
            title: editTitle,
            setTitle: setEditTitle,
            clientName: editClientName,
            setClientName: setEditClientName,
            projectType: editProjectType,
            setProjectType: setEditProjectType,
            description: editDescription,
            setDescription: setEditDescription,
            notes: editNotes,
            setNotes: setEditNotes,
            startDate: editStartDate,
            setStartDate: setEditStartDate,
            endDate: editEndDate,
            setEndDate: setEditEndDate,
            budgetLow: editBudgetLow,
            setBudgetLow: setEditBudgetLow,
            budgetHigh: editBudgetHigh,
            setBudgetHigh: setEditBudgetHigh,
          }}
          inputClasses={inputClasses}
          labelClasses={labelClasses}
          selectClasses={selectClasses}
        />
      )}

      {activeTab === "crew" && (
        <CrewTab
          projectId={project.id}
          crew={project.projectCrew}
          crewMembers={crewMembers}
          onUpdate={() => router.refresh()}
        />
      )}

      {activeTab === "equipment" && (
        <EquipmentTab
          projectId={project.id}
          equipment={project.projectEquipment}
          inventory={inventory}
          inventoryCategories={inventoryCategories}
          onUpdate={() => router.refresh()}
        />
      )}

      {activeTab === "callsheets" && (
        <CallSheetsTab projectId={project.id} callSheets={project.callSheets} />
      )}

      {activeTab === "shotlists" && (
        <ShotListsTab projectId={project.id} shotLists={project.shotLists} />
      )}

      {activeTab === "schedule" && (
        <ScheduleTab projectId={project.id} scheduleDays={project.scheduleDays} />
      )}

      {activeTab === "documents" && (
        <ProjectDocumentsTab projectId={project.id} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════════ */

interface OverviewEditFields {
  title: string;
  setTitle: (v: string) => void;
  clientName: string;
  setClientName: (v: string) => void;
  projectType: string;
  setProjectType: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  budgetLow: string;
  setBudgetLow: (v: string) => void;
  budgetHigh: string;
  setBudgetHigh: (v: string) => void;
}

function OverviewTab({
  project,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  editFields,
  inputClasses,
  labelClasses,
  selectClasses,
}: {
  project: ProjectDetail;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
  editFields: OverviewEditFields;
  inputClasses: string;
  labelClasses: string;
  selectClasses: string;
}) {
  if (editing) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Edit Project
          </h2>
        </div>
        <div className="dashboard-card-body">
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Title</label>
                <input
                  type="text"
                  value={editFields.title}
                  onChange={(e) => editFields.setTitle(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Client</label>
                <input
                  type="text"
                  value={editFields.clientName}
                  onChange={(e) => editFields.setClientName(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Type</label>
                <select
                  value={editFields.projectType}
                  onChange={(e) => editFields.setProjectType(e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Start Date</label>
                <input
                  type="date"
                  value={editFields.startDate}
                  onChange={(e) => editFields.setStartDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>End Date</label>
                <input
                  type="date"
                  value={editFields.endDate}
                  onChange={(e) => editFields.setEndDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Budget Low ($)</label>
                <input
                  type="number"
                  value={editFields.budgetLow}
                  onChange={(e) => editFields.setBudgetLow(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Budget High ($)</label>
                <input
                  type="number"
                  value={editFields.budgetHigh}
                  onChange={(e) => editFields.setBudgetHigh(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                value={editFields.description}
                onChange={(e) => editFields.setDescription(e.target.value)}
                rows={3}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Notes</label>
              <textarea
                value={editFields.notes}
                onChange={(e) => editFields.setNotes(e.target.value)}
                rows={3}
                className={inputClasses}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onSave}
                disabled={saving}
                className="bg-steel text-black px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={onCancel}
                className="text-muted hover:text-white text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors px-4 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Overview
          </h2>
          <button
            onClick={onEdit}
            className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
          >
            Edit
          </button>
        </div>
        <div className="dashboard-card-body space-y-4">
          {project.description && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-[family-name:var(--font-heading)]">
                Description
              </p>
              <p className="text-chrome text-sm whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
          {project.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted mb-1 font-[family-name:var(--font-heading)]">
                Notes
              </p>
              <p className="text-chrome text-sm whitespace-pre-wrap">{project.notes}</p>
            </div>
          )}
          {!project.description && !project.notes && (
            <p className="text-muted text-sm">
              No description or notes yet.{" "}
              <button onClick={onEdit} className="text-steel hover:text-white transition-colors">
                Add details
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Delete */}
      <div className="dashboard-card">
        <div className="dashboard-card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted font-[family-name:var(--font-heading)]">
                Danger Zone
              </p>
              <p className="text-muted text-xs mt-1">
                Permanently delete this project and all associated data.
              </p>
            </div>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors shrink-0"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CREW TAB
   ═══════════════════════════════════════════════════════ */

function CrewTab({
  projectId,
  crew,
  crewMembers,
  onUpdate,
}: {
  projectId: string;
  crew: ProjectCrewMember[];
  crewMembers: CrewMemberOption[];
  onUpdate: () => void;
}) {
  const [localCrew, setLocalCrew] = useState(crew);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCrewMember, setSelectedCrewMember] = useState("");
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addDayRate, setAddDayRate] = useState("");
  const [addKitFee, setAddKitFee] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCrewMemberSelect = (cmId: string) => {
    setSelectedCrewMember(cmId);
    const cm = crewMembers.find((c) => c.id === cmId);
    if (cm) {
      setAddName(cm.name);
      setAddRole(cm.role);
      setAddDayRate(cm.dayRate?.toString() ?? "");
      setAddKitFee(cm.kitFee?.toString() ?? "");
    }
  };

  const handleAddCrew = async () => {
    if (!addName.trim() || !addRole.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/production/projects/${projectId}/crew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          crewMemberId: selectedCrewMember || null,
          name: addName.trim(),
          role: addRole.trim(),
          dayRate: addDayRate ? parseInt(addDayRate) : null,
          kitFee: addKitFee ? parseInt(addKitFee) : null,
          notes: addNotes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to add crew");
      const newCrew = await res.json();
      setLocalCrew((prev) => [...prev, newCrew]);
      setShowAdd(false);
      setSelectedCrewMember("");
      setAddName("");
      setAddRole("");
      setAddDayRate("");
      setAddKitFee("");
      setAddNotes("");
      onUpdate();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveCrew = async (crewId: string) => {
    if (!confirm("Remove this crew member from the project?")) return;
    try {
      const res = await fetch(
        `/api/production/projects/${projectId}/crew/${crewId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed");
      setLocalCrew((prev) => prev.filter((c) => c.id !== crewId));
      onUpdate();
    } catch {
      // silently fail
    }
  };

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";
  const selectClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors appearance-none cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Project Crew
          </h2>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
          >
            {showAdd ? "Cancel" : "+ Add Crew"}
          </button>
        </div>
        <div className="dashboard-card-body">
          {showAdd && (
            <div className="border border-card-border p-4 mb-4 space-y-4">
              <div>
                <label className={labelClasses}>Select from Crew Database</label>
                <select
                  value={selectedCrewMember}
                  onChange={(e) => handleCrewMemberSelect(e.target.value)}
                  className={selectClasses}
                >
                  <option value="">— Manual Entry —</option>
                  {crewMembers.map((cm) => (
                    <option key={cm.id} value={cm.id}>
                      {cm.name} ({cm.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    Name <span className="text-steel">*</span>
                  </label>
                  <input
                    type="text"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className={inputClasses}
                    placeholder="Crew member name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Role <span className="text-steel">*</span>
                  </label>
                  <input
                    type="text"
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. Gaffer, AC, PA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Day Rate ($)</label>
                  <input
                    type="number"
                    value={addDayRate}
                    onChange={(e) => setAddDayRate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Kit Fee ($)</label>
                  <input
                    type="number"
                    value={addKitFee}
                    onChange={(e) => setAddKitFee(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Notes</label>
                  <input
                    type="text"
                    value={addNotes}
                    onChange={(e) => setAddNotes(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <button
                onClick={handleAddCrew}
                disabled={submitting || !addName.trim() || !addRole.trim()}
                className="bg-steel text-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
              >
                {submitting ? "Adding..." : "Add Crew Member"}
              </button>
            </div>
          )}

          {localCrew.length === 0 ? (
            <p className="text-muted text-sm">No crew assigned yet.</p>
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
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Day Rate
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Kit Fee
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden md:table-cell">
                      Notes
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {localCrew.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-white text-sm">{c.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-chrome text-sm">{c.role}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-muted text-sm">
                          {c.dayRate ? `$${c.dayRate.toLocaleString()}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-muted text-sm">
                          {c.kitFee ? `$${c.kitFee.toLocaleString()}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted text-xs truncate max-w-xs block">
                          {c.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveCrew(c.id)}
                          className="text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                        >
                          Remove
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
  );
}

/* ═══════════════════════════════════════════════════════
   EQUIPMENT TAB
   ═══════════════════════════════════════════════════════ */

function EquipmentTab({
  projectId,
  equipment,
  inventory,
  inventoryCategories,
  onUpdate,
}: {
  projectId: string;
  equipment: ProjectEquipmentItem[];
  inventory: InventoryItem[];
  inventoryCategories: readonly string[];
  onUpdate: () => void;
}) {
  const [localEquipment, setLocalEquipment] = useState(equipment);
  const [showAdd, setShowAdd] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [addItemName, setAddItemName] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addDailyRate, setAddDailyRate] = useState("");
  const [addQuantity, setAddQuantity] = useState("1");
  const [addNotes, setAddNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!addItemName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/production/projects/${projectId}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          itemName: addItemName.trim(),
          category: addCategory.trim() || null,
          dailyRate: addDailyRate ? parseInt(addDailyRate) : null,
          quantity: addQuantity ? parseInt(addQuantity) : 1,
          notes: addNotes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const newItem = await res.json();
      setLocalEquipment((prev) => [...prev, newItem]);
      setShowAdd(false);
      setAddItemName("");
      setAddCategory("");
      setAddDailyRate("");
      setAddQuantity("1");
      setAddNotes("");
      onUpdate();
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (equipmentId: string) => {
    if (!confirm("Remove this equipment from the project?")) return;
    try {
      const res = await fetch(
        `/api/production/projects/${projectId}/equipment/${equipmentId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed");
      setLocalEquipment((prev) => prev.filter((e) => e.id !== equipmentId));
      onUpdate();
    } catch {
      // silently fail
    }
  };

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";

  return (
    <div className="space-y-4">
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Project Equipment
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setShowSelector(true)}
              className="text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
            >
              Browse Inventory
            </button>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
            >
              {showAdd ? "Cancel" : "+ Custom Item"}
            </button>
          </div>
        </div>
        <div className="dashboard-card-body">
          {showAdd && (
            <div className="border border-card-border p-4 mb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    Item Name <span className="text-steel">*</span>
                  </label>
                  <input
                    type="text"
                    value={addItemName}
                    onChange={(e) => setAddItemName(e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. RED V-Raptor"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Category</label>
                  <input
                    type="text"
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className={inputClasses}
                    placeholder="e.g. Camera, Lighting, Grip"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>Daily Rate ($)</label>
                  <input
                    type="number"
                    value={addDailyRate}
                    onChange={(e) => setAddDailyRate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Quantity</label>
                  <input
                    type="number"
                    value={addQuantity}
                    onChange={(e) => setAddQuantity(e.target.value)}
                    className={inputClasses}
                    min="1"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Notes</label>
                  <input
                    type="text"
                    value={addNotes}
                    onChange={(e) => setAddNotes(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <button
                onClick={handleAdd}
                disabled={submitting || !addItemName.trim()}
                className="bg-steel text-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
              >
                {submitting ? "Adding..." : "Add Equipment"}
              </button>
            </div>
          )}

          {localEquipment.length === 0 ? (
            <p className="text-muted text-sm">No equipment assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Item
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden sm:table-cell">
                      Daily Rate
                    </th>
                    <th className="text-center text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3">
                      Qty
                    </th>
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted font-[family-name:var(--font-heading)] px-4 py-3 hidden md:table-cell">
                      Notes
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {localEquipment.map((eq) => (
                    <tr
                      key={eq.id}
                      className="border-b border-card-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-white text-sm">{eq.itemName}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-chrome text-sm">
                          {eq.category || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-muted text-sm">
                          {eq.dailyRate ? `$${eq.dailyRate.toLocaleString()}` : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-muted text-sm">{eq.quantity}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-muted text-xs truncate max-w-xs block">
                          {eq.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemove(eq.id)}
                          className="text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] transition-colors"
                        >
                          Remove
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

      {showSelector && (
        <EquipmentSelector
          inventory={inventory}
          categories={inventoryCategories}
          onSelect={async (item) => {
            setSubmitting(true);
            try {
              const res = await fetch(`/api/production/projects/${projectId}/equipment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  itemName: item.itemName,
                  category: item.category,
                  dailyRate: item.dailyRate,
                  quantity: 1,
                  notes: null,
                }),
              });
              if (res.ok) {
                const newItem = await res.json();
                setLocalEquipment((prev) => [...prev, newItem]);
                onUpdate();
              }
            } catch {
              // silently fail
            } finally {
              setSubmitting(false);
            }
          }}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CALL SHEETS TAB
   ═══════════════════════════════════════════════════════ */

function CallSheetsTab({
  projectId,
  callSheets,
}: {
  projectId: string;
  callSheets: ProjectDetail["callSheets"];
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Call Sheets
        </h2>
        <Link
          href={`/admin/production/callsheets/new?projectId=${projectId}`}
          className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Call Sheet
        </Link>
      </div>
      <div className="dashboard-card-body">
        {callSheets.length === 0 ? (
          <p className="text-muted text-sm">
            No call sheets yet.{" "}
            <Link
              href={`/admin/production/callsheets/new?projectId=${projectId}`}
              className="text-steel hover:text-white transition-colors"
            >
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {callSheets.map((cs) => (
              <Link
                key={cs.id}
                href={`/admin/production/callsheets/${cs.id}`}
                className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
              >
                <div>
                  <span className="text-white text-sm">
                    {formatDate(cs.shootDate)}
                  </span>
                  {cs.locationName && (
                    <span className="text-muted text-xs ml-3">{cs.locationName}</span>
                  )}
                  <p className="text-muted text-[10px] mt-0.5">
                    Call: {cs.callTime}
                    {cs.wrapTime && ` | Wrap: ${cs.wrapTime}`}
                    {" | "}
                    {cs._count?.crewCalls ?? 0} crew
                  </p>
                </div>
                <StatusBadge status={cs.status} type="callsheet" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHOT LISTS TAB
   ═══════════════════════════════════════════════════════ */

function ShotListsTab({
  projectId,
  shotLists,
}: {
  projectId: string;
  shotLists: ProjectDetail["shotLists"];
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Shot Lists
        </h2>
        <Link
          href={`/admin/production/shotlists/new?projectId=${projectId}`}
          className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Shot List
        </Link>
      </div>
      <div className="dashboard-card-body">
        {shotLists.length === 0 ? (
          <p className="text-muted text-sm">
            No shot lists yet.{" "}
            <Link
              href={`/admin/production/shotlists/new?projectId=${projectId}`}
              className="text-steel hover:text-white transition-colors"
            >
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {shotLists.map((sl) => (
              <Link
                key={sl.id}
                href={`/admin/production/shotlists/${sl.id}`}
                className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
              >
                <div>
                  <span className="text-white text-sm">{sl.title}</span>
                  {sl.sceneNumber && (
                    <span className="text-muted text-xs ml-3">
                      Scene {sl.sceneNumber}
                    </span>
                  )}
                </div>
                <span className="text-muted text-[10px] uppercase tracking-widest shrink-0 ml-3">
                  {sl._count?.shots ?? 0} shots
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCHEDULE TAB
   ═══════════════════════════════════════════════════════ */

function ScheduleTab({
  projectId,
  scheduleDays,
}: {
  projectId: string;
  scheduleDays: ProjectDetail["scheduleDays"];
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Schedule
        </h2>
        <Link
          href={`/admin/production/schedule/new?projectId=${projectId}`}
          className="ml-auto text-[10px] uppercase tracking-widest text-steel hover:text-white transition-colors font-[family-name:var(--font-heading)]"
        >
          + New Shoot Day
        </Link>
      </div>
      <div className="dashboard-card-body">
        {scheduleDays.length === 0 ? (
          <p className="text-muted text-sm">
            No shoot days scheduled yet.{" "}
            <Link
              href={`/admin/production/schedule/new?projectId=${projectId}`}
              className="text-steel hover:text-white transition-colors"
            >
              Add one
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {scheduleDays.map((day) => (
              <Link
                key={day.id}
                href={`/admin/production/schedule/${day.id}`}
                className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
              >
                <div>
                  <span className="text-white text-sm">{formatDate(day.date)}</span>
                  {day.locationName && (
                    <span className="text-muted text-xs ml-3">{day.locationName}</span>
                  )}
                  <p className="text-muted text-[10px] mt-0.5">
                    {day.startTime}
                    {day.wrapTime && ` – ${day.wrapTime}`}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-muted text-[10px] uppercase tracking-widest">
                    {day._count?.crewAssignments ?? 0} crew
                    {" | "}
                    {day._count?.equipmentAssignments ?? 0} gear
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROJECT DOCUMENTS TAB
   ═══════════════════════════════════════════════════════ */

function ProjectDocumentsTab({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<Array<{
    id: string;
    token: string;
    status: string;
    recipientName: string | null;
    createdAt: string;
    completedAt: string | null;
    template: { name: string; isExternal: boolean };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useCallback(() => {}, []);

  useState(() => {
    fetch(`/api/documents?projectId=${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        setDocuments(data.documents || []);
        setLoading(false);
      });
  });

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/d/${token}`);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Documents
        </h2>
        <Link
          href={`/admin/documents/new`}
          className="text-xs text-muted hover:text-steel transition-colors"
        >
          + New Document
        </Link>
      </div>
      <div className="dashboard-card-body">
        {loading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : documents.length === 0 ? (
          <p className="text-muted text-sm">No documents linked to this project yet.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border border-card-border/50">
                <div>
                  <Link href={`/admin/documents/${doc.id}`} className="text-sm text-white hover:text-steel">
                    {doc.template.name}
                  </Link>
                  {doc.recipientName && (
                    <span className="text-muted text-xs ml-2">{doc.recipientName}</span>
                  )}
                  <p className="text-muted text-[10px] mt-0.5">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    doc.status === "COMPLETED" ? "bg-green-900/50 text-green-300" :
                    doc.status === "SENT" ? "bg-blue-900/50 text-blue-300" :
                    doc.status === "VIEWED" ? "bg-yellow-900/50 text-yellow-300" :
                    "bg-zinc-700 text-zinc-300"
                  }`}>
                    {doc.status}
                  </span>
                  {doc.template.isExternal && ["SENT", "VIEWED"].includes(doc.status) && (
                    <button onClick={() => copyLink(doc.token)} className="text-[10px] text-muted hover:text-steel">
                      {copied === doc.token ? "Copied!" : "Copy Link"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
