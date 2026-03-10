import { prisma } from "@/lib/prisma";
import CrewPageClient from "./CrewPageClient";
import type { CRMCrewMember } from "@/lib/crm-types";

export default async function CrewPage() {
  const crew = await prisma.crewMember.findMany({
    orderBy: { name: "asc" },
  });

  const serialized: CRMCrewMember[] = crew.map((c) => ({
    ...c,
    lastBooked: c.lastBooked?.toISOString() ?? null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return <CrewPageClient crew={serialized} />;
}
