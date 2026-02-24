export interface Category {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: { id: string; name: string; email: string } | null;
  updatedBy?: { id: string; name: string; email: string } | null;
  _count?: { categoryCourses: number };
}

export interface CategoryState {
  categories: Category[];
  total: number;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor: string | null;
}

export interface CategoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  cursor?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}
