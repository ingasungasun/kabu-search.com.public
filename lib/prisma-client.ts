/**
 * - Prevent hot reloading from creating new instances of PrismaClient
 * https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/*
  eslint-disable-next-line import/prefer-default-export --
  This is a specification of Prisma.
  */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
