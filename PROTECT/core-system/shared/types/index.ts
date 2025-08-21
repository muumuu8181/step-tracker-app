export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
}

export type Theme = 'light' | 'dark';
export type Language = 'ja' | 'en';