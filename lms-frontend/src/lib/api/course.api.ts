import axiosInstance from "../axios";
import { Course, CourseQueryParams, Lesson } from "@/types/course.types";

interface CourseListResponse {
  success: boolean;
  courses: Course[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextCursor: string | null;
  };
}

interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export const courseApi = {
  getAll: async (params?: CourseQueryParams): Promise<CourseListResponse> => {
    const { data } = await axiosInstance.get("/courses", { params });
    return data;
  },

  getById: async (id: string): Promise<CourseResponse> => {
    const { data } = await axiosInstance.get(`/courses/${id}`);
    return data;
  },

  create: async (payload: FormData): Promise<CourseResponse> => {
    const { data } = await axiosInstance.post("/courses", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, payload: FormData | object): Promise<CourseResponse> => {
    const isFormData = payload instanceof FormData;
    const { data } = await axiosInstance.patch(`/courses/${id}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/courses/${id}`);
    return data;
  },

  // Lessons
  getLessons: async (courseId: string): Promise<{ success: boolean; data: Lesson[] }> => {
    const { data } = await axiosInstance.get(`/courses/${courseId}/lessons`);
    return data;
  },

  createLesson: async (courseId: string, payload: Partial<Lesson>): Promise<{ success: boolean; data: Lesson }> => {
    const { data } = await axiosInstance.post(`/courses/${courseId}/lessons`, payload);
    return data;
  },

  updateLesson: async (courseId: string, lessonId: string, payload: Partial<Lesson>): Promise<{ success: boolean; data: Lesson }> => {
    const { data } = await axiosInstance.patch(`/courses/${courseId}/lessons/${lessonId}`, payload);
    return data;
  },

  deleteLesson: async (courseId: string, lessonId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await axiosInstance.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return data;
  },
};
