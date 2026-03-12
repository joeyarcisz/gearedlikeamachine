import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ScheduleDayDetailClient from "./ScheduleDayDetailClient";
import { inventory, categories } from "@/lib/inventory";

export default async function ScheduleDayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const scheduleDay = await prisma.scheduleDay.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true } },
      crewAssignments: {
        orderBy: { callTime: "asc" },
      },
      equipmentAssignments: {
        orderBy: { itemName: "asc" },
      },
    },
  });

  if (!scheduleDay) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(scheduleDay));

  return (
    <ScheduleDayDetailClient
      scheduleDay={serialized}
      inventory={inventory}
      categories={categories}
    />
  );
}
