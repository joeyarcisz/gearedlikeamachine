# GLM — Geared Like A Machine

## Critical Rules

- **Use "GLM" in all client-facing text** — never "GLAM"
- **No em dashes** in emails, messages, or client-facing copy. Use commas or restructure.
- **Say "prep day"** — never "pre-vis day"
- **Production company voice** — site reads as a full production company, not a solo operator. Use "the company" not "I." No personal photos of Joey in production galleries.
- **Do not edit `.env` files** — environment variables are managed on Vercel. Never commit secrets.
- **Do not edit `prisma/migrations/`** — migrations are generated, not hand-written.
- **Do not edit `package-lock.json`** — let npm manage it.

## Project Overview

Texas-based production company + equipment rental business. Two lanes: premium gear rentals and video production services. Admin panel with CRM, production management, and scope calculator.

## Tech Stack

- **Framework**: Next.js 16 (App Router, no `src/` directory)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (inline theme in `globals.css`, no config file)
- **Database**: PostgreSQL via Neon, Prisma 7 with `@prisma/adapter-pg`
- **Email**: Resend
- **Auth**: bcryptjs + httpOnly cookie sessions (`glm_admin_token`)
- **Hosting**: Vercel (auto-deploys on push to `main`)
- **Fonts**: Rajdhani 700 (headings), Inter 400 (body)

## Architecture

```
app/
  (admin-auth)/    # Login page (public, excluded from middleware)
  admin/           # Protected admin dashboard
    contacts/      # CRM contacts
    crew/          # Crew member management
    pipeline/      # Sales pipeline / opportunities
    production/    # Projects, call sheets, shot lists, schedule
  api/             # API routes
    admin/         # Login/logout
    crm/           # Contacts, crew, opportunities, activities
    production/    # Projects, schedule with crew/equipment assignments
    discovery/     # Public discovery form
    scope-lead/    # Scope calculator lead capture
  blog/            # Markdown blog ([slug] routing)
  discovery/       # Public discovery form page
  rentals/         # Equipment rental catalog
  scope/           # Instant estimate wizard
  work/            # Portfolio
components/        # Shared UI components
  admin/           # Admin-specific (AdminShell, etc.)
  scope/           # Scope wizard steps
content/blog/      # Markdown blog posts (frontmatter: title, date, excerpt, category, tags, featured, draft)
lib/               # Core logic
  admin-auth.ts    # Session validation/creation/deletion
  blog.ts          # Markdown parsing with gray-matter + remark
  crm-types.ts     # CRM TypeScript interfaces
  data.ts          # Static site config, nav links, portfolio items
  inventory.ts     # Rental gear catalog (static array)
  prisma.ts        # Prisma client singleton
  production-types.ts  # Production system interfaces
  scope-*.ts       # Scope calculator (types, pricing tables, calculations, summary)
prisma/
  schema.prisma    # 15 models, 5 enums
  seed.ts          # Database seeding
  migrations/      # Auto-generated, do not edit
```

## Key Patterns

### API Routes

All protected API routes follow this pattern:

```typescript
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// 1. Auth check
const cookieStore = await cookies();
const token = cookieStore.get("glm_admin_token")?.value;
if (!token || !(await validateAdminSession(token))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// 2. Validate input (POST/PUT/PATCH)
// 3. Prisma query
// 4. logActivity() on mutations
// 5. Return NextResponse.json(data, { status })
```

Error responses: 401 (unauthorized), 400 (validation), 500 (server error).

### Components

- **Server components** (default): Pages, layouts, data fetching
- **Client components** (`"use client"`): Forms, interactive dashboards, anything with state
- Forms use `useState` + `fetch()` pattern, not Server Actions
- Status pattern: `"idle" | "sending" | "sent" | "error"`
- Icons are custom SVG components in `components/icons.tsx`

### Authentication

- Middleware at `middleware.ts` protects `/admin/*` and `/api/crm/*`
- Public exceptions: `/admin/login`, `/api/admin/login`
- Session stored in `AdminSession` Prisma model
- Cookie: `glm_admin_token` (httpOnly, 30-day expiry)
- Password hash in `ADMIN_PASSWORD_HASH` env var (Vercel only)

### Prisma

- Singleton in `lib/prisma.ts` with global cache in development
- Uses `@prisma/adapter-pg` for Neon connection pooling
- Always run `npx prisma generate` after schema changes
- Build script: `prisma generate && next build`

### Tailwind v4

Theme tokens defined in `globals.css` via `@theme inline`:
- Colors: `black` (#0A0A0A), `navy` (#1B1C1B), `steel` (#E0E0E0), `chrome` (#999), `muted` (#707070), `card` (#0F0F0F), `card-border` (#303030)
- Fonts: `font-heading` (Rajdhani), `font-body` (Inter)
- No `tailwind.config.ts` needed

### Static Data

- Rental inventory: `lib/inventory.ts` — typed array of `{ id, category, item, rate }`
- Site config: `lib/data.ts` — branding, nav, portfolio items
- Scope pricing: `lib/scope-pricing.ts` — rate tables, crew packages, gear tiers

### Blog

- Markdown files in `content/blog/`, filename = slug
- Frontmatter parsed by gray-matter
- Posts with `draft: true` are filtered out
- Rendered with remark + remark-html

## Database Models

Contact, Opportunity, Activity, CrewMember, Project, CallSheet, CrewCall, ShotList, Shot, ScheduleDay, ScheduleCrewAssignment, ScheduleEquipmentAssignment, ProjectCrew, ProjectEquipment, AdminSession

## Environment Variables

- `POSTGRES_PRISMA_URL` — Neon connection string (used by Prisma adapter)
- `DATABASE_URL` — Direct database URL
- `ADMIN_PASSWORD_HASH` — bcrypt hash for admin login
- `RESEND_API_KEY` — Email sending (if configured)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate && next build
npm run lint         # ESLint
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma migrate dev --name <name>  # Create new migration
npx prisma db push   # Push schema without migration (dev only)
npx tsx prisma/seed.ts  # Seed database
```

## Deploy

Push to `main` triggers Vercel auto-deploy. Always run `npm run build` locally first to catch errors.
