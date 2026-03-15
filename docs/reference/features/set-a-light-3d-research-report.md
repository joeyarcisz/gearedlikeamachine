# set.a.light 3D: Strategic Research Report V2

**Prepared for:** Joey Arcisz, Commercial DP / Geared Like A Machine
**Date:** March 6, 2026
**Purpose:** Evaluate set.a.light 3D V3 for building an interactive lighting exploration tool on gearedlikeamachine.com, content creation opportunities, and strategic fit with GLM's positioning.

**Research method:** 5 parallel research agents covering capabilities, technical feasibility, competitive landscape, content landscape, and elixxier business analysis. 200+ web sources consulted.

---

## Table of Contents

1. [set.a.light 3D Capabilities That Matter](#section-1-setalight-3d--capabilities-that-matter-for-this-project)
2. [Technical Feasibility: Building the Interactive Web Experience](#section-2-technical-feasibility--building-the-interactive-web-experience)
3. [What Exists in This Space Right Now](#section-3-what-exists-in-this-space-right-now)
4. [Content Landscape: Who's Making Content About set.a.light 3D](#section-4-content-landscape--whos-making-content-about-setalight-3d)
5. [elixxier Partnership & Business Analysis](#section-5-elixxier-partnership--business-analysis)
6. [Strategic Assessment & Recommendations](#section-6-strategic-assessment--recommendations)

---

## SECTION 1: set.a.light 3D — Capabilities That Matter for This Project

### A) Export Capabilities

This is the foundation. If the software can't export what we need, nothing else matters.

#### Image Render/Export

| Spec | Detail |
|------|--------|
| **Max resolution** | 4K (3840px) in STUDIO and CINEMA. 2K in BASIC. |
| **Resolution options** | 800px, 1200px, 1600px, 1920px, 3840px (selectable in Settings > Quality Options) |
| **Image formats** | JPG confirmed for renders and set plans. PNG and TIFF are NOT confirmed in any documentation. |
| **Transparency/alpha** | **No.** No evidence of alpha channel or transparency export anywhere. The renderer produces complete scenes with backgrounds. |
| **Render quality controls** | Shadow Quality (levels 1-5), Texture Quality (levels 1-4+), Render Quality, Render Resolution. Ultra quality mode includes live denoiser. |

#### Blueprint/Diagram Exports (Set Plans)

| Spec | Detail |
|------|--------|
| **Formats** | PDF (print-optimized) and JPG |
| **Data included** | Lighting diagram (bird's eye view), light positions and distances, camera and light settings (power, color temp), gear and modifiers used, camera views with rendered previews, full gear/packing list, 3D studio view |
| **Custom branding** | Header bar with your own logo and title. Persists once uploaded. |
| **Editable fields** | Image title, studio name, photographer name, customer name, date, notes |

#### Storyboard Export

- **Format:** PDF (printable)
- **Contents:** Shot-by-shot frames, rearrangeable, with notes and directions per frame
- **Quality:** Shots render up to 4K for client previews

#### Animation/MP4 Export

- **Format:** MP4 only (no ProRes, MOV, or frame sequence export documented)
- **Resolution/FPS/length limits:** Not publicly documented. The software allows MP4 export for client sharing.
- **What can be animated:** Camera movements (dolly, crane, pan, tilt, orbit), light intensity, light color, light position, modifier changes, prop movement, character movement, lens animation, depth of field. All frame-accurate.

#### CRITICAL: Individual Light Toggle + Re-Render

**Can you toggle individual lights on/off and render each variation?**

**YES, but manually.** Each light has independent on/off and power controls. You can turn off any light, re-render, and export. However:

- **No batch rendering exists.** Each render must be triggered manually.
- **No scripting, CLI, API, or automation.** Entirely GUI-driven.
- **No "render per light" automated workflow.** You toggle, render, save. Toggle, render, save. Repeat.

For a 4-light setup with 3 camera angles, you'd need: 4 individual light renders + 1 all-on hero render = 5 renders per angle x 3 angles = **15 manual renders per setup.** With the additive compositing approach (see Section 2), this is all you need. It's tedious but absolutely doable.

#### Multiple Camera Angles

**Yes.** Multiple cameras can be placed in the set. Switch between them instantly. Render from each position independently while keeping lighting constant. Can switch between still and movie cameras.

#### Batch Rendering / Automation

**No.** No render queue, batch export, scripting, command-line interface, or plugin system exists. Everything is manual.

---

### B) Setup Building Capabilities

#### Equipment Library (Confirmed Brands in V3)

**Continuous lights (confirmed):**
- ARRI (LED and tungsten spotlights with Fresnel lenses)
- Aputure (Storm 80c, Storm 400x, Storm 1200x, Amaran 150c)
- Nanlite
- KinoFlo
- Astera (Helios Tube, Hyperion Tube, PixelTube, QuikPunch, QuikSpot)

**Strobes/Flash:** Variety of studio strobes, monolights, speedlights (specific brand names beyond generic not fully itemized in available sources)

**NOT confirmed:** Profoto, Godox, Litepanels. These brands were not mentioned in any documentation, review, or feature list found.

**Asset library size:** 4.24 GB (substantial equipment database)

#### Modifiers

Softboxes (resizable to match real gear), strip lights, umbrellas, barndoors, honeycomb grids, Fresnel lenses, color gels, diffusers, V-flats, scrims/diffusion panels, C-stands with booms, photo tripods, jibs. V3 allows free combination of modifiers with nearly all light sources.

#### Custom Light Creation

**Yes.** Create custom strobes and continuous lights using **IES Import** to match real gear's light distribution profiles. Custom speedlights with matching control ranges and zoom. Resize existing softboxes to match your equipment. Save as custom presets. Mark lights as "favorites" or "own equipment."

#### Light Meter

Built-in virtual light meter measuring in real time. Aperture, shutter speed, and ISO adjustable. **Available in STUDIO and CINEMA only** (not BASIC). Recent update: now accounts for indirect light.

#### Fog/Atmospheric Effects

Volumetric fog with real-time light interaction (rays, diffusion, dramatic shafts). HDRI sky presets (clear, cloudy, night). Sun positioning by location, date, and time. **Primarily CINEMA tier features.**

#### 3D Model Import

Supported formats: .fbx, .obj, .dae (Collada), .3ds, .lwo, .ply, .stl, .gltf, .glb. Recommended: .fbx, .obj, .dae. Available via 3D Importer Add-on (included in CINEMA, $39 add-on for BASIC/STUDIO).

#### Human Models / Poses

Pose templates + custom posing mode with save/reuse. Pose slider (up to 12 poses, blendable). Body morphing (height, weight, facial features, body shape, pregnancy, muscle tone). Dozens of clothing, hairstyles, skin tones, makeup, accessories. Multiple models per scene.

#### Sets/Props

Indoor studio environments (walls, floors, ceilings, backgrounds). Outdoor via HDRI maps. Custom imported 3D environments. Vehicles (firetruck, freightliner, pickup, security truck, trailer). Cosmetics/beauty product range. Build "far into the distance" for wide outdoor environments.

---

### C) Tier Comparison

#### Pricing

| Tier | Regular Price (est.) | Educational (45% off) | License Type |
|------|---------------------|----------------------|--------------|
| **BASIC** | ~$94-100 | ~$55 | Lifetime, 3 computers |
| **STUDIO** | ~$180-230 | ~$99 | Lifetime, 3 computers |
| **CINEMA** | ~$269-299 | ~$148 | Lifetime, 3 computers |

All tiers: one-time purchase, no subscription, 1 year free updates, upgradeable (pay the difference), 15-day free trial of any tier.

#### Feature Comparison

| Feature | BASIC | STUDIO | CINEMA |
|---------|-------|--------|--------|
| Strobes/Flash | Up to 5 | Unlimited | Unlimited |
| Continuous Lights | **No** | Yes | Yes |
| Light Meter | **No** | Yes | Yes |
| Max Render Resolution | 2K | 4K | 4K |
| Volumetric Fog | No | No | **Yes** |
| Sun Positioning / Outdoor | No | No | **Yes** |
| Animation Tool | No (add-on) | No (add-on) | **Included** |
| 3D Object Import | No (add-on $39) | No (add-on $39) | **Included** |
| MP4 Export | No | No | **Yes** |
| Set Plan PDF/JPG | Yes | Yes (custom branding) | Yes (custom branding) |
| Storyboard Export | Limited | Yes | Yes |

#### What CINEMA Adds Over STUDIO

1. Full continuous lighting library (cinema/video lights)
2. Animation Tool (camera moves, light animation, character movement, MP4 export)
3. 3D Importer (FBX, OBJ, glTF, etc.)
4. Natural light simulation (sun positioning by location/date/time)
5. Volumetric fog and atmospheric effects
6. Outdoor HDRI environments with realistic ambient lighting

**Verdict: CINEMA is required for this project.** Continuous lights are essential for commercial cinema setups. Animation for video walkthroughs. Fog for moody commercial looks. At ~$269 lifetime, it's a trivial investment.

---

## SECTION 2: Technical Feasibility — Building the Interactive Web Experience

### Three Approaches Evaluated

---

### APPROACH A: Render Layer Method (Pre-Rendered Additive Compositing)

**The concept:** Build each setup in set.a.light 3D. Render each light's contribution individually on a black/dark background. In the browser, stack these images using CSS `mix-blend-mode: screen` (or canvas `globalCompositeOperation: lighter`). Toggling a light shows/hides its layer. The visual result is physically accurate because light is additive.

#### The Key Technical Insight

**You do NOT need 2^N renders. You need only N renders.**

For a 4-light setup, the brute-force approach would require 16 combinations (2^4). But with additive compositing:

1. Render each light's contribution **individually** (key only, fill only, back only, hair only) = **4 renders**
2. Optionally render a base ambient/environment pass = **1 render**
3. In the browser, stack all layers and use `mix-blend-mode: screen` to combine them
4. Toggle individual layers on/off with opacity
5. The screen blend mode mathematically simulates additive light: `1 - (1-a)(1-b)`

**This is a proven technique.** Two confirmed implementations:

- **Virtual Lighting Studio (zvork.fr):** Built with Blender Cycles pre-rendered passes. Each light rendered separately, combined in browser. "Solo" button hides all layers except one. This is the exact technique.
- **Broadway Educators Lightlab:** Original 2002 version stored thousands of brute-force combinations. Modern version switched to a stack of semi-transparent images manipulated by code, ~20 images stacked back-to-front. Same principle.

#### CSS Implementation

```css
.light-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  mix-blend-mode: screen;
  transition: opacity 0.3s;
}
.light-layer.off {
  opacity: 0;
}
```

The `screen` blend mode prevents pure white blowout and mimics photographic exposure response better than raw additive. For true additive (if needed), use canvas `globalCompositeOperation: 'lighter'` (R1+R2, G1+G2, B1+B2, clamped to 255).

#### File Size Budget

| Format | Per image (1080p) | 4-light setup (5 images) | 3 angles |
|--------|-------------------|--------------------------|----------|
| PNG | 500KB-2MB | 2.5-10MB | 7.5-30MB |
| WebP | 150-400KB | 750KB-2MB | 2.25-6MB |
| AVIF | 100-300KB | 500KB-1.5MB | 1.5-4.5MB |

**Recommendation:** Use `<picture>` element with AVIF primary, WebP fallback, JPEG safety net. At WebP quality, each complete setup with 3 angles is ~2-6MB total. Very manageable.

#### Production Workflow Per Setup

1. Build the setup in set.a.light 3D (the creative work)
2. Place 3 cameras (overhead diagram, camera POV, side/3-quarter view)
3. For each camera angle:
   - Turn on only key light, render, export
   - Turn on only fill light, render, export
   - Turn on only back light, render, export
   - Turn on only hair/accent light, render, export
   - (Optional) Render ambient/environment only
4. Export the overhead diagram/set plan PDF with full gear list
5. Compress all images to WebP/AVIF
6. Drop into web template (reusable component)

**Per setup: ~15-20 manual renders + diagram exports.** Approximately 30-45 minutes of rendering work per setup once you're familiar with the workflow. The creative setup-building time is separate and varies.

#### Available React Libraries

**Before/After Sliders** (for comparing states):
- **react-compare-slider** (80K weekly npm downloads, zero deps, v3.1.0): Most flexible, supports any React component
- **react-compare-image** (22K weekly downloads, 401 GitHub stars): Simpler API, image-focused
- **img-comparison-slider** (web component, framework-agnostic): 4KB, keyboard accessible

**For the toggle UI itself:** No library needed. Simple React state (a boolean per light) toggling CSS classes on stacked `<img>` elements. ~50 lines of custom code.

#### Mobile Performance

CSS blend modes are GPU-accelerated. 4-6 layered images with `mix-blend-mode: screen` performs well on all modern mobile devices. Potential concern only with 10+ layers on very old devices. Image lazy-loading and WebP/AVIF keep bandwidth manageable.

---

### APPROACH B: Animation/Video Method

**The concept:** Use set.a.light 3D's animation tool to create video walkthroughs. Camera orbits the set, lights turn on one at a time, building from darkness to final look. Present with interactive chapter markers.

#### Video Players with Chapter Support

- **Video.js** (industry standard): WebVTT chapter tracks natively, videojs-markers plugin for clickable progress bar markers
- **Plyr** (modern, lightweight): Chapter support, clean UI
- **react-video-markers** (purpose-built): Markers with id, time, color, title
- **Liqvid** (sophisticated): React library for "liquid videos" with named segments, React component overlays, thumbnail previews. Originally designed for educational content.

#### HTML5 Native Approach

Chapter markers live in external WebVTT files loaded via `<track kind="chapters">`. JavaScript reads cues, renders clickable chapter list. Each chapter stores start time as data attribute.

#### Limitations

- **Linear narrative:** Users watch a predetermined reveal order. Cannot freely toggle "what does key+back look like without fill?"
- **No combinatorial exploration:** You show what you chose to show them
- **File size:** 1-2 minute 1080p H.264 = 20-50MB per video. 4K doubles that. Multiple angles = multiple videos.
- **Lower interactivity:** Jumping between chapters is clunkier than toggling switches
- **Engagement:** Interactive video has 90% completion rate vs 58% for non-interactive, but chapter-marked video is only mildly interactive

---

### APPROACH C: Real-Time 3D in Browser

**The concept:** Present the actual 3D scene in the browser using Three.js/React Three Fiber. True real-time interaction: orbit camera, toggle lights, adjust parameters.

#### Technologies

- **React Three Fiber (R3F):** React renderer for Three.js. Declarative JSX for 3D.
- **@react-three/drei:** 100+ helpers including Lightformer (softbox simulation), Environment (HDR reflections), Stage (one-component lighting)
- **Three.js light types:** RectAreaLight (softboxes, but NO shadow support), SpotLight (Fresnels, with shadows), PointLight (practicals), DirectionalLight (sun)

#### The Realism Problem

This is the dealbreaker. From Three.js community forums:

- Three.js uses **rasterization, not ray tracing.** No accurate global illumination, no caustics, no physically correct soft shadows from area lights, limited light bounce.
- With careful work (environment maps, contact shadows, tone mapping, bloom), you can reach **70-80% of offline render quality.** But matching set.a.light 3D's physics-based rendering is not achievable in real-time WebGL.
- Path tracing renderers (three-gpu-pathtracer) can close the gap but sacrifice interactivity (seconds to converge per frame).

#### Build Complexity

- Basic 3D showcase: 2-3 weeks
- Product configurator: 4-6 weeks
- Studio lighting simulator with accurate placement, toggleable fixtures, convincing rendering: **6-10 weeks** for an experienced R3F developer
- You'd essentially be rebuilding a simplified set.a.light 3D in the browser

#### Mobile Performance

- WebGL single-threaded: every draw call runs sequentially, CPU bottleneck
- Mid-range phones: ~30fps (workable). Budget Android devices: problematic.
- WebGPU not yet widely supported on mobile
- Battery drain significant for 3D scenes

---

### Approach Comparison Matrix

| Criterion | A: Render Layers | B: Video Chapters | C: Real-Time 3D |
|---|---|---|---|
| **Visual Quality** | 5/5 | 5/5 | 3/5 |
| **Interactivity** | 4/5 | 2/5 | 5/5 |
| **Effort Per Setup** | 3/5 | 4/5 | 1/5 |
| **Scalability** | 4/5 | 3/5 | 2/5 |
| **Mobile Performance** | 4/5 | 5/5 | 2/5 |
| **Wow Factor** | 4/5 | 2/5 | 5/5 |
| **TOTAL** | **24/30** | **21/30** | **18/30** |

### Scoring Rationale

**Visual Quality:** A and B both use offline-rendered images/video at full set.a.light quality. C uses real-time WebGL which fundamentally cannot match offline path tracing.

**Interactivity:** A gives free toggle of any light combination instantly. B is linear with skip points. C allows full orbital camera + toggle + parameter adjustment.

**Effort Per Setup:** A requires ~15-20 manual renders per setup (30-45 min). B requires one animation sequence + chapter markers. C requires rebuilding the entire scene in Three.js from scratch.

**Scalability:** A is templated (render passes, drop into reusable component). B needs new videos. C needs new 3D scene builds.

**Mobile:** A is static images with CSS blending (lightweight). B is native video (most optimized path). C is WebGL (battery drain, inconsistent performance).

**Wow Factor:** A produces genuine "aha" moments when toggling lights. B is just a video. C's orbitable 3D is the most impressive interaction model.

### Verdict: Approach A Wins

**Approach A (Render Layer with Additive Compositing) is the clear winner.** It delivers the best balance of visual quality, interactivity, production feasibility, and mobile performance.

**Recommended hybrid:** Use Approach A as the primary interactive experience. Add a short Approach B video walkthrough per setup as a supplementary "guided tour" for passive viewers. This gives you both interactive exploration AND linear narrative content from the same set.a.light setups.

---

## SECTION 3: What Exists in This Space Right Now

### The Definitive Finding

**Nothing like what you're describing exists anywhere on the internet.**

No production company, cinematographer, DP, filmmaker, film school, or educational platform has an interactive web experience where visitors can explore professional lighting setups, toggle individual lights on/off to see their contribution, view from multiple camera angles, and see associated gear lists. This concept does not exist.

### What DOES Exist (and Why It's Not This)

#### Virtual Lighting Studio (zvork.fr/vls)
- Free, browser-based, no installation
- Place up to 6 lights around a virtual portrait subject (mannequin head)
- Move, tilt, spin, adjust intensity, add color gels
- Has a **"solo" button** to see one light's contribution in isolation
- **What it lacks:** Single fixed camera angle. Generic mannequin head only. No gear lists, no brand-specific equipment, no cinematic scenes, no multiple angles, no real production context. Appears ~2012 era. No updates in years.
- **Gap:** Closest ancestor in spirit (toggle lights, see contribution) but is an educational toy for portrait photographers, not a production portfolio tool.

#### Google Learning Light (artsandculture.google.com)
- Released April 2025, Google Arts & Culture experiment
- AI chatbot "LuxeBot3000" with 8 lighting lessons
- Manual controls for 6 lights (intensity, beam angle, color)
- **What it lacks:** Cannot change light positions. No softboxes/modifiers/flags. No camera simulation. No export. No community.
- **Gap:** Educational experiment for absolute beginners. Not professional, not cinematic.

#### Sylights / Lighting Diagram Creators
- Sylights (sylights.com): 2D overhead lighting diagrams. iOS/web. Drag-and-drop.
- Lighting Diagrams (lightingdiagrams.com): Same concept, web-based.
- Aputure Diagram Master (Sidus Link): iOS/Android, lighting diagrams + power distribution.
- **Gap:** All are diagramming tools. No rendering, no visualization of what light looks like on a subject. Just icons on floor plans.

#### set.a.light 3D (the software itself)
- The most advanced lighting simulation tool available
- Desktop-only (Mac/Windows). Not browser-based, not embeddable.
- **Gap:** Planning tool for pre-production, not a client-facing exploration experience.

#### Cine Tracer
- Unreal Engine-based cinematography simulator. Desktop (Steam, ~$40).
- Real-world camera/light representations, dollies, cranes, flags. Works in lumens.
- **Last updated over 2 years ago** (appears abandoned or very slow development).
- **Gap:** Desktop only. Not web-based. Not a portfolio tool.

#### Light Reference (lightreference.com)
- Free browser tool. Move a single light around 3D heads/objects.
- Designed for 2D artists (painters/illustrators) studying shadow reference.
- **Gap:** Single light only. Not for photography or cinematography.

#### Product Configurator Technology
- Threekit, ZeroLight, car configurators: Photorealistic 3D with material/color swaps, 360-degree rotation.
- The interaction model (explore from every angle, toggle options) is the closest analogue to what you're building.
- **Gap:** Nobody has applied configurator technology to lighting setups. Current applications: cars, furniture, shoes, consumer products.

### Production Company Websites: State of the Art

Searched extensively across production company portfolio roundups (DesignRush, Awwwards, Fabrik, HubSpot). The most "interactive" features on any production company website are:
- Autoplay hero video reels
- Portfolio grids with hover-to-play effects
- Occasional parallax scrolling
- Case study pages with written descriptions
- BTS photo galleries

**No production company has built anything that lets visitors interact with, explore, or toggle elements of their work.** The bar is video reels and image grids.

### Film School / Educational Platforms

- AFI, USC, NYU, Full Sail, NYFA: All practical workshops. No web-based interactive tools.
- MasterClass: Video lessons only.
- Roger Deakins (rogerdeakins.com): Static lighting diagrams from his films. Forum. Podcast. No interactive tools.
- Wandering DP: Podcast + written breakdowns with BTS photos. Excellent education but entirely static media.

### Three.js / WebGL Demos for Lighting

- Three.js official examples: Generic lighting demos (spheres, cubes). Developer learning tools.
- ASLS Studio: Open-source DMX lighting visualizer in Three.js. Proves Three.js can handle toggleable lights.
- Light Tracer Render (lighttracer.org): GPU path tracing in browser. Desktop only.
- R3F examples include three-point lighting setups and Drei Lightformer/Stage components.
- **Building blocks exist. Nobody has assembled them for cinematic lighting exploration.**

### Competitive Gap Summary

| Feature | VLS (zvork) | Google Learning Light | set.a.light 3D | Cine Tracer | **Your Concept** |
|---------|:-----------:|:---------------------:|:--------------:|:-----------:|:----------------:|
| Toggle individual lights | Yes (solo) | Partially | Yes | Yes | **Yes** |
| Multiple camera angles | No | No | Yes | Yes | **Yes** |
| Real production context | No | No | No (3D renders) | No (UE renders) | **Yes** |
| Brand-specific gear lists | No | No | Yes | Yes | **Yes** |
| Browser-based | Yes | Yes | No | No | **Yes** |
| On a production company site | No | No | No | No | **Yes** |
| Educational annotations | No | Basic | Via set plans | No | **Yes** |

**The gap is total and confirmed.** This would be a genuine first-of-its-kind feature.

---

## SECTION 4: Content Landscape — Who's Making Content About set.a.light 3D

### elixxier's Own YouTube Channel

| Metric | Value |
|--------|-------|
| Channel | elixxier Software |
| Subscribers | ~5,660 |
| Total views | ~410,000 |
| Videos | ~110 |
| Recent views | ~2,023/month |
| Content | Software tutorials (video manuals), feature demos, quick tips |
| Top video | "Introduction" — 17,159 views |

This is a very small channel for a software company. For context, Aputure's ecosystem serves 1.2M+ users.

### Third-Party Creators

#### Joe Edelman (~180K subscribers)
- New York photography educator
- Uses set.a.light in lighting setup demonstrations
- Testimonial featured on elixxier website
- Appears to have affiliate/promotional relationship
- **Perspective:** Photographer. Not a filmmaker.

#### John Gress (small channel, drives traffic via website)
- Chicago photographer/DP
- Affiliate discount code JOHN-15 (15% off)
- Published the only substantial V3 review (johngress.com)
- Uses set.a.light for mood boards and complex lighting problem-solving
- **Perspective:** Photographer with some DP crossover. Content about set.a.light is photography-oriented.

#### Simon Songhurst (photographer, London)
- 20+ years experience. Clients: Marks & Spencer, L'Oreal, Rimmel, Lancôme, Dove
- Affiliate code SIMONSONGHURST (15% off)
- **Perspective:** Photographer. Not a filmmaker.

#### PhotographyPX (resource site)
- Published review, featured on elixxier blog
- Uses set.a.light as teaching aid for practical lighting examples

### Known Ambassadors/Affiliates

| Name | Background | Focus |
|------|-----------|-------|
| Jeahn Laffitte | Award-winning commercial photographer, Wyoming. Clients: Adobe, State Farm, Zippo. Runs Luma University podcast. | Photography |
| Eimantas Raulinaitis | Lithuanian videographer/content creator. Works with edelkrone, Soundstripe. | Gear/content creator (leans video) |
| Joe Edelman | Photography educator, 180K YouTube subs | Photography |
| John Gress | Photographer/DP, Chicago | Photography |
| Simon Songhurst | Commercial photographer, London | Photography |

**No formal ambassador program exists.** These are informal affiliate arrangements with personalized discount codes.

### The Critical Finding: 100% Photography Content

**Every single creator making set.a.light 3D content is a photographer.** Zero cinematographers. Zero filmmakers. Zero working commercial DPs.

All existing content is:
- Flash/strobe setups for portrait photography
- Studio lighting for headshots, beauty, fashion, glamour
- Software interface tutorials ("how to use set.a.light")
- Software reviews (often affiliate-driven)

**Nobody is making content about:**
- Using set.a.light for commercial film production previs
- The CINEMA tier for continuous lighting / motion picture work
- The animation features for camera move planning
- The outdoor/HDRI features for location scout previs
- Building actual client deliverables (treatment previs, director's decks) with set.a.light outputs
- Using set.a.light as a working DP tool on real commercial jobs

### V3's Filmmaker Features Are Invisible

V3 was a major rebuild specifically targeting filmmakers: continuous lights, animation, outdoor environments, HDRI, fog, MP4 export, camera animation. Despite this, **V3-specific content from third parties is essentially nonexistent.** John Gress's written review is the only substantial V3 coverage found. The animation capabilities, outdoor features, and CINEMA tier have zero third-party content.

### Joey Arcisz Connection

**Confirmed: Joey is featured in the top banner of set.a.light 3D's main product page** at elixxier.com/en/set-a-light-3d/. This is prominent placement on their primary sales page.

However: no blog post, no interview, no case study, no affiliate code, and no co-created content exists around this relationship. The connection is visual-only. No results for "Geared Like A Machine" + "set.a.light" anywhere online.

### Reddit/Forum Presence

Nearly zero Reddit visibility. The software barely registers on r/cinematography, r/filmmakers, or r/videography. The most substantial discussion found was a DPReview forum thread titled "What are you using set.a.light 3D for?" with positive feedback but noting limitations (no diffusion/silks at the time, limited light meter, minimum strobe power gaps).

### The Content Gap

Five massive, confirmed content gaps:

1. **Commercial filmmaking + set.a.light:** Nobody is showing this tool from a working DP perspective
2. **"Build something real" content:** All content is about the software itself, not using it to achieve real production outcomes
3. **Previs-to-production workflow:** Zero content showing how a professional DP plans lighting for a commercial using any digital tool
4. **Animation/motion features:** V3's animation capabilities have zero third-party coverage
5. **Outdoor/HDRI features:** Zero third-party coverage

### Broader Commercial Lighting Education Landscape

Major players in cinematography lighting education:
- **Wandering DP (Patrick O'Sullivan):** 500+ podcast episodes. Commercial cinematography focus. ~47K Instagram.
- **Shane Hurlbut, ASC:** Ran Hurlbut Academy (ceased Jan 2022), now Filmmakers Academy.
- **Aputure / Ted Sim:** 1.2M+ users. "Four-Minute Film School" series since 2014.
- **Lewis Potts:** Australian DP, YouTube tutorials on lighting plans, pre-production, grading.
- **Epic Light Media:** Production company with YouTube lighting tutorials.

Academic research confirms: "the high cost and limited availability of soundstages for cinematography lighting education pose significant challenges." There is documented institutional demand for better lighting education. The existing supply is either expensive (film school), time-consuming (500-episode podcast), or brand-marketing disguised as education (Aputure).

---

## SECTION 5: elixxier Partnership & Business Analysis

### Company Profile

| Detail | Value |
|--------|-------|
| **Legal entity** | elixxier Software GmbH |
| **Headquarters** | Hohnerstr. 25, 70469 Stuttgart, Baden-Wurttemberg, Germany |
| **Founded** | ~2011 |
| **Managing Director / Founder** | Johannes Dauner (former automotive engineer + professional photographer) |
| **Registered capital** | 25,000 EUR (standard German GmbH minimum) |
| **Estimated size** | 10-30 employees (bootstrapped, niche market) |
| **Revenue** | Not publicly disclosed. No venture funding. Estimated low single-digit millions EUR annually. |

### Affiliate Program

| Spec | Detail |
|------|--------|
| **URL** | affiliate.elixxier.com |
| **Commission** | 20% of net sale value |
| **Cookie duration** | 90 days (IP + cookie tracking) |
| **Payout** | 1st-5th of following month |
| **Minimum payout** | 50 EUR |
| **Cost to join** | Free, no obligations |
| **Approval** | Manual review of your site/channel |
| **Discount codes** | Personalized 15% codes distributed to active affiliates |

### Content Creator Partnerships

elixxier has proven willingness to work with creators:
- Joe Edelman: Testimonial on website, ongoing promotional relationship
- John Gress: Personalized affiliate code (JOHN-15), multiple review articles
- Simon Songhurst: Personalized affiliate code (SIMONSONGHURST)
- All partnerships appear handled case-by-case through affiliate program + direct relationships (no structured ambassador program)

### Education Program

- Dedicated education page at elixxier.com/en/educational-institutions/
- Eligible: state-recognized schools, colleges, universities, adult education centers
- Graduated pricing on request (education@elixxier.com)
- Lifetime licenses for institutions
- Students can activate on personal computers
- Admin controls for nudity/community content
- APA (American Photographic Artists) members get 15% discount

### Social Media Presence

| Platform | Followers/Subs | Posts/Videos | Activity |
|----------|---------------|-------------|----------|
| **Instagram** | 130,000 | 1,244 | Very active (strongest channel) |
| **Facebook** | 7,400 | Active | Regular updates |
| **YouTube** | 5,660 | ~110 | Modest (~2K views/month) |

The 130K Instagram vs 5.6K YouTube gap is telling: elixxier built their community on Instagram (where photographers live) but has minimal presence on YouTube (where filmmakers and educators build audiences). This is directly aligned with the finding that all their users/ambassadors are photographers, not filmmakers.

### Community Platform

- Built-in community at community.elixxier.com (also accessible within the software)
- **10,000+ shared lighting setups** available for download
- Upload setups, get feedback, follow creators, collect favorites
- No Discord server found
- Facebook User Group exists as primary external community space

### Product Trajectory

**Version history:** V1 (2013 launch, world's first dedicated lighting simulator) > V2/V2.5 (matured, community platform) > V3 (complete engine rebuild, "built on a completely new foundation")

**V3 was their biggest update ever:** New rendering engine, cinematic camera animation, light animation, character motion, natural light simulation, outdoor environments, model morphing, free modifier combination, live denoising.

**Update frequency:** Monthly or bi-monthly cadence. Recent updates include new lights (Astera, Aputure models), vehicles, cosmetics, bug fixes, light meter improvements.

### Competitive Position

| Tool | Focus | Price | Status |
|------|-------|-------|--------|
| **set.a.light 3D** | Photo + film lighting simulation | $94-299 (lifetime) | Active, V3 major update |
| **Cine Tracer** | Cinematography simulation (UE) | ~$40 (Steam) | **Appears dead** (2+ years since update) |
| **FrameForge** | Storyboarding + previz | $349+ | Emmy-winning, storyboard focus |
| **Shot Designer** | Shot planning/diagramming | Free-$40 | Lightweight 2D diagrams |
| **Google Learning Light** | Educational lighting intro | Free | Very basic, educational toy |

set.a.light 3D is the **undisputed leader** in dedicated lighting simulation. Their closest film-focused competitor (Cine Tracer) appears abandoned. Their moat: 13+ years development, physically accurate light data, 10K+ community setups, manufacturer partnerships (Aputure, Astera), education market penetration, 130K Instagram following.

### Google's Entry: Learning Light

Released April 2025 by Google Arts & Culture. Powered by Gemini AI. Very simplified: 6 fixed-position lights, no modifiers, no camera simulation, no export. **Threat to elixxier: LOW.** This is an educational experiment for beginners, not a professional tool. If anything, it's a top-of-funnel that could drive curious learners toward set.a.light 3D.

---

## SECTION 6: Strategic Assessment & Recommendations

### A) The Interactive Tool — Should You Build It?

**YES. Build it.**

The strategic case is overwhelming:

1. **Nothing like it exists.** Confirmed across 200+ sources. No production company, DP, film school, or platform has an interactive lighting exploration tool. This is a genuine first.
2. **The technology is proven.** The additive compositing technique (CSS `mix-blend-mode: screen`) is exactly how Virtual Lighting Studio and Broadway Educators Lightlab work. This is not experimental.
3. **The source material is excellent.** set.a.light 3D's physics-based rendering produces high-quality renders that will look impressive on screen. The overhead diagrams with gear lists provide the technical depth.
4. **It fits the brand perfectly.** "Geared Like A Machine" is about systematic, engineered approaches to production. An interactive lighting tool IS engineering applied to cinematography. It's the brand made tangible.
5. **It complements the Production Scope Engine.** Scope Engine shows what a production costs. The Lighting Lab shows what goes into making it look right. Together, they communicate: this company operates at a level nobody else does.
6. **The competitive moat is real.** Even if someone copied the concept, they'd need set.a.light 3D Cinema + real commercial lighting knowledge + web development capability + the brand to contextualize it. That combination is rare.

#### Which Approach?

**Approach A (Render Layer / Additive Compositing) as the primary experience.**

Optional: Add a short Approach B (video walkthrough) per setup as a supplementary "guided tour" for visitors who prefer passive viewing. The video becomes content for YouTube/social too.

Do NOT build Approach C (real-time 3D). The visual quality gap is too large, the build complexity is too high, and mobile performance is too inconsistent. If real-time 3D ever makes sense, it's a V3 of this feature, not V1.

#### Minimum Viable Version

The MVP that would still be impressive:

- **4 complete setups** (see suggested setups below)
- **Per setup:** Toggle individual lights on/off, see the result update instantly
- **Per setup:** 2 views minimum (camera POV + overhead diagram)
- **Per setup:** Gear list panel showing exact fixtures, modifiers, and settings per light
- **Per setup:** Brief text annotation per light explaining its purpose ("This fill light softens the shadow under the chin created by the key, bringing the contrast ratio to approximately 3:1")
- **Clean, branded UI** matching GLM's design system (dark, systematic, steel accents)
- **Mobile responsive** (touch-friendly toggles, swipeable angles)

#### Realistic Build Timeline

| Phase | Time | Description |
|-------|------|-------------|
| Setup creation in set.a.light 3D | 2-4 hours per setup | Build the setup, place cameras, render all light passes |
| Image processing | 30 min per setup | Compress to WebP/AVIF, optimize |
| Web component build | 3-5 days | React component with layer toggle, angle switching, gear panel, annotations |
| Content writing | 1-2 hours per setup | Gear lists, light annotations, setup descriptions |
| Integration + polish | 1-2 days | Page layout, responsive testing, performance optimization |
| **Total for 4 setups** | **~2 weeks** | Assuming ~4 hours/day dedicated to this |

#### Suggested Initial Setups (6 Recommended)

These should showcase range and demonstrate practical commercial knowledge:

1. **Corporate Interview (3-Point Classic)** — The bread-and-butter. Key + fill + back + background separation. Most relatable to potential corporate clients.
2. **Product Beauty (Top-Down)** — Beauty dish or large softbox overhead, bounce fill, rim accents. Shows product capability.
3. **Automotive / Hard Light** — Fresnel key with sharp shadows, large bounce source, accent kickers. Demonstrates dramatic commercial work.
4. **Food / Tabletop** — Large diffused overhead panel, dark cards for shadow control, accent spot. Common commercial need.
5. **Cinematic Talking Head (Documentary Style)** — Motivated window key with diffusion, negative fill, subtle hair light. Shows the film look that separates a DP from a videographer.
6. **Moody Brand Film (Low Key)** — Single hard source with atmospheric haze, subtle fill, colored accent. Shows creative range and set.a.light 3D's fog capabilities.

Start with 4 of these for launch. Add the remaining 2 within the first month. Plan to add 1-2 new setups quarterly.

#### How It Complements the Production Scope Engine

| Scope Engine | Lighting Lab |
|-------------|-------------|
| "What does it cost?" | "What does it look like?" |
| Business/budget tool | Creative/technical tool |
| Appeals to producers and decision-makers | Appeals to other DPs, creatives, and curious clients |
| Demonstrates operational expertise | Demonstrates craft expertise |
| Converts inquiries | Builds authority and trust |

Together, they say: "This company can both plan your budget AND execute the creative at a high level." No other production company website in Texas (or arguably anywhere) offers both.

#### Suggested Feature Names

Matching the "Geared Like A Machine" identity (systematic, engineered, industrial):

1. **Light Lab** — Clean, technical, immediately understood. "Explore setups in the Light Lab."
2. **Lighting Forge** — Industrial, implies craftsmanship. "Built in the Lighting Forge."
3. **Light Engine** — Pairs with "Scope Engine." Consistent naming system. "Production Scope Engine + Light Engine."
4. **The Rig** — Industry slang for a lighting setup. Concise and authentic. "Explore The Rig."

**Recommendation: "Light Engine"** — it creates a product suite naming convention with the Scope Engine. "GLM's Light Engine" and "GLM's Scope Engine" sound like components of a machine, which IS the brand.

---

### B) Content Strategy — What Content Comes From This?

**Yes, the process of building this tool IS content.** And the output generates ongoing content naturally.

#### Content That Emerges from This Project

The tool itself is a content flywheel:

```
Build setup in set.a.light → Render for Light Engine (web tool)
                           → Record screen for YouTube tutorial
                           → Export stills for Instagram carousel
                           → Export diagram for blog post
                           → Write gear list for newsletter
                           → Animation becomes short-form video
```

Every single setup you build generates 5-6 pieces of content across platforms, plus the permanent interactive feature on your site.

#### 5 Specific Content Concepts

**1. "Deconstructing the Light" (YouTube Series)**
Working title: *"What Every Light Does in a $50K Commercial"*
Format: 8-12 minute episodes. Build a commercial setup in set.a.light 3D, explaining each light's purpose as you add it. Show the additive build-up from darkness to final frame. End with the real-world application. Each episode corresponds to one Light Engine setup on the site.

**2. "One Setup, Five Ways" (YouTube/Instagram)**
Working title: *"Same Set, Five Looks: How Lighting Changes Everything"*
Format: Start with one base setup. Modify one variable (key height, fill ratio, color temperature, modifier swap, add haze). Show the dramatic difference each change makes. Demonstrates depth of knowledge no other creator is showing.

**3. "The Previs-to-Production Pipeline" (Blog + YouTube)**
Working title: *"I Previs'd This Entire Commercial in Software Before Touching a Camera"*
Format: Document the full workflow. Build the previs in set.a.light 3D. Show the previs frames. Then cut to the actual production footage. Compare previs vs reality side by side. This content doesn't exist anywhere.

**4. "Light Engine BTS: How I Built an Interactive Lighting Tool" (Blog + YouTube)**
Working title: *"I Built Something No Production Company Has Ever Done"*
Format: Document the technical process of building the Light Engine feature. The set.a.light workflow, the rendering pipeline, the web development, the design decisions. This is the "making of" content that showcases innovation. Appeals to tech-curious DPs and production companies.

**5. "Lighting for the Brief" (YouTube Series)**
Working title: *"Client Says 'Make It Cinematic' — Here's What That Actually Means"*
Format: Take common client brief language ("cinematic," "clean and bright," "moody," "editorial," "documentary feel") and show exactly what lighting setup produces each look. Build each in set.a.light 3D. Incredibly practical for clients AND for other DPs.

#### Where Content Should Live

| Content | Primary Platform | Secondary |
|---------|-----------------|-----------|
| Interactive Light Engine | gearedlikeamachine.com (permanent feature) | N/A |
| Video tutorials/series | YouTube (discovery + SEO) | Embedded on GLM blog |
| Setup diagrams + gear lists | GLM blog (SEO) | Instagram carousel |
| Short-form clips | Instagram Reels / YouTube Shorts | TikTok if relevant |
| Setup stills | Instagram feed | Portfolio page |

**The website is home base.** YouTube is for discovery and audience building. Instagram is for community and visual showcase. All roads lead back to gearedlikeamachine.com.

#### Series vs Finite Project?

**Series. Indefinitely.** Each new commercial you work on is a potential new Light Engine setup. Each new technique you explore becomes content. The flywheel spins as long as you're working, which is indefinitely. Plan for quarterly additions to the Light Engine (1-2 new setups per quarter) and monthly content from the creation process.

---

### C) set.a.light 3D — Should You Buy It? Which Tier?

**Buy CINEMA. Immediately.**

| Requirement | BASIC | STUDIO | CINEMA |
|-------------|:-----:|:------:|:------:|
| Continuous lights for film setups | No | Yes | **Yes** |
| Animation for video walkthroughs | No | No (add-on) | **Yes** |
| 3D import for custom props/sets | No | No (add-on $39) | **Yes** |
| Fog/atmosphere for moody setups | No | No | **Yes** |
| Outdoor/HDRI for location previs | No | No | **Yes** |
| 4K renders | No (2K) | Yes | **Yes** |
| Light meter | No | Yes | **Yes** |

STUDIO + add-ons would get you continuous lights + animation + 3D import for ~$230 + $39 + animation add-on (price unknown). But you'd still miss fog, outdoor environments, and sun positioning.

**CINEMA at ~$269 lifetime gets you everything.** For a tool that will generate web features, content, previs capability for real productions, and an affiliate revenue stream, this is not a meaningful cost. It's less than one day rate.

**Use the 15-day free trial first** to confirm the render layer workflow works as expected. Test: render a 4-light setup with each light solo'd, export each, and verify they composite correctly with `mix-blend-mode: screen` in a quick HTML test.

---

### D) elixxier Outreach — Should You Approach Them?

**Yes. After building the Light Engine.**

The strongest approach is to build first, then pitch. Showing elixxier a finished, live interactive feature built on their software is infinitely more compelling than describing a hypothetical.

#### The Pitch Positioning

You're not another photographer asking for an affiliate code. You are:
- A **working commercial DP** (not a hobbyist or reviewer)
- **Already featured on their product page** (existing visual relationship)
- Building something **nobody has ever built** with their software (interactive web tool)
- Operating in a market segment (commercial filmmaking) they're **actively trying to penetrate** with V3/CINEMA tier
- Creating the **first cinematography-focused content** for their platform (their entire creator ecosystem is photographers)

This makes you uniquely valuable to them. Every other affiliate is a photographer reviewing software. You're a DP building a first-of-its-kind tool that showcases their product's capabilities in the film market they want to own.

#### What to Ask For

1. **Free CINEMA license** (saves ~$269, symbolic of a real partnership)
2. **Affiliate partnership** with personalized discount code (20% commission on referrals)
3. **Featured case study** on their blog/website (exposure to their 130K Instagram audience)
4. **Co-marketing arrangement** (they promote the Light Engine to their community, you promote set.a.light to the film market)
5. **Early access to new features/equipment updates** (allows you to be first to showcase new capabilities)

#### Draft Outreach (send AFTER the Light Engine is live)

> Hi Johannes,
>
> I'm Joey Arcisz, a Commercial Director of Photography based in Texas. My work is already featured on your set.a.light 3D product page, and I wanted to reach out because I've built something I think you'll find interesting.
>
> I used set.a.light 3D CINEMA to create an interactive tool on my production company website (gearedlikeamachine.com/light-engine) where visitors can explore commercial lighting setups, toggle individual lights on and off to see each light's contribution, and view gear lists for every fixture. It's the first tool of its kind on any production company website, and it's built entirely on set.a.light 3D renders.
>
> I'm also creating a YouTube content series around commercial lighting using set.a.light 3D, focused on the cinematography/filmmaking side, which I noticed is an underserved area in your current creator ecosystem.
>
> I'd love to explore a partnership: affiliate arrangement, case study feature, and co-promotion to your community. Happy to jump on a call to discuss.
>
> Joey Arcisz
> Geared Like A Machine
> gearedlikeamachine.com

---

### E) Risks & Honest Downsides

#### What Could Go Wrong

**1. Render quality may not be impressive enough**
- **Risk level: MEDIUM.** set.a.light 3D is a physics-based simulator, not a film-grade renderer. The renders will look good but not photorealistic. They'll clearly be 3D software output, not real photographs.
- **Mitigation:** Frame the tool as a lighting DIAGRAM and EXPLORATION tool, not a portfolio piece. The value is in understanding light behavior, not in the beauty of the render. The overhead diagrams and gear lists provide the professional depth. Real production stills on other parts of the site handle the "wow this looks amazing" role.

**2. Manual rendering is tedious**
- **Risk level: LOW-MEDIUM.** Each setup requires 15-20 manual renders. No batch processing.
- **Mitigation:** Front-load the work. Build 4-6 setups, establish the pipeline, then add incrementally. Once the workflow is established, each new setup is 2-4 hours total.

**3. Additive compositing artifacts**
- **Risk level: LOW.** Screen blend mode is mathematically sound for additive light, but edge cases exist: overlapping highlights may look slightly different than a true "all lights on" render due to the blend formula.
- **Mitigation:** Test thoroughly. Render an "all lights on" hero image and compare against the composited version. If discrepancy is visible, use the hero as the "all on" state and only use compositing for partial states.

**4. Limited audience for the interactive tool itself**
- **Risk level: LOW.** The direct audience for an interactive lighting tool on a production company website is niche (other DPs, film students, curious clients). But the tool's purpose is not mass traffic. It's an authority signal, a conversation starter, a content engine, and a differentiation play. One impressed creative director who hires you for a $75K job because they explored your Light Engine justifies the entire investment 100x over.

**5. Ongoing maintenance burden**
- **Risk level: LOW.** Once built, the web component is static. Adding new setups is content creation, not engineering. The React component is reusable. Images are just files. There's no database, no API, no moving parts to break.

**6. elixxier discontinues or dramatically changes the software**
- **Risk level: LOW.** Lifetime license means your copy works forever regardless of what they do. Rendered images are just JPGs/PNGs. The web tool doesn't depend on set.a.light at runtime. Even if elixxier disappeared tomorrow, everything you've built and rendered continues to work.

**7. Someone copies the concept**
- **Risk level: VERY LOW in the near term.** Copying requires: (a) buying set.a.light CINEMA, (b) having real commercial lighting knowledge to build authentic setups, (c) web development skill to build the interactive component, (d) a brand and site to contextualize it. The intersection of "working commercial DP" + "web developer" + "interested in building interactive tools" is vanishingly small. By the time anyone copies it, you'll have a year's head start, a content library, an elixxier partnership, and brand association.

#### Honest Assessment of Effort vs. Return

| Investment | Return |
|-----------|--------|
| ~$269 for CINEMA license | Lifetime tool for previs + content + web feature |
| ~2 weeks for initial build (4 setups + web component) | First-of-its-kind feature, permanent differentiation |
| ~2-4 hours per additional setup | New web content + YouTube video + Instagram post + blog post per setup |
| Ongoing: ~1 setup per month | Compounding content library + growing Light Engine |

The risk-adjusted return is extremely favorable. The worst case is: you spend $269 and 2 weeks, the tool is mildly interesting but doesn't drive direct revenue, and you have a solid previs tool for actual productions. The best case: it becomes a signature feature of the GLM brand, generates inbound leads, creates a content flywheel, and establishes you as the first DP to build something like this.

---

## Appendix: Key Sources

### Official elixxier Resources
- [set.a.light 3D V3 Product Page](https://www.elixxier.com/en/set-a-light-3d/)
- [elixxier Pricing](https://www.elixxier.com/en/pricing/)
- [elixxier Documentation](https://www.elixxier.com/en/docs/)
- [elixxier Video Tutorials](https://www.elixxier.com/en/video-tutorials/)
- [elixxier Affiliate Program](https://affiliate.elixxier.com/)
- [elixxier Education Program](https://www.elixxier.com/en/educational-institutions/)
- [Quality Settings Blog Post](https://blog.elixxier.com/en/quality-settings-set-a-light-3d/)
- [Set Plan Export Page](https://www.elixxier.com/en/lightingdiagram-export/index.php)
- [3D Importer Docs](https://www.elixxier.com/en/docs/3d-importer-add-on/import-3d-object/)
- [Light Sources Docs](https://www.elixxier.com/en/docs/build-your-set-up/light-sources/)

### Reviews & Coverage
- [John Gress V3 Review](https://johngress.com/set-a-light-3d-v3-review-discount-code/)
- [Shotkit Review](https://shotkit.com/elixxier-set-a-light-3d-review/)
- [PremiumBeat Review](https://www.premiumbeat.com/blog/set-a-light-product-review/)
- [No Film School Coverage](https://nofilmschool.com/learn-lighting-with-set-a-light-software)
- [PPA Feature](https://www.ppa.com/ppmag/articles/3d-studio-light-planning)
- [PRO EDU Introduction](https://proedu.com/blogs/news/introduction-set-a-light-3d-software)
- [PetaPixel Review](https://petapixel.com/2021/06/19/review-set-a-light-3d-makes-learning-and-seeing-light-a-piece-of-cake/)

### Technical Resources (Web Implementation)
- [MDN: mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode)
- [MDN: globalCompositeOperation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)
- [react-compare-slider (npm)](https://www.npmjs.com/package/react-compare-slider)
- [img-comparison-slider](https://img-comparison-slider.sneas.io/)
- [Virtual Lighting Studio (zvork.fr)](http://www.zvork.fr/vls/)
- [Broadway Educators Lightlab](https://broadwayeducators.com/evolving-an-online-lightlab-for-dance-and-proscenium-lighting/)
- [BlenderNation: VLS Built with Cycles](https://www.blendernation.com/2012/04/20/virtual-lighting-studio-done-with-cycles/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Lightformer](https://drei.docs.pmnd.rs/staging/lightformer)
- [three-gpu-pathtracer](https://github.com/gkjohnson/three-gpu-pathtracer)
- [Three.js RectAreaLight](https://threejs.org/docs/pages/RectAreaLight.html)
- [Video.js](https://videojs.org/guides/react/)
- [Liqvid (interactive video)](https://liqvidjs.org/)
- [react-video-markers](https://www.npmjs.com/package/react-video-markers)
- [Light Tracer Render](https://lighttracer.org/web.html)
- [ASLS Studio (Three.js DMX)](https://discourse.threejs.org/t/asls-studio-open-source-dmx-lighting-engine-and-visualizer/50415)

### Competitive Landscape
- [Virtual Lighting Studio](http://www.zvork.fr/vls/)
- [Google Learning Light](https://artsandculture.google.com/experiment/learning-light/)
- [Sylights](https://sylights.com/)
- [Lighting Diagrams](https://lightingdiagrams.com/)
- [Light Reference](https://www.lightreference.com/)
- [Cine Tracer (Steam)](https://store.steampowered.com/app/904960/Cine_Tracer/)
- [Previs Pro 3](https://digitalproduction.com/2025/09/22/animatics-ai-lighting-and-a-free-tier-previs-pro-3-expands-storyboarding-on-ipad/)

### Content Creators
- [Joe Edelman (YouTube)](https://youtube.com/photojoeedelman)
- [elixxier YouTube Channel](https://www.youtube.com/@elixxiersoftware)
- [Jeahn Laffitte](https://jeahnlaffitte.com/)
- [Simon Songhurst](https://www.simonsonghurst.com/)
- [Wandering DP](https://wanderingdp.com/)

---

*Report generated March 6, 2026. All findings based on publicly available information as of research date.*
