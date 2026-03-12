import { prisma } from "@/lib/prisma";
import ProductionDashboardClient from "./ProductionDashboardClient";

export default async function ProductionPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeProjects,
    projectsByStatus,
    upcomingShootDays,
    recentCallSheets,
    totalCrewResult,
    totalShots,
    completedShots,
  ] = await Promise.all([
    prisma.project.count({
      where: { status: { not: "archived" } },
    }),
    prisma.project.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.scheduleDay.findMany({
      where: { date: { gte: today } },
      orderBy: { date: "asc" },
      take: 5,
      include: {
        project: { select: { id: true, title: true } },
      },
    }),
    prisma.callSheet.findMany({
      orderBy: { shootDate: "desc" },
      take: 5,
      include: {
        project: { select: { id: true, title: true } },
      },
    }),
    prisma.projectCrew.findMany({
      where: { project: { status: { not: "archived" } } },
      distinct: ["name"],
      select: { name: true },
    }),
    prisma.shot.count({
      where: { shotList: { project: { status: { not: "archived" } } } },
    }),
    prisma.shot.count({
      where: {
        completed: true,
        shotList: { project: { status: { not: "archived" } } },
      },
    }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const row of projectsByStatus) {
    statusCounts[row.status] = row._count._all;
  }

  const serialize = <T extends Record<string, unknown>>(obj: T) =>
    JSON.parse(JSON.stringify(obj));

  return (
    <ProductionDashboardClient
      data={{
        activeProjects,
        projectsByStatus: statusCounts,
        upcomingShootDays: upcomingShootDays.map(serialize),
        recentCallSheets: recentCallSheets.map(serialize),
        totalCrew: totalCrewResult.length,
        totalShots,
        completedShots,
      }}
    />
  );
}
