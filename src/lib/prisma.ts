import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    return prisma;
  } catch (error) {
      
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await prisma.$disconnect();
  } catch (error) {
      
  }
}

export default prisma;