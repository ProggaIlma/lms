import axiosInstance from "../axios";

export const progressApi = {
  markComplete: async (payload: { lessonId: string; courseId: string }) => {
    const { data } = await axiosInstance.post("/progress/complete", payload);
    return data;
  },

  markIncomplete: async (payload: { lessonId: string; courseId: string }) => {
    const { data } = await axiosInstance.post("/progress/incomplete", payload);
    return data;
  },

  getCourseProgress: async (courseId: string) => {
    const { data } = await axiosInstance.get(`/progress/${courseId}`);
    return data;
  },
};