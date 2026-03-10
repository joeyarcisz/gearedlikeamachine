import { prisma } from "@/lib/prisma";
import KanbanBoard from "@/components/admin/KanbanBoard";
import type { CRMOpportunity, CRMContact } from "@/lib/crm-types";

export default async function PipelinePage() {
  const opportunities = await prisma.opportunity.findMany({
    include: { contact: true },
    orderBy: { updatedAt: "desc" },
  });

  const serialized: CRMOpportunity[] = opportunities.map((o) => ({
    ...o,
    lastTouch: o.lastTouch?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    contact: o.contact
      ? ({
          ...o.contact,
          lastContact: o.contact.lastContact?.toISOString() ?? null,
          createdAt: o.contact.createdAt.toISOString(),
          updatedAt: o.contact.updatedAt.toISOString(),
        } as CRMContact)
      : null,
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
        Pipeline
      </h1>
      <KanbanBoard opportunities={serialized} />
    </div>
  );
}
