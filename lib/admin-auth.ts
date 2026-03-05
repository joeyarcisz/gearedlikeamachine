import { prisma } from "./prisma";
import { randomBytes } from "crypto";

export async function validateAdminSession(token: string): Promise<boolean> {
  const session = await prisma.adminSession.findUnique({ where: { token } });
  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => {});
    return false;
  }
  return true;
}

export async function createAdminSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.adminSession.create({ data: { token, expiresAt } });
  return token;
}

export async function deleteAdminSession(token: string): Promise<void> {
  await prisma.adminSession.delete({ where: { token } }).catch(() => {});
}
