import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CrewMemberForm from "@/components/admin/CrewMemberForm";
import EmailCompose from "@/components/admin/EmailCompose";
import LogActivityForm from "@/components/admin/LogActivityForm";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import CrewDocumentsSection from "@/components/documents/CrewDocumentsSection";
import type { CRMCrewMember } from "@/lib/crm-types";
import type { Activity } from "@prisma/client";

export default async function EditCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [crewMember, activities] = await Promise.all([
    prisma.crewMember.findUnique({
      where: { id },
    }),
    prisma.activity.findMany({
      where: { crewMemberId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  if (!crewMember) notFound();

  const serialized: CRMCrewMember = {
    ...crewMember,
    lastBooked: crewMember.lastBooked?.toISOString() ?? null,
    createdAt: crewMember.createdAt.toISOString(),
    updatedAt: crewMember.updatedAt.toISOString(),
  };

  const serializedActivities = activities.map((a: Activity) => ({
    ...a,
    metadata: a.metadata as Record<string, unknown> | null,
    crewMemberId: a.crewMemberId,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <CrewMemberForm crew={serialized} />

      {crewMember.email && (
        <EmailCompose
          contactId={crewMember.id}
          contactEmail={crewMember.email}
          contactName={crewMember.name}
          contactStage=""
          crewMode={true}
          crewMemberId={crewMember.id}
        />
      )}

      <CrewDocumentsSection crewMemberId={crewMember.id} crewMemberName={crewMember.name} />

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Activity
          </h2>
        </div>
        <div className="dashboard-card-body space-y-6">
          <LogActivityForm crewMemberId={crewMember.id} />
          <ActivityTimeline activities={serializedActivities} />
        </div>
      </div>
    </div>
  );
}
