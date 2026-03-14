"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import EstimateSearch from "@/components/admin/EstimateSearch";
import LineItemRow from "@/components/admin/LineItemRow";
import EstimateTotals from "@/components/admin/EstimateTotals";

type Contact = { id: string; name: string; company: string | null; email?: string | null };
type Opportunity = { id: string; title: string };

type LineItem = {
  id?: string;
  catalogItemId?: string | null;
  name: string;
  category: string;
  department: string | null;
  rateType: string;
  unitRate: number;
  quantity: number;
  days: number;
  lineTotal: number;
  sortOrder: number;
  notes: string | null;
  isOwnerLabor?: boolean;
  catalogBaseRate?: number;
  catalogMarkupPercent?: number;
};

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
};

const CATEGORY_ORDER = ["PRE_PRO", "CREW", "GEAR", "POST", "TRAVEL"];
const CATEGORY_LABELS: Record<string, string> = {
  PRE_PRO: "Pre-Production",
  CREW: "Production Crew",
  GEAR: "Equipment",
  POST: "Post-Production",
  TRAVEL: "Travel",
};

interface EstimateBuilderProps {
  id?: string;
}

export default function EstimateBuilder({ id }: EstimateBuilderProps) {
  const router = useRouter();
  const [estimateId, setEstimateId] = useState(id || "");
  const [estimateNumber, setEstimateNumber] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [contactId, setContactId] = useState<string | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [opportunityId, setOpportunityId] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [shootDays, setShootDays] = useState<number | "">("");
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [convertSuccess, setConvertSuccess] = useState<{ projectId: string; projectTitle: string } | null>(null);

  // Load existing estimate
  useEffect(() => {
    if (!id) return;
    fetch(`/api/estimates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEstimateNumber(data.estimateNumber);
        setTitle(data.title);
        setStatus(data.status);
        setContactId(data.contactId);
        setSelectedContact(data.contact);
        setOpportunityId(data.opportunityId);
        setShootDays(data.shootDays ?? "");
        setValidUntil(data.validUntil ? data.validUntil.split("T")[0] : "");
        setProjectId(data.projectId || null);
        setNotes(data.notes || "");
        setClientNotes(data.clientNotes || "");
        setLineItems(
          (data.lineItems || []).map((li: LineItem & { catalogItem?: CatalogItem | null }) => ({
            ...li,
            isOwnerLabor: li.catalogItem?.isOwnerLabor ?? false,
            catalogBaseRate: li.catalogItem?.baseRate ?? undefined,
            catalogMarkupPercent: li.catalogItem?.markupPercent ?? undefined,
          }))
        );
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [id]);

  // Search contacts
  useEffect(() => {
    if (contactSearch.trim().length < 2) {
      setContacts([]);
      return;
    }
    fetch("/api/crm/contacts")
      .then((r) => r.json())
      .then((data: Contact[]) => {
        const q = contactSearch.toLowerCase();
        setContacts(
          data.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              (c.company && c.company.toLowerCase().includes(q))
          ).slice(0, 10)
        );
      })
      .catch(() => {});
  }, [contactSearch]);

  // Load opportunities for selected contact
  useEffect(() => {
    if (!contactId) {
      setOpportunities([]);
      return;
    }
    fetch("/api/crm/opportunities")
      .then((r) => r.json())
      .then((data: (Opportunity & { contactId?: string | null })[]) => {
        setOpportunities(data.filter((o) => o.contactId === contactId));
      })
      .catch(() => {});
  }, [contactId]);

  const total = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

  const addCatalogItem = useCallback(
    (item: CatalogItem) => {
      const days = typeof shootDays === "number" ? shootDays : 1;
      const quantity = 1;
      const lineTotal =
        item.rateType === "PER_MILE"
          ? Math.round((item.billRate / 100) * quantity * days)
          : Math.round(item.billRate * quantity * days);

      setLineItems((prev) => [
        ...prev,
        {
          catalogItemId: item.id,
          name: item.name,
          category: item.category,
          department: item.department,
          rateType: item.rateType,
          unitRate: item.billRate,
          quantity,
          days,
          lineTotal,
          sortOrder: prev.length,
          notes: null,
          isOwnerLabor: item.isOwnerLabor,
          catalogBaseRate: item.baseRate,
          catalogMarkupPercent: item.markupPercent,
        },
      ]);
    },
    [shootDays]
  );

  function addCustomItem() {
    const days = typeof shootDays === "number" ? shootDays : 1;
    setLineItems((prev) => [
      ...prev,
      {
        name: "Custom Item",
        category: "CREW",
        department: null,
        rateType: "DAY",
        unitRate: 0,
        quantity: 1,
        days,
        lineTotal: 0,
        sortOrder: prev.length,
        notes: null,
      },
    ]);
  }

  function updateLineItem(index: number, updated: LineItem) {
    setLineItems((prev) => prev.map((li, i) => (i === index ? updated : li)));
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave(): Promise<string | null> {
    if (!title.trim()) return null;
    setSaving(true);

    try {
      const body = {
        title: title.trim(),
        status,
        contactId: contactId || null,
        opportunityId: opportunityId || null,
        shootDays: shootDays || null,
        validUntil: validUntil || null,
        notes: notes || null,
        clientNotes: clientNotes || null,
      };

      let savedEstimateId = estimateId;

      // Prepare line items payload for bulk sync
      const lineItemsPayload = lineItems.map((li, i) => ({
        id: li.id || undefined,
        catalogItemId: li.catalogItemId || null,
        name: li.name,
        category: li.category,
        department: li.department,
        rateType: li.rateType,
        unitRate: li.unitRate,
        quantity: li.quantity,
        days: li.days,
        sortOrder: i,
        notes: li.notes,
      }));

      if (estimateId) {
        // Single PUT with metadata + line items
        await fetch(`/api/estimates/${estimateId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, lineItems: lineItemsPayload }),
        });
      } else {
        // Create the estimate first
        const res = await fetch("/api/estimates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        savedEstimateId = data.id;
        setEstimateId(data.id);
        setEstimateNumber(data.estimateNumber);

        // Then sync line items via PUT
        if (savedEstimateId && lineItemsPayload.length > 0) {
          await fetch(`/api/estimates/${savedEstimateId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lineItems: lineItemsPayload }),
          });
        }
      }

      if (!id && savedEstimateId) {
        router.push(`/admin/estimates/${savedEstimateId}`);
      }

      return savedEstimateId || null;
    } catch {
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function handleGeneratePDF() {
    // Save first to ensure latest data, and get the ID back
    const savedId = await handleSave();
    const targetId = savedId || estimateId;
    if (!targetId) return;

    const res = await fetch(`/api/estimates/${targetId}/pdf`, { method: "POST" });
    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${estimateNumber || "estimate"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleDuplicate() {
    if (!estimateId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/estimates/${estimateId}/duplicate`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/estimates/${data.id}`);
      }
    } catch {
      // silent
    }
    setSaving(false);
  }

  async function handleConvertToProject() {
    if (!estimateId) return;
    if (!confirm("Convert this estimate to a project? This will mark the estimate as Accepted and create a new project.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/estimates/${estimateId}/convert`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStatus("ACCEPTED");
        setProjectId(data.project.id);
        setConvertSuccess({ projectId: data.project.id, projectTitle: data.project.title });
      }
    } catch {
      // silent
    }
    setSaving(false);
  }

  // Group line items by category for display
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat] || cat,
    items: lineItems
      .map((li, originalIndex) => ({ ...li, originalIndex }))
      .filter((li) => li.category === cat),
  })).filter((g) => g.items.length > 0);

  if (!loaded) {
    return <div className="p-6 text-muted text-sm">Loading estimate...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            {estimateNumber || "New Estimate"}
          </h1>
          {estimateId && (
            <select
              value={status}
              onChange={async (e) => {
                const newStatus = e.target.value;
                setStatus(newStatus);
                if (estimateId) {
                  await fetch(`/api/estimates/${estimateId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                  });
                }
              }}
              className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                status === "DRAFT" ? "bg-white/10 text-white border-card-border" :
                status === "SENT" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                status === "ACCEPTED" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                status === "DECLINED" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}
            >
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="EXPIRED">Expired</option>
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="text-[10px] uppercase tracking-widest bg-card border border-card-border text-white px-3 py-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {estimateId && (
            <button
              onClick={handleDuplicate}
              disabled={saving}
              className="text-[10px] uppercase tracking-widest bg-card border border-card-border text-white px-3 py-1.5 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Duplicate
            </button>
          )}
          {estimateId && (status === "SENT" || status === "ACCEPTED") && !projectId && (
            <button
              onClick={handleConvertToProject}
              disabled={saving}
              className="text-[10px] uppercase tracking-widest bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
            >
              Convert to Project
            </button>
          )}
          <button
            onClick={handleGeneratePDF}
            disabled={!estimateId && !title.trim()}
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors disabled:opacity-50"
          >
            Generate PDF
          </button>
        </div>
      </div>

      {/* Convert success banner */}
      {convertSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-green-400">
            Project created: {convertSuccess.projectTitle}
          </span>
          <a
            href={`/admin/production`}
            className="text-[10px] uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors"
          >
            View Projects
          </a>
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Estimate title (e.g., FranklinWH Durability Campaign)"
        className="w-full bg-card border border-card-border rounded px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:border-steel/50"
      />

      {/* Meta row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Contact search */}
        <div className="relative">
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">Client / Contact</label>
          {selectedContact ? (
            <div className="flex items-center gap-2 bg-card border border-card-border rounded px-3 py-2">
              <span className="text-xs text-white truncate">{selectedContact.name}</span>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  setContactId(null);
                  setContactSearch("");
                }}
                className="text-muted hover:text-red-400 text-sm"
              >
                &times;
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => {
                  setContactSearch(e.target.value);
                  setShowContactDropdown(true);
                }}
                onFocus={() => setShowContactDropdown(true)}
                placeholder="Search contacts..."
                className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-steel/50"
              />
              {showContactDropdown && contacts.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-card border border-card-border rounded shadow-lg">
                  {contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedContact(c);
                        setContactId(c.id);
                        setContactSearch("");
                        setShowContactDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 text-xs text-white"
                    >
                      {c.name}
                      {c.company && <span className="text-muted ml-1">({c.company})</span>}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Opportunity */}
        <div>
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">Opportunity</label>
          <select
            value={opportunityId || ""}
            onChange={(e) => setOpportunityId(e.target.value || null)}
            className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-steel/50"
          >
            <option value="">None</option>
            {opportunities.map((o) => (
              <option key={o.id} value={o.id}>{o.title}</option>
            ))}
          </select>
        </div>

        {/* Shoot days */}
        <div>
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">Shoot Days</label>
          <input
            type="number"
            value={shootDays}
            onChange={(e) => setShootDays(e.target.value ? Number(e.target.value) : "")}
            placeholder="e.g., 4"
            className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-steel/50"
          />
        </div>

        {/* Valid until */}
        <div>
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">Valid Until</label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-steel/50"
          />
        </div>
      </div>

      {/* Catalog search */}
      <div>
        <label className="text-[9px] uppercase tracking-widest text-muted block mb-2">Add Items from Catalog</label>
        <EstimateSearch onSelect={addCatalogItem} />
      </div>

      {/* Line items table */}
      <div>
        {grouped.length === 0 ? (
          <div className="text-muted text-sm py-8 text-center border border-card-border rounded">
            No line items yet. Search the catalog above to add items.
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.category} className="mb-4">
              <div className="text-[10px] uppercase tracking-widest text-steel font-[family-name:var(--font-heading)] px-2 py-1.5 border-b border-card-border mb-1">
                {group.label}
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] uppercase tracking-widest text-muted">
                    <th className="py-1 px-2 text-left font-normal">Item</th>
                    <th className="py-1 px-2 text-left font-normal">Rate</th>
                    <th className="py-1 px-2 text-center font-normal">Qty</th>
                    <th className="py-1 px-2 text-center font-normal">Days</th>
                    <th className="py-1 px-2 text-right font-normal">Total</th>
                    <th className="py-1 px-1 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <LineItemRow
                      key={item.originalIndex}
                      item={item}
                      onChange={(updated) => updateLineItem(item.originalIndex, updated as LineItem)}
                      onRemove={() => removeLineItem(item.originalIndex)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        <button
          onClick={addCustomItem}
          className="text-[10px] uppercase tracking-widest text-muted hover:text-white transition-colors mt-2"
        >
          + Add Custom Line Item
        </button>
      </div>

      {/* Totals */}
      <EstimateTotals
        lineItems={lineItems.map((li) => ({
          unitRate: li.unitRate,
          quantity: li.quantity,
          days: li.days,
          rateType: li.rateType,
          isOwnerLabor: li.isOwnerLabor,
          catalogBaseRate: li.catalogBaseRate,
          catalogMarkupPercent: li.catalogMarkupPercent,
        }))}
        total={total}
      />

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">
            Internal Notes - never shown on PDF
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-steel/50 resize-none"
          />
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-widest text-muted block mb-1">
            Client Notes - shown on PDF footer
          </label>
          <textarea
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            rows={3}
            className="w-full bg-card border border-card-border rounded px-3 py-2 text-xs text-white placeholder:text-muted focus:outline-none focus:border-steel/50 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
