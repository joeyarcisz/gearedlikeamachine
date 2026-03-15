# CRM UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the GLM admin CRM from a form-oriented CRUD app into a sales productivity tool with inline editing, drag-and-drop pipeline, and slide-out quick-action panels.

**Architecture:** Four improvements layered onto existing admin components. New shared components (Toast, InlineStageDropdown, SlideOutPanel) are built first, then composed into feature-specific panels and the Kanban board. Existing API routes handle all mutations. No schema changes.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, @dnd-kit/core (drag-and-drop), Prisma ORM (Neon PostgreSQL)

**Spec:** `docs/superpowers/specs/2026-03-10-crm-ux-improvements-design.md`

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `components/admin/Toast.tsx` | Floating notification that auto-dismisses |
| `components/admin/InlineStageDropdown.tsx` | Click-to-edit stage tag with positioned dropdown menu |
| `components/admin/SlideOutPanel.tsx` | Right-edge panel container with backdrop, escape-to-close |
| `components/admin/ContactQuickPanel.tsx` | Contact quick-action content for slide-out |
| `components/admin/OpportunityQuickPanel.tsx` | Opportunity quick-action content for slide-out |
| `components/admin/KanbanBoard.tsx` | Horizontal Kanban pipeline replacing PipelineBoard |
| `components/admin/KanbanCard.tsx` | Draggable opportunity card |
| `components/admin/KanbanColumn.tsx` | Droppable stage column |

### Modified Files
| File | Changes |
|------|---------|
| `components/admin/ContactTable.tsx` | Replace `<Link>` row navigation with onClick → slide-out. Add InlineStageDropdown on stage tags. |
| `app/admin/contacts/page.tsx` | Wrap in client boundary, render SlideOutPanel + ContactQuickPanel. |
| `app/admin/pipeline/page.tsx` | Replace PipelineBoard with KanbanBoard, render SlideOutPanel + OpportunityQuickPanel. |

### Verified (No Changes Needed)
| File | Reason |
|------|--------|
| `app/api/crm/activities/route.ts` | GET already supports `?contactId=&limit=` query. POST already auto-updates `lastContact`/`lastTouch`. |
| `app/api/crm/contacts/[id]/email/route.ts` | Already updates `lastContact` on email send. |
| `app/api/crm/contacts/[id]/route.ts` | PATCH already logs `stage_change` activity. |
| `app/api/crm/opportunities/[id]/route.ts` | PATCH already logs `stage_change` activity. |

---

## Chunk 1: Foundation Components

### Task 1: Install @dnd-kit

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/jeanclawd/geared-like-a-machine && npm install @dnd-kit/core
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/jeanclawd/geared-like-a-machine && node -e "require('@dnd-kit/core/dist/core.cjs.development'); console.log('@dnd-kit/core OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @dnd-kit/core for Kanban pipeline drag-and-drop"
```

---

### Task 2: Create Toast component

**Files:**
- Create: `components/admin/Toast.tsx`

- [ ] **Step 1: Create Toast component**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onDone: () => void;
}

export default function Toast({ message, duration = 1500, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), duration);
    const removeTimer = setTimeout(() => onDoneRef.current(), duration + 300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] px-4 py-2 bg-[#303030] border border-card-border text-[#E0E0E0] text-sm rounded transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
```

- [ ] **Step 2: Verify it renders**

Import and render `<Toast message="Test" onDone={() => {}} />` temporarily in any admin page. Confirm it appears at bottom-right and fades after 1.5s. Remove the test render.

- [ ] **Step 3: Commit**

```bash
git add components/admin/Toast.tsx
git commit -m "feat(admin): add Toast notification component"
```

---

### Task 3: Create InlineStageDropdown component

**Files:**
- Create: `components/admin/InlineStageDropdown.tsx`

- [ ] **Step 1: Create InlineStageDropdown component**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import StageTag from "./StageTag";
import Toast from "./Toast";
import {
  CONTACT_STAGES,
  CONTACT_STAGE_LABELS,
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE_LABELS,
} from "@/lib/crm-types";

interface InlineStageDropdownProps {
  stage: string;
  type: "contact" | "opportunity";
  entityId: string;
  onUpdated: (newStage: string) => void;
}

