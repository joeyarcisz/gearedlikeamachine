# CRM UX Improvements — Design Spec

**Date:** 2026-03-10
**Status:** Approved

## Overview

Four UX improvements to the GLM admin CRM to reduce clicks, maximize productivity, and bring the interface from "traditional CRUD app" to "sales productivity tool."

## 1. Inline Stage Change

**Where:** Contact table rows, pipeline card stage tags, slide-out panels.

**Behavior:**
- Click stage tag → positioned dropdown anchored to the tag (not a modal)
- `e.stopPropagation()` on the stage tag click to prevent triggering the row/card click (which opens the slide-out panel)
- Select new stage → auto-saves via PATCH → tag updates in place
- Activity auto-logged as `stage_change` on the backend
- Brief toast confirmation ("Stage updated"), fades after 1.5s
- Click outside dropdown to dismiss (no save button needed)
- No page navigation, no form

**Styling:** Dropdown uses existing stage color-coding. Charcoal background, Steel border, stage tags rendered as colored pills matching `StageTag` component.

## 2. Drag-and-Drop Kanban Pipeline

**Layout:**
- Horizontal scrollable board replacing vertical collapsible sections
- Only populated stages render as columns (empty stages hidden)
- Column header: stage tag + count + total value range
- Cards stack vertically within each column, scrollable on overflow

**Won/Lost/Deferred:**
- Render as compact summary rows BELOW the board, not as columns
- Show count + total value, click to expand and see cards
- Not drag targets

**Drag behavior:**
- Grab card, drag horizontally into another column
- Drop zone highlights on hover (subtle Steel border glow)
- On drop: PATCH opportunity stage → auto-log `stage_change` → update column counts/values
- Vertical card order within columns is purely visual/ephemeral (no persistence, no schema changes). Default sort: priority descending, then by title alphabetically.

**Card contents:**
- Title (bold), company (muted), contact name, next action (1 line truncated), value range (right-aligned), priority badge
- Click anywhere (non-drag) → opens slide-out panel (cards are NOT wrapped in `<Link>`, panel opens via onClick handler)

**Library:** `@dnd-kit/core` + `@dnd-kit/sortable` (new dependency, must be installed)

**Mobile fallback:** Below `lg` breakpoint, columns stack vertically. Drag disabled on touch — use inline stage dropdown instead.

## 3. Auto-Update lastContact / lastTouch

**Note:** Some of these triggers may already be implemented in existing API routes. Verify existing implementation before adding duplicate logic.

**Triggers that update `lastContact` on a contact:**
- Log an activity (note, call, meeting) → set to now
- Send an email → set to now
- Stage change → does NOT update (not "contact")

**Triggers that update `lastTouch` on an opportunity:**
- Log an activity against the opportunity → set to now
- Stage change on opportunity → does NOT update `lastTouch` (consistent with contact behavior)

**Implementation:** Audit existing activity/email API routes to confirm coverage. Add any missing updates. No new endpoints needed.

## 4. Slide-Out Quick-Action Panel

**Trigger:** Click contact row or pipeline card. Replaces the current `<Link>` navigation — rows/cards are no longer wrapped in `<Link>`. The full detail page still exists and is reachable via the "Open Full View" link inside the panel.

**Dimensions:**
- Width: 420px desktop, full-width mobile
- Height: full viewport
- Overlay: semi-transparent Midnight backdrop, click to close
- Close: X button, Escape key, or backdrop click

**Data loading:** On panel open, fetch contact/opportunity details + last 5 activities via existing API endpoints. Show a skeleton/loading state while fetching.

**Contact panel (top to bottom):**
- Header: Name (Rajdhani 700) + Company (muted) + close button
- Stage: clickable inline dropdown (Section 1)
- Quick fields: Next Action (editable textarea, 2 rows), Last Contact (read-only, auto-managed)
- Log Activity: type dropdown + description + Log button, always visible
- Recent Activity: last 5 items, compact timeline (type badge + description + relative time)
- Footer: "Open Full View" link to `/admin/contacts/[id]`

**Opportunity panel (top to bottom):**
- Header: Title (Rajdhani 700) + Company (muted) + close button
- Stage: clickable inline dropdown
- Priority: clickable inline dropdown (values: high, medium-high, medium, low)
- Quick fields: Next Action (editable textarea), Value range (read-only), Contact name (link)
- Log Activity: same as contact
- Recent Activity: last 5 items
- Footer: "Open Full View" link to `/admin/pipeline/[id]`

**Save behavior:** Each field auto-saves on blur (PATCH request). Brief "Saved" indicator fades after 1s.

**Styling:** Graphite (#1B1C1B) background, Steel borders. No film grain inside panel.

## Brand Constraints

- Colors: Midnight #0A0A0A, Graphite #1B1C1B, Charcoal #303030, Chrome #999, Steel #E0E0E0, White #FFF
- Headings: Rajdhani 700, tracking-wider
- Body: Inter 400
- No film grain inside functional panels
- Consistent with existing admin aesthetic

## Technical Notes

- React 19 + Next.js 16 + Tailwind v4
- Drag library: @dnd-kit/core (NEW dependency — `npm install @dnd-kit/core`)
- Database: Prisma ORM with PrismaPg adapter (Neon PostgreSQL)
- All mutations via existing API routes (PATCH/POST)
- No new database schema changes needed (vertical card order within Kanban columns is ephemeral, not persisted)
- Priority values: `high`, `medium-high`, `medium`, `low` (String field, validated at UI level)
