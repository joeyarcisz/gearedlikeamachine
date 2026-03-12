import { prisma } from "@/lib/prisma";
import NewShotListForm from "./NewShotListForm";

export default async function NewShotListPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-4 sm:p-6">
      <NewShotListForm projects={projects} />
    </div>
  );
}
