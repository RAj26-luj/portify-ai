export const securityConfig = {
  bcryptRounds: 12,

  jwtMaxAge: 30 * 24 * 60 * 60,

  verificationTokenAge:
    24 * 60 * 60 * 1000,

  resetTokenAge:
    60 * 60 * 1000,

  sessionCookieName:
    "portify-session",

  rateLimit: {
    auth: {
      requests: 10,
      windowMs: 15 * 60 * 1000,
    },

    api: {
      requests: 100,
      windowMs: 15 * 60 * 1000,
    },

    contact: {
      requests: 5,
      windowMs: 60 * 60 * 1000,
    },

    approval: {
      requests: 20,
      windowMs: 15 * 60 * 1000,
    },

    upload: {
      requests: 20,
      windowMs: 15 * 60 * 1000,
    },
  },

  password: {
    minLength: 8,
    maxLength: 128,

    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialCharacter: true,
  },

  upload: {
    maxImageSize:
      5 * 1024 * 1024,

    maxResumeSize:
      10 * 1024 * 1024,

    allowedImageTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ],

    allowedResumeTypes: [
      "application/pdf",
    ],
  },

  auth: {
    requireEmailVerification: true,
    requireAdminApproval: true,
    blockRejectedUsers: true,
    blockBlockedUsers: true,
  },

  cookies: {
    secure:
      process.env.NODE_ENV ===
      "production",

    httpOnly: true,

    sameSite: "lax" as const,
  },
} as const;