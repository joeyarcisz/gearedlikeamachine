import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { inventory, categories } from "@/lib/inventory";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      contact: {
        select: { id: true, name: true, company: true },
      },
      callSheets: {
        orderBy: { shootDate: "desc" },
        include: { _count: { select: { crewCalls: true } } },
      },
      shotLists: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { shots: true } } },
      },
      scheduleDays: {
        orderBy: { date: "asc" },
        include: {
          _count: {
            select: { crewAssignments: true, equipmentAssignments: true },
          },
        },
      },
      projectCrew: {
        include: {
          crewMember: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      },
      projectEquipment: true,
    },
  });

  if (!project) {
    notFound();
  }

  // Fetch contacts for the crew add form
  const crewMembers = await prisma.crewMember.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true, dayRate: true, kitFee: true },
  });

  const serialize = <T extends Record<string, unknown>>(obj: T) =>
    JSON.parse(JSON.stringify(obj));

  return (
    <ProjectDetailClient
      project={serialize(project)}
      crewMembers={crewMembers.map(serialize)}
      inventory={inventory}
      inventoryCategories={categories}
    />
  );
}
