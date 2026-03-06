/* ──────────────────────────────────────────────
   Scope & Instant Estimate — Pricing & Constants
   ────────────────────────────────────────────── */

import type {
  ProjectType,
  ScopeFormat,
  VideoDuration,
  Platform,
  AspectRatio,
  CrewRole,
  CrewPackage,
  GearSelections,
  SpecializedGear,
  EditingComplexity,
  ColorGradeTier,
  SoundDesignTier,
  MotionGraphicsTier,
  MusicLicenseTier,
  UrgencyTier,
} from "./scope-types";

/* ── Display Options (for UI) ── */

export const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "commercial", label: "Commercial" },
  { value: "brand-film", label: "Brand Film" },
  { value: "social-media", label: "Social Media Content" },
  { value: "corporate", label: "Corporate / Internal" },
  { value: "documentary", label: "Documentary" },
  { value: "event", label: "Event Coverage" },
  { value: "product-demo", label: "Product Demo" },
  { value: "music-video", label: "Music Video" },
  { value: "testimonial", label: "Testimonial / Case Study" },
  { value: "training", label: "Training / Educational" },
];

export const SCOPE_FORMATS: { value: ScopeFormat; label: string; description: string }[] = [
  { value: "single", label: "Single Video", description: "One finished deliverable" },
  { value: "series", label: "Video Series", description: "Multiple related videos" },
  { value: "campaign", label: "Campaign (Multi-Format)", description: "Multi-platform assets" },
  { value: "retainer", label: "Ongoing Retainer", description: "Recurring content production" },
];

export const DURATIONS: { value: VideoDuration; label: string; minutes: number }[] = [
  { value: "under-30s", label: "Under 30 seconds", minutes: 0.5 },
  { value: "30s-60s", label: "30–60 seconds", minutes: 0.75 },
  { value: "1-2min", label: "1–2 minutes", minutes: 1.5 },
  { value: "2-5min", label: "2–5 minutes", minutes: 3.5 },
  { value: "5-10min", label: "5–10 minutes", minutes: 7.5 },
  { value: "10-30min", label: "10–30 minutes", minutes: 20 },
  { value: "30-plus", label: "30+ minutes", minutes: 35 },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X" },
  { value: "website", label: "Website" },
  { value: "broadcast", label: "Broadcast TV" },
  { value: "streaming", label: "Streaming" },
  { value: "internal", label: "Internal" },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "9:16", label: "9:16 (Vertical)" },
  { value: "1:1", label: "1:1 (Square)" },
  { value: "4:5", label: "4:5 (Portrait)" },
];

export const CREW_ROLES: { value: CrewRole; label: string }[] = [
  { value: "director", label: "Director" },
  { value: "dp", label: "Director of Photography" },
  { value: "camera-op", label: "Camera Operator" },
  { value: "first-ac", label: "1st AC" },
  { value: "gaffer", label: "Gaffer" },
  { value: "key-grip", label: "Key Grip" },
  { value: "ge-swing", label: "G&E Swing" },
  { value: "sound-mixer", label: "Sound Mixer" },
  { value: "makeup-hair", label: "Makeup / Hair" },
  { value: "pa", label: "Production Assistant" },
  { value: "producer", label: "Producer" },
  { value: "teleprompter-op", label: "Teleprompter Operator" },
  { value: "drone-op", label: "Drone Operator" },
];

export const CREW_PACKAGES: Record<CrewPackage, { label: string; roles: CrewRole[] }> = {
  lean: {
    label: "Lean",
    roles: ["dp", "sound-mixer", "pa"],
  },
  standard: {
    label: "Standard",
    roles: ["director", "dp", "camera-op", "gaffer", "sound-mixer", "pa", "producer"],
  },
  full: {
    label: "Full Production",
    roles: [
      "director", "dp", "camera-op", "first-ac", "gaffer", "key-grip",
      "ge-swing", "sound-mixer", "makeup-hair", "pa", "producer",
      "teleprompter-op", "drone-op",
    ],
  },
};

