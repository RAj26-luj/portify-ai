export const databaseConfig = {
  url: process.env.DATABASE_URL ?? "",

  mongodb: {
    connectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;