import axiosInstance from "../axios";

export const enrollmentApi = {
  enroll: async (courseId: string) => {
    const { data } = await axiosInstance.post("/enrollments", { courseId });
    return data;
  },

  getMyEnrollments: async () => {
    const { data } = await axiosInstance.get("/enrollments/mine");
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await axiosInstance.patch(`/enrollments/${id}`, { status });
    return data;
  },
};