export const CREW_DAY_RATES: Record<CrewRole, number> = {
  director: 2000,
  dp: 1500,
  "camera-op": 750,
  "first-ac": 650,
  gaffer: 850,
  "key-grip": 800,
  "ge-swing": 450,
  "sound-mixer": 850,
  "makeup-hair": 650,
  pa: 250,
  producer: 1200,
  "teleprompter-op": 450,
  "drone-op": 1500,
};

/* ── Gear ── */

type GearKey = keyof GearSelections;

export const GEAR_OPTIONS: Record<GearKey, { value: string; label: string; rate: number; description: string }[]> = {
  camera: [
    { value: "standard", label: "Standard", rate: 300, description: "Mirrorless (FX3, Z cam)" },
    { value: "cinema", label: "Cinema", rate: 550, description: "RED Komodo, ARRI Amira" },
    { value: "premium-cinema", label: "Premium Cinema", rate: 900, description: "V-Raptor, Alexa Mini" },
  ],
  lenses: [
    { value: "standard", label: "Standard", rate: 150, description: "Photo zooms" },
    { value: "cinema-primes", label: "Cinema Primes", rate: 400, description: "Cine-glass prime set" },
    { value: "anamorphic", label: "Anamorphic", rate: 600, description: "Anamorphic lens set" },
  ],
  lighting: [
    { value: "basic", label: "Basic", rate: 200, description: "2-3 LED panels" },
    { value: "standard", label: "Standard", rate: 400, description: "4-6 lights + modifiers" },
    { value: "full-production", label: "Full Production", rate: 1000, description: "Full lighting package + HMI" },
  ],
  audio: [
    { value: "basic-lav", label: "Basic Lav", rate: 100, description: "Wireless lav kit" },
    { value: "standard", label: "Standard", rate: 250, description: "Mixer + boom + wireless" },
    { value: "broadcast", label: "Broadcast", rate: 500, description: "Multi-track, IFB, comms" },
  ],
  grip: [
    { value: "none", label: "None", rate: 0, description: "" },
    { value: "basic", label: "Basic", rate: 200, description: "C-stands, flags, basic rigging" },
    { value: "full-van", label: "Full Van", rate: 600, description: "Grip van + full package" },
  ],
  drone: [
    { value: "none", label: "None", rate: 0, description: "" },
    { value: "standard", label: "Standard", rate: 350, description: "Mavic-class aircraft" },
    { value: "cinema-grade", label: "Cinema-Grade", rate: 2500, description: "Inspire 3 / Alta (operated)" },
  ],
};

export const GEAR_CATEGORY_LABELS: Record<GearKey, string> = {
  camera: "Camera",
  lenses: "Lenses",
  lighting: "Lighting",
  audio: "Audio",
  grip: "Grip",
  drone: "Drone",
};

export const SPECIALIZED_GEAR: { value: SpecializedGear; label: string; rate: number }[] = [
  { value: "car-mount", label: "Car Mount", rate: 200 },
  { value: "underwater", label: "Underwater Housing", rate: 500 },
  { value: "crane", label: "Crane / Jib", rate: 300 },
  { value: "dolly-track", label: "Dolly + Track", rate: 200 },
  { value: "slider", label: "Slider", rate: 75 },
  { value: "easyrig", label: "Easyrig", rate: 175 },
  { value: "segway", label: "Segway", rate: 75 },
  { value: "monitor-15", label: '15" Monitor', rate: 100 },
  { value: "wireless-video", label: "Wireless Video", rate: 200 },
];

/* ── Pre-Production ── */

export const PRE_PRODUCTION_RATES: Record<string, Record<ScopeFormat, number>> = {
  "Creative Strategy": { single: 750, series: 1200, campaign: 1800, retainer: 1000 },
  "Scripting": { single: 750, series: 1500, campaign: 2000, retainer: 1000 },
  "Storyboarding": { single: 500, series: 800, campaign: 1200, retainer: 600 },
  "Production Planning": { single: 500, series: 900, campaign: 1200, retainer: 700 },
  "Casting / Coordination": { single: 350, series: 500, campaign: 700, retainer: 400 },
};

// Location scouting is per-location
export const LOCATION_SCOUTING_RATES: Record<ScopeFormat, number> = {
  single: 350,
  series: 500,
  campaign: 600,
  retainer: 400,
};

