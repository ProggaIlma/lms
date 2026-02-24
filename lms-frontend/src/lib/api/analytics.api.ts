import axiosInstance from "../axios";

export const analyticsApi = {
  getAdminStats: async () => {
    const { data } = await axiosInstance.get("/analytics/admin");
    return data;
  },

  getEnrollmentGrowth: async () => {
    const { data } = await axiosInstance.get("/analytics/enrollment-growth");
    return data;
  },

  getTopCourses: async () => {
    const { data } = await axiosInstance.get("/analytics/top-courses");
    return data;
  },

  getInstructorStats: async () => {
    const { data } = await axiosInstance.get("/analytics/instructor");
    return data;
  },
};
