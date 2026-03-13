# Site Features Batch 1 — Design Spec

**Date:** 2026-03-13
**Status:** Approved
**Scope:** 4 features designed together, built together, shipped together. Nothing goes live until all four are complete. Package prices must be confirmed by Joey before final deploy.

---

## Feature 1: About Page

**Route:** `/about`
**Shell:** Public site shell (Navbar + Footer), NOT DashboardShell
**Nav:** Add "About" to navLinks in `lib/data.ts`, positioned after "Work" (second item)
**Metadata:** `title: "About | Geared Like A Machine"`, `description: "A production company built on two decades across every format and role. Based in Texas, available worldwide."`

### Layout: Anchor Sections (typography-only, no hero image)

**Section 1: Hero**
- Breadcrumb label: "ABOUT" — `font-mono text-xs text-muted tracking-[3px] uppercase`
- Headline: "A Decade in the Making" — Rajdhani 700, uppercase, tracking-wider
- Steel accent line: `<div className="w-12 h-0.5 bg-steel my-4" />`
- Subtext: "The production company that took ten years to build right." — Inter, text-chrome
- No image. Typography-only hero.

**Section 2: The Story**
- Section title: "THE STORY"
- Three paragraphs, narrative style. Copy uses "the company" / "we" — never "I" or Joey's name.

Paragraph 1 — Walking away:
- A decade ago, helped build a production company with partners. Things were going well, but over time the visions diverged. One by one, the partners moved on. Sold shares and walked away from something that was working, because it wasn't building toward the right thing.

Paragraph 2 — The decade between:
- Spent the next ten years behind the camera on every kind of production imaginable. Refined the vision. Studied what worked and what didn't at every production company, agency, and set. Learned what a production company should be.

Paragraph 3 — GLM is born:
- GLM is that vision realized. A production company built on two decades of experience and a commitment to running things differently — more efficient, more precise, technology-forward. This is the beginning of a bigger story.

**Section 3: The Machine**
- Section title: "THE MACHINE"
- Two cards side by side (stack on mobile): `flex gap-6 flex-wrap`, each card `flex-1 min-w-[280px] border border-card-border p-6 bg-card`

Production card:
- Title: "PRODUCTION"
- Differentiator lead: "Every project benefits from two decades across every format and role. Streamlined operations, no wasted motion, no bloated crews."
- Capabilities list below `border-t border-card-border pt-3`: Commercial, Documentary, Narrative, Short-form, Live production, Motion design, Full post pipeline (edit, color, sound, graphics)

Rentals card:
- Title: "RENTALS"
- Differentiator lead: "The rental experience is due for an overhaul. We're building a better way to get the right gear into the right hands — faster, smarter, and with the kind of support that only comes from people who use this equipment every day."
- Capabilities list below divider: Cinema cameras, Lenses, Lighting, Grip, Drones, Monitoring, Audio, Curated packages, Texas-based
- Final line in steel color: "Something new is coming."

**Section 4: The Range**
- Section title: "THE RANGE"
- Opening copy: "If it involves a screen, we've worked nearly every role involved in getting the final product to the viewer. That kind of range builds a perspective that most people in this industry simply don't have."
- Second paragraph: "It means understanding not just the creative, but the logistics, the technology, the pipeline, and the decisions that make or break a production at every stage."
- Format tags (border pills, `px-4 py-2 border border-card-border text-steel text-xs tracking-wider uppercase`): Live Production, NASCAR Broadcasts, Narrative Features, Global Campaigns, Viral Content, Motion Design, Event Stages, Commercial, Documentary, Full Post Pipeline

**Section 5: CTA**
- Headline: "Put Us to Work"
- Subtext: "Ready to see what GLM can do for your next project?"
- Primary button: "Start a Project" → /discovery
- Secondary button: "Get an Estimate" → /scope

### Design Rules
- No images on the page
- No client names anywhere
- No stat counters or animated numbers
- No personal photos of Joey
- All copy in company voice ("we", "the company")
- Colors/fonts match existing design system: #0A0A0A bg, steel (#E0E0E0), Rajdhani headings, Inter body

