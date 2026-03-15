# StudioBinder Deep Dive: Feature Extraction & GLM Adaptation Strategy

## What Is StudioBinder

StudioBinder is the leading SaaS production management platform for film, TV, and video production. Based in Santa Monica, CA. Built entirely in JavaScript, hosted on tier-one cloud infrastructure with 256-bit SSL encryption. Web-only (no native mobile app, but mobile-responsive). They acquired ProductionBeast (a production job board) in 2017.

---

## Complete Feature Map

StudioBinder organizes into **5 production stages**: Write, Breakdown, Visualize, Plan, Shoot.

### MODULE 1: SCREENWRITING

| Feature | Details |
|---------|---------|
| Screenplay editor | Industry-standard formatting, auto-complete, hotkeys, auto-save |
| AV Script (two-column) | For commercials, docs, music videos. Narration + visual side-by-side |
| Script import | PDF, Final Draft (.fdx), Fountain, TXT |
| Revision tracking | WGA-standard color-coded revisions (Indie+ plans) |
| Unlimited versions | Draft access, version history |
| Collaboration | Real-time co-writing, commenting, sharing |
| Script outline | Split-screen outline view (Indie+ plans) |
| Title page designer | Custom title pages |
| Episodic organization | Organize by seasons (Professional+ plans) |
| Document templates | Reusable templates (Professional+ plans) |

### MODULE 2: SCRIPT BREAKDOWN

| Feature | Details |
|---------|---------|
| Element tagging | Click-to-tag: props, costumes, equipment, VFX, set dressing, cast, vehicles, special effects, stunts, etc. |
| Auto-sync | Changes sync to stripboards, shot lists, call sheets |
| Breakdown reports | Filter by scenes, elements, cast, locations, shoot day |
| DOOD reports | Day Out of Days tracking |
| Prep/shoot times | Advanced breakdown with time estimates (Indie+) |
| Story days | Track narrative timeline across scenes (Indie+) |
| Real-time collaboration | Multiple team members break down simultaneously |
| Department sharing | View-only access for specific departments |

### MODULE 3: SHOT LIST & STORYBOARD

| Feature | Details |
|---------|---------|
| Shot list builder | Shot type, size, movement, angle, lens, frame rate, lighting, equipment |
| Auto-generate from script | Tag shots directly from screenplay |
| Visual references | Attach renders, photos, drawings to each shot |
| Storyboard view | Thumbnail gallery mode with annotations |
| Aspect ratio options | Customizable framing display |
| Shot completion tracking | Check off shots during production |
| Color coding | Organize by scene, setup, or custom categories |
| Annotated arrows | Camera/character movement indicators (Indie+) |
| Image editor | Built-in editing for storyboard images (Indie+) |
| Layout customization | Choose which fields appear, export layout |
| Camera setups | Shot list scheduling with setup grouping (Professional+) |

### MODULE 4: SCHEDULING

| Feature | Details |
|---------|---------|
| Stripboard interface | Drag-and-drop scene arrangement |
| Auto-sorting | By location, time of day, page count, cast |
| Multiple schedules | Alternate versions for contingencies (Professional+) |
| Precision timing | Time ranges, SMPTE timecodes (Professional+) |
| Episodic cross-boarding | Multi-episode schedule management |
| Tallywork | Advanced scheduling calculations (Indie+) |

### MODULE 5: CALL SHEETS

| Feature | Details |
|---------|---------|
| Auto-populate | Weather, locations, cast, crew, parking, nearest hospital |
| Distribution | Email, SMS, online link, PDF download |
| Delivery analytics | Track email delivery, open status, view count, timestamped confirmations |
| Recipient messaging | Send announcements to call sheet recipients (Professional+) |
| Templates | Reusable call sheet templates (Professional+) |
| Custom branding | Company logo and colors (Professional+) |
| Advanced builder | Enhanced layout and field options (Indie+) |
| Advanced PDFs | Custom headers, watermarks (Indie+) |

### MODULE 6: CONTACTS & CREW

| Feature | Details |
|---------|---------|
| Contact database | Detailed profiles for cast, crew, vendors |
| Cross-project transfer | Move contacts between projects |
| Integration | Contacts auto-populate into call sheets, schedules |
| Custom contact lists | Organized groupings (Indie+) |
| Shared inbox | Team messaging hub (Indie+) |

### MODULE 7: PRODUCTION CALENDAR

| Feature | Details |
|---------|---------|
| Custom calendars | Unlimited calendars and groups |
| Event management | Production events, milestones, deadlines |
| Dependencies | Task/event dependencies (Indie+) |
| All project types | Pre-production, production, post-production |

