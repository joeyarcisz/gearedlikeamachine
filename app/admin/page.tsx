import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/admin/DashboardView";

export default async function AdminPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  const activeContactStages = [
    "lead",
    "qualifying",
    "active_contact",
    "active_conversation",
    "client_account",
  ] as const;

  const activeOpportunityStages = [
    "lead",
    "qualification",
    "proposal",
    "negotiation",
    "waiting_client_feedback",
    "nurture_reactivation",
  ] as const;

  const [
    overdueContacts,
    staleContacts,
    overdueOpportunities,
    opportunities,
    wonOpportunities,
    lostCount,
    recentActivities,
  ] = await Promise.all([
    // Overdue: active stage, has nextAction, lastContact > 7 days ago
    prisma.contact.findMany({
      where: {
        stage: { in: [...activeContactStages] },
        nextAction: { not: null },
        lastContact: { lt: sevenDaysAgo },
      },
      orderBy: { lastContact: "asc" },
      take: 20,
    }),
    // Stale: active stage, not touched in 30+ days
    prisma.contact.findMany({
      where: {
        stage: { in: [...activeContactStages] },
        OR: [
          { lastContact: { lt: thirtyDaysAgo } },
          { lastContact: null, createdAt: { lt: thirtyDaysAgo } },
        ],
      },
      orderBy: { updatedAt: "asc" },
      take: 20,
    }),
    // Overdue opportunities
    prisma.opportunity.findMany({
      where: {
        stage: { in: [...activeOpportunityStages] },
        nextAction: { not: null },
        lastTouch: { lt: sevenDaysAgo },
      },
      orderBy: { lastTouch: "asc" },
      take: 20,
    }),
    // All active opportunities for pipeline summary
    prisma.opportunity.findMany({
      where: { stage: { in: [...activeOpportunityStages] } },
    }),
    // Won
    prisma.opportunity.findMany({
      where: { stage: "won" },
    }),
    // Lost count
    prisma.opportunity.count({
      where: { stage: "lost" },
    }),
    // Recent activities
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        contact: { select: { id: true, name: true } },
        opportunity: { select: { id: true, title: true } },
      },
    }),
  ]);

  // Build pipeline summary by stage
  const stageMap = new Map<string, { _count: number; _sumLow: number; _sumHigh: number }>();
  for (const opp of opportunities) {
    const existing = stageMap.get(opp.stage) || { _count: 0, _sumLow: 0, _sumHigh: 0 };
    existing._count++;
    existing._sumLow += opp.estimatedValueLow || 0;
    existing._sumHigh += opp.estimatedValueHigh || 0;
    stageMap.set(opp.stage, existing);
  }
  const pipelineSummary = Array.from(stageMap.entries()).map(([stage, vals]) => ({
    stage,
    ...vals,
  }));

  const totalPipelineValue = opportunities.reduce(
    (sum: number, o) => sum + (o.estimatedValueHigh || o.estimatedValueLow || 0),
    0
  );
  const wonValue = wonOpportunities.reduce(
    (sum: number, o) => sum + (o.estimatedValueHigh || o.estimatedValueLow || 0),
    0
  );

  // Serialize dates to strings
  const serialize = <T extends Record<string, unknown>>(obj: T) => JSON.parse(JSON.stringify(obj));

  return (
    <DashboardView
      data={{
        overdueContacts: overdueContacts.map(serialize),
        staleContacts: staleContacts.map(serialize),
        overdueOpportunities: overdueOpportunities.map(serialize),
        pipelineSummary,
        wonCount: wonOpportunities.length,
        lostCount,
        wonValue,
        totalPipelineValue,
        recentActivities: recentActivities.map(serialize),
      }}
    />
  );
}