### Files to Create
- `app/about/page.tsx` — server component, public shell (Navbar + Footer)

### Files to Modify
- `lib/data.ts` — add `{ label: "About", href: "/about" }` to navLinks after "Work"

---

## Feature 2: Portfolio Pages (Kubota, Conn-Selmer, JFK)

### 2a: JFK — Video-Hero Layout

**Route:** `/work/jfk-unspoken-speech` (file already exists as a stub — replace with full layout)
**Metadata:** `title: "JFK: The Unspoken Speech | Geared Like A Machine"`, `description: "ADDY Best of Show winning documentary. Winner of Gold ADDY in Public Service Audio/visual."`

**Layout:**
1. Full-width video embed (Vimeo 76923179) as hero — 16:9 aspect ratio, `<iframe>` with responsive container
2. Category tag: "DOCUMENTARY"
3. Title: "The Unspoken Speech"
4. Award badge: built as text component with SVG star icon (add to `components/icons.tsx`) + "ADDY BEST OF SHOW 2014" — `inline-flex items-center gap-2 px-4 py-2 border border-card-border bg-card`. The `/public/jfk/addy-award.webp` is supplementary imagery, not the badge UI.
5. Description: "Winner of the 2014 ADDY Best of Show Broadcast award for editing and a Gold ADDY in the Public Service Audio/visual category."
6. JFK pull-quote with left border accent (`border-l-2 border-steel pl-4`):
   - "Above all, words alone are not enough. The United States is a peaceful nation. And where our strength and determination are clear, our words need merely to convey conviction, not belligerence. If we are strong, our strength will speak for itself. If we are weak, words will be of no help."
   - Attribution: "— President John F. Kennedy"
7. Back link: "← BACK TO WORK" → `/`  with scroll to #portfolio

**Assets (already downloaded):**
- `/public/jfk/hero.webp` — BTS photo (secondary use below quote)
- `/public/jfk/addy-award.webp` — award badge image (supplementary)
- `/public/jfk/featured.jpg` — existing featured image

**Video:** `https://player.vimeo.com/video/76923179` (will be swapped to GLM Vimeo later)

**Files to modify:**
- `app/work/jfk-unspoken-speech/page.tsx` — replace existing stub with full video-hero layout

### 2b: Kubota — Video + Gallery Layout

**Route:** `/work/kubota`
**Metadata:** `title: "Kubota | Geared Like A Machine"`, `description: "Multi-location commercial production for Kubota across Texas, Tennessee, Kansas, and Georgia."`

**Layout:**
1. Category tag: "COMMERCIAL / INDUSTRIAL"
2. Title: "Kubota"
3. Role: "Director of Photography"
4. Locations: Grapevine, TX · Murfreesboro, TN · Abilene, KS · Jefferson, GA
5. Video grid: 3 YouTube embeds. Desktop: 2-col top row, 1 left bottom. Mobile: single column stack.
   - `https://www.youtube.com/embed/ZVyoOsreOMg`
   - `https://www.youtube.com/embed/GJSkOZVGdh4`
   - `https://www.youtube.com/embed/Vp-ftvJ2lY4`
6. Image gallery: 14 production stills in responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
7. Back link: "← BACK TO WORK"

**Assets (already downloaded):**
- `/public/kubota/01.webp` through `/public/kubota/14.webp`

**Files to create:**
- `app/work/kubota/page.tsx`
- `app/work/kubota/KubotaGallery.tsx` (`"use client"` component for gallery interaction)

### 2c: Conn-Selmer — Gallery + Testimonial Layout

**Route:** `/work/conn-selmer`
**Metadata:** `title: "Conn-Selmer | Geared Like A Machine"`, `description: "Producer and DP for Conn-Selmer and MusicProfessor.com. 4 production days, 8 musicians, 150+ video lessons."`