export default function InlineStageDropdown({
  stage,
  type,
  entityId,
  onUpdated,
}: InlineStageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const stages = type === "contact" ? CONTACT_STAGES : OPPORTUNITY_STAGES;
  const labels =
    type === "contact" ? CONTACT_STAGE_LABELS : OPPORTUNITY_STAGE_LABELS;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSelect(newStage: string) {
    if (newStage === stage) {
      setOpen(false);
      return;
    }
    setSaving(true);
    const endpoint =
      type === "contact"
        ? `/api/crm/contacts/${entityId}`
        : `/api/crm/opportunities/${entityId}`;

    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    setSaving(false);
    if (res.ok) {
      setOpen(false);
      onUpdated(newStage);
      setToast("Stage updated");
    }
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(!open);
        }}
        className="cursor-pointer disabled:opacity-50"
        disabled={saving}
      >
        <StageTag stage={stage} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] bg-[#303030] border border-card-border rounded shadow-lg py-1 max-h-[280px] overflow-y-auto">
          {stages.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(s);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#1B1C1B] flex items-center gap-2 ${
                s === stage ? "bg-[#1B1C1B]" : ""
              }`}
            >
              <StageTag stage={s} />
              <span className="text-[#999] text-xs">{labels[s]}</span>
            </button>
          ))}
        </div>
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
```

**Key decisions:**
- `e.stopPropagation()` prevents the stage click from triggering row/card click handlers
- Dropdown renders below the tag using `absolute top-full`
- The `StageTag` component is reused inside the dropdown items for visual consistency
- Toast is rendered locally (each dropdown manages its own toast)
- The label text is shown next to the tag since some tag abbreviations are ambiguous

- [ ] **Step 2: Verify it works**

Temporarily replace a `<StageTag>` in ContactTable with:
```tsx
<InlineStageDropdown stage={c.stage} type="contact" entityId={c.id} onUpdated={(s) => console.log(s)} />
```
Confirm: clicking the tag opens dropdown, selecting a stage fires PATCH, toast appears. Remove the temp code.

- [ ] **Step 3: Commit**

```bash
git add components/admin/InlineStageDropdown.tsx
git commit -m "feat(admin): add InlineStageDropdown for click-to-edit stage changes"
```

---

## Chunk 2: Slide-Out Panel System

### Task 4: Create SlideOutPanel container

**Files:**
- Create: `components/admin/SlideOutPanel.tsx`

- [ ] **Step 1: Create SlideOutPanel component**

```tsx
"use client";

import { useEffect } from "react";

interface SlideOutPanelProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideOutPanel({
  open,
  onClose,
  children,
}: SlideOutPanelProps) {
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-[#0A0A0A]/80 transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[420px] h-full bg-[#1B1C1B] border-l border-card-border overflow-y-auto shadow-2xl animate-[slideIn_200ms_ease-out]">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add slide-in animation to global CSS**

In `app/globals.css`, add this keyframe:

```css
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

- [ ] **Step 3: Verify slide-out works**

Temporarily add to any admin page:
```tsx
const [open, setOpen] = useState(false);
<button onClick={() => setOpen(true)}>Test</button>
<SlideOutPanel open={open} onClose={() => setOpen(false)}>
  <div className="p-6 text-white">Panel content</div>
</SlideOutPanel>
```
Confirm: panel slides in from right, backdrop click closes, Escape closes, body scroll locked. Remove test code.

- [ ] **Step 4: Commit**

```bash
git add components/admin/SlideOutPanel.tsx app/globals.css
git commit -m "feat(admin): add SlideOutPanel container with backdrop and keyboard close"
```

---

### Task 5: Create ContactQuickPanel

**Files:**
- Create: `components/admin/ContactQuickPanel.tsx`

- [ ] **Step 1: Create ContactQuickPanel component**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import InlineStageDropdown from "./InlineStageDropdown";
import Toast from "./Toast";
import type { CRMContact, CRMActivity } from "@/lib/crm-types";

interface ContactQuickPanelProps {
  contact: CRMContact;
  onStageChange: (contactId: string, newStage: string) => void;
  onClose: () => void;
}

const ACTIVITY_COLORS: Record<string, string> = {
  note: "bg-blue-500",
  email_sent: "bg-purple-500",
  call: "bg-green-500",
  meeting: "bg-amber-500",
  stage_change: "bg-orange-500",
  created: "bg-emerald-500",
  updated: "bg-cyan-500",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ContactQuickPanel({
  contact,
  onStageChange,
  onClose,
}: ContactQuickPanelProps) {
  const [nextAction, setNextAction] = useState(contact.nextAction || "");
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState("note");
  const [activityDesc, setActivityDesc] = useState("");
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [stage, setStage] = useState(contact.stage);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(
      `/api/crm/activities?contactId=${contact.id}&limit=5`
    );
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
    setLoading(false);
  }, [contact.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Reset state when contact changes
  useEffect(() => {
    setNextAction(contact.nextAction || "");
    setStage(contact.stage);
    setLoading(true);
    fetchActivities();
  }, [contact.id, contact.nextAction, contact.stage, fetchActivities]);

  async function saveNextAction() {
    const res = await fetch(`/api/crm/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextAction }),
    });
    if (res.ok) setToast("Saved");
  }

  async function logActivity() {
    if (!activityDesc.trim()) return;
    setLogging(true);
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activityType,
        description: activityDesc.trim(),
        contactId: contact.id,
      }),
    });
    setLogging(false);
    if (res.ok) {
      setActivityDesc("");
      setToast("Activity logged");
      fetchActivities();
    }
  }

  function handleStageChange(newStage: string) {
    setStage(newStage);
    onStageChange(contact.id, newStage);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-card-border">
        <div>
          <h2 className="text-lg text-white font-[family-name:var(--font-heading)] tracking-wider">
            {contact.name}
          </h2>
          {contact.company && (
            <p className="text-[#999] text-sm mt-0.5">{contact.company}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#999] hover:text-white text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stage */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
            Stage
          </label>
          <InlineStageDropdown
            stage={stage}
            type="contact"
            entityId={contact.id}
            onUpdated={handleStageChange}
          />
        </div>

        {/* Next Action */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
            Next Action
          </label>
          <textarea
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            onBlur={saveNextAction}
            rows={2}
            className="w-full bg-black/60 border border-card-border text-white text-sm rounded px-3 py-2 focus:border-[#E0E0E0] focus:outline-none resize-none"
            placeholder="What's the next step?"
          />
        </div>

        {/* Last Contact */}
        {contact.lastContact && (
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Last Contact
            </label>
            <p className="text-sm text-[#E0E0E0]">
              {new Date(contact.lastContact).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Log Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-2">
            Log Activity
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="bg-black/60 border border-card-border text-white text-sm rounded px-2 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            >
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
            </select>
            <input
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") logActivity();
              }}
              placeholder="Description..."
              className="flex-1 bg-black/60 border border-card-border text-white text-sm rounded px-3 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            />
          </div>
          <button
            onClick={logActivity}
            disabled={logging || !activityDesc.trim()}
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1 rounded hover:bg-white disabled:opacity-40 transition-colors"
          >
            {logging ? "Logging..." : "Log"}
          </button>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-3">
            Recent Activity
          </label>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-black/30 rounded animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-[#999]">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      ACTIVITY_COLORS[a.type] || "bg-gray-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#E0E0E0] truncate">
                      {a.description}
                    </p>
                    <p className="text-[10px] text-[#999]">
                      {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-card-border">
        <Link
          href={`/admin/contacts/${contact.id}`}
          className="text-[10px] uppercase tracking-widest text-[#E0E0E0] hover:text-white transition-colors"
        >
          Open Full View &rarr;
        </Link>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/ContactQuickPanel.tsx
git commit -m "feat(admin): add ContactQuickPanel for slide-out quick actions"
```

---

### Task 6: Create OpportunityQuickPanel

**Files:**
- Create: `components/admin/OpportunityQuickPanel.tsx`

- [ ] **Step 1: Create OpportunityQuickPanel component**

```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import InlineStageDropdown from "./InlineStageDropdown";
import Toast from "./Toast";
import type { CRMOpportunity, CRMActivity } from "@/lib/crm-types";

interface OpportunityQuickPanelProps {
  opportunity: CRMOpportunity;
  onStageChange: (oppId: string, newStage: string) => void;
  onClose: () => void;
}

const PRIORITY_OPTIONS = ["high", "medium-high", "medium", "low"];

const PRIORITY_COLORS: Record<string, string> = {
  high: "border-red-500/40 text-red-400",
  "medium-high": "border-orange-500/40 text-orange-400",
  medium: "border-amber-500/40 text-amber-400",
  low: "border-[#999]/40 text-[#999]",
};

const ACTIVITY_COLORS: Record<string, string> = {
  note: "bg-blue-500",
  email_sent: "bg-purple-500",
  call: "bg-green-500",
  meeting: "bg-amber-500",
  stage_change: "bg-orange-500",
  created: "bg-emerald-500",
  updated: "bg-cyan-500",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatValue(low: number | null, high: number | null): string {
  if (!low && !high) return "—";
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n}`;
  if (low && high) return `${fmt(low)} – ${fmt(high)}`;
  return fmt(low || high!);
}

export default function OpportunityQuickPanel({
  opportunity,
  onStageChange,
  onClose,
}: OpportunityQuickPanelProps) {
  const [nextAction, setNextAction] = useState(opportunity.nextAction || "");
  const [priority, setPriority] = useState(opportunity.priority || "");
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityType, setActivityType] = useState("note");
  const [activityDesc, setActivityDesc] = useState("");
  const [logging, setLogging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [stage, setStage] = useState(opportunity.stage);
  const priorityRef = useRef<HTMLDivElement>(null);

  const fetchActivities = useCallback(async () => {
    const res = await fetch(
      `/api/crm/activities?opportunityId=${opportunity.id}&limit=5`
    );
    if (res.ok) {
      const data = await res.json();
      setActivities(data);
    }
    setLoading(false);
  }, [opportunity.id]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    setNextAction(opportunity.nextAction || "");
    setPriority(opportunity.priority || "");
    setStage(opportunity.stage);
    setLoading(true);
    fetchActivities();
  }, [opportunity.id, opportunity.nextAction, opportunity.priority, opportunity.stage, fetchActivities]);

  // Click-outside handler for priority dropdown
  useEffect(() => {
    if (!priorityOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [priorityOpen]);

  async function saveNextAction() {
    const res = await fetch(`/api/crm/opportunities/${opportunity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nextAction }),
    });
    if (res.ok) setToast("Saved");
  }

  async function savePriority(newPriority: string) {
    setPriority(newPriority);
    setPriorityOpen(false);
    const res = await fetch(`/api/crm/opportunities/${opportunity.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: newPriority }),
    });
    if (res.ok) setToast("Priority updated");
  }

  async function logActivity() {
    if (!activityDesc.trim()) return;
    setLogging(true);
    const res = await fetch("/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: activityType,
        description: activityDesc.trim(),
        opportunityId: opportunity.id,
        contactId: opportunity.contactId || undefined,
      }),
    });
    setLogging(false);
    if (res.ok) {
      setActivityDesc("");
      setToast("Activity logged");
      fetchActivities();
    }
  }

  function handleStageChange(newStage: string) {
    setStage(newStage);
    onStageChange(opportunity.id, newStage);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-card-border">
        <div>
          <h2 className="text-lg text-white font-[family-name:var(--font-heading)] tracking-wider">
            {opportunity.title}
          </h2>
          {opportunity.company && (
            <p className="text-[#999] text-sm mt-0.5">{opportunity.company}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#999] hover:text-white text-xl leading-none p-1"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Stage + Priority row */}
        <div className="flex gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Stage
            </label>
            <InlineStageDropdown
              stage={stage}
              type="opportunity"
              entityId={opportunity.id}
              onUpdated={handleStageChange}
            />
          </div>
          <div className="relative" ref={priorityRef}>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Priority
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPriorityOpen(!priorityOpen);
              }}
              className="cursor-pointer"
            >
              <span
                className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                  PRIORITY_COLORS[priority] || "border-card-border text-[#999]"
                }`}
              >
                {priority || "None"}
              </span>
            </button>
            {priorityOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 min-w-[140px] bg-[#303030] border border-card-border rounded shadow-lg py-1">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p}
                    onClick={(e) => {
                      e.stopPropagation();
                      savePriority(p);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#1B1C1B] ${
                      p === priority ? "bg-[#1B1C1B]" : ""
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${
                        PRIORITY_COLORS[p]
                      }`}
                    >
                      {p}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Action */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
            Next Action
          </label>
          <textarea
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            onBlur={saveNextAction}
            rows={2}
            className="w-full bg-black/60 border border-card-border text-white text-sm rounded px-3 py-2 focus:border-[#E0E0E0] focus:outline-none resize-none"
            placeholder="What's the next step?"
          />
        </div>

        {/* Value + Contact */}
        <div className="flex gap-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
              Value
            </label>
            <p className="text-sm text-[#E0E0E0]">
              {formatValue(opportunity.estimatedValueLow, opportunity.estimatedValueHigh)}
            </p>
          </div>
          {opportunity.contact && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-1.5">
                Contact
              </label>
              <Link
                href={`/admin/contacts/${opportunity.contactId}`}
                className="text-sm text-[#E0E0E0] hover:text-white transition-colors"
              >
                {opportunity.contact.name}
              </Link>
            </div>
          )}
        </div>

        {/* Log Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-2">
            Log Activity
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="bg-black/60 border border-card-border text-white text-sm rounded px-2 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            >
              <option value="note">Note</option>
              <option value="call">Call</option>
              <option value="meeting">Meeting</option>
            </select>
            <input
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") logActivity();
              }}
              placeholder="Description..."
              className="flex-1 bg-black/60 border border-card-border text-white text-sm rounded px-3 py-1.5 focus:border-[#E0E0E0] focus:outline-none"
            />
          </div>
          <button
            onClick={logActivity}
            disabled={logging || !activityDesc.trim()}
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1 rounded hover:bg-white disabled:opacity-40 transition-colors"
          >
            {logging ? "Logging..." : "Log"}
          </button>
        </div>

        {/* Recent Activity */}
        <div className="border-t border-card-border pt-4">
          <label className="text-[10px] uppercase tracking-widest text-[#999] block mb-3">
            Recent Activity
          </label>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-black/30 rounded animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-[#999]">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      ACTIVITY_COLORS[a.type] || "bg-gray-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#E0E0E0] truncate">
                      {a.description}
                    </p>
                    <p className="text-[10px] text-[#999]">
                      {timeAgo(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-card-border">
        <Link
          href={`/admin/pipeline/${opportunity.id}`}
          className="text-[10px] uppercase tracking-widest text-[#E0E0E0] hover:text-white transition-colors"
        >
          Open Full View &rarr;
        </Link>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/OpportunityQuickPanel.tsx
git commit -m "feat(admin): add OpportunityQuickPanel for slide-out quick actions"
```

---

## Chunk 3: Kanban Pipeline Board

### Task 7: Create KanbanCard component

**Files:**
- Create: `components/admin/KanbanCard.tsx`

- [ ] **Step 1: Create KanbanCard component**

```tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import StageTag from "./StageTag";
import type { CRMOpportunity } from "@/lib/crm-types";

interface KanbanCardProps {
  opportunity: CRMOpportunity;
  onClick: () => void;
  isDragDisabled?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "border-red-500/40 text-red-400",
  "medium-high": "border-orange-500/40 text-orange-400",
  medium: "border-amber-500/40 text-amber-400",
  low: "border-[#999]/40 text-[#999]",
};

function formatValue(low: number | null, high: number | null): string {
  if (!low && !high) return "";
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n}`;
  if (low && high) return `${fmt(low)}–${fmt(high)}`;
  return fmt(low || high!);
}

export default function KanbanCard({
  opportunity,
  onClick,
  isDragDisabled,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: opportunity.id,
      data: { opportunity },
      disabled: isDragDisabled,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#0A0A0A] border border-card-border rounded p-3 cursor-pointer hover:border-[#E0E0E0]/30 transition-colors ${
        isDragging ? "opacity-30" : ""
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm text-white font-medium truncate flex-1">
          {opportunity.title}
        </h3>
        {opportunity.priority && (
          <span
            className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 border rounded-sm shrink-0 ${
              PRIORITY_COLORS[opportunity.priority] || "border-card-border text-[#999]"
            }`}
          >
            {opportunity.priority}
          </span>
        )}
      </div>
      {opportunity.company && (
        <p className="text-[11px] text-[#999] truncate">{opportunity.company}</p>
      )}
      {opportunity.contact?.name && (
        <p className="text-[11px] text-[#E0E0E0] truncate mt-0.5">
          {opportunity.contact.name}
        </p>
      )}
      {opportunity.nextAction && (
        <p className="text-[11px] text-[#999] truncate mt-1.5 italic">
          {opportunity.nextAction}
        </p>
      )}
      {(opportunity.estimatedValueLow || opportunity.estimatedValueHigh) && (
        <p className="text-xs text-[#E0E0E0] mt-1.5 text-right">
          {formatValue(opportunity.estimatedValueLow, opportunity.estimatedValueHigh)}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/KanbanCard.tsx
git commit -m "feat(admin): add KanbanCard draggable opportunity card"
```

---

### Task 8: Create KanbanColumn component

**Files:**
- Create: `components/admin/KanbanColumn.tsx`

- [ ] **Step 1: Create KanbanColumn component**

```tsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import StageTag from "./StageTag";

interface KanbanColumnProps {
  stage: string;
  count: number;
  totalLow: number;
  totalHigh: number;
  isOver?: boolean;
  children: React.ReactNode;
}

function formatValue(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export default function KanbanColumn({
  stage,
  count,
  totalLow,
  totalHigh,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${stage}`,
    data: { stage },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[260px] max-w-[300px] shrink-0 rounded border transition-colors ${
        isOver
          ? "border-[#E0E0E0]/50 bg-[#E0E0E0]/5"
          : "border-card-border bg-[#1B1C1B]/50"
      }`}
    >
      {/* Column header */}
      <div className="p-3 border-b border-card-border">
        <div className="flex items-center justify-between mb-1">
          <StageTag stage={stage} />
          <span className="text-[10px] text-[#999]">{count}</span>
        </div>
        {(totalLow > 0 || totalHigh > 0) && (
          <p className="text-[10px] text-[#999]">
            {formatValue(totalLow)}–{formatValue(totalHigh)}
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[80px]">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/admin/KanbanColumn.tsx
git commit -m "feat(admin): add KanbanColumn droppable stage column"
```

---

### Task 9: Create KanbanBoard and wire up pipeline page

**Files:**
- Create: `components/admin/KanbanBoard.tsx`
- Modify: `app/admin/pipeline/page.tsx`

- [ ] **Step 1: Create KanbanBoard component**

```tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import SlideOutPanel from "./SlideOutPanel";
import OpportunityQuickPanel from "./OpportunityQuickPanel";
import StageTag from "./StageTag";
import Toast from "./Toast";
import { OPPORTUNITY_STAGES } from "@/lib/crm-types";
import type { CRMOpportunity } from "@/lib/crm-types";

interface KanbanBoardProps {
  opportunities: CRMOpportunity[];
}

const ACTIVE_STAGES = OPPORTUNITY_STAGES.filter(
  (s) => s !== "won" && s !== "lost" && s !== "deferred"
);
const CLOSED_STAGES = ["won", "lost", "deferred"] as const;

const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  "medium-high": 1,
  medium: 2,
  low: 3,
};

function sortOpps(opps: CRMOpportunity[]): CRMOpportunity[] {
  return [...opps].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority || ""] ?? 4;
    const pb = PRIORITY_ORDER[b.priority || ""] ?? 4;
    if (pa !== pb) return pa - pb;
    return a.title.localeCompare(b.title);
  });
}

function formatValue(n: number): string {
  if (n === 0) return "$0";
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return `$${n}`;
}

export default function KanbanBoard({ opportunities: initialOpps }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<CRMOpportunity | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedClosed, setExpandedClosed] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for disabling drag
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    function handleResize() {
      setIsMobile(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = useMemo(() => {
    const map = new Map<string, CRMOpportunity[]>();
    for (const stage of OPPORTUNITY_STAGES) {
      map.set(stage, []);
    }
    for (const opp of opportunities) {
      const list = map.get(opp.stage);
      if (list) list.push(opp);
    }
    return map;
  }, [opportunities]);

  const activeOpp = activeId
    ? opportunities.find((o) => o.id === activeId) || null
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const oppId = active.id as string;
    const dropData = over.data.current as { stage?: string } | undefined;
    const newStage = dropData?.stage;
    if (!newStage) return;

    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp || opp.stage === newStage) return;

    // Optimistic update
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
    if (selectedOpp?.id === oppId) {
      setSelectedOpp((prev) => prev ? { ...prev, stage: newStage } : null);
    }

    const res = await fetch(`/api/crm/opportunities/${oppId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    if (res.ok) {
      setToast("Stage updated");
    } else {
      // Revert on failure
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, stage: opp.stage } : o))
      );
    }
  }

  const handleStageChange = useCallback((oppId: string, newStage: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
  }, []);

  function toggleClosedStage(stage: string) {
    setExpandedClosed((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  }

  // Filter active stages to only those with opportunities
  const populatedActiveStages = ACTIVE_STAGES.filter(
    (s) => (grouped.get(s)?.length || 0) > 0
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        <Link
          href="/admin/pipeline/new"
          className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
        >
          + New Opportunity
        </Link>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {populatedActiveStages.map((stage) => {
            const opps = sortOpps(grouped.get(stage) || []);
            const totalLow = opps.reduce(
              (sum, o) => sum + (o.estimatedValueLow || 0),
              0
            );
            const totalHigh = opps.reduce(
              (sum, o) => sum + (o.estimatedValueHigh || 0),
              0
            );
            return (
              <KanbanColumn
                key={stage}
                stage={stage}
                count={opps.length}
                totalLow={totalLow}
                totalHigh={totalHigh}
              >
                {opps.map((opp) => (
                  <KanbanCard
                    key={opp.id}
                    opportunity={opp}
                    onClick={() => setSelectedOpp(opp)}
                    isDragDisabled={isMobile}
                  />
                ))}
              </KanbanColumn>
            );
          })}
        </div>

        {/* Drag overlay (ghost card while dragging) */}
        <DragOverlay>
          {activeOpp ? (
            <div className="bg-[#0A0A0A] border border-[#E0E0E0]/50 rounded p-3 shadow-2xl w-[260px] opacity-90">
              <h3 className="text-sm text-white font-medium truncate">
                {activeOpp.title}
              </h3>
              {activeOpp.company && (
                <p className="text-[11px] text-[#999] truncate">
                  {activeOpp.company}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Won/Lost/Deferred summary rows */}
      <div className="mt-6 space-y-2">
        {CLOSED_STAGES.map((stage) => {
          const opps = grouped.get(stage) || [];
          if (opps.length === 0) return null;
          const totalLow = opps.reduce(
            (sum, o) => sum + (o.estimatedValueLow || 0),
            0
          );
          const totalHigh = opps.reduce(
            (sum, o) => sum + (o.estimatedValueHigh || 0),
            0
          );
          const isExpanded = expandedClosed.has(stage);
          return (
            <div
              key={stage}
              className="border border-card-border rounded"
            >
              <button
                onClick={() => toggleClosedStage(stage)}
                className="w-full flex items-center justify-between p-3 hover:bg-[#1B1C1B]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#999] text-xs">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <StageTag stage={stage} />
                  <span className="text-[10px] text-[#999]">
                    {opps.length}
                  </span>
                </div>
                <span className="text-xs text-[#999]">
                  {formatValue(totalLow)}–{formatValue(totalHigh)}
                </span>
              </button>
              {isExpanded && (
                <div className="p-3 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {sortOpps(opps).map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpp(opp)}
                      className="bg-[#0A0A0A] border border-card-border rounded p-3 cursor-pointer hover:border-[#E0E0E0]/30 transition-colors"
                    >
                      <h3 className="text-sm text-white truncate">
                        {opp.title}
                      </h3>
                      {opp.company && (
                        <p className="text-[11px] text-[#999] truncate">
                          {opp.company}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Slide-out panel */}
      <SlideOutPanel
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      >
        {selectedOpp && (
          <OpportunityQuickPanel
            opportunity={selectedOpp}
            onStageChange={handleStageChange}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </SlideOutPanel>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
```

- [ ] **Step 2: Update pipeline page to use KanbanBoard**

Replace the contents of `app/admin/pipeline/page.tsx` with:

```tsx
import { prisma } from "@/lib/prisma";
import KanbanBoard from "@/components/admin/KanbanBoard";
import type { CRMOpportunity, CRMContact } from "@/lib/crm-types";

export default async function PipelinePage() {
  const opportunities = await prisma.opportunity.findMany({
    include: { contact: true },
    orderBy: { updatedAt: "desc" },
  });

  const serialized: CRMOpportunity[] = opportunities.map((o) => ({
    ...o,
    lastTouch: o.lastTouch?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    contact: o.contact
      ? ({
          ...o.contact,
          lastContact: o.contact.lastContact?.toISOString() ?? null,
          createdAt: o.contact.createdAt.toISOString(),
          updatedAt: o.contact.updatedAt.toISOString(),
        } as CRMContact)
      : null,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
        Pipeline
      </h1>
      <KanbanBoard opportunities={serialized} />
    </div>
  );
}
```

- [ ] **Step 3: Verify Kanban board**

Run `npm run dev`, navigate to `/admin/pipeline`. Confirm:
- Horizontal columns appear for populated stages
- Cards show title, company, contact, priority, value
- Drag a card between columns → stage updates → toast appears
- Won/Lost/Deferred appear as collapsible rows below
- Click a card → slide-out panel opens
- Inline stage change works in the panel
- Mobile: columns stack vertically, no drag

- [ ] **Step 4: Commit**

```bash
git add components/admin/KanbanBoard.tsx components/admin/KanbanCard.tsx components/admin/KanbanColumn.tsx app/admin/pipeline/page.tsx
git commit -m "feat(admin): replace pipeline with horizontal Kanban board with drag-and-drop"
```

---

## Chunk 4: Contact Table Integration

### Task 10: Update ContactTable with inline stage + slide-out

**Files:**
- Modify: `components/admin/ContactTable.tsx`

- [ ] **Step 1: Modify ContactTable**

Changes to `components/admin/ContactTable.tsx`:

1. Update imports — replace `Link` with `InlineStageDropdown`, add `useEffect`:
```tsx
// REMOVE this line: import Link from "next/link";
// ADD this import:
import InlineStageDropdown from "./InlineStageDropdown";
// UPDATE React import to include useEffect:
import { useState, useMemo, useEffect } from "react";
```

2. Add `onSelectContact` prop:
```tsx
interface ContactTableProps {
  contacts: CRMContact[];
  onSelectContact: (contact: CRMContact) => void;
}
```
Update the function signature to destructure `onSelectContact`.

3. Add local state for tracking stage changes:
```tsx
const [localContacts, setLocalContacts] = useState(contacts);
```
Use `localContacts` instead of `contacts` in the filter/sort `useMemo`.

4. Add effect to sync when props change:
```tsx
useEffect(() => { setLocalContacts(contacts); }, [contacts]);
```

5. Replace `<StageTag stage={c.stage} />` in the table with:
```tsx
<InlineStageDropdown
  stage={c.stage}
  type="contact"
  entityId={c.id}
  onUpdated={(newStage) => {
    setLocalContacts((prev) =>
      prev.map((lc) => lc.id === c.id ? { ...lc, stage: newStage } : lc)
    );
  }}
/>
```

6. Replace the `<Link>` wrapping the contact name with a plain `<span>` (the row click handles navigation to the slide-out panel, so no separate click handler needed on the name):
```tsx
<span className="text-steel hover:text-white transition-colors">
  {c.name}
</span>
```

7. Make the table row clickable (opens slide-out panel):
```tsx
<tr
  key={c.id}
  onClick={() => onSelectContact(c)}
  className="border-b border-card-border hover:bg-graphite/50 cursor-pointer transition-colors"
>
```

8. Remove the existing "+ New Contact" `<Link>` button from inside ContactTable — it moves to `ContactsPageClient` to avoid duplication.

- [ ] **Step 2: Commit**

```bash
git add components/admin/ContactTable.tsx
git commit -m "feat(admin): add inline stage change and slide-out trigger to ContactTable"
```

---

### Task 11: Update contacts page to include slide-out panel

**Files:**
- Modify: `app/admin/contacts/page.tsx`

- [ ] **Step 1: Create ContactsPageClient wrapper**

Since the contacts page is a server component for data fetching, create a client wrapper. Modify `app/admin/contacts/page.tsx`:

```tsx
import { prisma } from "@/lib/prisma";
import ContactsPageClient from "./ContactsPageClient";
import type { CRMContact } from "@/lib/crm-types";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const serialized: CRMContact[] = contacts.map((c) => ({
    ...c,
    lastContact: c.lastContact?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <ContactsPageClient contacts={serialized} />;
}
```

- [ ] **Step 2: Create ContactsPageClient component**

Create `app/admin/contacts/ContactsPageClient.tsx`:

```tsx
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ContactTable from "@/components/admin/ContactTable";
import SlideOutPanel from "@/components/admin/SlideOutPanel";
import ContactQuickPanel from "@/components/admin/ContactQuickPanel";
import type { CRMContact } from "@/lib/crm-types";

interface ContactsPageClientProps {
  contacts: CRMContact[];
}

export default function ContactsPageClient({
  contacts: initialContacts,
}: ContactsPageClientProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);

  const handleStageChange = useCallback(
    (contactId: string, newStage: string) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, stage: newStage } : c))
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact((prev) =>
          prev ? { ...prev, stage: newStage } : null
        );
      }
    },
    [selectedContact]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Contacts
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            {contacts.length} total
          </span>
          <Link
            href="/admin/contacts/new"
            className="text-[10px] uppercase tracking-widest bg-[#E0E0E0] text-[#0A0A0A] px-3 py-1.5 rounded hover:bg-white transition-colors"
          >
            + New Contact
          </Link>
        </div>
      </div>
      <ContactTable
        contacts={contacts}
        onSelectContact={setSelectedContact}
      />

      <SlideOutPanel
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      >
        {selectedContact && (
          <ContactQuickPanel
            contact={selectedContact}
            onStageChange={handleStageChange}
            onClose={() => setSelectedContact(null)}
          />
        )}
      </SlideOutPanel>
    </div>
  );
}
```

- [ ] **Step 3: Verify contacts page**

Run `npm run dev`, navigate to `/admin/contacts`. Confirm:
- Contact table renders with inline stage dropdowns
- Click a stage tag → dropdown opens → select new stage → saves and updates in place
- Click a contact row → slide-out panel opens from right
- Panel shows: name, company, stage (editable), next action (editable, auto-saves on blur), last contact, log activity, recent activity
- "Open Full View" link navigates to full edit page
- Escape / backdrop click closes panel
- Stage changes in panel reflect in the table

- [ ] **Step 4: Commit**

```bash
git add app/admin/contacts/page.tsx app/admin/contacts/ContactsPageClient.tsx
git commit -m "feat(admin): add slide-out panel to contacts page with inline editing"
```

---

### Task 12: Verify auto-updates and final cleanup

**Files:**
- Verify: `app/api/crm/activities/route.ts` (lines 78-90)
- Verify: `app/api/crm/contacts/[id]/email/route.ts` (line 76)

- [ ] **Step 1: Verify lastContact auto-update on activity log**

In the browser: open a contact's slide-out panel, log an activity (e.g., "Test call" as type "Call"). Check the database or reload the page — the contact's Last Contact date should update to today.

This is already implemented in `app/api/crm/activities/route.ts:78-84`:
```tsx
if (contactId) {
  await prisma.contact.update({
    where: { id: contactId },
    data: { lastContact: new Date() },
  });
}
```

- [ ] **Step 2: Verify lastTouch auto-update on opportunity activity**

Open an opportunity's slide-out panel, log an activity. The opportunity's lastTouch should update.

Already implemented in `app/api/crm/activities/route.ts:85-90`:
```tsx
if (opportunityId) {
  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: { lastTouch: new Date() },
  });
}
```

- [ ] **Step 3: Verify email updates lastContact**

Already implemented in `app/api/crm/contacts/[id]/email/route.ts:76-79`.

- [ ] **Step 4: Verify stage change does NOT update lastContact/lastTouch**

Change a contact's stage via inline dropdown. Verify that lastContact does NOT change (only the stage_change activity is logged). Same for opportunities.

Already correct — the PATCH routes for contacts and opportunities only log a `stage_change` activity, they don't update `lastContact`/`lastTouch`.

- [ ] **Step 5: Run build to verify no TypeScript errors**

```bash
cd /Users/jeanclawd/geared-like-a-machine && npm run build
```

Expected: Build succeeds with no type errors.

- [ ] **Step 6: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(admin): resolve build errors from CRM UX improvements"
```

- [ ] **Step 7: Keep old PipelineBoard for reference**

The old `components/admin/PipelineBoard.tsx` is no longer imported anywhere. It can be deleted now or kept for reference. Recommended: delete it to avoid confusion.

```bash
git rm components/admin/PipelineBoard.tsx
git commit -m "chore: remove old PipelineBoard replaced by KanbanBoard"
```

---

## Summary

| Task | Component | Type |
|------|-----------|------|
| 1 | @dnd-kit install | Dependency |
| 2 | Toast | New component |
| 3 | InlineStageDropdown | New component |
| 4 | SlideOutPanel | New component |
| 5 | ContactQuickPanel | New component |
| 6 | OpportunityQuickPanel | New component |
| 7 | KanbanCard | New component |
| 8 | KanbanColumn | New component |
| 9 | KanbanBoard + pipeline page | New component + page modification |
| 10 | ContactTable | Component modification |
| 11 | Contacts page + client wrapper | Page modification |
| 12 | Verify auto-updates + cleanup | Verification |

**New files:** 8
**Modified files:** 3
**Deleted files:** 1 (PipelineBoard.tsx)
**New dependency:** @dnd-kit/core
**Schema changes:** None
**API changes:** None (all existing routes support needed operations)
