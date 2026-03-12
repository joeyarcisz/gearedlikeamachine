import { prisma } from "@/lib/prisma";
import SchedulePageClient from "./SchedulePageClient";

export default async function SchedulePage() {
  const [scheduleDays, projects] = await Promise.all([
    prisma.scheduleDay.findMany({
      include: {
        project: { select: { id: true, title: true } },
        _count: {
          select: {
            crewAssignments: true,
            equipmentAssignments: true,
          },
        },
      },
      orderBy: { date: "asc" },
    }),
    prisma.project.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  const serialized = JSON.parse(JSON.stringify(scheduleDays));

  return (
    <SchedulePageClient
      scheduleDays={serialized}
      projects={projects}
    />
  );
}
