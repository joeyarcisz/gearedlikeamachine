# Geared Like A Machine — Brand Design Guidelines

**Version 1.0 — March 2026**
**Prepared for internal use and vendor handoff**

---

## 1. Brand Overview

### Who We Are

Geared Like A Machine (GLM) is a premium cinematic video production company based in Texas, operating globally. We create high-impact still and motion content for brands and organizations of every scale.

### Positioning

GLM occupies the **emerging-premium tier** in the DFW production market. We are not a budget shop. We are not a legacy agency. We are an operator-led production machine that scales to scope: one-day social shoots or six-week campaigns.

### Brand Metaphor

**Industrial precision.** The entire brand identity — name, logo, language, visual system — draws from mechanical engineering. Gears, machines, blueprints, calibrated systems. Every piece of content is "engineered" and "machined to spec." This is not decoration. It is the organizing principle of the brand.

### Core Tagline

> **Engineered to Move Audiences**

### Brand Descriptor

> For more than two decades, brands and organizations of every scale have trusted us to create high-impact still and motion content. Based in Texas, working globally.

---

## 2. Brand Voice & Tone

### Personality

GLM speaks like a senior operator who has done this hundreds of times. Confident without arrogance. Technical without jargon overload. Direct without being curt.

### Voice Attributes

| Attribute | Description |
|---|---|
| **Direct** | Short declarative sentences. Lead with the point. No preamble. |
| **Precision-focused** | Specifics over generalities. Numbers, formats, deliverables. |
| **Mechanical** | Industrial metaphors are native: "engineered," "machined," "calibrated," "throttle," "deploy." |
| **Confident** | We state capability as fact. "We build narratives that move audiences." Not "We strive to..." |
| **Human** | Despite the industrial language, we are not robotic. Occasional wit. Never cold. |

### Words We Use

`engineered` · `machined` · `precision` · `execute` · `deploy` · `calibrated` · `operator` · `vetted` · `locked in` · `built to spec` · `no filler` · `elastic` · `throttle up` · `outcome-driven` · `format agnostic` · `deep bench`

### Words We Avoid

`synergy` · `leverage` (as a verb) · `circle back` · `touch base` · `disrupting` · `revolutionary` · `world-class` · `best-in-class` · `passionate` · `storytellers` (as a self-description) · `creative agency` · `content creators`

### Punctuation Rules

- **Never use em dashes** in client-facing text. Use commas, periods, or restructure the sentence.
- Favor periods over semicolons.
- Use the Oxford comma.

### Copy Examples

**Service description (correct tone):**
> Platform-native vertical and horizontal content built to stop the scroll. Reels, TikToks, YouTube Shorts — all captured at cinema-grade quality with formats engineered for each algorithm.

**CTA (correct tone):**
> Put Us to Work. Tell us what you're building and we'll engineer the production to match. No filler. Just execution.

**Process step (correct tone):**
> Concept, script, storyboard, shot list, and production logistics — all engineered before a single camera rolls. No guesswork.

---

## 3. Logo Usage

### Primary Mark

The GLM logo is a **gear icon with an embedded play triangle**, rendered as an inline SVG. It always appears alongside the wordmark "GEARED LIKE A MACHINE."

**Icon specifications:**
- ViewBox: `0 0 48 48`
- Outer gear ring: circle at center (24, 24), radius 14px, stroke 4px, no fill
- 8 gear teeth: 8x7px rectangles with 1px border-radius, positioned at 45-degree intervals
- Play triangle: polygon at points `20,16 20,32 34,24` (right-pointing, centered in gear)
- Color: inherits `currentColor` (typically steel `#E0E0E0`)

### Wordmark

- Font: Rajdhani Bold
- Case: ALL UPPERCASE
- Letter spacing: `0.2em`
- Size: `text-lg` (mobile) / `text-xl` (desktop)

### Clear Space

Maintain a minimum clear space equal to the width of one gear tooth (approximately 8px at standard size) on all sides of the logo mark.

### Acceptable Color Variations

| Variation | Logo Color | Background |
|---|---|---|
| **Primary** | Steel `#E0E0E0` | Black `#0A0A0A` |
| **Reversed** | Black `#0A0A0A` | White `#F0F0F0` |
| **Monochrome light** | White `#FFFFFF` | Dark background |
| **Monochrome dark** | Black `#000000` | Light background |

### Logo Don'ts

