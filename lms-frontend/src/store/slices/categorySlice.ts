import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryApi } from "@/lib/api/category.api";
import {
  CategoryState,
  CategoryQueryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.types";

const initialState: CategoryState = {
  categories: [],
  total: 0,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    nextCursor: null,
  },
};

export const fetchCategories = createAsyncThunk(
  "category/fetchAll",
  async (params: CategoryQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await categoryApi.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (payload: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      return await categoryApi.create(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, payload }: { id: string; payload: UpdateCategoryPayload }, { rejectWithValue }) => {
    try {
      return await categoryApi.update(id, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.pagination = action.payload.pagination;
        state.total = action.payload.pagination.total;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload.data);
        state.total += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.data.id);
        if (index !== -1) state.categories[index] = action.payload.data;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
