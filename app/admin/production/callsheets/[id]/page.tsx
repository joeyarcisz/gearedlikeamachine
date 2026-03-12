import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CallSheetDetailClient from "./CallSheetDetailClient";
import type { CallSheetDetail, CallSheetStatus } from "@/lib/production-types";

export default async function CallSheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const callSheet = await prisma.callSheet.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true, clientName: true } },
      crewCalls: {
        orderBy: { callTime: "asc" },
        include: {
          crewMember: { select: { phone: true, email: true } },
        },
      },
    },
  });

  if (!callSheet) notFound();

  const serialized: CallSheetDetail = {
    id: callSheet.id,
    projectId: callSheet.projectId,
    project: callSheet.project,
    shootDate: callSheet.shootDate.toISOString(),
    callTime: callSheet.callTime,
    wrapTime: callSheet.wrapTime,
    locationName: callSheet.locationName,
    locationAddress: callSheet.locationAddress,
    parkingNotes: callSheet.parkingNotes,
    nearestHospital: callSheet.nearestHospital,
    weatherSummary: callSheet.weatherSummary,
    weatherTemp: callSheet.weatherTemp,
    sunrise: callSheet.sunrise,
    sunset: callSheet.sunset,
    generalNotes: callSheet.generalNotes,
    specialInstructions: callSheet.specialInstructions,
    status: callSheet.status as CallSheetStatus,
    crewCalls: callSheet.crewCalls.map((cc) => ({
      id: cc.id,
      crewMemberId: cc.crewMemberId,
      name: cc.name,
      role: cc.role,
      callTime: cc.callTime,
      notes: cc.notes,
      phone: cc.crewMember?.phone ?? null,
      email: cc.crewMember?.email ?? null,
    })),
    createdAt: callSheet.createdAt.toISOString(),
    updatedAt: callSheet.updatedAt.toISOString(),
  };

  return <CallSheetDetailClient callSheet={serialized} />;
}
