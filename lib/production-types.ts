// ═══════════════════════════════════════════════════════
// PRODUCTION MANAGEMENT TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════

// ── Project ──

export type ProjectStatus = "pre_production" | "production" | "post_production" | "wrap" | "archived";

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: "pre_production", label: "Pre-Production", color: "#4488ff" },
  { value: "production", label: "Production", color: "#44cc88" },
  { value: "post_production", label: "Post-Production", color: "#d4a054" },
  { value: "wrap", label: "Wrap", color: "#999999" },
  { value: "archived", label: "Archived", color: "#555555" },
];

export const PROJECT_TYPES = [
  "commercial",
  "brand-film",
  "social-media",
  "corporate",
  "documentary",
  "event",
  "product-demo",
  "music-video",
  "testimonial",
  "training",
  "narrative",
  "other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  commercial: "Commercial",
  "brand-film": "Brand Film",
  "social-media": "Social Media",
  corporate: "Corporate",
  documentary: "Documentary",
  event: "Event",
  "product-demo": "Product Demo",
  "music-video": "Music Video",
  testimonial: "Testimonial",
  training: "Training",
  narrative: "Narrative",
  other: "Other",
};

export interface ProjectSummary {
  id: string;
  title: string;
  clientName: string | null;
  status: ProjectStatus;
  projectType: string | null;
  startDate: string | null;
  endDate: string | null;
  budgetLow: number | null;
  budgetHigh: number | null;
  createdAt: string;
  _count?: {
    callSheets: number;
    shotLists: number;
    scheduleDays: number;
    projectCrew: number;
  };
}

export interface ProjectDetail extends ProjectSummary {
  contactId: string | null;
  contact: { id: string; name: string; company: string | null } | null;
  description: string | null;
  notes: string | null;
  updatedAt: string;
  callSheets: CallSheetSummary[];
  shotLists: ShotListSummary[];
  scheduleDays: ScheduleDaySummary[];
  projectCrew: ProjectCrewMember[];
  projectEquipment: ProjectEquipmentItem[];
}

// ── Call Sheets ──

export type CallSheetStatus = "draft" | "sent" | "confirmed";

export const CALL_SHEET_STATUSES: { value: CallSheetStatus; label: string; color: string }[] = [
  { value: "draft", label: "Draft", color: "#707070" },
  { value: "sent", label: "Sent", color: "#4488ff" },
  { value: "confirmed", label: "Confirmed", color: "#44cc88" },
];

export interface CallSheetSummary {
  id: string;
  projectId: string;
  shootDate: string;
  callTime: string;
  wrapTime: string | null;
  locationName: string | null;
  status: CallSheetStatus;
  _count?: { crewCalls: number };
}

export interface CallSheetDetail extends CallSheetSummary {
  project: { id: string; title: string };
  locationAddress: string | null;
  parkingNotes: string | null;
  nearestHospital: string | null;
  weatherSummary: string | null;
  weatherTemp: string | null;
  sunrise: string | null;
  sunset: string | null;
  generalNotes: string | null;
  specialInstructions: string | null;
  crewCalls: CrewCallEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CrewCallEntry {
  id: string;
  crewMemberId: string | null;
  name: string;
  role: string;
  callTime: string;
  notes: string | null;
}

// ── Shot Lists ──

export interface ShotListSummary {
  id: string;
  projectId: string;
  title: string;
  sceneNumber: string | null;
  _count?: { shots: number };
  createdAt: string;
}

export interface ShotListDetail extends ShotListSummary {
  project: { id: string; title: string };
  description: string | null;
  shots: ShotEntry[];
  updatedAt: string;
}

export interface ShotEntry {
  id: string;
  shotNumber: string;
  size: string | null;
  movement: string | null;
  angle: string | null;
  lens: string | null;
  frameRate: string | null;
  equipment: string | null;
  lighting: string | null;
  description: string;
  imageUrl: string | null;
  notes: string | null;
  completed: boolean;
  sortOrder: number;
}

export const SHOT_SIZES = ["ES", "WS", "FS", "MFS", "MS", "MCU", "CU", "ECU"] as const;
export const SHOT_MOVEMENTS = ["Static", "Pan", "Tilt", "Push In", "Pull Out", "Zoom", "Dolly Zoom", "Roll", "Tracking", "Trucking", "Handheld", "Crane", "Drone"] as const;
export const SHOT_ANGLES = ["Eye Level", "Low Angle", "High Angle", "Dutch", "Overhead", "POV", "Worms Eye"] as const;
export const SHOT_FRAME_RATES = ["23.976fps", "24fps", "25fps", "29.97fps", "30fps", "48fps", "60fps", "120fps", "240fps"] as const;

// ── Schedule ──

export interface ScheduleDaySummary {
  id: string;
  projectId: string;
  date: string;
  startTime: string;
  wrapTime: string | null;
  locationName: string | null;
  sortOrder: number;
  _count?: {
    crewAssignments: number;
    equipmentAssignments: number;
  };
}

export interface ScheduleDayDetail extends ScheduleDaySummary {
  project: { id: string; title: string };
  locationAddress: string | null;
  notes: string | null;
  crewAssignments: ScheduleCrewEntry[];
  equipmentAssignments: ScheduleEquipmentEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleCrewEntry {
  id: string;
  crewMemberId: string | null;
  name: string;
  role: string;
  callTime: string | null;
  rate: number | null;
  notes: string | null;
}

export interface ScheduleEquipmentEntry {
  id: string;
  itemName: string;
  category: string | null;
  quantity: number;
  notes: string | null;
}

// ── Project Crew & Equipment ──

export interface ProjectCrewMember {
  id: string;
  crewMemberId: string | null;
  crewMember?: { id: string; name: string; email: string | null; phone: string | null } | null;
  name: string;
  role: string;
  dayRate: number | null;
  kitFee: number | null;
  notes: string | null;
}

export interface ProjectEquipmentItem {
  id: string;
  itemName: string;
  category: string | null;
  dailyRate: number | null;
  quantity: number;
  notes: string | null;
}
