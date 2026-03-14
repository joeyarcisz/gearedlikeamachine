"use client";

import { useState, useEffect } from "react";

type CatalogItem = {
  id: string;
  name: string;
  department: string;
  category: string;
  rateType: string;
  baseRate: number;
  markupPercent: number;
  billRate: number;
  isOwnerLabor: boolean;
  sortOrder: number;
  active: boolean;
};

type NewItem = {
  name: string;
  department: string;
  category: string;
  rateType: string;
  baseRate: string;
  markupPercent: string;
  isOwnerLabor: boolean;
};

const CATEGORY_ORDER = ["PRE_PRO", "CREW", "GEAR", "POST", "TRAVEL"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  PRE_PRO: "Pre-Production",
  CREW: "Production Crew",
  GEAR: "Equipment",
  POST: "Post-Production",
  TRAVEL: "Travel",
};

const RATE_TYPE_LABELS: Record<string, string> = {
  DAY: "/day",
  HOUR: "/hr",
  FLAT: "flat",
  PER_MILE: "/mi",
};

function computePreviewBillRate(
  baseRate: number,
  markupPercent: number,
  isOwnerLabor: boolean,
  rateType: string
): number {
  if (isOwnerLabor) return baseRate;
  const marked = baseRate * (1 + markupPercent / 100);
  if (rateType === "PER_MILE") return Math.ceil(marked);
  return Math.ceil(marked / 50) * 50;
}

function formatRate(rate: number, rateType: string) {
  if (rateType === "PER_MILE") return `$${(rate / 100).toFixed(2)}/mi`;
  const suffix = RATE_TYPE_LABELS[rateType] || "";
  return `$${rate.toLocaleString()}${suffix}`;
}

