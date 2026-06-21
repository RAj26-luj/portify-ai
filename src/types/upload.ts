export interface UploadResponse {
  publicId: string;

  url: string;

  format?: string;

  bytes?: number;

  width?: number;

  height?: number;

  duration?: number;

  fileName?: string;

  createdAt?:
    | string
    | Date;
}

export interface UploadResult
  extends UploadResponse {}

export interface UploadRequest {
  file: string;

  folder:
    | "profiles"
    | "covers"
    | "projects"
    | "certificates"
    | "gallery"
    | "resumes"
    | "videos";

  type:
    | "image"
    | "document"
    | "video";
}

export interface MediaUploadRequest {
  portfolioId: string;

  file: string;

  type:
    | "IMAGE"
    | "VIDEO"
    | "PDF"
    | "ICON";

  usage?: string;

  name?: string;
}

export interface MediaUploadResponse {
  success: boolean;

  mediaId?: string;

  url?: string;

  error?: string;
}