import { prisma } from "@/lib/prisma";
import OpportunityForm from "@/components/admin/OpportunityForm";

export default async function NewOpportunityPage() {
  const contacts = await prisma.contact.findMany({
    select: { id: true, name: true, company: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <OpportunityForm contacts={contacts} />
    </div>
  );
}
