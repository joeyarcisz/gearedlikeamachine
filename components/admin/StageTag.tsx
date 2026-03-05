import { CONTACT_STAGE_LABELS, OPPORTUNITY_STAGE_LABELS } from "@/lib/crm-types";

const stageColors: Record<string, string> = {
  // Contact stages
  lead: "border-blue-500/40 text-blue-400",
  qualifying: "border-amber-500/40 text-amber-400",
  active_contact: "border-emerald-500/40 text-emerald-400",
  active_conversation: "border-green-500/40 text-green-400",
  client_account: "border-steel/40 text-steel",
  client_past: "border-muted/40 text-muted",
  inactive_contact: "border-red-500/40 text-red-300",
  // Opportunity stages
  qualification: "border-amber-500/40 text-amber-400",
  proposal: "border-purple-500/40 text-purple-400",
  negotiation: "border-orange-500/40 text-orange-400",
  waiting_client_feedback: "border-yellow-500/40 text-yellow-400",
  nurture_reactivation: "border-cyan-500/40 text-cyan-400",
  won: "border-green-500/40 text-green-400",
  lost: "border-red-500/40 text-red-400",
  deferred: "border-muted/40 text-muted",
};

export default function StageTag({ stage }: { stage: string }) {
  const label =
    CONTACT_STAGE_LABELS[stage] || OPPORTUNITY_STAGE_LABELS[stage] || stage;
  const color = stageColors[stage] || "border-card-border text-muted";

  return (
    <span
      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm ${color}`}
    >
      {label}
    </span>
  );
}
