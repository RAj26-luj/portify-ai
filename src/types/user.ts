export type UserRole =
  | "USER"
  | "ADMIN";

export type UserStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface User {
  id: string;

  name: string;

  email: string;

  username?:
    | string
    | null;

  password?:
    | string
    | null;

  phone?:
    | string
    | null;

  image?:
    | string
    | null;

  coverImage?:
    | string
    | null;

  website?:
    | string
    | null;

  country?:
    | string
    | null;

  state?:
    | string
    | null;

  city?:
    | string
    | null;

  role: UserRole;

  status: UserStatus;

  approvalNote?:
    | string
    | null;

  approvedAt?:
    | Date
    | null;

  emailVerified?:
    | Date
    | null;

  isBlocked: boolean;

  lastLogin?:
    | Date
    | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface UserProfile {
  id: string;

  name: string;

  email: string;

  username?:
    | string
    | null;

  phone?:
    | string
    | null;

  image?:
    | string
    | null;

  coverImage?:
    | string
    | null;

  website?:
    | string
    | null;

  country?:
    | string
    | null;

  state?:
    | string
    | null;

  city?:
    | string
    | null;
}

export interface UserSummary {
  id: string;

  name: string;

  email: string;

  role: UserRole;

  status: UserStatus;

  isBlocked: boolean;

  createdAt: Date;
}

export interface ApprovalRequestUser {
  id: string;

  name: string;

  email: string;

  status: UserStatus;

  approvalNote?:
    | string
    | null;

  createdAt: Date;
}