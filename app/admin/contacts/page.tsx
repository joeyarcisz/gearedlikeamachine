import { prisma } from "@/lib/prisma";
import ContactTable from "@/components/admin/ContactTable";
import type { CRMContact } from "@/lib/crm-types";

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const serialized: CRMContact[] = contacts.map((c) => ({
    ...c,
    lastContact: c.lastContact?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-widest text-white font-[family-name:var(--font-heading)]">
          Contacts
        </h1>
        <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
          {contacts.length} total
        </span>
      </div>
      <ContactTable contacts={serialized} />
    </div>
  );
}
