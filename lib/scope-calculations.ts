/* ──────────────────────────────────────────────
   Scope & Instant Estimate — Calculation Engine
   ────────────────────────────────────────────── */

import type {
  ScopeInput,
  EstimateBreakdown,
  LineItem,
  ScopeFormat,
} from "./scope-types";

import {
  PRE_PRODUCTION_RATES,
  LOCATION_SCOUTING_RATES,
  CREW_DAY_RATES,
  GEAR_OPTIONS,
  GEAR_CATEGORY_LABELS,
  SPECIALIZED_GEAR,
  DURATIONS,
  EDITING_TIERS,
  COLOR_TIERS,
  SOUND_TIERS,
  MOTION_TIERS,
  MUSIC_TIERS,
  URGENCY_TIERS,
  TRAVEL_RATE_PER_CREW_DAY,
  EXTRA_LOCATION_RATE,
  TALENT_DAY_RATE,
  CAPTION_BASE_RATE,
  CAPTION_ADDITIONAL_LANGUAGE_RATE,
  CUTDOWN_RATE,
  ADDITIONAL_REVISION_RATE,
  BASE_REVISION_ROUNDS,
  CONTINGENCY_RATE,
  DEPOSIT_RATE,
  CREW_ROLES,
} from "./scope-pricing";

function fmt(name: string): string {
  return name;
}

const MAX_EDIT_DAYS = 120;

