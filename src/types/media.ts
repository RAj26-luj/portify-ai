import type {
  MediaType,
} from "@prisma/client";

export interface MediaFile {
  publicId: string;

  secureUrl: string;

  url?: string;

  format?: string;

  bytes?: number;

  width?: number;

  height?: number;

  duration?: number;

  originalName?: string;

  createdAt?:
    | string
    | Date;
}

export interface UploadedMedia {
  id: string;

  portfolioId: string;

  type: MediaType;

  url: string;

  publicId?: string | null;

  name?: string | null;

  usage?: string | null;

  createdAt: Date;
}

export interface UploadResponse {
  success: boolean;

  data?: MediaFile;

  error?: string;

  message?: string;
}

export interface UploadResult {
  publicId: string;

  secureUrl: string;

  bytes?: number;

  format?: string;

  width?: number;

  height?: number;

  duration?: number;
}