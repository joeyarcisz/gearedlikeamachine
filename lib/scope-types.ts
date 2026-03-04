/* ──────────────────────────────────────────────
   Scope & Instant Estimate — Type Definitions
   ────────────────────────────────────────────── */

export interface LeadInfo {
  email: string;
  company: string;
  jobTitle: string;
}

export type ProjectType =
  | "commercial"
  | "brand-film"
  | "social-media"
  | "corporate"
  | "documentary"
  | "event"
  | "product-demo"
  | "music-video"
  | "testimonial"
  | "training";

export type ScopeFormat =
  | "single"
  | "series"
  | "campaign"
  | "retainer";

export type VideoDuration =
  | "under-30s"
  | "30s-60s"
  | "1-2min"
  | "2-5min"
  | "5-10min"
  | "10-30min"
  | "30-plus";

export type Platform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "x"
  | "website"
  | "broadcast"
  | "streaming"
  | "internal";

export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

export type CrewRole =
  | "director"
  | "dp"
  | "camera-op"
  | "first-ac"
  | "gaffer"
  | "key-grip"
  | "ge-swing"
  | "sound-mixer"
  | "makeup-hair"
  | "pa"
  | "producer"
  | "teleprompter-op"
  | "drone-op";

export type CrewPackage = "lean" | "standard" | "full";

export type GearTier = "none" | "standard" | "mid" | "premium";

export interface GearSelections {
  camera: "standard" | "cinema" | "premium-cinema";
  lenses: "standard" | "cinema-primes" | "anamorphic";
  lighting: "basic" | "standard" | "full-production";
  audio: "basic-lav" | "standard" | "broadcast";
  grip: "none" | "basic" | "full-van";
  drone: "none" | "standard" | "cinema-grade";
}

export type SpecializedGear =
  | "car-mount"
  | "underwater"
  | "crane"
  | "dolly-track"
  | "slider"
  | "easyrig"
  | "segway"
  | "monitor-15"
  | "wireless-video";

export type EditingComplexity =
  | "straightforward"
  | "standard"
  | "complex"
  | "premium";

export type ColorGradeTier =
  | "none"
  | "basic"
  | "cinematic"
  | "film-emulation";

export type SoundDesignTier =
  | "none"
  | "basic"
  | "full-design"
  | "broadcast";

export type MotionGraphicsTier =
  | "none"
  | "lower-thirds"
  | "moderate"
  | "heavy";

export type MusicLicenseTier =
  | "none"
  | "stock"
  | "premium"
  | "custom-score";

export type UrgencyTier =
  | "flexible"
  | "standard"
  | "expedited"
  | "rush";

/* ── Wizard Step Data ── */

export interface StepProjectTypeData {
  projectType: ProjectType | null;
  scopeFormat: ScopeFormat | null;
}

export interface StepDeliverablesData {
  videoCount: number;
  duration: VideoDuration;
  platforms: Platform[];
  aspectRatios: AspectRatio[];
  cutdownsPerVideo: number;
}

export interface StepProductionData {
  shootDays: number;
  locations: number;
  travelRequired: boolean;
  travelDays: number;
  crewPackage: CrewPackage;
  crewRoles: CrewRole[];
  gear: GearSelections;
  specializedGear: SpecializedGear[];
  talentNeeded: boolean;
  talentCount: number;
}

export interface StepPostProductionData {
  editingComplexity: EditingComplexity;
  colorGrade: ColorGradeTier;
  soundDesign: SoundDesignTier;
  motionGraphics: MotionGraphicsTier;
  musicLicense: MusicLicenseTier;
  captions: boolean;
  captionLanguages: number;
  revisionRounds: number;
}

export interface StepTimelineData {
  startDate: string;
  deliveryDate: string;
  urgency: UrgencyTier;
}

export interface ScopeInput {
  projectType: StepProjectTypeData;
  deliverables: StepDeliverablesData;
  production: StepProductionData;
  postProduction: StepPostProductionData;
  timeline: StepTimelineData;
}

/* ── Output Types ── */

export type LineItemCategory =
  | "Pre-Production"
  | "Crew"
  | "Gear"
  | "Post-Production"
  | "Additional";

export interface LineItem {
  name: string;
  category: LineItemCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface EstimateBreakdown {
  lineItems: LineItem[];
  subtotal: number;
  urgencyMultiplier: number;
  urgencyPremium: number;
  contingency: number;
  total: number;
  deposit: number;
  warnings: string[];
}

export interface ScopeSummary {
  overview: string;
  deliverables: string;
  production: string;
  postProduction: string;
  timeline: string;
}