- Do not fill the gear with a solid color
- Do not rotate the logo mark
- Do not separate the icon from the wordmark in primary usage
- Do not change the play triangle to a different shape
- Do not add drop shadows, gradients, or effects
- Do not use colors outside the approved palette
- Do not stretch or distort the aspect ratio

### Secondary Decorative Elements

Two additional SVG elements exist for layout decoration only:

- **GearDecoration**: Large 12-tooth gear (120x120 viewBox) with spokes. Used as low-opacity background element. Never used as the primary logo.
- **MechanicalDivider**: Horizontal rule with centered gear accent. Used as section dividers.

---

## 4. Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| **Black** | `#0A0A0A` | `--color-black` | Page background, primary surface |
| **Navy** | `#131313` | `--color-navy` | Elevated surfaces, card tints |
| **Steel** | `#E0E0E0` | `--color-steel` | Primary accent, CTAs, logo, headings |
| **White** | `#F0F0F0` | `--color-white` | Primary text color |

### Secondary Colors

| Name | Hex | CSS Variable | Usage |
|---|---|---|---|
| **Chrome** | `#999999` | `--color-chrome` | Secondary text, subtle borders |
| **Muted** | `#707070` | `--color-muted` | Tertiary text, labels, timestamps |
| **Card** | `#0F0F0F` | `--color-card` | Card backgrounds |
| **Card Border** | `#2A2A2A` | `--color-card-border` | Borders, dividers, separators |

### Opacity Variants (commonly used)

| Token | Value | Usage |
|---|---|---|
| `black/75` – `black/95` | Overlay darkening | Image overlays, modal backdrops |
| `navy/20` – `navy/60` | Tinted backgrounds | Hover states, card fills |
| `steel/10` – `steel/80` | Light accents | Subtle highlights, text emphasis |
| `chrome/30` | Subtle borders | Secondary border treatment |

### Status / Functional Colors

| Purpose | Color | Context |
|---|---|---|
| Availability indicator | `rgba(34, 197, 94, 0.7)` | Green pulse dot (status active) |
| Error / destructive | Red tones (contextual) | Form validation only |

### Print Overrides

For printed materials, the palette inverts:
- Background: `#FFFFFF`
- Primary text: `#000000`
- Gray tones: `#1F2937`, `#111827`, `#374151`

### Color Hierarchy

The palette is intentionally monochromatic. There is **no brand color** in the traditional sense (no blue, no red, no orange). The identity lives in the contrast between near-black surfaces and steel/chrome metallic tones. This is deliberate: the work (video, photography) provides all the color. The brand frame stays neutral.

---

## 5. Typography

### Primary Typeface — Rajdhani

**Role:** Headings, navigation, buttons, labels, display text

| Property | Value |
|---|---|
| Source | Google Fonts |
| Classification | Geometric sans-serif (Devanagari + Latin) |
| Weights used | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) |
| CSS variable | `--font-rajdhani` |
| Default case | UPPERCASE |

Rajdhani's angular, mechanical letterforms directly reinforce the industrial brand metaphor. It reads as technical and engineered without being cold.

### Secondary Typeface — Inter

**Role:** Body copy, paragraphs, form inputs, descriptive text

| Property | Value |
|---|---|
| Source | Google Fonts |
| Classification | Humanist sans-serif |
| Weights used | 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold) |
| CSS variable | `--font-inter` |
| Default case | Sentence case |

Inter provides maximum readability at all sizes, balancing Rajdhani's angular personality with clean neutrality.

### Type Scale

| Element | Size (mobile) | Size (desktop) | Weight | Font | Tracking |
|---|---|---|---|---|---|
| Hero H1 | `text-4xl` (36px) | `text-7xl` (80px) | Bold (700) | Rajdhani | `-0.05em` (leading: 0.95) |
| Section H2 | `text-3xl` (30px) | `text-4xl` (36px) | Bold (700) | Rajdhani | `wide` |
| Card heading | `text-xl` (20px) | `text-3xl` (30px) | Bold (700) | Rajdhani | — |
| Section kicker | `text-xs` (12px) | `text-xs` (12px) | Semibold (600) | Rajdhani | `0.3em` |
| Body copy | `text-base` (16px) | `text-lg` (18px) | Regular (400) | Inter | — |
| Button text | `text-sm` (14px) | `text-sm` (14px) | Semibold (600) | Rajdhani | `widest` (0.15em) |
| Small label | `text-[10px]` | `text-xs` (12px) | Medium (500) | Rajdhani | `widest` |
| Footer text | `text-sm` (14px) | `text-sm` (14px) | Regular (400) | Inter | — |

