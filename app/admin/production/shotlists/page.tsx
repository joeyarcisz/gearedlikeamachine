import { prisma } from "@/lib/prisma";
import ShotListsPageClient from "./ShotListsPageClient";
import type { ShotListSummary } from "@/lib/production-types";

export default async function ShotListsPage() {
  const shotLists = await prisma.shotList.findMany({
    include: {
      project: { select: { id: true, title: true } },
      _count: { select: { shots: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized: (ShotListSummary & { project: { id: string; title: string } })[] =
    shotLists.map((sl) => ({
      id: sl.id,
      projectId: sl.projectId,
      title: sl.title,
      sceneNumber: sl.sceneNumber,
      _count: sl._count,
      createdAt: sl.createdAt.toISOString(),
      project: sl.project,
    }));

  return <ShotListsPageClient shotLists={serialized} />;
}
