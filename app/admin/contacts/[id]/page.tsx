import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/admin/ContactForm";
import EmailCompose from "@/components/admin/EmailCompose";
import LogActivityForm from "@/components/admin/LogActivityForm";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import type { CRMContact, CRMOpportunity } from "@/lib/crm-types";
import type { Opportunity, Activity } from "@prisma/client";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [contact, activities] = await Promise.all([
    prisma.contact.findUnique({
      where: { id },
      include: { opportunities: true },
    }),
    prisma.activity.findMany({
      where: { contactId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  if (!contact) notFound();

  const serialized: CRMContact & { opportunities: CRMOpportunity[] } = {
    ...contact,
    lastContact: contact.lastContact?.toISOString() ?? null,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
    opportunities: contact.opportunities.map((o: Opportunity) => ({
      ...o,
      lastTouch: o.lastTouch?.toISOString() ?? null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
  };

  const serializedActivities = activities.map((a: Activity) => ({
    ...a,
    metadata: a.metadata as Record<string, unknown> | null,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ContactForm contact={serialized} />

      {contact.email && (
        <EmailCompose
          contactId={contact.id}
          contactEmail={contact.email}
          contactName={contact.name}
          contactStage={contact.stage}
          contactCompany={contact.company}
        />
      )}

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
            Activity
          </h2>
        </div>
        <div className="dashboard-card-body space-y-6">
          <LogActivityForm contactId={contact.id} />
          <ActivityTimeline activities={serializedActivities} />
        </div>
      </div>
    </div>
  );
}