**Layout:**
1. Category tag: "MUSIC / EDUCATION"
2. Title: "Conn-Selmer"
3. Role: "Producer / Director of Photography"
4. Subtitle: "In partnership with MusicProfessor.com"
5. Project stats: 4 Production Days | 8 Musicians | 150+ Video Lessons
6. Testimonial card (`border border-card-border bg-card p-6`):
   - Quote: "You set such an exceptionally high standard that is now what I demand from the crews I work with"
   - Attribution: "— Elisa Janson Jones, Senior Product Manager - Digital, Conn-Selmer"
7. Screenshot gallery: 14 images in 2-column grid (16:9 aspect ratio). Single column on mobile.
8. Back link: "← BACK TO WORK"

**Assets (already downloaded):**
- `/public/conn-selmer/hero.webp` — Conn-Selmer logo banner
- `/public/conn-selmer/01.webp` through `/public/conn-selmer/14.webp` — screenshots

**Files to create:**
- `app/work/conn-selmer/page.tsx`
- `app/work/conn-selmer/ConnSelmerGallery.tsx` (`"use client"` component)

### Homepage Integration (all three)
- Add Kubota, Conn-Selmer to `portfolioItems` array in `lib/data.ts` (JFK is already in `featuredWork`)
- Extend `bentoLayout` array in `PortfolioGrid.tsx` from 7 to 9 entries to handle the new items
- No Work dropdown — portfolio pages are discoverable via the homepage grid. The current "Work" nav link scrolls to #portfolio, which is sufficient.

---

## Feature 3: Rental Packages + Policies

**Route:** `/rentals` (existing page, add new sections)
**Note:** The rentals page uses `DashboardShell`. All new sections must wrap in `dashboard-card` divs with `dashboard-card-header` labels to match the existing visual pattern.

### New Section: Curated Packages (above existing inventory)

- Wrapped in `dashboard-card` with header "Curated Packages"
- Subtitle: "One price. Everything you need. Skip the line items."
- 5 package cards in vertical stack:
  - Each card: name (left), one-liner description (left), day rate (right, large)
  - Card style: `border border-card-border bg-card p-5 flex justify-between items-center flex-wrap gap-3`
  - **Package names, descriptions, and prices TBD** — Joey will confirm before deploy. Use the 5 from the roadmap as placeholders during build, clearly marked for review.
- Footer note: "Weekend rate: pickup Fri after 2PM, return Mon by 11AM = 1 day rate. Weekly: 3x daily."

### Existing inventory browser stays as-is between packages and How It Works.

### New Section: How It Works (below inventory)

- Wrapped in `dashboard-card` with header "How It Works"
- 4 steps in horizontal row (stack 2x2 on mobile, `grid grid-cols-2 sm:grid-cols-4 gap-4`):
  1. Browse — "Pick a package or build your own from inventory."
  2. Request — "Submit your dates and gear list. We confirm availability."
  3. Pickup — "Everything prepped, tested, and ready. Texas-based."
  4. Return — "Bring it back. We handle inspection and turnover."
- Step numbers: large, `text-xl font-bold text-steel opacity-30`

### New Section: Rental Policies (collapsible accordion)

- Wrapped in `dashboard-card` with header "Rental Policies"
- 5 accordion items (collapsed by default, expand on click):
  1. **Rates & Duration** — Day rate = 24hrs from pickup. Weekend: Fri 2PM to Mon 11AM = 1 day. Weekly: 3x daily.
  2. **Insurance & Deposits** — COI required for >$5,000 replacement value. Under $5,000: credit card hold.
  3. **Cancellation** — Free before pickup. 50% within 24hrs of pickup. 100% no-show.
  4. **Damage, Loss & Late Returns** — Damage: repair or replacement, whichever less. Loss/theft: full replacement at market value. Late: 25% daily rate per day.
  5. **Delivery** — Available in DFW area, fee applies.

### Files to create
- `components/RentalPackages.tsx` — server component (static data, no interactivity)
- `components/RentalPolicies.tsx` — `"use client"` component (accordion expand/collapse requires useState)
- `components/HowItWorks.tsx` — server component

### Files to modify
- `app/rentals/page.tsx` — import and place new sections in order: Packages → Inventory → HowItWorks → Policies

---

## Feature 4: Location Landing Pages (SEO)

