import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShotListDetailClient from "./ShotListDetailClient";
import type { ShotListDetail, ShotEntry } from "@/lib/production-types";

export default async function ShotListDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const shotList = await prisma.shotList.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true } },
      shots: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!shotList) notFound();

  const serialized: ShotListDetail = {
    id: shotList.id,
    projectId: shotList.projectId,
    title: shotList.title,
    sceneNumber: shotList.sceneNumber,
    description: shotList.description,
    project: shotList.project,
    createdAt: shotList.createdAt.toISOString(),
    updatedAt: shotList.updatedAt.toISOString(),
    shots: shotList.shots.map(
      (s): ShotEntry => ({
        id: s.id,
        shotNumber: s.shotNumber,
        size: s.size,
        movement: s.movement,
        angle: s.angle,
        lens: s.lens,
        frameRate: s.frameRate,
        equipment: s.equipment,
        lighting: s.lighting,
        description: s.description,
        imageUrl: s.imageUrl,
        notes: s.notes,
        completed: s.completed,
        sortOrder: s.sortOrder,
      })
    ),
  };

  return <ShotListDetailClient shotList={serialized} />;
}
