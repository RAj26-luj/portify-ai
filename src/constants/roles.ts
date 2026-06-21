export const roles = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const userStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type Role =
  (typeof roles)[keyof typeof roles];

export type UserStatus =
  (typeof userStatus)[keyof typeof userStatus];

export const roleOptions = [
  {
    label: "User",
    value: roles.USER,
  },
  {
    label: "Admin",
    value: roles.ADMIN,
  },
] as const;

export const statusOptions = [
  {
    label: "Pending",
    value: userStatus.PENDING,
  },
  {
    label: "Approved",
    value: userStatus.APPROVED,
  },
  {
    label: "Rejected",
    value: userStatus.REJECTED,
  },
] as const;

export function isAdmin(
  role?: string | null
) {
  return role === roles.ADMIN;
}

export function isUser(
  role?: string | null
) {
  return role === roles.USER;
}

export function isApproved(
  status?: string | null
) {
  return status === userStatus.APPROVED;
}

export function isPending(
  status?: string | null
) {
  return status === userStatus.PENDING;
}

export function isRejected(
  status?: string | null
) {
  return status === userStatus.REJECTED;
}