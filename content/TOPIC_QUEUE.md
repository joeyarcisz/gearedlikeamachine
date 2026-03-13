# Blog Topic Queue

Production-intel agent pulls the next `ready` topic, researches it, and drafts a post with `draft: true`. Joey reviews and publishes.

## Status Key
- `ready` — Researched enough to write. Next in line.
- `needs-research` — Topic identified but needs deep research before drafting.
- `in-progress` — Agent is currently drafting.
- `drafted` — Draft exists in `content/blog/`. Awaiting Joey's review.
- `published` — Live on site.
- `parked` — Deprioritized. Revisit later.

---

## SEO Priority (DFW keyword targets)

| # | Topic | Category | Target Keywords | Status |
|---|-------|----------|----------------|--------|
| 1 | What Does a Director of Photography Actually Do? | Business | dallas DP, cinematographer dallas, director of photography | drafted — `what-does-a-director-of-photography-actually-do.md` |
| 2 | How Much Does Video Production Cost in Dallas? | Business | video production cost dallas, commercial video pricing texas | ready |
| 3 | Equipment Rental Guide for Dallas Productions | Business | camera rental dallas, equipment rental dfw, production gear rental | ready |

## Cinematography Systems (extending existing content lane)

| # | Topic | Category | Concept | Status |
|---|-------|----------|---------|--------|
| 4 | Color Temperature as a Storytelling Tool | Cinematography | Kelvin scale as emotional language, warm/cool contrast, mixed sources as tension | needs-research |
| 5 | Lens Choice Is a Character Decision | Cinematography | Focal length = emotional distance. Wide = vulnerability, long = compression/isolation. Anamorphic vs spherical psychology | needs-research |
| 6 | The Grip Truck Is a Lighting Instrument | Cinematography | Negative fill, bounce, diffusion, flags. The subtractive side of lighting most people ignore | needs-research |
| 7 | Motivated Lighting: Every Source Needs a Reason | Cinematography | Practicals, windows, screens as motivation. Unmotivated light reads as fake | needs-research |
| 8 | Sound Design Starts on Set | Filmmaking | Production audio as foundation, room tone, wild lines, the DP's role in protecting audio | needs-research |
| 9 | Pre-Production Is Where You Win or Lose | Filmmaking | Shotlists, tech scouts, storyboards, blocking diagrams. The prep that separates pros from amateurs | needs-research |
| 10 | The One-Light Interview Setup | Cinematography | Single source + neg fill + background separation. Maximum result from minimum gear. The setup Joey uses most | needs-research |

## Business & Industry (extending pricing/business lane)

| # | Topic | Category | Concept | Status |
|---|-------|----------|---------|--------|
| 11 | Why Your Production Company Needs an Equipment Package | Business | Owner-operator advantage, margin on gear, client perception, the math of owning vs renting | needs-research |
| 12 | The Producer's Guide to Hiring a DP | Business | What to look for, red flags, how reels lie, questions to ask, day rate vs project rate | needs-research |
| 13 | Retainers Beat Project Work | Business | Monthly content days, predictable revenue, client retention, how to pitch and price them | needs-research |
| 14 | What Clients Actually Care About (It Is Not Your Camera) | Business | Reliability, communication, problem-solving, delivery speed. The soft skills that win repeat business | needs-research |
| 15 | Building a Crew You Can Trust | Business | Vetting process, day rate expectations, when to upgrade crew, the gaffer relationship | needs-research |

## Content to Add Later (Joey: drop new topics here)

| # | Topic | Category | Notes | Status |
|---|-------|----------|-------|--------|
| | | | | |

---

## Rules for the Production-Intel Agent

1. Pick the lowest-numbered `ready` topic. If none are `ready`, pick the lowest `needs-research` topic, research it first, then draft.
2. Write the draft to `content/blog/` in the GLM repo with `draft: true` in frontmatter.
3. Follow the blog style guide in memory (`blog-content-style-guide.md`) exactly.
4. After drafting, update this file: change status to `drafted` and add the filename.
5. **Every post MUST have an interactive companion.** Build a standalone HTML file at `public/interactive/[slug].html`. Read an existing interactive for reference (e.g., `public/interactive/four-bucket-exposure-system.html`). Match the quality: dark theme, custom fonts, animations, educational interactivity. Add `interactive: "/interactive/[slug].html"` to the post frontmatter.
6. **Generate a distribution kit** alongside each post. Save to `content/blog/drafts/[slug]-distribution.md` with: email subject line, email body (3-4 sentences), Instagram caption, LinkedIn post copy, and 3 tweet options.
7. One post per cycle. Quality over quantity.
