export interface CRMContact {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: string;
  lastContact: string | null;
  nextAction: string | null;
  notes: string | null;
  sourceFiles: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CRMOpportunity {
  id: string;
  title: string;
  company: string | null;
  stage: string;
  estimatedValueLow: number | null;
  estimatedValueHigh: number | null;
  lastTouch: string | null;
  nextAction: string | null;
  owner: string | null;
  priority: string | null;
  notes: string | null;
  contactId: string | null;
  contact?: CRMContact | null;
  createdAt: string;
  updatedAt: string;
}

export interface CRMActivity {
  id: string;
  type: string;
  description: string;
  metadata: Record<string, unknown> | null;
  contactId: string | null;
  opportunityId: string | null;
  crewMemberId: string | null;
  createdAt: string;
}

export const ACTIVITY_TYPES = [
  "note",
  "email_sent",
  "call",
  "meeting",
  "stage_change",
  "created",
  "updated",
] as const;

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  note: "Note",
  email_sent: "Email Sent",
  call: "Call",
  meeting: "Meeting",
  stage_change: "Stage Change",
  created: "Created",
  updated: "Updated",
};

export interface CRMCrewMember {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  dayRate: number | null;
  kitFee: number | null;
  notes: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  instagram: string | null;
  imdb: string | null;
  w9OnFile: boolean;
  ndaOnFile: boolean;
  rating: number | null;
  lastBooked: string | null;
  tags: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CREW_ROLES = [
  "Gaffer",
  "Key Grip",
  "Sound Mixer",
  "AC / 1st AC",
  "AC / 2nd AC",
  "Grip",
  "Editor",
  "Producer",
  "Production Assistant",
  "Drone Operator",
  "DIT",
  "MUA / Hair",
  "Stylist",
  "Art Director",
  "Production Designer",
  "Teleprompter Op",
  "Jib / Technocrane Op",
  "Steadicam Op",
  "BTS Photographer",
  "Colorist",
  "Other",
] as const;

export const CREW_ROLE_LABELS: Record<string, string> = {
  "Gaffer": "Gaffer",
  "Key Grip": "Key Grip",
  "Sound Mixer": "Sound Mixer",
  "AC / 1st AC": "AC / 1st AC",
  "AC / 2nd AC": "AC / 2nd AC",
  "Grip": "Grip",
  "Editor": "Editor",
  "Producer": "Producer",
  "Production Assistant": "Production Assistant",
  "Drone Operator": "Drone Operator",
  "DIT": "DIT",
  "MUA / Hair": "MUA / Hair",
  "Stylist": "Stylist",
  "Art Director": "Art Director",
  "Production Designer": "Production Designer",
  "Teleprompter Op": "Teleprompter Op",
  "Jib / Technocrane Op": "Jib / Technocrane Op",
  "Steadicam Op": "Steadicam Op",
  "BTS Photographer": "BTS Photographer",
  "Colorist": "Colorist",
  "Other": "Other",
};

export const CONTACT_STAGES = [
  "lead",
  "qualifying",
  "active_contact",
  "active_conversation",
  "client_account",
  "client_past",
  "inactive_contact",
] as const;

export const OPPORTUNITY_STAGES = [
  "lead",
  "qualification",
  "proposal",
  "negotiation",
  "waiting_client_feedback",
  "nurture_reactivation",
  "won",
  "lost",
  "deferred",
] as const;

export const CONTACT_STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  qualifying: "Qualifying",
  active_contact: "Active Contact",
  active_conversation: "Active Conversation",
  client_account: "Client Account",
  client_past: "Past Client",
  inactive_contact: "Inactive",
};

export const OPPORTUNITY_STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  qualification: "Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  waiting_client_feedback: "Waiting on Client",
  nurture_reactivation: "Nurture / Reactivation",
  won: "Won",
  lost: "Lost",
  deferred: "Deferred",
};
