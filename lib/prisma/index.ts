import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_DATABASE_TOKEN}`, // Fixed token env var name
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };
let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter }); // Initialize prisma first
  globalForPrisma.prisma = prisma;
} else {
  prisma = globalForPrisma.prisma;
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;
