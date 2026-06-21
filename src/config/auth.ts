export const authConfig = {
  pages: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    pendingApproval: "/pending-approval",
    dashboard: "/dashboard",
    admin: "/admin",
    unauthorized: "/unauthorized",
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  roles: {
    USER: "USER",
    ADMIN: "ADMIN",
  },

  status: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },

  redirects: {
    afterLogin: "/dashboard",
    afterRegister: "/verify-email",
    afterVerification: "/pending-approval",
    afterApproval: "/dashboard",
    afterLogout: "/login",
    adminLogin: "/admin",
  },

  security: {
    requireEmailVerification: true,
    requireAdminApproval: true,
    allowOAuthWithoutApproval: false,
    blockRejectedUsers: true,
    blockUnverifiedUsers: true,
  },

  email: {
    verificationExpiryHours: 24,
    passwordResetExpiryHours: 1,
  },
} as const;

export type UserRole =
  (typeof authConfig.roles)[keyof typeof authConfig.roles];

export type UserStatus =
  (typeof authConfig.status)[keyof typeof authConfig.status];