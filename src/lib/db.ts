import prisma from "./prisma";

export { prisma };

export async function healthCheck() {
  try {
    await prisma.$runCommandRaw({
      ping: 1,
    });

return {
  success: true,
  timestamp: new Date().toISOString(),
};
} catch (error) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function transaction<T>(
  callback: (
    tx: Parameters<
      Parameters<
        typeof prisma.$transaction
      >[0]
    >[0]
  ) => Promise<T>
) {
  return prisma.$transaction(callback);
}

export async function ensureConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
      
    return false;
  }
}