/* ── Post-Production ── */

export const EDITING_TIERS: { value: EditingComplexity; label: string; dayRate: number; daysPerMinute: number; description: string }[] = [
  { value: "straightforward", label: "Straightforward", dayRate: 500, daysPerMinute: 0.5, description: "Simple cuts, social content" },
  { value: "standard", label: "Standard", dayRate: 800, daysPerMinute: 1, description: "Multi-cam, interviews, B-roll" },
  { value: "complex", label: "Complex", dayRate: 1200, daysPerMinute: 1.5, description: "Heavy storytelling, VFX integration" },
  { value: "premium", label: "Premium", dayRate: 1500, daysPerMinute: 2.5, description: "Broadcast, multi-format deliverables" },
];

export const COLOR_TIERS: { value: ColorGradeTier; label: string; perVideo: number; description: string }[] = [
  { value: "none", label: "None", perVideo: 0, description: "" },
  { value: "basic", label: "Basic Color", perVideo: 400, description: "Balanced, clean look" },
  { value: "cinematic", label: "Cinematic", perVideo: 800, description: "Custom look, scene-by-scene" },
  { value: "film-emulation", label: "Film Emulation", perVideo: 1200, description: "Film stock emulation, show-level" },
];

export const SOUND_TIERS: { value: SoundDesignTier; label: string; perVideo: number; description: string }[] = [
  { value: "none", label: "None", perVideo: 0, description: "" },
  { value: "basic", label: "Basic Mix", perVideo: 300, description: "Levels, noise reduction, mix" },
  { value: "full-design", label: "Full Design", perVideo: 750, description: "SFX, foley, layered mix" },
  { value: "broadcast", label: "Broadcast Mix", perVideo: 1200, description: "Broadcast-spec, loudness standards" },
];

export const MOTION_TIERS: { value: MotionGraphicsTier; label: string; perVideo: number; description: string }[] = [
  { value: "none", label: "None", perVideo: 0, description: "" },
  { value: "lower-thirds", label: "Lower Thirds", perVideo: 400, description: "Titles, name supers, end cards" },
  { value: "moderate", label: "Moderate", perVideo: 1000, description: "Animated graphics, transitions" },
  { value: "heavy", label: "Heavy Motion Design", perVideo: 2500, description: "Full motion design, 3D elements" },
];

export const MUSIC_TIERS: { value: MusicLicenseTier; label: string; perVideo: number; isPerProject?: boolean; description: string }[] = [
  { value: "none", label: "None", perVideo: 0, description: "" },
  { value: "stock", label: "Stock Music", perVideo: 150, description: "Licensed library track" },
  { value: "premium", label: "Premium License", perVideo: 500, description: "Exclusive or curated track" },
  { value: "custom-score", label: "Custom Score", perVideo: 3000, isPerProject: true, description: "Original composition" },
];

export const URGENCY_TIERS: { value: UrgencyTier; label: string; multiplier: number; description: string }[] = [
  { value: "flexible", label: "Flexible (-5%)", multiplier: 0.95, description: "No rush — we'll schedule at availability" },
  { value: "standard", label: "Standard", multiplier: 1.0, description: "Typical production timeline" },
  { value: "expedited", label: "Expedited (+15%)", multiplier: 1.15, description: "Faster turnaround, priority scheduling" },
  { value: "rush", label: "Rush (+30%)", multiplier: 1.30, description: "Immediate priority, compressed timeline" },
];

/* ── Additional Costs ── */

export const TRAVEL_RATE_PER_CREW_DAY = 350;
export const EXTRA_LOCATION_RATE = 300;
export const TALENT_DAY_RATE = 500;
export const CAPTION_BASE_RATE = 200;
export const CAPTION_ADDITIONAL_LANGUAGE_RATE = 150;
export const CUTDOWN_RATE = 250;
export const ADDITIONAL_REVISION_RATE = 350;
export const BASE_REVISION_ROUNDS = 2;
export const CONTINGENCY_RATE = 0.10;
export const DEPOSIT_RATE = 0.50;
