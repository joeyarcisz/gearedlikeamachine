import { prisma } from "@/lib/prisma";
import CallSheetsPageClient from "./CallSheetsPageClient";
import type { CallSheetStatus } from "@/lib/production-types";

export default async function CallSheetsPage() {
  const callSheets = await prisma.callSheet.findMany({
    include: {
      project: { select: { id: true, title: true } },
      _count: { select: { crewCalls: true } },
    },
    orderBy: { shootDate: "desc" },
  });

  const serialized = callSheets.map((cs) => ({
    id: cs.id,
    projectId: cs.projectId,
    project: cs.project,
    shootDate: cs.shootDate.toISOString(),
    callTime: cs.callTime,
    wrapTime: cs.wrapTime,
    locationName: cs.locationName,
    status: cs.status as CallSheetStatus,
    _count: cs._count,
  }));

  return <CallSheetsPageClient callSheets={serialized} />;
}