export function calculateEstimate(input: ScopeInput): EstimateBreakdown {
  const items: LineItem[] = [];
  const warnings: string[] = [];
  const format: ScopeFormat = input.projectType.scopeFormat ?? "single";
  const { videoCount, duration, cutdownsPerVideo } = input.deliverables;
  const { shootDays, locations, crewRoles, gear, specializedGear } = input.production;

  /* ── 1. Pre-Production ── */
  for (const [itemName, rates] of Object.entries(PRE_PRODUCTION_RATES)) {
    const price = rates[format];
    items.push({
      name: fmt(itemName),
      category: "Pre-Production",
      quantity: 1,
      unit: "project",
      unitPrice: price,
      total: price,
    });
  }

  // Location scouting (per location)
  if (locations > 0) {
    const rate = LOCATION_SCOUTING_RATES[format];
    items.push({
      name: "Location Scouting",
      category: "Pre-Production",
      quantity: locations,
      unit: "location",
      unitPrice: rate,
      total: rate * locations,
    });
  }

  /* ── 2. Crew ── */
  for (const role of crewRoles) {
    const rate = CREW_DAY_RATES[role];
    const roleLabel = CREW_ROLES.find((r) => r.value === role)?.label ?? role;
    items.push({
      name: roleLabel,
      category: "Crew",
      quantity: shootDays,
      unit: "day",
      unitPrice: rate,
      total: rate * shootDays,
    });
  }

  /* ── 3. Gear ── */
  const gearKeys = Object.keys(gear) as (keyof typeof gear)[];
  for (const key of gearKeys) {
    const selected = gear[key];
    const options = GEAR_OPTIONS[key];
    const option = options.find((o) => o.value === selected);
    if (option && option.rate > 0) {
      items.push({
        name: `${GEAR_CATEGORY_LABELS[key]} — ${option.label}`,
        category: "Gear",
        quantity: shootDays,
        unit: "day",
        unitPrice: option.rate,
        total: option.rate * shootDays,
      });
    }
  }

  // Specialized gear
  for (const sg of specializedGear) {
    const spec = SPECIALIZED_GEAR.find((s) => s.value === sg);
    if (spec) {
      items.push({
        name: spec.label,
        category: "Gear",
        quantity: shootDays,
        unit: "day",
        unitPrice: spec.rate,
        total: spec.rate * shootDays,
      });
    }
  }

  /* ── 4. Post-Production ── */
  // Editing
  const durationMeta = DURATIONS.find((d) => d.value === duration);
  const minutesPerVideo = durationMeta?.minutes ?? 2;
  const totalFinishedMinutes = minutesPerVideo * videoCount;
  const editTier = EDITING_TIERS.find((t) => t.value === input.postProduction.editingComplexity);
  if (editTier) {
    const rawEditDays = Math.ceil(totalFinishedMinutes * editTier.daysPerMinute);
    const editDays = Math.max(1, Math.min(MAX_EDIT_DAYS, rawEditDays));
    if (rawEditDays > MAX_EDIT_DAYS) {
      warnings.push(`Editing days were capped at ${MAX_EDIT_DAYS} (calculated ${rawEditDays}). The actual cost for this scope may be higher — contact us for a custom quote.`);
    }
    items.push({
      name: `Editing — ${editTier.label}`,
      category: "Post-Production",
      quantity: editDays,
      unit: "day",
      unitPrice: editTier.dayRate,
      total: editTier.dayRate * editDays,
    });
  }

  // Color grading
  const colorTier = COLOR_TIERS.find((t) => t.value === input.postProduction.colorGrade);
  if (colorTier && colorTier.perVideo > 0) {
    items.push({
      name: `Color Grading — ${colorTier.label}`,
      category: "Post-Production",
      quantity: videoCount,
      unit: "video",
      unitPrice: colorTier.perVideo,
      total: colorTier.perVideo * videoCount,
    });
  }

  // Sound design
  const soundTier = SOUND_TIERS.find((t) => t.value === input.postProduction.soundDesign);
  if (soundTier && soundTier.perVideo > 0) {
    items.push({
      name: `Sound Design — ${soundTier.label}`,
      category: "Post-Production",
      quantity: videoCount,
      unit: "video",
      unitPrice: soundTier.perVideo,
      total: soundTier.perVideo * videoCount,
    });
  }

  // Motion graphics
  const motionTier = MOTION_TIERS.find((t) => t.value === input.postProduction.motionGraphics);
  if (motionTier && motionTier.perVideo > 0) {
    items.push({
      name: `Motion Graphics — ${motionTier.label}`,
      category: "Post-Production",
      quantity: videoCount,
      unit: "video",
      unitPrice: motionTier.perVideo,
      total: motionTier.perVideo * videoCount,
    });
  }

  // Music
  const musicTier = MUSIC_TIERS.find((t) => t.value === input.postProduction.musicLicense);
  if (musicTier && musicTier.perVideo > 0) {
    if (musicTier.isPerProject) {
      items.push({
        name: `Music — ${musicTier.label}`,
        category: "Post-Production",
        quantity: 1,
        unit: "project",
        unitPrice: musicTier.perVideo,
        total: musicTier.perVideo,
      });
    } else {
      items.push({
        name: `Music — ${musicTier.label}`,
        category: "Post-Production",
        quantity: videoCount,
        unit: "video",
        unitPrice: musicTier.perVideo,
        total: musicTier.perVideo * videoCount,
      });
    }
  }

  // Captions
  if (input.postProduction.captions && input.postProduction.captionLanguages > 0) {
    items.push({
      name: "Captions (Primary Language)",
      category: "Post-Production",
      quantity: videoCount,
      unit: "video",
      unitPrice: CAPTION_BASE_RATE,
      total: CAPTION_BASE_RATE * videoCount,
    });
    const extraLangs = Math.max(0, input.postProduction.captionLanguages - 1);
    if (extraLangs > 0) {
      items.push({
        name: "Captions (Additional Languages)",
        category: "Post-Production",
        quantity: videoCount * extraLangs,
        unit: "video-language",
        unitPrice: CAPTION_ADDITIONAL_LANGUAGE_RATE,
        total: CAPTION_ADDITIONAL_LANGUAGE_RATE * videoCount * extraLangs,
      });
    }
  }

  // Social cutdowns
  const totalCutdowns = cutdownsPerVideo * videoCount;
  if (totalCutdowns > 0) {
    items.push({
      name: "Social Cutdowns",
      category: "Post-Production",
      quantity: totalCutdowns,
      unit: "cutdown",
      unitPrice: CUTDOWN_RATE,
      total: CUTDOWN_RATE * totalCutdowns,
    });
  }

  // Additional revisions
  const extraRevisions = Math.max(0, input.postProduction.revisionRounds - BASE_REVISION_ROUNDS);
  if (extraRevisions > 0) {
    items.push({
      name: "Additional Revision Rounds",
      category: "Post-Production",
      quantity: extraRevisions,
      unit: "round",
      unitPrice: ADDITIONAL_REVISION_RATE,
      total: ADDITIONAL_REVISION_RATE * extraRevisions,
    });
  }

  /* ── 5. Additional ── */
  // Travel
  if (input.production.travelRequired && input.production.travelDays > 0) {
    const crewCount = crewRoles.length;
    items.push({
      name: "Travel (per crew-day)",
      category: "Additional",
      quantity: input.production.travelDays * crewCount,
      unit: "crew-day",
      unitPrice: TRAVEL_RATE_PER_CREW_DAY,
      total: TRAVEL_RATE_PER_CREW_DAY * input.production.travelDays * crewCount,
    });
  }

  // Extra locations (beyond first)
  const extraLocations = Math.max(0, locations - 1);
  if (extraLocations > 0) {
    items.push({
      name: "Additional Locations",
      category: "Additional",
      quantity: extraLocations,
      unit: "location",
      unitPrice: EXTRA_LOCATION_RATE,
      total: EXTRA_LOCATION_RATE * extraLocations,
    });
  }

  // Talent
  if (input.production.talentNeeded && input.production.talentCount > 0) {
    items.push({
      name: "On-Camera Talent",
      category: "Additional",
      quantity: input.production.talentCount * shootDays,
      unit: "talent-day",
      unitPrice: TALENT_DAY_RATE,
      total: TALENT_DAY_RATE * input.production.talentCount * shootDays,
    });
  }

  /* ── 6. Totals ── */
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const urgencyMeta = URGENCY_TIERS.find((t) => t.value === input.timeline.urgency);
  const urgencyMultiplier = urgencyMeta?.multiplier ?? 1.0;
  const urgencyPremium = subtotal * (urgencyMultiplier - 1);
  const afterUrgency = subtotal + urgencyPremium;
  const contingency = afterUrgency * CONTINGENCY_RATE;
  const total = afterUrgency + contingency;
  const deposit = total * DEPOSIT_RATE;

  return {
    lineItems: items,
    subtotal,
    urgencyMultiplier,
    urgencyPremium,
    contingency,
    total,
    deposit,
    warnings,
  };
}
