export interface ApiResponse<
  T = unknown
> {
  success: boolean;

  data?: T;

  error?: string;

  message?: string;
}

export interface PaginatedResponse<
  T
> {
  success: boolean;

  data: T[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;

  error?: string;

  message?: string;
}

export interface ActionResponse<
  T = unknown
> {
  success: boolean;

  data?: T;

  error?: string;

  message?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DashboardStats {
  totalViews: number;
  uniqueVisitors: number;
  resumeDownloads: number;
  contactRequests: number;
  projectClicks: number;
}