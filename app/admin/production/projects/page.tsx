import { prisma } from "@/lib/prisma";
import ProjectsPageClient from "./ProjectsPageClient";
import type { ProjectSummary } from "@/lib/production-types";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          callSheets: true,
          shotLists: true,
          scheduleDays: true,
          projectCrew: true,
        },
      },
    },
  });

  const serialized: ProjectSummary[] = projects.map((p) => ({
    id: p.id,
    title: p.title,
    clientName: p.clientName,
    status: p.status,
    projectType: p.projectType,
    startDate: p.startDate?.toISOString() ?? null,
    endDate: p.endDate?.toISOString() ?? null,
    budgetLow: p.budgetLow,
    budgetHigh: p.budgetHigh,
    createdAt: p.createdAt.toISOString(),
    _count: p._count,
  }));

  return <ProjectsPageClient projects={serialized} />;
}
