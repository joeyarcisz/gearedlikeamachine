import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

type ActivityType = Prisma.ActivityCreateInput["type"];

interface LogActivityParams {
  type: ActivityType;
  description: string;
  metadata?: Prisma.InputJsonValue;
  contactId?: string;
  opportunityId?: string;
}

export async function logActivity({
  type,
  description,
  metadata,
  contactId,
  opportunityId,
}: LogActivityParams) {
  return prisma.activity.create({
    data: {
      type,
      description,
      metadata: metadata ?? undefined,
      contactId: contactId ?? undefined,
      opportunityId: opportunityId ?? undefined,
    },
  });
}
