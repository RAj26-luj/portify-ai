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
  },

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
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
};