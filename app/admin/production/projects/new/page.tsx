import { prisma } from "@/lib/prisma";
import NewProjectForm from "./NewProjectForm";

export default async function NewProjectPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, company: true },
  });

  const serialized = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
  }));

  return (
    <div className="p-4 sm:p-6">
      <NewProjectForm contacts={serialized} />
    </div>
  );
}