**Routes:**
- `/dallas-video-production`
- `/fort-worth-video-production`
- `/equipment-rental-dallas`

**Shell:** Public site shell (Navbar + Footer), NOT DashboardShell

### Implementation Approach
Build three standalone page files (no shared template component). The equipment rental page has a meaningfully different services grid and schema from the two production pages, making a shared template more complex than helpful.

### Shared Section Structure

1. **Hero** — breadcrumb label "GLM · TEXAS", city-specific headline, steel accent line, 2-3 sentence intro
2. **Services Grid** — 2x2 grid of service cards with local angle (`grid grid-cols-1 sm:grid-cols-2 gap-3`). Production pages: Commercial, Corporate, Documentary, Short-Form. Rental page: Cinema Cameras, Lighting, Grip & Electric, Curated Packages.
3. **Why GLM in [City]** — 3-4 paragraphs (800-1200 words total per page). Substantial unique content. Local knowledge, production infrastructure, market understanding. This is the SEO meat.
4. **How We Work** — Compact 4-step process: Discovery, Plan, Produce, Deliver
5. **CTA** — "Start Your [City] Project" with primary (→ /discovery) and secondary (→ /scope) buttons

### Schema Markup
Inject as `<script type="application/ld+json">` inline in each page component, placed in the JSX body (Next.js App Router renders it in the HTML).

### Sitemap
If no `app/sitemap.ts` exists, create one to include all public pages: homepage, about, rentals, scope, discovery, blog, all work pages, and all three location pages.

### Content Differentiation

**Dallas Video Production:**
- Keywords: dallas video production, video production company dallas, dallas production company
- Local angle: Deep Ellum studios, downtown corporate, DFW agency ecosystem, tech corridor, healthcare, finance
- Metadata: `title: "Dallas Video Production Company | Geared Like A Machine"`, `description: "Full-service video production in Dallas, TX. Commercial, corporate, documentary, and short-form content."`
- Schema: LocalBusiness + Service

**Fort Worth Video Production:**
- Keywords: fort worth video production, video production fort worth
- Local angle: Stockyards, Cultural District, Sundance Square, TCU, manufacturing, aerospace (Lockheed), ranch/agriculture, tourism
- Metadata: `title: "Fort Worth Video Production | Geared Like A Machine"`, `description: "Video production services in Fort Worth, TX. Commercial, documentary, corporate video, and branded content."`
- Schema: LocalBusiness + Service

**Equipment Rental Dallas:**
- Keywords: camera rental dallas, equipment rental dfw, film equipment rental texas, lens rental dallas
- Local angle: DFW production community, Texas film incentives, same-day pickup
- Different services grid: rental categories instead of production services, preview of curated packages linking to /rentals
- Metadata: `title: "Camera & Equipment Rental Dallas | Geared Like A Machine"`, `description: "Cinema camera, lens, lighting, and grip rental in Dallas-Fort Worth. Curated packages and same-day pickup."`
- Schema: LocalBusiness + Product

### Design Rules
- No portfolio images or client names on these pages
- Pure service/capability content
- Not added to main navigation — SEO entry points only, found via search and sitemap
- Each page must have genuinely unique content (no city-name swapping)

### Files to create
- `app/dallas-video-production/page.tsx`
- `app/fort-worth-video-production/page.tsx`
- `app/equipment-rental-dallas/page.tsx`
- `app/sitemap.ts` (if not already present)

---

## Implementation Notes

- **Ship together:** All features deploy in one push. Rental packages are DEFERRED (Joey confirming prices). The rental page ships with How It Works + Policies only. Packages added in a follow-up deploy.
- **Navigation updates:** Add "About" to navLinks. Add 2 new portfolio items (Kubota, Conn-Selmer) to `portfolioItems`. Extend `bentoLayout` to 9 entries.
- **Video URLs temporary:** JFK Vimeo and Kubota YouTube embeds will be swapped to GLM Vimeo later.
- **SEO content:** Location pages need 800-1200 words of unique content each. Write during build.
- **No lead magnet:** Feature 5 (PDF lead magnet) is parked. Will revisit later.
