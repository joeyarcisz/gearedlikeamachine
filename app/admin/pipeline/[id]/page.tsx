import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OpportunityForm from "@/components/admin/OpportunityForm";
import type { CRMOpportunity } from "@/lib/crm-types";

export default async function EditOpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [opportunity, contacts] = await Promise.all([
    prisma.opportunity.findUnique({
      where: { id },
      include: { contact: true },
    }),
    prisma.contact.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!opportunity) notFound();

  const serialized: CRMOpportunity = {
    ...opportunity,
    lastTouch: opportunity.lastTouch?.toISOString() ?? null,
    createdAt: opportunity.createdAt.toISOString(),
    updatedAt: opportunity.updatedAt.toISOString(),
    contact: opportunity.contact
      ? {
          ...opportunity.contact,
          lastContact: opportunity.contact.lastContact?.toISOString() ?? null,
          createdAt: opportunity.contact.createdAt.toISOString(),
          updatedAt: opportunity.contact.updatedAt.toISOString(),
        }
      : null,
  };

  return (
    <div className="p-4 sm:p-6">
      <OpportunityForm opportunity={serialized} contacts={contacts} />
    </div>
  );
}
