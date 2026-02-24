import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseApi } from "@/lib/api/course.api";
import { Course, CourseQueryParams } from "@/types/course.types";

interface CourseState {
  courses: Course[];
  total: number;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: CourseState = {
  courses: [],
  total: 0,
  isLoading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
};

export const fetchCourses = createAsyncThunk(
  "course/fetchAll",
  async (params: CourseQueryParams | undefined, { rejectWithValue }) => {
    try {
      return await courseApi.getAll(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await courseApi.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete course");
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    clearCourseError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.courses     = action.payload.courses;
        state.pagination  = action.payload.pagination;
        state.total       = action.payload.pagination.total;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload as string;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        state.total  -= 1;
      });
  },
});

export const { clearCourseError } = courseSlice.actions;
export default courseSlice.reducer;