"use client";

import Link from "next/link";
import { CONTACT_STAGE_LABELS, OPPORTUNITY_STAGE_LABELS, ACTIVITY_TYPE_LABELS } from "@/lib/crm-types";
import type { CRMContact, CRMOpportunity, CRMActivity } from "@/lib/crm-types";

interface PipelineStageSummary {
  stage: string;
  _count: number;
  _sumLow: number;
  _sumHigh: number;
}

interface DashboardData {
  overdueContacts: CRMContact[];
  staleContacts: CRMContact[];
  overdueOpportunities: CRMOpportunity[];
  pipelineSummary: PipelineStageSummary[];
  wonCount: number;
  lostCount: number;
  wonValue: number;
  totalPipelineValue: number;
  recentActivities: (CRMActivity & {
    contact?: { id: string; name: string } | null;
    opportunity?: { id: string; title: string } | null;
  })[];
}

const activityTypeColors: Record<string, string> = {
  note: "border-blue-500/40 text-blue-400",
  email_sent: "border-purple-500/40 text-purple-400",
  call: "border-green-500/40 text-green-400",
  meeting: "border-amber-500/40 text-amber-400",
  stage_change: "border-orange-500/40 text-orange-400",
  created: "border-emerald-500/40 text-emerald-400",
  updated: "border-cyan-500/40 text-cyan-400",
};

function relativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diffMs = new Date().getTime() - new Date(dateStr).getTime();
  return Math.floor(diffMs / 86400000);
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const {
    overdueContacts,
    staleContacts,
    overdueOpportunities,
    pipelineSummary,
    wonCount,
    lostCount,
    wonValue,
    totalPipelineValue,
    recentActivities,
  } = data;

  const actionCount = overdueContacts.length + overdueOpportunities.length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Action Items" value={actionCount} highlight={actionCount > 0} />
        <StatBox label="Pipeline Value" value={`$${(totalPipelineValue / 1000).toFixed(0)}k`} />
        <StatBox label="Won" value={wonCount} />
        <StatBox label="Lost" value={lostCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Actions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Today&apos;s Actions
            </h2>
            {actionCount > 0 && (
              <span className="ml-auto text-[10px] uppercase tracking-widest text-amber-400 font-[family-name:var(--font-heading)]">
                {actionCount} overdue
              </span>
            )}
          </div>
          <div className="dashboard-card-body">
            {actionCount === 0 ? (
              <p className="text-muted text-sm">All caught up.</p>
            ) : (
              <div className="space-y-2">
                {overdueContacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/contacts/${c.id}`}
                    className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
                  >
                    <div>
                      <span className="text-white text-sm">{c.name}</span>
                      {c.company && (
                        <span className="text-muted text-xs ml-2">{c.company}</span>
                      )}
                      <p className="text-muted text-xs mt-0.5 truncate max-w-xs">
                        {c.nextAction}
                      </p>
                    </div>
                    <span className="text-amber-400 text-[10px] uppercase tracking-widest shrink-0 ml-2">
                      {daysSince(c.lastContact)}d ago
                    </span>
                  </Link>
                ))}
                {overdueOpportunities.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/pipeline/${o.id}`}
                    className="flex items-center justify-between p-3 border border-card-border/50 hover:border-card-border transition-colors"
                  >
                    <div>
                      <span className="text-white text-sm">{o.title}</span>
                      {o.company && (
                        <span className="text-muted text-xs ml-2">{o.company}</span>
                      )}
                      <p className="text-muted text-xs mt-0.5 truncate max-w-xs">
                        {o.nextAction}
                      </p>
                    </div>
                    <span className="text-amber-400 text-[10px] uppercase tracking-widest shrink-0 ml-2">
                      {daysSince(o.lastTouch)}d ago
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
              Needs Attention
            </h2>
            {staleContacts.length > 0 && (
              <span className="ml-auto text-[10px] uppercase tracking-widest text-red-400 font-[family-name:var(--font-heading)]">
                {staleContacts.length} stale
              </span>
            )}
          </div>
          <div className="dashboard-card-body">
            {staleContacts.length === 0 ? (
              <p className="text-muted text-sm">No stale contacts.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {staleContacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/contacts/${c.id}`}
                    className="flex items-center justify-between p-2 border border-card-border/30 hover:border-card-border transition-colors"
                  >
                    <div>
                      <span className="text-white text-sm">{c.name}</span>
                      {c.company && (
                        <span className="text-muted text-xs ml-2">{c.company}</span>
                      )}
                    </div>
                    <span className="text-red-400 text-[10px] uppercase tracking-widest shrink-0 ml-2">
                      {daysSince(c.lastContact) ?? daysSince(c.createdAt)}d
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline breakdown */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Pipeline Breakdown
          </h2>
          <span className="ml-auto text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
            Won: ${(wonValue / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="dashboard-card-body">
          {pipelineSummary.length === 0 ? (
            <p className="text-muted text-sm">No opportunities yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-card-border">
                    <th className="text-left text-[10px] uppercase tracking-widest text-muted py-2 font-[family-name:var(--font-heading)]">Stage</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted py-2 font-[family-name:var(--font-heading)]">Count</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted py-2 font-[family-name:var(--font-heading)]">Low Est.</th>
                    <th className="text-right text-[10px] uppercase tracking-widest text-muted py-2 font-[family-name:var(--font-heading)]">High Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {pipelineSummary.map((row) => (
                    <tr key={row.stage} className="border-b border-card-border/30">
                      <td className="py-2 text-white">
                        {OPPORTUNITY_STAGE_LABELS[row.stage] || row.stage}
                      </td>
                      <td className="py-2 text-right text-muted">{row._count}</td>
                      <td className="py-2 text-right text-muted">
                        ${row._sumLow.toLocaleString()}
                      </td>
                      <td className="py-2 text-right text-muted">
                        ${row._sumHigh.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Recent Activity
          </h2>
        </div>
        <div className="dashboard-card-body">
          {recentActivities.length === 0 ? (
            <p className="text-muted text-sm">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivities.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-2 border-b border-card-border/20 last:border-0"
                >
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border rounded-sm shrink-0 mt-0.5 ${
                      activityTypeColors[a.type] || "border-card-border text-muted"
                    }`}
                  >
                    {ACTIVITY_TYPE_LABELS[a.type] || a.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{a.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.contact && (
                        <Link
                          href={`/admin/contacts/${a.contact.id}`}
                          className="text-steel text-xs hover:underline"
                        >
                          {a.contact.name}
                        </Link>
                      )}
                      {a.opportunity && (
                        <Link
                          href={`/admin/pipeline/${a.opportunity.id}`}
                          className="text-steel text-xs hover:underline"
                        >
                          {a.opportunity.title}
                        </Link>
                      )}
                    </div>
                  </div>
                  <span className="text-muted text-[10px] uppercase tracking-widest shrink-0">
                    {relativeTime(a.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="dashboard-card">
      <div className="p-4 text-center">
        <p
          className={`text-2xl font-bold ${
            highlight ? "text-amber-400" : "text-white"
          }`}
        >
          {value}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-muted mt-1 font-[family-name:var(--font-heading)]">
          {label}
        </p>
      </div>
    </div>
  );
}
