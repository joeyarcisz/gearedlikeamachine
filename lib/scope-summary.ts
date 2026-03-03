/* ──────────────────────────────────────────────
   Scope & Instant Estimate — Summary Generator
   ────────────────────────────────────────────── */

import type { ScopeInput, ScopeSummary } from "./scope-types";
import {
  PROJECT_TYPES,
  SCOPE_FORMATS,
  DURATIONS,
  PLATFORMS,
  CREW_ROLES,
  CREW_PACKAGES,
  GEAR_OPTIONS,
  GEAR_CATEGORY_LABELS,
  SPECIALIZED_GEAR,
  EDITING_TIERS,
  COLOR_TIERS,
  SOUND_TIERS,
  MOTION_TIERS,
  MUSIC_TIERS,
  URGENCY_TIERS,
} from "./scope-pricing";

function listJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function generateSummary(input: ScopeInput): ScopeSummary {
  const projectLabel =
    PROJECT_TYPES.find((t) => t.value === input.projectType.projectType)?.label ?? "Video";
  const formatLabel =
    SCOPE_FORMATS.find((f) => f.value === input.projectType.scopeFormat)?.label ?? "Project";
  const durationLabel =
    DURATIONS.find((d) => d.value === input.deliverables.duration)?.label ?? "";
  const platformLabels = input.deliverables.platforms.map(
    (p) => PLATFORMS.find((pl) => pl.value === p)?.label ?? p
  );

  /* ── Overview ── */
  const overview = `This estimate covers a ${formatLabel.toLowerCase()} engagement for ${projectLabel.toLowerCase()} production. The project scope includes ${input.deliverables.videoCount} finished video${input.deliverables.videoCount !== 1 ? "s" : ""} at approximately ${durationLabel.toLowerCase()} each, optimized for delivery across ${listJoin(platformLabels)}.`;

  /* ── Deliverables ── */
  const ratioLabels = input.deliverables.aspectRatios.join(", ");
  const cutdownTotal =
    input.deliverables.cutdownsPerVideo * input.deliverables.videoCount;
  let deliverablesText = `The final deliverable package will include ${input.deliverables.videoCount} ${durationLabel.toLowerCase()} video${input.deliverables.videoCount !== 1 ? "s" : ""} formatted in ${ratioLabels} aspect ratio${input.deliverables.aspectRatios.length > 1 ? "s" : ""}.`;
  if (cutdownTotal > 0) {
    deliverablesText += ` Additionally, ${cutdownTotal} social cutdown${cutdownTotal !== 1 ? "s" : ""} (${input.deliverables.cutdownsPerVideo} per video) will be produced for platform-specific distribution.`;
  }

  /* ── Production ── */
  const crewPackageLabel =
    CREW_PACKAGES[input.production.crewPackage]?.label ?? "Custom";
  const activeRoles = input.production.crewRoles.map(
    (r) => CREW_ROLES.find((cr) => cr.value === r)?.label ?? r
  );
  let productionText = `Production will span ${input.production.shootDays} shoot day${input.production.shootDays !== 1 ? "s" : ""} across ${input.production.locations} location${input.production.locations !== 1 ? "s" : ""}. The crew operates under a ${crewPackageLabel.toLowerCase()} package configuration with ${activeRoles.length} positions: ${listJoin(activeRoles)}.`;

  // Gear summary
  const gearSummary: string[] = [];
  const gearKeys = Object.keys(input.production.gear) as (keyof typeof input.production.gear)[];
  for (const key of gearKeys) {
    const val = input.production.gear[key];
    const opt = GEAR_OPTIONS[key]?.find((o) => o.value === val);
    if (opt && opt.rate > 0) {
      gearSummary.push(`${GEAR_CATEGORY_LABELS[key]}: ${opt.label}`);
    }
  }
  if (gearSummary.length > 0) {
    productionText += ` Gear packages include ${listJoin(gearSummary)}.`;
  }

  const specGear = input.production.specializedGear.map(
    (sg) => SPECIALIZED_GEAR.find((s) => s.value === sg)?.label ?? sg
  );
  if (specGear.length > 0) {
    productionText += ` Specialized equipment includes ${listJoin(specGear)}.`;
  }

  if (input.production.travelRequired) {
    productionText += ` Travel is factored in for ${input.production.travelDays} day${input.production.travelDays !== 1 ? "s" : ""}.`;
  }

  if (input.production.talentNeeded) {
    productionText += ` ${input.production.talentCount} on-camera talent position${input.production.talentCount !== 1 ? "s" : ""} are included.`;
  }

  /* ── Post-Production ── */
  const editLabel =
    EDITING_TIERS.find((t) => t.value === input.postProduction.editingComplexity)?.label ?? "";
  const colorLabel =
    COLOR_TIERS.find((t) => t.value === input.postProduction.colorGrade)?.label ?? "";
  const soundLabel =
    SOUND_TIERS.find((t) => t.value === input.postProduction.soundDesign)?.label ?? "";
  const motionLabel =
    MOTION_TIERS.find((t) => t.value === input.postProduction.motionGraphics)?.label ?? "";
  const musicLabel =
    MUSIC_TIERS.find((t) => t.value === input.postProduction.musicLicense)?.label ?? "";

  let postText = `Post-production will follow a ${editLabel.toLowerCase()} editing workflow.`;

  // Map tier values to clean prose descriptions (avoids "basic color color grading")
  const colorDescriptions: Record<string, string> = {
    basic: "basic color grading",
    cinematic: "cinematic color grading",
    "film-emulation": "film emulation color grading",
  };
  const soundDescriptions: Record<string, string> = {
    basic: "a basic audio mix",
    "full-design": "full sound design",
    broadcast: "broadcast-quality sound mixing",
  };
  const motionDescriptions: Record<string, string> = {
    "lower-thirds": "lower thirds and basic titling",
    moderate: "moderate motion graphics",
    heavy: "heavy motion design",
  };
  const musicDescriptions: Record<string, string> = {
    stock: "stock music licensing",
    premium: "premium music licensing",
    "custom-score": "a custom musical score",
  };

  const postFeatures: string[] = [];
  if (input.postProduction.colorGrade !== "none")
    postFeatures.push(colorDescriptions[input.postProduction.colorGrade] ?? colorLabel.toLowerCase());
  if (input.postProduction.soundDesign !== "none")
    postFeatures.push(soundDescriptions[input.postProduction.soundDesign] ?? soundLabel.toLowerCase());
  if (input.postProduction.motionGraphics !== "none")
    postFeatures.push(motionDescriptions[input.postProduction.motionGraphics] ?? motionLabel.toLowerCase());
  if (input.postProduction.musicLicense !== "none")
    postFeatures.push(musicDescriptions[input.postProduction.musicLicense] ?? musicLabel.toLowerCase());

  if (postFeatures.length > 0) {
    postText += ` The package includes ${listJoin(postFeatures)}.`;
  }

  if (input.postProduction.captions) {
    postText += ` Captions will be delivered in ${input.postProduction.captionLanguages} language${input.postProduction.captionLanguages !== 1 ? "s" : ""}.`;
  }

  postText += ` ${input.postProduction.revisionRounds} round${input.postProduction.revisionRounds !== 1 ? "s" : ""} of revisions are included in this estimate.`;

  /* ── Timeline ── */
  const urgencyDescriptions: Record<string, string> = {
    flexible: "The project timeline is flexible, with no hard deadline.",
    standard: "The project will follow a standard production timeline.",
    expedited: "The project is on an expedited timeline with priority scheduling.",
    rush: "This is a rush project requiring immediate priority and a compressed timeline.",
  };
  let timelineText = urgencyDescriptions[input.timeline.urgency] ?? "The project will follow a standard production timeline.";
  if (input.timeline.startDate) {
    timelineText += ` Production is targeted to begin around ${input.timeline.startDate}.`;
  }
  if (input.timeline.deliveryDate) {
    timelineText += ` Final delivery is expected by ${input.timeline.deliveryDate}.`;
  }

  return {
    overview,
    deliverables: deliverablesText,
    production: productionText,
    postProduction: postText,
    timeline: timelineText,
  };
}
