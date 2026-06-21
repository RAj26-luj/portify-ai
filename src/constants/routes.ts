export const routes = {
  home: "/",

  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  pendingApproval: "/pending-approval",
  unauthorized: "/unauthorized",

  dashboard: (username: string) => `/dashboard/${username}`,
  dashboardProfile: (username: string) => `/dashboard/${username}/profile`,
  dashboardPortfolio: (username: string) => `/dashboard/${username}/portfolio`,
  dashboardResume: (username: string) => `/dashboard/${username}/resume`,
  dashboardSkills: (username: string) => `/dashboard/${username}/skills`,
  dashboardProjects: (username: string) => `/dashboard/${username}/projects`,
  dashboardEducation: (username: string) => `/dashboard/${username}/education`,
  dashboardExperience: (username: string) => `/dashboard/${username}/experience`,
  dashboardAchievements: (username: string) =>
    `/dashboard/${username}/achievements`,
  dashboardCertificates: (username: string) =>
    `/dashboard/${username}/certificates`,
  dashboardPublications: (username: string) =>
    `/dashboard/${username}/publications`,
  dashboardOpenSource: (username: string) =>
    `/dashboard/${username}/open-source`,
  dashboardCodingProfiles: (username: string) =>
    `/dashboard/${username}/coding-profiles`,
  dashboardSocialLinks: (username: string) =>
    `/dashboard/${username}/social-links`,
  dashboardCustomSections: (username: string) =>
    `/dashboard/${username}/custom-sections`,
  dashboardMessages: (username: string) =>
    `/dashboard/${username}/messages`,
  dashboardAnalytics: (username: string) =>
    `/dashboard/${username}/analytics`,
  dashboardThemes: (username: string) =>
    `/dashboard/${username}/themes`,
  dashboardSettings: (username: string) =>
    `/dashboard/${username}/settings`,
  dashboardSectionSettings: (username: string) =>
    `/dashboard/${username}/section-settings`,

  admin: "/admin",
  adminUsers: "/admin/users",
  adminApprovals: "/admin/approvals",
  adminReports: "/admin/reports",

  portfolio: "/portfolio",
  publicPortfolio: (username: string) => `/portfolio/${username}`,

  api: {
    auth: "/api/auth",
    verifyEmail: "/api/auth/verify-email",
    resendVerification: "/api/auth/resend-verification",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",

    approval: "/api/approval",
    admin: "/api/admin",
    users: "/api/users",

    resume: "/api/resume",
    resumeImport: "/api/resume/import",
    resumeParse: "/api/resume/parse",
    resumeDownload: "/api/resume/download",

    contact: "/api/contact",
    themes: "/api/themes",
    activateTheme: "/api/themes/activate",

    upload: "/api/upload",
  },
} as const;