### Typography Rules

1. **Headings are always uppercase** — Rajdhani in uppercase is the brand's typographic signature.
2. **Body copy is always sentence case** — Inter handles readability.
3. **Never use italic** — The brand voice is assertive and direct. Italics suggest hesitation.
4. **Letter spacing increases as size decreases** — Large headings use tight/default tracking. Small labels use wide/widest tracking.
5. **Line height tightens for display sizes** — Hero text uses `leading-[0.95]`. Body uses `leading-relaxed` (1.625).

---

## 6. Imagery & Visual Style

### Image Philosophy

The work IS the visual identity. GLM's role is to frame the work, not compete with it. Backgrounds are dark. Overlays are subtle. The images carry all the color and energy.

### Photographic Style

| Attribute | Guideline |
|---|---|
| **Lighting** | Cinematic. Motivated sources. Natural light preferred for outdoor; controlled, moody light for studio/set. No flat corporate lighting. |
| **Color** | Rich, graded. The look of finished production work, not behind-the-scenes phone snaps. |
| **Subject matter** | Camera systems, production crews at work, finished frames from projects, talent on set. Never stock photography. |
| **Composition** | Cinematic aspect ratios preferred (2.39:1, 16:9). Center-weighted or rule-of-thirds. Negative space is welcome. |
| **Mood** | Confident, controlled, focused. Not chaotic. Not sterile. The energy of a well-run set. |

### Image Treatment on Site

| Treatment | CSS | Context |
|---|---|---|
| **Default state** | `grayscale` filter | Portfolio tiles, background images |
| **Hover state** | `grayscale-0`, `scale-105` | Reveals full color on interaction |
| **Dark overlay** | `bg-gradient-to-t from-black/80 to-transparent` | Text legibility over images |
| **Film grain** | SVG turbulence at `opacity: 0.06`, `mix-blend-mode: overlay` | Applied globally across entire page |
| **Side textures** | `filter: invert(1) grayscale(1)`, `opacity: 0.12` | Decorative edge treatments |

### Video Usage

- Inline `<video>` elements: always `autoPlay`, `loop`, `muted`, `playsInline`
- Object fit: `object-cover`
- Decorative videos use low opacity (20-30%) and grayscale filter
- Hero/showreel videos use full color with subtle dark overlay

### Aspect Ratios

| Context | Ratio |
|---|---|
| Hero video | `3:4` (mobile), `4:5` (tablet), `3:4` (desktop) |
| Showreel embed | `16:9` |
| Portfolio tiles | ~`1:1` (200px auto-rows) |
| Featured work cards | Fixed `h-48` (192px) |

### Image File Conventions

- `/public/portfolio-[project].gif` — Portfolio grid thumbnails
- `/public/[project]/featured.jpg` — Hero image for project pages
- `/public/[project]/[asset].jpg|gif` — Individual production stills

---

## 7. Layout & Spacing Principles

### Grid Philosophy

GLM uses **constraint-based layouts**. Content never stretches to full viewport width. Every section is bounded by a max-width container with consistent horizontal padding.

### Max-Width System

| Width | Tailwind | Pixel Value | Usage |
|---|---|---|---|
| **Wide** | `max-w-7xl` | 1280px | Hero sections, primary content |
| **Standard** | `max-w-6xl` | 1024px | Services, portfolio, process, footer |
| **Narrow** | `max-w-4xl` | 896px | CTA sections, focused content |
| **Text** | `max-w-2xl` | 672px | Form containers, text-only blocks |
| **Paragraph** | `max-w-xl` | 576px | Single descriptive paragraphs |

### Horizontal Padding (responsive)

| Breakpoint | Padding | Pixels |
|---|---|---|
| Mobile (default) | `px-4` | 16px |
| Small (640px+) | `px-6` | 24px |
| Large (1024px+) | `px-8` | 32px |

### Section Spacing

| Type | Padding | Pixels |
|---|---|---|
| Standard section | `py-20 sm:py-28` | 80px / 112px |
| Compact section | `py-16` | 64px |
| Tight section | `py-8` | 32px |
| Hero top | `pt-28 sm:pt-32 lg:pt-40` | 112px / 128px / 160px |

### Grid Patterns

**Bento Grid (Portfolio):**
- Desktop: 4 columns, variable row spans creating an asymmetric mosaic
- Mobile: 2 columns, uniform squares
- Gap: `gap-2` (8px)

