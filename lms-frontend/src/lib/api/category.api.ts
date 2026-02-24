import axiosInstance from "../axios";
import {
  Category,
  CategoryQueryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginationMeta,
} from "@/types/category.types";

interface CategoryListResponse {
  success: boolean;
  message: string;
  categories: Category[];
  pagination: PaginationMeta;
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export const categoryApi = {
  getAll: async (params?: CategoryQueryParams): Promise<CategoryListResponse> => {
    const { data } = await axiosInstance.get("/categories", { params });
    return data;
  },

  getById: async (id: string): Promise<CategoryResponse> => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  create: async (payload: CreateCategoryPayload): Promise<CategoryResponse> => {
    const { data } = await axiosInstance.post("/categories", payload);
    return data;
  },

  update: async (id: string, payload: UpdateCategoryPayload): Promise<CategoryResponse> => {
    const { data } = await axiosInstance.patch(`/categories/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  },
};
