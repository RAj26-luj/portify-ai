import type {
  UserRole,
  UserStatus,
} from "@prisma/client";

export interface AuthUser {
  id: string;

  name: string;

  email: string;

  username?: string | null;

  image?: string | null;

  coverImage?:
    | string
    | null;

  role: UserRole;

  status: UserStatus;

  isBlocked: boolean;

  phone?: string | null;

  website?:
    | string
    | null;

  country?:
    | string
    | null;

  state?:
    | string
    | null;

  city?: string | null;

  approvalNote?:
    | string
    | null;

  approvedAt?:
    | Date
    | null;

  lastLogin?:
    | Date
    | null;

  emailVerified?:
    | Date
    | null;

  createdAt?:
    | Date
    | null;

  updatedAt?:
    | Date
    | null;
}

export interface SessionUser
  extends AuthUser {}

export interface AuthSession {
  user: SessionUser;
}