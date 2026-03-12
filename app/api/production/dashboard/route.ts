import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

async function authorize() {
  const cookieStore = await cookies();
  const token = cookieStore.get("glm_admin_token")?.value;
  if (!token || !(await validateAdminSession(token))) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
      // Count of projects NOT archived
      prisma.project.count({
        where: { status: { not: "archived" } },
      }),

      // Group count by status
      prisma.project.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),

      // Next 10 schedule days from today
      prisma.scheduleDay.findMany({
        where: { date: { gte: today } },
        orderBy: { date: "asc" },
        take: 10,
        include: {
          project: { select: { id: true, title: true } },
        },
      }),

      // Last 5 call sheets
      prisma.callSheet.findMany({
        orderBy: { shootDate: "desc" },
        take: 5,
        include: {
          project: { select: { id: true, title: true } },
        },
      }),

      // Count of unique crew across active projects
      prisma.projectCrew.findMany({
        where: { project: { status: { not: "archived" } } },
        distinct: ["name"],
        select: { name: true },
      }),

      // Total shots in active projects
      prisma.shot.count({
        where: { shotList: { project: { status: { not: "archived" } } } },
      }),

      // Completed shots in active projects
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

    return NextResponse.json({
      activeProjects,
      projectsByStatus: statusCounts,
      upcomingShootDays,
      recentCallSheets,
      totalCrew: totalCrewResult.length,
      totalShots,
      completedShots,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
