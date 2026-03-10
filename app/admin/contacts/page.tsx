import { prisma } from "@/lib/prisma";
import ContactsPageClient from "./ContactsPageClient";
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

  return <ContactsPageClient contacts={serialized} />;
}