### MODULE 8: TASK MANAGEMENT

| Feature | Details |
|---------|---------|
| Task boards | Kanban-style boards, lists, cards |
| Checklists | Sub-tasks within tasks (Indie+) |
| Attachments | File attachments to tasks (Indie+) |
| Due dates | Deadline tracking |
| Comments | Team collaboration on tasks |
| Unlimited boards | Multiple task boards per project (Professional+) |

### MODULE 9: VISUALIZATION

| Feature | Details |
|---------|---------|
| Mood boards | Collect and share visual inspiration |
| Customizable | Fully customizable layouts |
| Shareable | Share with clients and team |
| Image upload | Add reference images, color palettes |

### MODULE 10: LOCATIONS

| Feature | Details |
|---------|---------|
| Location management | Store location details, photos, contacts |
| Integration | Feeds into call sheets and schedules |
| Maps | Google Maps integration for directions |

### MODULE 11: REPORTING

| Feature | Details |
|---------|---------|
| Breakdown summaries | Overview of all tagged elements |
| Element lists | Filtered by category |
| DOOD reports | Cast day tracking |
| Shooting schedules | Printable schedule reports |
| Script sides | Auto-generated sides in shoot order |

---

## Pricing Structure (as of 2025-2026)

| Plan | Monthly | Annual (per month) | Projects | Storage | Users | Key Additions |
|------|---------|-------------------|----------|---------|-------|---------------|
| **Free** | $0 | $0 | 1 | - | 1 | Limited everything. Call sheets only to self. |
| **Starter** | $49 | $42 | 10 | 50GB | 2 | Unlimited contacts, shot lists, storyboards. Full call sheets. Script import. |
| **Indie** | $99 | $85 | 25 | 75GB | 4 | WGA revisions, advanced breakdowns, image editors, shared inbox, advanced scheduling, watermarks |
| **Professional** | $149 | $127 | Unlimited | 100GB | 6 | Precision timing, episodic org, templates, auto-populated call sheets, unlimited task boards |
| **Agency** | $269 | $229 | Unlimited | - | Team | Multi-team management |
| **Studio** | $399 | $340 | Unlimited | - | Team | Enterprise-level features |
| **Enterprise** | Custom | Custom | Unlimited | Custom | Custom | SSO, dedicated support, custom integrations |

---

## Known Weaknesses (from user reviews)

1. **No mobile app** - web-only, needs internet connection
2. **No undo/redo** in some editors
3. **Poor customer support** - slow response times
4. **No budgeting module** - Celtx has this, StudioBinder does not
5. **No API** - can't integrate with external tools
6. **Limited integrations** - only PDF, CSV, Final Draft, Google Maps
7. **English only** - no multilingual support
8. **No offline mode** - cloud-dependent
9. **Mixed reviews** - 2.7/5 on SaaSWorthy (though better on other platforms)
10. **Browser-only** - no desktop app

---

## GLM Adaptation Strategy

### The Opportunity

StudioBinder charges $49-$399/month and lacks several critical features. GLM can build a production management tool that:
1. Integrates with the existing GLM site (Next.js 16 + Tailwind v4)
2. Serves GLM's own production workflow first
3. Becomes a differentiator for GLM's production company positioning
4. Eventually opens as a SaaS revenue stream

### Phase 1: Internal Production Tools (MVP)

Build these into the existing GLM admin panel first. These directly serve GLM's production business:

**1. Project Dashboard**
- Project cards with status (Pre-production, Production, Post, Complete)
- Client info, dates, budget summary
- Quick links to all project documents

**2. Contact/Crew Database** (already started with CRM)
- Crew profiles: name, role, rate, availability, gear list, portfolio link
- Client profiles: company, contacts, project history
- Tag system: DP, gaffer, grip, sound, PA, etc.
- Cross-project history

**3. Call Sheet Builder**
- Auto-pull from project data (crew, location, times)
- Weather API integration (free: OpenWeatherMap)
- Google Maps for locations
- PDF generation (already have WeasyPrint experience)
- Email/SMS distribution
- Delivery tracking (read receipts)

**4. Shot List / Storyboard**
- Shot specs: size, movement, lens, angle, equipment, notes
- Storyboard image upload
- Aspect ratio selector
- Check-off during production
- PDF export

**5. Production Schedule**
- Calendar view (day, week, timeline)
- Drag-and-drop scheduling
- Crew assignment per day
- Location assignment
- Conflict detection (crew double-booked)