export default function CatalogManager() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: "baseRate" | "markupPercent";
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newItem, setNewItem] = useState<NewItem | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  function fetchCatalog() {
    fetch("/api/estimates/catalog")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  // Group items by department within each category
  function getGroupedItems() {
    const grouped: Record<string, Record<string, CatalogItem[]>> = {};
    for (const cat of CATEGORY_ORDER) {
      grouped[cat] = {};
    }
    for (const item of items) {
      if (!grouped[item.category]) grouped[item.category] = {};
      if (!grouped[item.category][item.department]) {
        grouped[item.category][item.department] = [];
      }
      grouped[item.category][item.department].push(item);
    }
    return grouped;
  }

  function startEdit(id: string, field: "baseRate" | "markupPercent", currentValue: number) {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  }

  async function saveEdit(id: string) {
    if (!editingCell) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const numValue = Number(editValue);
    if (isNaN(numValue) || numValue < 0) {
      setEditingCell(null);
      return;
    }

    const updates: Record<string, number> = {};
    updates[editingCell.field] = numValue;

    setSaving(id);
    try {
      const res = await fetch(`/api/estimates/catalog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      }
    } catch {
      // silent
    }
    setSaving(null);
    setEditingCell(null);
  }

  function handleEditKeyDown(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter") {
      saveEdit(id);
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  }

  async function toggleActive(item: CatalogItem) {
    setSaving(item.id);
    try {
      if (item.active) {
        // Soft-delete via DELETE
        const res = await fetch(`/api/estimates/catalog/${item.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: false } : i)));
        }
      } else {
        // Re-activate via PUT
        const res = await fetch(`/api/estimates/catalog/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: true }),
        });
        if (res.ok) {
          const updated = await res.json();
          setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
        }
      }
    } catch {
      // silent
    }
    setSaving(null);
  }

  function startNewItem(category: string) {
    setNewItem({
      name: "",
      department: "",
      category,
      rateType: "DAY",
      baseRate: "",
      markupPercent: "0",
      isOwnerLabor: false,
    });
  }

  async function saveNewItem() {
    if (!newItem || !newItem.name.trim() || !newItem.department.trim() || !newItem.baseRate) return;
    setSaving("new");
    try {
      const res = await fetch("/api/estimates/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem.name.trim(),
          department: newItem.department.trim(),
          category: newItem.category,
          rateType: newItem.rateType,
          baseRate: Number(newItem.baseRate),
          markupPercent: Number(newItem.markupPercent),
          isOwnerLabor: newItem.isOwnerLabor,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        setNewItem(null);
      }
    } catch {
      // silent
    }
    setSaving(null);
  }

  const grouped = getGroupedItems();
  const previewBillRate =
    newItem && newItem.baseRate
      ? computePreviewBillRate(
          Number(newItem.baseRate),
          Number(newItem.markupPercent) || 0,
          newItem.isOwnerLabor,
          newItem.rateType
        )
      : null;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Rate Catalog
          </h1>
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {items.filter((i) => i.active).length} active items
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-muted text-sm py-12 text-center">Loading catalog...</div>
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((category) => {
            const departments = grouped[category];
            if (!departments || Object.keys(departments).length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[10px] uppercase tracking-widest text-chrome font-[family-name:var(--font-heading)]">
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <button
                    onClick={() => startNewItem(category)}
                    className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-card-border text-[10px] uppercase tracking-widest text-muted">
                        <th className="py-2 px-3 font-normal">Name</th>
                        <th className="py-2 px-3 font-normal text-right">Base Rate</th>
                        <th className="py-2 px-3 font-normal text-right">Markup %</th>
                        <th className="py-2 px-3 font-normal text-right">Bill Rate</th>
                        <th className="py-2 px-3 font-normal">Type</th>
                        <th className="py-2 px-3 font-normal text-center">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* New item row */}
                      {newItem && newItem.category === category && (
                        <tr className="border-b border-card-border bg-white/5">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              placeholder="Item name"
                              className="bg-transparent border border-card-border rounded px-2 py-1 text-xs text-white w-full focus:outline-none focus:border-steel/50"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={newItem.department}
                              onChange={(e) => setNewItem({ ...newItem, department: e.target.value })}
                              placeholder="Department"
                              className="bg-transparent border border-card-border rounded px-2 py-1 text-xs text-muted w-full mt-1 focus:outline-none focus:border-steel/50"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={newItem.baseRate}
                              onChange={(e) => setNewItem({ ...newItem, baseRate: e.target.value })}
                              placeholder="0"
                              className="bg-transparent border border-card-border rounded px-2 py-1 text-xs text-white w-20 text-right focus:outline-none focus:border-steel/50"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={newItem.markupPercent}
                              onChange={(e) => setNewItem({ ...newItem, markupPercent: e.target.value })}
                              className="bg-transparent border border-card-border rounded px-2 py-1 text-xs text-white w-16 text-right focus:outline-none focus:border-steel/50"
                            />
                          </td>
                          <td className="py-2 px-3 text-right text-xs text-chrome font-mono">
                            {previewBillRate !== null
                              ? formatRate(previewBillRate, newItem.rateType)
                              : "-"}
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={newItem.rateType}
                              onChange={(e) => setNewItem({ ...newItem, rateType: e.target.value })}
                              className="bg-card border border-card-border rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-steel/50"
                            >
                              <option value="DAY">Day</option>
                              <option value="HOUR">Hour</option>
                              <option value="FLAT">Flat</option>
                              <option value="PER_MILE">Per Mile</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={saveNewItem}
                                disabled={saving === "new"}
                                className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-2 py-0.5 rounded hover:bg-white transition-colors disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setNewItem(null)}
                                className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}

                      {Object.entries(departments)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([department, deptItems]) => (
                          <DepartmentSection
                            key={department}
                            department={department}
                            items={deptItems}
                            editingCell={editingCell}
                            editValue={editValue}
                            saving={saving}
                            onStartEdit={startEdit}
                            onEditValueChange={setEditValue}
                            onEditKeyDown={handleEditKeyDown}
                            onSaveEdit={saveEdit}
                            onToggleActive={toggleActive}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DepartmentSection({
  department,
  items,
  editingCell,
  editValue,
  saving,
  onStartEdit,
  onEditValueChange,
  onEditKeyDown,
  onSaveEdit,
  onToggleActive,
}: {
  department: string;
  items: CatalogItem[];
  editingCell: { id: string; field: "baseRate" | "markupPercent" } | null;
  editValue: string;
  saving: string | null;
  onStartEdit: (id: string, field: "baseRate" | "markupPercent", value: number) => void;
  onEditValueChange: (value: string) => void;
  onEditKeyDown: (e: React.KeyboardEvent, id: string) => void;
  onSaveEdit: (id: string) => void;
  onToggleActive: (item: CatalogItem) => void;
}) {
  return (
    <>
      <tr className="border-b border-card-border/50">
        <td
          colSpan={6}
          className="py-1.5 px-3 text-[9px] uppercase tracking-widest text-muted bg-white/[0.02]"
        >
          {department}
        </td>
      </tr>
      {items
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => (
          <tr
            key={item.id}
            className={`border-b border-card-border transition-colors ${
              item.active ? "hover:bg-white/5" : "opacity-40"
            }`}
          >
            <td className="py-2 px-3 text-xs text-white">
              {item.isOwnerLabor && (
                <span className="text-yellow-400 mr-1">&#9733;</span>
              )}
              {item.name}
            </td>
            <td className="py-2 px-3 text-right">
              {editingCell?.id === item.id && editingCell.field === "baseRate" ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  onBlur={() => onSaveEdit(item.id)}
                  onKeyDown={(e) => onEditKeyDown(e, item.id)}
                  className="bg-transparent border border-steel/50 rounded px-2 py-0.5 text-xs text-white w-20 text-right focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => onStartEdit(item.id, "baseRate", item.baseRate)}
                  className="text-xs text-white font-mono hover:text-chrome transition-colors cursor-text"
                >
                  {item.rateType === "PER_MILE"
                    ? `${item.baseRate}c`
                    : `$${item.baseRate.toLocaleString()}`}
                </button>
              )}
            </td>
            <td className="py-2 px-3 text-right">
              {editingCell?.id === item.id && editingCell.field === "markupPercent" ? (
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  onBlur={() => onSaveEdit(item.id)}
                  onKeyDown={(e) => onEditKeyDown(e, item.id)}
                  className="bg-transparent border border-steel/50 rounded px-2 py-0.5 text-xs text-white w-16 text-right focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => onStartEdit(item.id, "markupPercent", item.markupPercent)}
                  className="text-xs text-muted font-mono hover:text-chrome transition-colors cursor-text"
                >
                  {item.markupPercent}%
                </button>
              )}
            </td>
            <td className="py-2 px-3 text-right text-xs text-chrome font-mono">
              {formatRate(item.billRate, item.rateType)}
            </td>
            <td className="py-2 px-3 text-[10px] text-muted uppercase">
              {RATE_TYPE_LABELS[item.rateType] || item.rateType}
            </td>
            <td className="py-2 px-3 text-center">
              <button
                onClick={() => onToggleActive(item)}
                disabled={saving === item.id}
                className={`text-[10px] w-12 py-0.5 rounded uppercase tracking-widest transition-colors disabled:opacity-50 ${
                  item.active
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {item.active ? "On" : "Off"}
              </button>
            </td>
          </tr>
        ))}
    </>
  );
}
