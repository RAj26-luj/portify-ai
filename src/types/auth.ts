export type UserRole = "USER" | "ADMIN";

export type UserStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;

  role: UserRole;
  status: UserStatus;

  isBlocked: boolean;
}