**6. Equipment Tracking** (unique to GLM - ties into rental business)
- Gear assigned per project
- Availability calendar (rental vs. production use)
- Kit lists per shoot day
- Packing/QC checklists

### Phase 2: Enhanced Production Tools

**7. Script Breakdown**
- Upload script (PDF/FDX import)
- Element tagging (props, wardrobe, VFX, etc.)
- Breakdown reports
- DOOD reports

**8. Budget Builder**
- Line-item budget (StudioBinder doesn't have this!)
- Crew rates auto-populated from database
- Equipment rates from GLM inventory
- Markup calculations
- Client-facing vs. internal views
- PDF proposal/estimate generation

**9. Client Portal** (StudioBinder doesn't have this)
- Client login to view: schedule, deliverables, approvals
- Approval workflow: treatments, edits, final delivery
- Comment/feedback system
- File delivery with download tracking

### Phase 3: SaaS Platform

**10. Multi-tenant architecture**
- Other production companies can sign up
- White-label option
- Tiered pricing similar to StudioBinder

### GLM Advantages Over StudioBinder

| Feature | StudioBinder | GLM Version |
|---------|-------------|-------------|
| Budgeting | No | Yes - integrated with crew rates + equipment |
| Client portal | No | Yes - approvals, feedback, delivery |
| Equipment management | No | Yes - tied to rental inventory |
| Offline mode | No | PWA with offline capability |
| Mobile app | No (web only) | PWA, responsive-first |
| API | No | Yes - open API for integrations |
| Estimate/proposal builder | No | Yes - already building this |
| Post-production tracking | Limited | Full: edit rounds, color, sound, delivery |
| AI integration | No | Shot list suggestions, schedule optimization |

### Tech Stack for GLM Production Tools

Already in place:
- **Next.js 16** - App router, server components, API routes
- **Tailwind v4** - Consistent with existing GLM design system
- **TypeScript** - Type safety throughout
- **Vercel** - Hosting, serverless functions, edge
- **SQLite/Turso** or **Supabase** - Database (evaluate based on needs)

Additional needs:
- **PDF generation** - Already have WeasyPrint; could also use @react-pdf/renderer for Next.js native
- **Email** - Resend or SendGrid for call sheet distribution
- **SMS** - Twilio for text notifications
- **File storage** - Vercel Blob or S3 for uploads
- **Auth** - NextAuth.js or Clerk for multi-user access
- **Real-time** - Supabase Realtime or Pusher for collaboration

### Recommended Build Order

1. **Project Dashboard** - Foundation for everything else
2. **Contact/Crew Database** - Extend existing CRM
3. **Call Sheet Builder** - Highest immediate utility on set
4. **Shot List** - Pre-production essential
5. **Production Schedule** - Calendar + crew assignment
6. **Equipment Tracker** - GLM differentiator
7. **Budget Builder** - Revenue-driving feature
8. **Client Portal** - Professional differentiator
9. **Script Breakdown** - Advanced pre-production
10. **SaaS multi-tenancy** - Revenue expansion

---

## Sources

- [StudioBinder Homepage](https://www.studiobinder.com/)
- [StudioBinder Pricing (FindPM)](https://findpmsoftware.com/products/studiobinder)
- [StudioBinder Support - Free Plan](https://support.studiobinder.com/en/articles/1964209-what-s-included-with-the-free-plan)
- [StudioBinder Support - Choosing Plans](https://support.studiobinder.com/en/articles/10106468-choosing-the-right-studiobinder-plan)
- [Peerspace StudioBinder Review](https://www.peerspace.com/resources/studiobinder-production-management-software-review/)
- [ContentCreators StudioBinder Profile](https://contentcreators.com/tools/studiobinder)
- [Celtx vs StudioBinder (Celtx Blog)](https://blog.celtx.com/celtx-vs-studiobinder-comparison/)
- [StudioBinder vs Celtx vs Assemble (Assemble)](https://www.onassemble.com/blog/studiobinders-vs-celtx-vs-assemble)
- [StudioBinder Script Breakdown](https://www.studiobinder.com/script-breakdown-software/)
- [StudioBinder Call Sheet Software](https://www.studiobinder.com/call-sheet-software/)
- [StudioBinder Shot List](https://www.studiobinder.com/shot-list-storyboard/)
- [StudioBinder Production Calendar](https://www.studiobinder.com/production-calendar/)
- [StudioBinder Tech Stack (RocketReach)](https://rocketreach.co/studiobinder-inc-technology-stack_b5a744aaf9221ccb)
- [SetKeeper Production Management](https://www.setkeeper.com/)