**Three-Column Info:**
- Desktop: `grid-cols-[80px_1fr_1.2fr]` — number badge, title, description
- Mobile: stacked vertically

**Two-Column Feature:**
- Desktop: `grid-cols-2 gap-12`
- Mobile: stacked with left border accent

### Card Patterns

Cards use **borders as primary visual weight**, not shadows or elevation.

```
Background: navy/30 (#131313 at 30% opacity) or card (#0F0F0F)
Border: 1px solid card-border (#2A2A2A)
Padding: p-6 (24px) to p-8 (32px)
Border-radius: none (sharp corners by default)
```

### Whitespace Philosophy

Whitespace is generous and intentional. It reinforces the precision of the brand: every element is placed with purpose, never crowded. When in doubt, add more space, not less.

### Breakpoints

| Name | Width | Usage |
|---|---|---|
| Mobile | 0px+ | Base/default styles |
| `sm` | 640px+ | Tablet portrait, minor adjustments |
| `md` | 768px+ | Tablet landscape, grid activation |
| `lg` | 1024px+ | Desktop, full grid layouts |
| `xl` | 1280px+ | Wide desktop, max-width caps |

---

## 8. Component Reference

### Buttons

**Primary (solid):**
```
bg-steel text-black px-8 py-3.5
text-sm uppercase tracking-widest font-semibold
hover:bg-steel/80
transition-all duration-300
```

**Secondary (outline):**
```
border border-chrome/30 text-white px-8 py-3.5
text-sm uppercase tracking-widest font-semibold
hover:border-steel hover:text-steel
transition-all duration-300
```

### Navigation

- Fixed position, transparent by default
- On scroll: `bg-black/90 backdrop-blur-md border-b border-card-border`
- Links: `text-sm uppercase tracking-widest text-muted hover:text-white`
- Mobile: hamburger menu at `lg` breakpoint, full-height sidebar

### Footer

- Three-column grid on desktop, stacked on mobile
- Top border: `border-t border-card-border`
- Logo + tagline left, navigation center, contact right

### Animations

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Fade-in-up | 800ms | ease-out | Page load (hero elements) |
| Scroll fade | 700ms | ease-out | Scroll into viewport |
| Marquee | 30s | linear, infinite | Always running (ticker) |
| Gear spin | 25-30s | linear, infinite | Always running (decorative) |
| Hover transitions | 300ms | default | User interaction |
| Image reveal | 500ms | default | Hover (grayscale removal + scale) |

---

## 9. Do's and Don'ts

### Do

- Use the monochromatic palette. Let the work provide color.
- Keep headings uppercase in Rajdhani.
- Use mechanical/industrial language naturally.
- Maintain generous whitespace between sections.
- Apply grayscale-to-color hover treatment on portfolio imagery.
- Use borders (not shadows) for visual hierarchy.
- Keep copy short, direct, and specific.
- Reference the film grain overlay on digital surfaces.

### Don't

- Add brand colors (blue, red, orange, etc.) to the palette.
- Use drop shadows on cards or buttons.
- Use italic text anywhere in the brand system.
- Use rounded corners on cards (sharp edges only).
- Write in passive voice or hedging language ("We strive to..." "We aim to...").
- Use stock photography. Every image should be from real GLM production work.
- Use the acronym "GLAM" in any client-facing material. Always "GLM."
- Use em dashes in client-facing communications.
- Overcrowd layouts. When in doubt, add space.
- Use the GearDecoration SVG as a logo substitute.

---

## 10. File Reference

| Asset | Location |
|---|---|
| Logo SVG component | `/components/icons.tsx` → `GearPlayLogo` |
| Gear decoration SVG | `/components/icons.tsx` → `GearDecoration` |
| Section divider SVG | `/components/icons.tsx` → `MechanicalDivider` |
| Color variables | `/app/globals.css` → `@theme inline` block |
| Font configuration | `/app/layout.tsx` → Google Fonts imports |
| Tailwind config | `/app/globals.css` (Tailwind v4, no separate config file) |
| Portfolio images | `/public/portfolio-*.gif`, `/public/[project]/` |
| OG image | `/public/og-image.png` |

---

*This document was generated from the live codebase at `/Users/jeanclawd/geared-like-a-machine/` on March 6, 2026. Specs marked as inferred should be reviewed and confirmed by the brand owner.*
